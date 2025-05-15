<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <div class="top-space"></div>
    <div class="page-container">
      <div class="filter-container">
        <v-navigation-drawer v-model="open" width="350">
          <v-list>
            <v-list-item class="py-4 ml-6 title" title="Tugboat"></v-list-item>
            <v-divider></v-divider>
            <v-list-item 
              v-for="tugboat in devices" 
              :key="tugboat.DeviceId"
              class="d-flex align-center py-3 ml-6"
              @click="selectSingleBoat(tugboat.DeviceId)"
              :class="{ 'selected-boat': selectedBoats === tugboat.DeviceId }"
            >
              <template v-slot:prepend>
                <v-checkbox
                  :value="tugboat.DeviceId"
                  v-model="selectedBoats"
                  @change="emitSelectedBoats"
                  density="compact" 
                  hide-details
                ></v-checkbox>
              </template>
              <div class="d-flex align-center">
                <v-icon class="mx-3" :class="getStatusClass(tugboat)">mdi-ferry</v-icon>
                <span>{{ tugboat.DeviceName }}</span>
              </div>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </div>
      <div class="map-container">
        <div id="map" class="map">
          <v-img :src="require('@/assets/Icons/compass_map.svg')" class="compass"></v-img>
        </div>
        <TransportTable :selectedBoat="selectedBoatData" />
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import NavigationBar from '@/components/NavigationBar.vue';
import TransportTable from '@/components/TugboatDetails/TransportTable.vue';

const $api = inject('$api');
const route = useRoute();
const deviceId = ref(route.params.deviceId);
const map = ref(null);
const boatMarkers = ref([]);
const selectedBoats = ref(null);
const selectedBoatData = ref(null);
const open = ref(true);
const devices = ref([]);
const loading = ref(false);
const error = ref(null);
const position = [13.1486, 100.8122]; // Default (เกาะสีชัง)

const fetchAllTugboats = async () => {
  try {
    loading.value = true;
    error.value = null;

    const riverResponse = await $api.get('/MachineStatus/GetTugboatRiver');
    const riverTugboats = riverResponse.data.flatMap(item => item.Devices);

    const seaResponse = await $api.get('/MachineStatus/GetTugboatSea');
    const seaTugboats = seaResponse.data.flatMap(item => item.Devices);

    devices.value = [...riverTugboats, ...seaTugboats];

    if (deviceId.value) {
      await fetchDeviceData(deviceId.value);
    }
  } catch (err) {
    console.error('Error fetching tugboats:', err);
    error.value = err;
    devices.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchDeviceData = async (specificDeviceId) => {
  try {
    loading.value = true;
    error.value = null;

    const response = await $api.get('/MachineStatus/GetDeviceByDeviceId', {
      params: { deviceid: specificDeviceId }
    });

    // Response เป็น array ดึง object ตัวแรก
    const updatedDevice = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;

    if (!updatedDevice) {
      throw new Error('No device data found for DeviceId: ' + specificDeviceId);
    }
    selectedBoatData.value = updatedDevice;

    const index = devices.value.findIndex(d => d.DeviceId === specificDeviceId);
    if (index !== -1) {
      devices.value[index] = { ...devices.value[index], ...updatedDevice };
    } else {
      devices.value.push(updatedDevice);
    }

    selectedBoats.value = specificDeviceId;
    updateMapMarkers();
  } catch (err) {
    console.error('Error fetching device data:', err);
    error.value = err;
    selectedBoatData.value = null;
  } finally {
    loading.value = false;
  }
};

const initMap = () => {
  map.value = L.map('map').setView(position, 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);
};

const updateMapMarkers = () => {
  if (!map.value) {
    console.warn("Map is not initialized yet.");
    return;
  }

  // ลบ markers เก่า
  boatMarkers.value.forEach(marker => map.value.removeLayer(marker));
  boatMarkers.value = [];

  // เพิ่ม marker ใหม่
  if (selectedBoats.value && selectedBoatData.value) {
    const tugboat = selectedBoatData.value;

    // ดึง Latitude และ Longitude จาก Mesurement
    const latitude = tugboat.Mesurement?.find(m => m.measurementname === 'Latitude')?.lastValue;
    const longitude = tugboat.Mesurement?.find(m => m.measurementname === 'Longitude')?.lastValue;

    console.log("Latitude:", latitude, "Longitude:", longitude);

    // แปลง lastValue เป็นพิกัดทศนิยม
    const lat = latitude ? parseFloat(latitude) / 1000000 : position[0];
    const lng = longitude ? parseFloat(longitude) / 1000000 : position[1];

    console.log("Converted Lat:", lat, "Converted Lng:", lng);

    const boatIcon = L.divIcon({
      className: 'custom-boat-icon',
      html: `<div style="color: ${getStatusColor(tugboat)};">
              <i class="mdi mdi-ferry" style="font-size: 30px;"></i>
            </div>`,
      iconSize: [30, 30]
    });

    const marker = L.marker([lat, lng], { icon: boatIcon })
      .bindPopup(`<b>${tugboat.DeviceName || 'Unknown'}</b><br>Status: ${getStatusText(tugboat)}`)
      .addTo(map.value);

    boatMarkers.value.push(marker);

    map.value.setView([lat, lng], 12);
  }
};

const getStatusText = (tugboat) => {
  const status = tugboat.Mesurement?.find(m => m.measurementname === 'Status')?.lastValue;
  switch (status) {
    case '1': return 'Running';
    case '2': return 'Maintenance';
    case '3': return 'Pending';
    case '5': return 'Unknown';
    default: return 'Unknown';
  }
};

const getStatusColor = (tugboat) => {
  const status = tugboat.Mesurement?.find(m => m.measurementname === 'Status')?.lastValue;
  switch (status) {
    case '1': return '#009688'; // Running
    case '2': return '#DC2B2B'; // Maintenance
    case '3': return '#FAC12A'; // Pending
    case '5': return '#979a9a'; // Active
    default: return '#000000';
  }
};

const getStatusClass = (tugboat) => {
  const status = tugboat.Mesurement?.find(m => m.measurementname === 'Status')?.lastValue;
  switch (status) {
    case '1': return 'status-running';
    case '2': return 'status-maintenance';
    case '3': return 'status-pending';
    case '5': return 'status-unknown';
    default: return '';
  }
};

const selectSingleBoat = (tugboatId) => {
  if (selectedBoats.value !== tugboatId) {
    selectedBoats.value = tugboatId;
    fetchDeviceData(tugboatId);
  } else {
    selectedBoats.value = null;
    selectedBoatData.value = null;
    updateMapMarkers();
  }
};

const emitSelectedBoats = () => {
  if (selectedBoats.value) {
    fetchDeviceData(selectedBoats.value);
  } else {
    selectedBoatData.value = null;
    updateMapMarkers();
  }
};

onMounted(async () => {
  initMap();
  await fetchAllTugboats();
});

// Watchers
watch(() => route.params.deviceId, async (newDeviceId) => {
  if (newDeviceId) {
    deviceId.value = newDeviceId;
    if (devices.value.length === 0) {
      await fetchAllTugboats();
    } else {
      await fetchDeviceData(newDeviceId);
    }
    if (map.value) {
      updateMapMarkers();
    }
  }
});
</script>

<style scoped>
.top-space {
  height: 64px;
}

.page-container {
  display: flex;
  height: calc(100vh - 64px);
}

.filter-container {
  width: 350px;
  height: 100%;
}

.map-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.map {
  flex-grow: 1;
  position: relative;
}

.compass {
  position: absolute;
  z-index: 999; 
  width: 202px; 
  top: 32px;
  right: 32px;
}

.custom-boat-icon {
  background: none;
  border: none;
}

:deep(.leaflet-left .leaflet-control) {
  display: none;
}

:deep(.v-list-item-title) {
  font-size: 2vh;
  font-weight: 600;
}

.status-maintenance {
  color: #DC2B2B;
}

.status-pending {
  color: #FAC12A;
}

.status-running {
  color: #009688;
}

.status-unknown {
  color: #979a9a;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}
</style>