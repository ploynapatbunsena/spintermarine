<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <div class="top-space"></div>
    <div class="page-container">
      <div class="filter-container">
        <v-navigation-drawer 
          v-model="open"
          width="350"
        >
          <v-list>
            <v-list-item class="py-4 ml-6 title" title="Tugboat"></v-list-item>
            <v-divider></v-divider>
            <v-list-item 
              v-for="tugboat in filteredDevices" 
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
                <v-icon class="mx-3" :class="getStatusClass(tugboat.status)">mdi-ferry</v-icon>
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
import { ref, onMounted, watch, computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import NavigationBar from '@/components/NavigationBar.vue';
import TransportTable from '@/components/TugboatDetails/TransportTable.vue';

const $api = inject('$api');

// State
const map = ref(null);
const boatMarkers = ref([]);
const selectedBoats = ref(null);
const selectedBoatData = ref(null);
const open = ref(true);
const devices = ref([]);

// ตำแหน่งเริ่มต้น (เกาะสีชัง)
const defaultPosition = [13.1486, 100.8122];

// Computed property สำหรับกรอง devices
const filteredDevices = computed(() => {
  return devices.value.filter(device => 
    device.TypeVehicle === 'Tugboat river going' || device.TypeVehicle === 'Tugboat sea going'
  );
});

// การจัดการ route
const route = useRoute();

const fetchDevices = async (deviceId) => {
  try {
    const response = await $api.put('/device/GetDeviceListProfile', {
      DeviceId: '' // ดึงข้อมูลทั้งหมดก่อน
    });
    devices.value = response.data;

    // Auto Select ตาม deviceId ที่ส่งมา โดยเช็คว่าเป็น Tugboat river going หรือ Tugboat sea going
    if (deviceId) {
      const selectedDevice = filteredDevices.value.find(d => d.DeviceId === deviceId);
      if (selectedDevice) {
        selectedBoats.value = deviceId;
        selectedBoatData.value = selectedDevice;
      } else {
        selectedBoats.value = null;
        selectedBoatData.value = null;
      }
      updateMapMarkers();
    }
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    devices.value = [];
  }
};

// ฟังก์ชันจาก GPSVessel
const initMap = () => {
  map.value = L.map('map').setView(defaultPosition, 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);
};

const updateSelectedBoats = (boatId) => {
  selectedBoats.value = boatId;
  const boat = filteredDevices.value.find(b => b.DeviceId === boatId);
  selectedBoatData.value = boat || null;
  updateMapMarkers();
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
  if (selectedBoats.value) {
    const boat = filteredDevices.value.find(b => b.DeviceId === selectedBoats.value);
    if (boat) {
      // ใช้ตำแหน่งจาก API (ในอนาคต) หรือ default เป็นเกาะสีชัง
      const location = {
        lat: boat.latitude || defaultPosition[0],
        lng: boat.longitude || defaultPosition[1]
      };

      const boatIcon = L.divIcon({
        className: 'custom-boat-icon',
        html: `<div style="color: ${getStatusColor(boat.status || 'Unknown')};">
                <i class="mdi mdi-ferry" style="font-size: 30px;"></i>
              </div>`,
        iconSize: [30, 30]
      });

      const marker = L.marker([location.lat, location.lng], { icon: boatIcon })
        .bindPopup(`<b>${boat.DeviceName || 'Unknown'}</b><br>Status: ${boat.status || 'N/A'}`)
        .addTo(map.value);

      boatMarkers.value.push(marker);

      // Center the map on the selected boat
      map.value.setView([location.lat, location.lng], 12);
    }
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Running': return '#009688';
    case 'Maintenance': return '#DC2B2B';
    case 'Pending': return '#FAC12A';
    default: return '#000000';
  }
};

// ฟังก์ชันจาก SelectList
const getStatusClass = (status) => {
  switch (status) {
    case "Running": return "status-running";
    case "Maintenance": return "status-maintenance";
    case "Pending": return "status-pending";
    default: return "";
  }
};

const selectSingleBoat = (boatId) => {
  selectedBoats.value = selectedBoats.value === boatId ? null : boatId;
  emitSelectedBoats();
};

const emitSelectedBoats = () => {
  updateSelectedBoats(selectedBoats.value);
};

// Lifecycle hooks
onMounted(async () => {
  const deviceId = route.params.deviceId;
  await fetchDevices(deviceId);
  initMap();
  if (selectedBoats.value) {
    updateMapMarkers();
  }
});

// Watchers
watch(selectedBoats, (newVal) => {
  selectedBoatData.value = filteredDevices.value.find(b => b.DeviceId === newVal) || null;
});

watch(() => route.params.deviceId, async (newDeviceId) => {
  if (newDeviceId) {
    await fetchDevices(newDeviceId);
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

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}
</style>