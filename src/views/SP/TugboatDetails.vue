<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <v-row>
        <v-col cols="12" class="position-relative d-flex align-center">
          <div style="width: 10vh;"></div>
          <div class="title flex-grow-1 text-center">{{ typeDeviceName }}</div>
          <div style="width: 10vh;">
            <AlertFunction :tugboat="tugboat" />
          </div>
        </v-col>
        <v-col cols="12"> 
          <v-row>
            <!-- Map -->
            <v-col cols="3" class="d5-flex justify-center align-center">
              <v-card class="card-map rounded-xl" elevation="1" @click="navigateToGPSVessel(typeDeviceName)">
                <p class="card-title">ตำแหน่งเรือ</p>
                <div id="mapContainer">
                  <v-img :src="require('@/assets/Icons/compass_map.svg')" style="z-index: 999; width: 7vw; top: 3vh;"></v-img>
                </div>
              </v-card>
            </v-col>
            <v-col cols="9">
              <!-- Gauge Chart -->
              <v-row>
                <v-col cols="4">
                  <v-card class="gauge-card">
                    <GagueChart
                      title="Water Temperature"
                      :value="0" 
                      :maxValue="100"
                      :delimiters="[(92 / 100) * 100, (95 / 100) * 100]"
                      :colors="['#3DCC5B', '#FFD54F', '#F44336']"
                      :labels="['92°', '95°']"
                      :rangeLabel="['0', '100']"
                      centralLabel="0°"
                    />
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card class="gauge-card">
                    <GagueChart
                      title="Oil Pressure"
                      :value="0"
                      :maxValue="10"
                      :delimiters="[(1 / 10) * 100, (2 / 10) * 100]"
                      :colors="['#F44336', '#FFD54F', '#3DCC5B']"
                      :labels="['1', '2']"
                      :rangeLabel="['0', '10']"
                      centralLabel="0 bar"
                    />
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card class="gauge-card">
                    <GagueChart
                      title="RPM"
                      :value="0"
                      :maxValue="2000"
                      :delimiters="[(1850 / 2000) * 100, (1900 / 2000) * 100]"
                      :colors="['#3DCC5B', '#FFD54F', '#F44336']"
                      :labels="['1850', '1900']"
                      :rangeLabel="['0', '2000']"
                      centralLabel="0 RPM"
                    />
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-card class="tugboat-info rounded-xl h-100">
                    <GeneralInfo />
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card class="pa-2 rounded-xl h-100">
                <FuelTank />
              </v-card>
            </v-col>
            <v-col>
              <v-card class="pa-2 rounded-xl h-100">
                <NoticeTable />
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import GagueChart from '@/components/GeneratorDetails/GagueChart.vue';
import GeneralInfo from '@/components/TugboatDetails/GeneralInfo.vue';
import FuelTank from '@/components/TugboatDetails/FuelTank.vue';
import NoticeTable from '@/components/GeneratorDetails/NoticeTable.vue';
import AlertFunction from '@/components/TugboatDetails/AlertFunction.vue';
import markerIconUrl from '@/assets/Images/ship_location.png';

const $api = inject('$api');
const router = useRouter();
const route = useRoute();
const map = ref(null);
const marker = ref(null);
const position = ref([13.1486, 100.8122]); // Default ตำแหน่งเกาะสีชัง
const typeDeviceName = ref('');
const tugboat = ref({});
const devices = ref([]);

const fetchDevices = async (deviceId) => {
  try {
    const response = await $api.put('/device/GetDeviceListProfile', {
      DeviceId: deviceId || ''
    });
    devices.value = response.data;

    const selectedTugboat = devices.value.find(device => device.DeviceId === deviceId);
    if (selectedTugboat) {
      typeDeviceName.value = selectedTugboat.TypeDevicename || selectedTugboat.DeviceName || 'Unknown Tugboat';
      tugboat.value = selectedTugboat;
      position.value = [
        selectedTugboat.latitude || 13.1486,
        selectedTugboat.longitude || 100.8122
      ];
    } else {
      typeDeviceName.value = 'Tugboat Not Found';
      position.value = [13.1486, 100.8122];
    }
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    typeDeviceName.value = 'Error Loading Tugboat';
    position.value = [13.1486, 100.8122];
  }
};

const navigateToGPSVessel = () => {
  router.push({ name: 'GPSVessel', params: { deviceId: route.params.deviceId } });
};

const updatePosition = () => {
  if (!position.value || !Array.isArray(position.value) || position.value.length !== 2) {
    console.error('Invalid position:', position.value);
    position.value = [13.1486, 100.8122];
  }

  if (marker.value) {
    marker.value.setLatLng(position.value);
  } else if (map.value) {
    const shipIcon = L.icon({
      iconUrl: markerIconUrl,
      iconSize: [52, 52],
      iconAnchor: [32, 32],
      popupAnchor: [0, -16]
    });

    marker.value = L.marker(position.value, { icon: shipIcon }).addTo(map.value);
    marker.value.bindPopup(`ตำแหน่งเรือ: ${position.value[0].toFixed(4)}, ${position.value[1].toFixed(4)}`);
  }

  if (map.value) {
    map.value.setView(position.value, 10);
  }
};

const initializeMap = () => {
  setTimeout(() => {
    map.value = L.map('mapContainer').setView(position.value, 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value);

    updatePosition();

    const cleanup = () => {
      if (map.value) {
        map.value.remove();
      }
    };
    window.addEventListener('beforeunload', cleanup);
  }, 100);
};

// โหลดข้อมูลเริ่มต้นและสร้างแผนที่
onMounted(async () => {
  await fetchDevices(route.params.deviceId);
  initializeMap();
});

// ตรวจจับการเปลี่ยนแปลงของ deviceId
watch(() => route.params.deviceId, async (newDeviceId) => {
  if (newDeviceId) {
    await fetchDevices(newDeviceId);
    if (map.value) {
      updatePosition(); // อัปเดตตำแหน่งในแผนที่ที่มีอยู่
    } else {
      initializeMap(); // สร้างแผนที่ใหม่ถ้ายังไม่มี
    }
  }
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.card-map {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 1vh;
}

.card-title {
  font-family: 'Sarabun', sans-serif;
  font-weight: 500;
  color: var(--dark-gray);
  margin-bottom: 8px;
  font-size: 1.5vh;
}

#mapContainer {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  z-index: 0;
}

.gauge-card {
  border-radius: 24px;
}

.tugboat-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>