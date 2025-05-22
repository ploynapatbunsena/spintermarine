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
        <div>
          <TransportTable 
           :selectedBoat="selectedBoatData" 
           :updateShipPosition="updateShipPositionOnMap" 
           :devices="devices"
         />
        </div>
      </div>
    </div>
    <v-snackbar v-model="error" color="error">{{ error?.message }}</v-snackbar>
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
const $api_vessel = inject('$api_vessel');
const $api_cmms = inject('$api_cmms');
const open_api_company = inject('open_api_company');
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
const position = [13.1486, 100.8122];
const shipMarkers = ref([]);

const fetchAllTugboats = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // ดึงข้อมูล Tugboat จาก API เดิม
    const riverResponse = await $api.get('/MachineStatus/GetTugboatRiver');
    const riverTugboats = riverResponse.data.flatMap(item => item.Devices);
    const seaResponse = await $api.get('/MachineStatus/GetTugboatSea');
    const seaTugboats = seaResponse.data.flatMap(item => item.Devices);
    const allTugboats = [...riverTugboats, ...seaTugboats];
    
    // ดึงสถานะล่าสุดจาก CMMS API
    const cmmsStatusData = await fetchCMMSStatus(allTugboats);
    
    // รวมข้อมูลและแมปสถานะ
    devices.value = processTugboatData(allTugboats, cmmsStatusData);
    
    if (deviceId.value) {
      await fetchDeviceData(deviceId.value);
    }
  } catch (error) {
    console.error('Error fetching tugboats:', error);
    error.value = new Error('Failed to fetch tugboat list. Please try again.');
    devices.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchDeviceData = async (specificDeviceId) => {
  try {
    loading.value = true;
    error.value = null;

    // ดึงข้อมูลอุปกรณ์จาก API
    const deviceResponse = await $api.get('/MachineStatus/GetDeviceByDeviceId', {
      params: { deviceid: specificDeviceId }
    });
    const updatedDevice = Array.isArray(deviceResponse.data) && deviceResponse.data.length > 0 
      ? deviceResponse.data[0] 
      : null;
    
    if (!updatedDevice) {
      throw new Error('No device data found for DeviceId: ' + specificDeviceId);
    }

    // ดึงสถานะล่าสุดจาก CMMS API
    const cmmsStatusData = await fetchCMMSStatus([updatedDevice]);
    const processedDevice = processTugboatData([updatedDevice], cmmsStatusData)[0];
    
    // ดึงข้อมูลงานและ vessel
    let jobData = [];
    let allVessels = new Set();
    let vesselShips = {}; // เก็บข้อมูล ship ของแต่ละ vessel
    
    try {
      const saleOrdersResponse = await $api_vessel.get('/all-sale-orders');
      const saleOrderIds = saleOrdersResponse.data.data.data.map(order => order.id);

      for (const id of saleOrderIds) {
        const jobResponse = await $api_vessel.get('/sale-orders-by-id', {
          params: { keyword: id }
        });
        const job = jobResponse.data.data.data;
        
        if (job.vessel_name) {
          allVessels.add(job.vessel_name);
          
          // เก็บข้อมูล ship ของ vessel นี้
          if (job.jobs_miiot?.job_ship?.ship) {
            vesselShips[job.vessel_name] = job.jobs_miiot.job_ship.ship;
          }
        }

        if (job.jobs_miiot?.job_ship?.ship?.name && processedDevice.Note &&
            job.jobs_miiot.job_ship.ship.name.trim().toLowerCase() === processedDevice.Note.trim().toLowerCase()) {
          jobData.push(job);
        }
      }
    } catch (apiError) {
      console.error('Error fetching job data:', apiError);
      error.value = new Error('Failed to fetch job data. Token may be invalid or server is unavailable.');
    }

    selectedBoatData.value = {
      ...processedDevice,
      jobs: jobData,
      allVessels: [...allVessels],
      vesselShips // เพิ่มข้อมูล ships ของแต่ละ vessel
    };

    // อัปเดตข้อมูลใน devices array
    const index = devices.value.findIndex(d => d.DeviceId === specificDeviceId);
    if (index !== -1) {
      devices.value[index] = { ...devices.value[index], ...processedDevice };
    } else {
      devices.value.push(processedDevice);
    }

    selectedBoats.value = specificDeviceId;
    updateMapMarkers();
  } catch (err) {
    console.error('Error fetching device data:', err);
    error.value = new Error(err.message || 'Failed to fetch tugboat data.');
    selectedBoatData.value = null;
  } finally {
    loading.value = false;
  }
};

const fetchCMMSStatus = async (tugboats) => {
  try {
    const toolList = tugboats.map(tugboat => ({
      toolName: tugboat.Note
    }));
    
    const response = await $api_cmms.post(
      `/v1/companies/${open_api_company}/tools/last-status`, 
      { toolList }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch CMMS status:', error);
    return [];
  }
};

const processTugboatData = (tugboats, cmmsData) => {
  return tugboats.map(tugboat => {
    const cmmsStatus = cmmsData.find(item => 
      item.toolName === tugboat.Note
    );
    let status = 'Unknown';
    if (cmmsStatus) {
      status = mapCMMSStatus(cmmsStatus.status);
    }

    return {
      ...tugboat,
      status
    };
  });
};

const updateShipPositionOnMap = (latitude, longitude) => {
  shipMarkers.value.forEach(marker => {
    if (marker && map.value) {
      map.value.removeLayer(marker);
    }
  });
  shipMarkers.value = [];

  if (!latitude || !longitude || !map.value) return;

  const lat = parseFloat(latitude) / 1000000;
  const lng = parseFloat(longitude) / 1000000;

  console.log('lat, lng', lat, lng);
  

  const shipIcon = L.divIcon({
    className: 'custom-ship-icon',
    html: `<div style="color: #194185;">
            <i class="mdi mdi-sail-boat" style="font-size: 30px;"></i>
          </div>`,
    iconSize: [30, 30]
  });

  const marker = L.marker([lat, lng], { icon: shipIcon })
    .addTo(map.value);

  shipMarkers.value.push(marker);
  map.value.setView([lat, lng], 12);
};

const initMap = () => {
  map.value = L.map('map').setView(position, 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);
};

const updateMapMarkers = () => {
  boatMarkers.value.forEach(marker => {
    if (marker && map.value) {
      marker.off();
      map.value.removeLayer(marker);
    }
  });

  boatMarkers.value = [];

  if (selectedBoats.value && selectedBoatData.value && map.value) {
    const tugboat = selectedBoatData.value;
    const latitude = tugboat.Mesurement?.find(m => m.measurementname === 'Latitude')?.lastValue;
    const longitude = tugboat.Mesurement?.find(m => m.measurementname === 'Longitude')?.lastValue;
    const lat = latitude ? parseFloat(latitude) / 1000000 : position[0];
    const lng = longitude ? parseFloat(longitude) / 1000000 : position[1];

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

    marker.on('dblclick', (e) => {
      setTimeout(() => {
        if (map.value && map.value._map) {
          map.value.setView(e.latlng, map.value.getZoom() + 1);
        }
      }, 10);
    });

    boatMarkers.value.push(marker);
    map.value.setView([lat, lng], 12);
  }
};

const getStatusText = (tugboat) => {
  return tugboat.status || 'Unknown';
};

const mapCMMSStatus = (cmmsStatus) => {
  switch (cmmsStatus) {
    case "ถูกใช้งานอยู่":
    case "พร้อมใช้งาน":
      return "Running";
    case "อยู่ระหว่างการสอบเทียบ":
      return "Pending";
    case "อยู่ระหว่างการซ่อม":
      return "Maintenance";
    case "ยกเลิกใช้งาน":
      return "Down";
    default:
      return 'Unknown';
  }
};

const getStatusColor = (tugboat) => {
  switch (tugboat.status) {
    case 'Running': return '#1CC042';
    case 'Maintenance': return '#DC2B2B';
    case 'Pending': return '#FAC12A';
    case 'Down': return '#FF0000';
    default: return '#979a9a';
  }
};

const getStatusClass = (tugboat) => {
  switch (tugboat.status) {
    case 'Running': return 'status-running';
    case 'Maintenance': return 'status-maintenance';
    case 'Pending': return 'status-pending';
    case 'Down': return 'status-down';
    default: return 'status-unknown';
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

watch(() => route.params.deviceId, async (newDeviceId) => {
  if (newDeviceId) {
    deviceId.value = newDeviceId;
    if (devices.value.length === 0) {
      await fetchAllTugboats();
    } else {
      await fetchDeviceData(newDeviceId);
    }
    if (map.value && map.value._map) {
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
  /* color: #009688; */
  color: #1CC042;
}

.status-unknown {
  color: #979a9a;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}
</style>