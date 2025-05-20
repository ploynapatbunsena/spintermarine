<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div v-if="!loading">
        <v-row v-for="device in devices" :key="device.DeviceId">
          <v-col cols="12" class="position-relative d-flex align-center">
            <div style="width: 10vh;"></div>
            <div class="title flex-grow-1 text-center">{{ device.DeviceLabel }}</div>
            <div style="width: 10vh;">
              <AlertBadges
                :warningCount="getWarningCount(device)"
                :dangerCount="getDangerCount(device)"
              />
            </div>
          </v-col>
          <v-col cols="12"> 
            <v-row v-if="devices.length > 0">
              <v-col cols="3" class="d5-flex justify-center align-center">
                <v-card class="card-map rounded-xl" elevation="1" @click="navigateToGPSVessel(device.DeviceId)">
                  <p class="card-title">ตำแหน่งเรือ</p>
                  <div id="mapContainer">
                    <v-img :src="require('@/assets/Icons/compass_map.svg')" style="z-index: 999; width: 7vw; top: 3vh;"></v-img>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-row>
                  <v-col cols="4" v-for="(gauge, index) in gauges" :key="index">
                    <v-card class="gauge-card">
                      <v-card-title class="gauge-title text-center">{{ gauge.title }}</v-card-title>
                      <v-card-text class="text-center pa-0">
                        <vue-gauge
                          v-if="isDataLoaded"
                          :refid="'_' + Math.random().toString(36).substr(2, 9)"
                          class="meticsGauge"
                          :options="getGaugeOptions(gauge.type, devices[0])"
                        />
                        <v-card-text class="central-label text-center pa-0">
                          {{ getMeasurementValue(gauge.type) }} {{ gauge.unit }}
                        </v-card-text>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-card class="tugboat-info rounded-xl h-100">
                      <GeneralInfo 
                        :measurements="filteredMeasurements"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-card class="pa-2 rounded-xl h-100">
                  <v-row class="h-100 align-center">
                    <v-col cols="4">
                      <FuelTank
                        title="Main Tank"
                        :remaining-volume="mainTankRemaining"
                        :total-capacity="mainTankCapacity"
                      />
                    </v-col>
                    <v-col cols="4">
                      <FuelTank
                        title="Feed Tank"
                        :remaining-volume="feedTankRemaining"
                        :total-capacity="feedTankCapacity"
                      />
                    </v-col>
                    <v-col cols="4">
                      <FuelTank
                        title="Total Tank"
                        :remaining-volume="totalTankRemaining"
                        :total-capacity="totalTankCapacity"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12" lg="6">
                <v-card class="pa-2 rounded-xl h-100">
                  <div class="notification-header">
                    <v-card-title class="header">Notification</v-card-title>
                    <v-card-title>
                      <router-link :to="{ name: 'NotificationReport'}">
                        <v-icon icon="mdi-pencil" class="edit"></v-icon>
                      </router-link>
                    </v-card-title>
                  </div>
                  <NotificationTable :notices="mappedNotices"/>
                </v-card>   
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <v-overlay
        :model-value="loading"
        class="align-center justify-center"
        persistent
      >
        <div class="pa-6 d-flex flex-column align-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="mt-4 text-h6" style="font-family: 'Inter', sans-serif;">Loading data...</div>
        </div>
      </v-overlay>
    </v-container>
  </v-app>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import VueGauge from 'vue-gauge'

import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import GeneralInfo from '@/components/TugboatDetails/GeneralInfo.vue';
import FuelTank from '@/components/TugboatDetails/FuelTank.vue';
import AlertBadges from '@/components/BargeDetails/AlertBadges.vue';
import markerIconUrl from '@/assets/Images/ship_location.png';
import { fuelCapacityTugboat } from '@/config/fuel-capacity-config';
import NotificationTable from '@/components/NotificationTable.vue';

const $api = inject('$api');
const router = useRouter();
const route = useRoute();
const loading = ref(true);
const error = ref(null);
const map = ref(null);
const marker = ref(null);
const mapInitialized = ref(false);
const position = ref([13.1486, 100.8122]);
const devices = ref([]);
const deviceId = ref(route.params.deviceId);
const chartWidth = ref(0);
const isDataLoaded = ref(false);
const noti = ref([])
const gauges = ref([
  { type: 'Water Temp', title: 'Water Temperature', unit: '°C' },
  { type: 'Oil Pressure', title: 'Oil Pressure', unit: 'bar' },
  { type: 'RPM', title: 'RPM', unit: 'RPM' }
]);

const fetchDeviceData = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await $api.get('/MachineStatus/GetDeviceByDeviceId', {
      params: { deviceId: deviceId.value }
    });

    devices.value = response.data;
    updateDevicePosition();
    
  } catch (err) {
    console.error('Error fetching device data:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const fetchNotification = async () => {
  loading.value = true;
  if (!devices.value.length) {
    await fetchDeviceData();
  }
  
  try {
    for (const device of devices.value) {
      const requestBody = {
        DeviceId: device.DeviceId,
        IsAccept: false
      };

      try {
        const response = await $api.put('/device/notificationlistStatus', requestBody);
        const filteredData = response.data.filter(item =>  item.Title.includes("Danger"));
        noti.value = [...noti.value, ...filteredData];
      } catch (err) {
        console.error(`Failed to fetch notifications for DeviceId ${device.DeviceId}:`, err);
      }
    }

    console.log("Notifications:", noti.value);
  } catch (err) {
    error.value = 'Failed to fetch notifications. Please try again later.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const mappedNotices = computed(() => {
  return noti.value.map(item => ({
    date: item.AlertTime,
    name: item.DeviceLabel,
    measuremnet: item.MeasurementName,
    details: item.Description,
    status: item.IsAccept ? 'ดำเนินการเสร็จสิ้น' : 'รอแจ้งซ่อม',
  }));
});

const updateDevicePosition = () => {
  if (devices.value.length > 0) {
    const device = devices.value[0];
    
    const longitudeMeasurement = device.Measurements?.find(
      m => m.measurementname === "Longitude" || m.measurementlabel === "Longitude"
    );
    
    const latitudeMeasurement = device.Measurements?.find(
      m => m.measurementname === "Latitude" || m.measurementlabel === "Latitude"
    );
    
    if (longitudeMeasurement && latitudeMeasurement) {
      const longitude = parseFloat(longitudeMeasurement.measurementvalue);
      const latitude = parseFloat(latitudeMeasurement.measurementvalue);
      
      if (!isNaN(longitude) && !isNaN(latitude)) {
        position.value = [latitude, longitude];
        updatePosition();
      }
    }
  }
};

const initializeMap = () => {
  if (mapInitialized.value || !document.getElementById('mapContainer')) return;

  setTimeout(() => {
    map.value = L.map('mapContainer').setView(position.value, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value);
  
    const shipIcon = L.icon({
      iconUrl: markerIconUrl,
      iconSize: [52, 52],
      iconAnchor: [26, 26],
      popupAnchor: [0, -16]
    });
  
    marker.value = L.marker(position.value, { icon: shipIcon }).addTo(map.value);
    marker.value.bindPopup(`ตำแหน่งเรือ: ${position.value[0].toFixed(4)}, ${position.value[1].toFixed(4)}`);
    mapInitialized.value = true;
  }, 100);
};

const updatePosition = () => {
  if (!position.value || !Array.isArray(position.value) || position.value.length !== 2) {
    console.error('Invalid position:', position.value);
    position.value = [13.1486, 100.8122];
  }

  if (marker.value) {
    marker.value.setLatLng(position.value);
    marker.value.setPopupContent(`ตำแหน่งเรือ: ${position.value[0].toFixed(4)}, ${position.value[1].toFixed(4)}`);
  }

  if (map.value) {
    map.value.setView(position.value, 10);
  }
};

const getWarningCount = (device) => {
  return device?.MeasurementsAlertCount?.find(item => 'AlertWarningTotal' in item)?.AlertWarningTotal || 0;
};

const getDangerCount = (device) => {
  return device?.MeasurementsAlertCount?.find(item => 'AlertDangerTotal' in item)?.AlertDangerTotal || 0;
};

const getMeasurementValue = (measurementName) => {
  if (!devices.value.length) return 0;
  const device = devices.value[0];
  const measurement = device.Mesurement.find(m => m.measurementname === measurementName);
  
  if (!measurement || measurement.lastValue === null) return 0;
  
  const value = parseFloat(measurement.lastValue);
  return isNaN(value) ? 0 : value;
};

const getGaugeOptions = (measurementName, device) => {
  if (!device) return {};
  
  const measurement = device.Mesurement.find(m => m.measurementname === measurementName);
  if (!measurement) return {};
  
  const lastValue = measurement.lastValue === null || isNaN(parseFloat(measurement.lastValue)) 
    ? 0 
    : parseFloat(measurement.lastValue);
  
  let needlePercentage = 0;
  let colors = [];
  let delimiters = [];
  let labels = [];
  
  switch (measurementName) {
    case 'Water Temp':
      needlePercentage = (lastValue / measurement.valuemax) * 100;
      colors = ['#3DCC5B', '#FFD54F', '#F44336'];
      delimiters = [
        (measurement.thresholdminwarning / measurement.valuemax) * 100,
        (measurement.thresholdmindanger / measurement.valuemax) * 100,
      ];
      labels = [measurement.thresholdminwarning, measurement.thresholdmindanger];
      break;
      
    case 'Oil Pressure':
      needlePercentage = (measurement.lastValue / measurement.valuemax) * 100;
      colors = ['#F44336', '#FFD54F', '#3DCC5B'];
      delimiters = [
        (measurement.thresholdmindanger / measurement.valuemax) * 100,
        (measurement.thresholdminwarning / measurement.valuemax) * 100,
      ];
      labels = [measurement.thresholdmindanger, measurement.thresholdminwarning];
      break;

    case 'RPM':
      needlePercentage = (lastValue / measurement.valuemax) * 100;
      colors = ['#3DCC5B', '#FFD54F', '#F44336'];
      delimiters = [
        (measurement.thresholdminwarning / measurement.valuemax) * 100,
        (measurement.thresholdmindanger / measurement.valuemax) * 100,
      ];
      labels = [measurement.thresholdminwarning, measurement.thresholdmindanger];
      break;
      
    default:
      needlePercentage = 0;
      colors = ['#3DCC5B'];
      delimiters = [];
      labels = [];
  }
  
  return {
    needleValue: needlePercentage,
    needleColor: '#2c3e50',
    arcDelimiters: delimiters,
    arcColors: colors,
    arcLabels: labels,
    rangeLabel: ['0', measurementName === 'Water Temp' ? '120' :
                measurementName === 'Oil Pressure' ? '5' :
                measurementName === 'RPM' ? '4000' : 
                measurement.valuemax.toString()],
    rangeLabelFontSize: window.innerWidth < 600 ? 8 : 10,
    arcLabelFontSize: window.innerWidth < 600 ? 6 : 8,
    arcOverEffect: true,
    chartWidth: chartWidth.value,
    hasNeedle: true
  };
};

const updateChartSize = () => {
  const width = window.innerWidth;
  if (width < 600) {
    chartWidth.value = width * 0.35;
  } else if (width < 960) {
    chartWidth.value = width * 0.25;
  } else if (width < 1264) {
    chartWidth.value = width * 0.2;
  } else {
    chartWidth.value = width * 0.15;
  }
};

const filteredMeasurements = computed(() => {
  if (!devices.value.length) return {};
  const measurements = devices.value[0].Mesurement;
  
  return {
    'Hour Meter': {
      value: measurements.find(m => m.measurementname === 'Hour Meter')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Hour Meter')?.measurementunit || 'hour'
    },
    'Battery Volts': {
      value: measurements.find(m => m.measurementname === 'Battery Volts')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Battery Volts')?.measurementunit || 'Volts'
    },
    'Wind-Speed': {
      value: measurements.find(m => m.measurementname === 'Oil Pressure')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Oil Pressure')?.measurementunit || 'm/s'
    },
    '%Throttle': {
      value: measurements.find(m => m.measurementname === 'Water Temp')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Water Temp')?.measurementunit || ''
    },
    'Total Fuel Consumption': {
      value: measurements.find(m => m.measurementname === 'Total Fuel Consumption')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Total Fuel Consumption')?.measurementunit || 'L'
    },
    'Fuel Rate': {
      value: measurements.find(m => m.measurementname === 'Fuel Rate')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Fuel Rate')?.measurementunit || 'L/hr'
    }
  };
});

const mainTankRemaining = computed(() => {
  if (!devices.value.length) return 0
  
  const measurements = devices.value[0].Mesurement || []
  const measurement = measurements.find(m => 
    m.measurementname === "Fuel Level Main" || 
    m.measurementlabel === "Fuel Level Main"
  )
  // console.log('Main Tank Measurement:', measurement)
  const value = measurement?.lastValue
  return value ? parseInt(value) : 0
})

const mainTankCapacity = computed(() => {
  if (!devices.value.length) return 20000
  return fuelCapacityTugboat[devices.value[0].DeviceName] || 20000
})

const feedTankRemaining = computed(() => {
  if (!devices.value.length) return 0
  
  const measurements = devices.value[0].Mesurement || []
  const measurement = measurements.find(m => 
    m.measurementname === "Fuel Level Feed" || 
    m.measurementlabel === "Fuel Level Feed"
  )
  // console.log('Feed Tank Measurement:', measurement)
  const value = measurement?.lastValue
  return value ? parseInt(value) : 0
})

const feedTankCapacity = computed(() => 20000)

const totalTankRemaining = computed(() => {
  return mainTankRemaining.value + feedTankRemaining.value
})

const totalTankCapacity = computed(() => {
  return mainTankCapacity.value + feedTankCapacity.value
})

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepage');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101010600');

  if (!permission || !permission.IsActive) {
    return router.push('/Homepage');
  }
};

const navigateToGPSVessel = (deviceId) => {
  router.push({ name: 'GPSVessel', params: { deviceId: deviceId } });
};

onMounted(async () => {
  await fetchDeviceData();
  isDataLoaded.value = true;
  initialize();
  initializeMap();
  updateChartSize();
  fetchNotification();
  window.addEventListener('resize', updateChartSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateChartSize);
   if (map.value) { map.value.remove(); map.value = null;}
});

watch(position, () => {
  updatePosition();
}, { deep: true });

watch(() => route.params.deviceId, (newId) => {
  deviceId.value = newId;
  fetchDeviceData(newId); // Your data fetching function
});

// ตรวจจับการเปลี่ยนแปลงของ deviceId
// watch(() => route.params.deviceId, async (newDeviceId) => {
//   if (newDeviceId) {
//     await fetchDeviceData(newDeviceId);
//     if (map.value) {
//       updatePosition(); // อัปเดตตำแหน่งในแผนที่ที่มีอยู่
//     } else {
//       initializeMap(); // สร้างแผนที่ใหม่ถ้ายังไม่มี
//     }
//   }
// });
</script>

<style lang="scss" scoped>
.title {
  font-size: 3vh;
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
  height: 100%;
  width: 100%;
  border-radius: 16px;
  z-index: 1;
}

.gauge-card {
  border-radius: 24px;
}

.tugboat-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.gauge-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.5vh;
  font-weight: bold;
  color: var(--dark-gray)
}

.central-label {
  font-size: 3vh;
  font-weight: bold;
  margin-top: -10%;
}

:deep(text) {
  font-family: 'Inter', sans-serif;
  font-size: 1  vh;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit {
  width: 2vw;
  height: 2vh;
  border-radius: 2vh;
  font-size: 2vh;
  color: var(--symbol-blue);
  background-color: var(--bg-light-tugboat);
}

.header {
  font-size: 2.5vh;
  font-weight: bold;
}
</style>