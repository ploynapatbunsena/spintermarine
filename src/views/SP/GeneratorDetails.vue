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
        </v-row>
        <v-row v-if="devices.length > 0">
          <v-col cols="12" lg="6">
            <v-row>
              <v-col cols="6" sm="6" md="6" lg="6" v-for="(gauge, index) in gauges" :key="index">
                <v-card class="gauge-card">
                  <v-card-title class="gauge-title text-center">{{ gauge.title }}</v-card-title>
                  <v-card-text class="text-center pa-0">
                    <vue-gauge
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
          </v-col>
          <v-col cols="12" lg="6">
            <v-card class="rounded-xl h-100">
              <v-card-title class="d-flex justify-center header">General Information</v-card-title>
              <v-card-text class="px-10">
                <GeneralInfo 
                  :measurements="filteredMeasurements"
                  :status="deviceStatus"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6">
            <v-card class="rounded-xl gen-img">
              <GeneratorImage 
                :measurements="filteredMeasurements"
              />
            </v-card>
          </v-col>
          <v-col cols="12" lg="6">
            <v-card class="pa-2 rounded-xl h-100">
              <div class="notification-header">
                <v-card-title class="header">Notification</v-card-title>
                <v-card-title>
                  <router-link 
                    :to="{
                      name: 'NotificationReport',
                      query: {
                        vehicle: devices[0]?.TypeDevicename,
                        device: devices[0]?.DeviceId,
                        measurements: 'all',
                        statuses: 'false'
                      }
                    }"
                  >
                    <v-icon icon="mdi-pencil" class="edit"></v-icon>
                  </router-link>
                </v-card-title>
              </div>
              <NotificationTable :notices="mappedNotices"/>
            </v-card>   
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
import { ref, onMounted, inject, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VueGauge from 'vue-gauge'
import NavigationBar from '@/components/NavigationBar.vue'
import SpaceBar from '@/components/SpaceBar.vue'
import AlertBadges from '@/components/BargeDetails/AlertBadges.vue'
import GeneralInfo from '@/components/GeneratorDetails/GeneralInfo.vue'
import GeneratorImage from '@/components/GeneratorDetails/GeneratorImage.vue'
import NotificationTable from '@/components/NotificationTable.vue'
import { watch } from 'vue'

const $api = inject('$api');
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref(null);
const chartWidth = ref(0);
const noti = ref([]);
const devices = ref([]);
const deviceId = ref(route.params.deviceId);
let intervalId = null;

const audioPlayed = ref(false);
const prevDangerCount = ref(0);
const alertSound = ref(null);

const gauges = ref([
  { type: 'Actual Power', title: 'Actual Power', unit: 'kW' },
  { type: 'Oil Pressure', title: 'Oil Pressure', unit: 'bar' },
  { type: 'Water Temp', title: 'Water Temperature', unit: '°C' },
  { type: 'RPM', title: 'RPM', unit: 'RPM' }
]);

watch(() => route.params.deviceId, (newId) => {
  deviceId.value = newId;
  fetchDeviceData(newId);
});

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepage');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101010300');

  if (!permission || !permission.IsActive) {
    return router.push('/Homepage');
  }
};

const fetchDeviceData = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await $api.get('/MachineStatus/GetDeviceByDeviceId', {
      params: { deviceId: deviceId.value }
    });
    devices.value = response.data;
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
      try {
        const response = await $api.put('/device/notificationlistStatus', {
          DeviceId: device.DeviceId,
          IsAccept: false
        });
      
        noti.value.push(...response.data);
      } catch (err) {
        console.error(`Failed to fetch notifications for DeviceId ${device.DeviceId}:`, err);
      }
    }
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
    // details: item.Description,
    details: {
      text: item.Description,
      isDanger: item.Description === "Danger",
      isWarning: item.Description === "Warning"
    },
    status: item.IsAccept ? 'ดำเนินการเสร็จสิ้น' : 'รอแจ้งซ่อม',
  }));
});

const getMeasurementValue = (measurementName) => {
  if (!devices.value.length) return 0
  const device = devices.value[0]
  const measurement = device.Mesurement.find(m => m.measurementname === measurementName)
  return measurement ? parseFloat(measurement.lastValue) : 0
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
    case 'Actual Power':
      needlePercentage = (lastValue / measurement.valuemax) * 100;
      colors = ['#3DCC5B', '#FFD54F', '#F44336'];
      delimiters = [
        (measurement.thresholdminwarning / measurement.valuemax) * 100,
        (measurement.thresholdmindanger / measurement.valuemax) * 100,
      ];
      console.log(measurement.lastValue );
      
      labels = [measurement.thresholdminwarning, measurement.thresholdmindanger];
      break;
      
    case 'Oil Pressure':
      needlePercentage = (lastValue / measurement.valuemax) * 100;
      colors = ['#F44336', '#FFD54F', '#3DCC5B'];
      delimiters = [
        (measurement.thresholdmindanger / measurement.valuemax) * 100,
        (measurement.thresholdminwarning / measurement.valuemax) * 100,
      ];
      labels = [measurement.thresholdmindanger, measurement.thresholdminwarning];
      break;
      
    case 'Water Temp':
      needlePercentage = (lastValue / measurement.valuemax) * 100;
      colors = ['#3DCC5B', '#FFD54F', '#F44336'];
      delimiters = [
        (measurement.thresholdminwarning / measurement.valuemax) * 100,
        (measurement.thresholdmindanger / measurement.valuemax) * 100,
      ];
      labels = [measurement.thresholdminwarning, measurement.thresholdmindanger];
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
    rangeLabel: ['0', measurementName === 'Actual Power' ? measurement.valuemax.toString() :
                measurementName === 'Oil Pressure' ? measurement.valuemax.toString() : 
                measurementName === 'Water Temp' ? measurement.valuemax.toString() : 
                measurementName === 'RPM' ? measurement.valuemax.toString() : 
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

const getWarningCount = (device) => {
  return device?.MeasurementsAlertCount?.find(item => 'AlertWarningTotal' in item)?.AlertWarningTotal || 0;
};

const getDangerCount = (device) => {
  return device?.MeasurementsAlertCount?.find(item => 'AlertDangerTotal' in item)?.AlertDangerTotal || 0;
};

const totalDangerCount = computed(() => {
  if (!devices.value.length) return 0;
  return devices.value.reduce((total, device) => {
    return total + (device?.MeasurementsAlertCount?.find(item => 'AlertDangerTotal' in item)?.AlertDangerTotal || 0);
  }, 0);
});

const playAlertSound = () => {
  if (!alertSound.value) {
    alertSound.value = new Audio('/alert-sound.mp3');
    alertSound.value.volume = 0.1;
  }
  
  alertSound.value.play().catch(e => console.error('Error playing sound:', e));
};

watch(totalDangerCount, (newCount, oldCount) => {
  if (!audioPlayed.value && newCount > 0) {
    playAlertSound();
    audioPlayed.value = true;
  }
  else if (newCount > oldCount) {
    playAlertSound();
  }
  
  prevDangerCount.value = newCount;
}, { immediate: true });

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
    'Actual Power': {
      value: measurements.find(m => m.measurementname === 'Actual Power')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Actual Power')?.measurementunit || 'kW'
    },
    'Oil Pressure': {
      value: measurements.find(m => m.measurementname === 'Oil Pressure')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Oil Pressure')?.measurementunit || 'bar'
    },
    'Water Temp': {
      value: measurements.find(m => m.measurementname === 'Water Temp')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Water Temp')?.measurementunit || '°C'
    },
    'Total Fuel Consumption': {
      value: measurements.find(m => m.measurementname === 'Total Fuel Consumption')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Total Fuel Consumption')?.measurementunit || 'L'
    },
    'RPM': {
      value: measurements.find(m => m.measurementname === 'RPM')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'RPM')?.measurementunit || 'RPM'
    },
    'Total Fuel ALL': {
      value: measurements.find(m => m.measurementname === 'Total Fuel ALL')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Total Fuel ALL')?.measurementunit || 'L'
    },
    'Fuel Rate': {
      value: measurements.find(m => m.measurementname === 'Fuel Rate')?.lastValue || '0',
      unit: measurements.find(m => m.measurementname === 'Fuel Rate')?.measurementunit || 'L/hr'
    }
  };
});

const deviceStatus = computed(() => {
  if (!devices.value.length) return 'N/A';
  const statusValue = devices.value[0].Mesurement.find(m => m.measurementname === 'Status')?.lastValue;
  
  const statusMap = {
    0: { text: 'Offline'},
    1: { text: 'Standby'},
    2: { text: 'Running'},
    3: { text: 'Standby/Maintenance'},
    4: { text: 'Running/Maintenance'},
    5: { text: 'Down'}
  };
  
  return statusMap[statusValue] || { text: 'N/A', color: '#C0C0C0' };
});

const fetchDataWithInterval = async () => {
  await fetchNotification();
  await fetchDeviceData();
};

const startDataInterval = () => {intervalId = setInterval(fetchDataWithInterval, 3 * 60 * 1000);};

const stopDataInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(async() => {
  console.log('Component mounted');

  await initialize();
  updateChartSize();
  await fetchDataWithInterval();
  startDataInterval();
  window.addEventListener('resize', updateChartSize);
})

onBeforeUnmount(() => {
  console.log('Component unmounted');
  
  window.removeEventListener('resize', updateChartSize);
  stopDataInterval();
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 3vh;
  font-weight: 600;
  text-align: center;
}

.gauge-card {
  border-radius: 24px;
}

.gen-img {
  background-color: var(--bg-gen);
  padding: 20px;
}

.header {
  font-size: 2.5vh;
  font-weight: bold;
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
  font-size: 1vh;
}

.edit {
  width: 2vw;
  height: 2vh;
  border-radius: 2vh;
  font-size: 2vh;
  color: var(--symbol-blue);
  background-color: var(--bg-light-tugboat);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
