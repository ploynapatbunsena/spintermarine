<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <!-- Hamburger Button for Mobile/Tablet -->
    <v-btn
      v-if="$vuetify.display.smAndDown"
      icon="mdi-menu"
      class="menu-button"
      @click="open = !open"
      color="white"
      variant="elevated"
    ></v-btn>
    <!-- <div class="page-container"> -->
      <div class="filter-container" :class="{ 'hidden': $vuetify.display.smAndDown && !open }">
        <v-navigation-drawer
          v-model="open"
          :temporary="$vuetify.display.smAndDown"
          :width="$vuetify.display.width > 2560 ? 800 : 350"
          :permanent="!$vuetify.display.smAndDown"
        >
          <v-list>
            <v-card-text class="py-2 title text-center">Tugboat</v-card-text>
            <v-divider></v-divider>
            <v-list-item>
              <v-row>
                <v-col cols="3" class="d-flex align-center">
                  <v-tooltip text="กำลังทำงาน">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-square" color="#1CC042" class="me-1 icon-detail"></v-icon>
                    </template>
                  </v-tooltip>
                  <span style="font-size: 1.5vh;" class="text-truncate">Running</span>
                </v-col>
                <v-col cols="3" class="d-flex align-center">
                  <v-tooltip text="รอเข้าซ่อม">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-square" color="#FAC12A" class="me-1 icon-detail"></v-icon>
                    </template>
                  </v-tooltip>
                  <span style="font-size: 1.5vh;" class="text-truncate">Pending</span>
                </v-col>
                <v-col cols="3" class="d-flex align-center">
                  <v-tooltip text="ดำเนินการซ่อม">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-square" color="#DC2B2B" class="me-1 icon-detail"></v-icon>
                    </template>
                  </v-tooltip>
                  <span class="text-truncate" style="font-size: 1.5vh;">Maintenance</span>
                </v-col>
                <v-col cols="3" class="d-flex align-center">
                  <v-tooltip text="ปิดการใช้งาน">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-square" color="#000000" class="me-1 icon-detail"></v-icon>
                    </template>
                  </v-tooltip>
                  <span class="text-truncate" style="font-size: 1.5vh;">Down</span>
                </v-col>
              </v-row>
            </v-list-item>
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
                <span>{{ deletePrefix(tugboat.DeviceName) }}</span>
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
            :updateMapMarkers="updateMapMarkers" 
            :devices="devices"
            :allVessels="allVessels"
            :vesselShips="vesselShips"
            :allJobs="allJobs"
          />
        </div>
      </div>
    <!-- </div> -->
    <v-snackbar v-model="error" color="error">{{ error?.message }}</v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch, inject, onUnmounted } from 'vue';
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
const allVessels = ref([]);
const vesselShips = ref({});
const allJobs = ref([]);
let intervalId  = null;

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

const fetchAllVessels = async () => {
  try {
    const saleOrdersResponse = await $api_vessel.get('/all-sale-orders');
    const saleOrderIds = saleOrdersResponse.data.data.data.map(order => order.id);

    for (const id of saleOrderIds) {
      const jobResponse = await $api_vessel.get('/sale-orders-by-id', {
        params: { keyword: id }
      });
      const job = jobResponse.data.data.data;
      allJobs.value.push(job);
      // console.log('job', job);
      
      if (job.vessel_name) {
        allVessels.value.push(job.vessel_name);
        // console.log('allVessels', allVessels.value);
        
        if (job.jobs_miiot?.job_ship?.ship) {
          vesselShips.value[job.vessel_name] = job.jobs_miiot.job_ship.ship;
        }
        // console.log('vesselShips', vesselShips.value);
      }
    }
  } catch (error) {
    console.error('Error fetching vessels:', error);
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
      // error.value = new Error('Server is unavailable.');
      // error.value = new Error('Failed to fetch job data. Token may be invalid or server is unavailable.');
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

const findVesselStatus = (vesselName) => {
  if (!vesselShips.value[vesselName]) return 'Unknown';
  
  const shipName = vesselShips.value[vesselName].name;
  const matchingDevice = devices.value.find(device => 
    device.Note?.trim() === shipName.trim()
  );
  
  return matchingDevice?.status || 'Unknown';
};

const initMap = () => {
  map.value = L.map('map').setView(position, 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);
};

const updateMapMarkers = (options = {}) => {
  // ลบมาร์กเกอร์เดิมทั้งหมด
  boatMarkers.value.forEach(marker => map.value?.removeLayer(marker));
  shipMarkers.value.forEach(marker => map.value?.removeLayer(marker));
  boatMarkers.value = [];
  shipMarkers.value = [];

  // กรณีอัปเดตเรือขนส่ง
  if (options.type === 'vessel' && options.latitude && options.longitude) {
    const lat = parseFloat(options.latitude) || position[0];
    const lng = parseFloat(options.longitude) || position[0];
    console.log('lat, long', lat, lng);
    
    const vesselName = options.vesselName;
    const status = findVesselStatus(vesselName);    
    
    const shipIcon = L.divIcon({
      className: 'custom-ship-icon',
      html: `<div style="color: ${getStatusColor({ status })};">
              <i class="mdi mdi-ferry" style="font-size: 3vh;"></i>
            </div>`,
    });

    const marker = L.marker([lat, lng], { icon: shipIcon })
      .addTo(map.value);

    shipMarkers.value.push(marker);
    map.value.setView([lat, lng], 12);
    return;
  }

  // กรณีอัปเดตเรือลากจูง (ส่วนเดิม)
  if (selectedBoats.value && selectedBoatData.value && map.value) {
    const tugboat = selectedBoatData.value;
    const latitude = tugboat.Mesurement?.find(m => m.measurementname === 'Latitude')?.lastValue;
    const longitude = tugboat.Mesurement?.find(m => m.measurementname === 'Longitude')?.lastValue;
    const lat = latitude ? parseFloat(latitude) : position[0];
    const lng = longitude ? parseFloat(longitude) : position[1];

    const boatIcon = L.divIcon({
      className: 'custom-boat-icon',
      html: `<div style="color: ${getStatusColor(tugboat)};">
              <i class="mdi mdi-ferry" style="font-size: 30px;"></i>
            </div>`,
      iconSize: [30, 30]
    });

    const marker = L.marker([lat, lng], { icon: boatIcon })
      .bindPopup(`<b>${deletePrefix(tugboat.DeviceName) || 'Unknown'}</b><br>Status: ${getStatusText(tugboat)}`)
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

const deletePrefix = (name) => {
  return name.replace(/Barge|Tugboat/gi, '').trim();
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

const getStatusColor = (statusObj) => {
  const status = typeof statusObj === 'string' ? statusObj : statusObj.status;
  switch (status) {
    case 'Running': return '#1CC042';
    case 'Maintenance': return '#DC2B2B';
    case 'Pending': return '#FAC12A';
    case 'Down': return '#000000';
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

const fetchDataWithInterval = async () => {
  await fetchAllTugboats();
  await fetchAllVessels();
};

const startDataInterval = () => {intervalId = setInterval(fetchDataWithInterval, 2 * 60 * 1000);};

const stopDataInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(async () => {
  console.log('Component mounted');
  initMap();
  await fetchDataWithInterval();
  startDataInterval();
});

onUnmounted(() => {
  stopDataInterval();
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
.title {
  font-size: 3vh;
  font-weight: bold;
}

.top-space {
  height: 64px;
}

.page-container {
  display: flex;
  height: 100vh;
}

.map-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.map {
  flex-grow: 1;
  width: 100%; /* เต็มความกว้าง */
  height: 100%; /* เต็มความสูงของคอนเทนเนอร์ */
  position: relative;
}

@media (min-width: 1280px) {
  .map-container {
    margin-left: 350px; /* เลื่อน map-container เพื่อชดเชย navigation drawer */
    width: calc(100% - 350px); /* ปรับความกว้างให้พอดี */
  }
}

@media (min-width: 2560px) {
  .map-container {
    margin-left: 800px; /* ปรับสำหรับ drawer ที่กว้างขึ้น */
    width: calc(100% - 800px);
  }
}

.compass {
  position: absolute;
  z-index: 500; 
  width: 15vh; 
  top: 52px;
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

.icon-detail {
  font-size: 1.5vh;
}

.menu-button {
  position: fixed; /* ทำให้ปุ่มลอยอิสระ */
  top: 72px; /* 64px (NavigationBar) + 8px margin */
  left: 16px;
  z-index: 600; /* อยู่เหนือ map และ drawer */
  background-color: white; /* พื้นหลังทึบเพื่อซ่อนสีเทา */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* เพิ่มเงาให้ดูเด่น */
}

@media(min-width: 2560px) {
  :deep(.v-list-item) {
    font-size: 1.5vh !important;
    padding: 1vh;
  }

  :deep(.v-checkbox .v-selection-control) {
    font-size: 1.5vh !important;
    padding: 1vh;
  }
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}

</style>