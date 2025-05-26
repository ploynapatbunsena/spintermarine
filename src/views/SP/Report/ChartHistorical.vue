<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div v-if="!loading">
        <div class="title">Historical Chart Report</div>
        <v-card class="mt-4">
          <v-card-text class="mx-16 my-6">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedType"
                  :items="typeOptions"
                  item-title="typeDeviceName"
                  item-value="typeDeviceName"
                  label="Vehicle"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:modelValue="handleTypeChange"
                  :error="vehicleError"
                  :error-messages="vehicleError ? 'Vehicle is required' : ''"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedDevices"
                  :items="deviceOptions"
                  item-title="deviceName"
                  item-value="deviceId"
                  label="Devices"
                  variant="outlined"
                  density="compact"
                  clearable
                  :error="deviceError"
                  :error-messages="deviceError ? 'Device is required' : ''"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedMeasurement"
                  :items="measurementList"
                  item-title="measurementName"
                  item-value="measurementId"
                  label="Measurement"
                  variant="outlined"
                  density="compact"
                  clearable
                  :error="measurementError"
                  :error-messages="measurementError ? 'Measurement is required' : ''"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <datePicker
                  v-model="startDate"
                  label="Start Date"
                  :max="endDate || null"
                  enable-seconds
                  teleport
                  :max-date="new Date()"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="Select Start Date"
                  :class="{ 'error-border': startDateError }"
                ></datePicker>
                <div v-if="startDateError" class="error-message">{{ startDateError }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <datePicker
                  v-model="endDate"
                  label="End Date"
                  :min="startDate || null"
                  enable-seconds
                  teleport
                  :max-date="new Date()"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="Select End Date"
                  :class="{ 'error-border': endDateError }"
                ></datePicker>
                <div v-if="endDateError" class="error-message">{{ endDateError }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedInterval"
                  :items="intervalList"
                  item-title="title"
                  item-value="id"
                  label="Interval"
                  variant="outlined"
                  density="compact"
                  :model-value="getDisplayInterval().id"
                >
                  <template v-slot:selection>
                    {{ getDisplayInterval().title }}
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn
                  class="cancel-btn elevation-0 text-none mr-4"
                  @click="resetFilters"
                >
                  Cancel
                </v-btn>
                <v-btn
                  class="search-btn mr-4 elevation-0 text-none"
                  @click="validateAndSearch"
                  :loading="searchLoading"
                >
                  Search
                </v-btn>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      class="download-btn elevation-0 text-none"
                      v-bind="props"
                      :disabled="!showResult"
                    >
                      Download
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="format in ['CSV', 'JPG']"
                      :key="format"
                      :value="format"
                      @click="downloadReport(format)"
                    >
                      <v-list-item-title>{{ format }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
  
          <v-card-text v-if="searchLoading" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <div>Loading data...</div>
          </v-card-text>
  
          <v-card-text v-if="error" class="text-center error--text">
            Error loading data: {{ error }}
          </v-card-text>
  
          <v-card-text v-if="showResult && !searchLoading" class="mx-16">
            <div v-if="error" class="text-center error--text py-4">
              <v-icon color="error">mdi-alert-circle</v-icon>
              {{ error }}
            </div>
            <div v-if="isChartLoaded && chartData" class="chart-container">
              <apexchart
                ref="chart"
                type="line" 
                height="680" 
                :options="chartData.options" 
                :series="chartData.series"
              ></apexchart>
            </div>
            <div v-else-if="!error" class="text-center py-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <div>กำลังโหลดข้อมูลกราฟ...</div>
            </div>
          </v-card-text>
        </v-card>
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
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import '@/assets/colors.scss';
import { computed, inject, onMounted, ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router';

const measurementLoading = ref(false);
const $api = inject('$api');
const router = useRouter();
const loading = ref(true);
const datePicker = VueDatePicker;
const apexchart = VueApexCharts;
const bargeGruop = ref([]);
const tugboatRiverGroup = ref([]);
const tugboatSeaGroup = ref([]);
const selectedType = ref(null);
const selectedDevices = ref(null);
const measurementList = ref([]);
const selectedMeasurement = ref(null);
const measurementError = ref(false);
const showResult = ref(false);
const searchLoading = ref(false);
const error = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const vehicleError = ref(false);
const deviceError = ref(false);
const startDateError = ref('');
const endDateError = ref('');
const selectedInterval = ref(null);
const intervalList = ref([
  { id: '5m', title: '5 minutes' },
  { id: '15m', title: '15 minutes' },
  { id: '30m', title: '30 minutes' },
  { id: '1h', title: '1 hour' },
  { id: '1d', title: '1 day' },
  { id: '1w', title: '1 week' },
  { id: '1M', title: '1 month' }
]);

const chart = ref(null);
const chartData = ref(null);
const chartOptions = ref({});
const chartSeries = ref([]);
const isChartLoaded = ref(false);

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/login');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101020100');

  if (!permission || !permission.IsActive) {
    return router.push('/login');
  }
};

const fetchDeviceData = async () => {
  try {
    loading.value = true;

    const [bargeResponse, riverResponse, seaResponse] = await Promise.all([
      $api.get('/MachineStatus/GetDeviceBargesGrouped'),
      $api.get('/MachineStatus/GetTugboatRiver'),
      $api.get('/MachineStatus/GetTugboatSea')
    ]);

    bargeGruop.value = bargeResponse.data;
    tugboatRiverGroup.value = riverResponse.data;
    tugboatSeaGroup.value = seaResponse.data;

    bargeGruop.value.forEach(group => group.typeVehicle = 'Barge');
    tugboatRiverGroup.value.forEach(group => group.typeVehicle = 'Tugboat River Going');
    tugboatSeaGroup.value.forEach(group => group.typeVehicle = 'Tugboat Sea Going');

  } catch (error) {
    console.error('Failed to fetch device data:', error);
    error.value = 'Failed to load device list. Please try again.';
  } finally {
    loading.value = false;
  }
};

const fetchMeasurementList = async () => {
  try {
    measurementLoading.value = true;

    if (!selectedDevices.value) {
      measurementList.value = [];
      selectedMeasurement.value = null;
      return;
    }

    const response = await $api.put('/Device/GetDeviceMeasurementList', {
      DeviceId: selectedDevices.value
    });

    measurementList.value = response.data
      .filter(item => item.MeasurementLabel !== "Status")
      .map(item => ({
        measurementId: item.MeasurementId,
        measurementName: item.MeasurementName,
    }));

    selectedMeasurement.value = null;
  } catch (error) {
    console.error('Failed to fetch measurement list:', error);
    measurementList.value = [];
    selectedMeasurement.value = null;
  } finally {
    measurementLoading.value = false;
  }
};

const typeOptions = computed(() => {
  const options = [];
  
  bargeGruop.value.forEach(item => {
    options.push({
      typeDeviceName: item.TypeDevicename,
      typeVehicle: 'Barge',
      source: 'barge'
    });
  });

  if (tugboatRiverGroup.value.length > 0) {
    options.push({
      typeDeviceName: 'Tugboat River Going',
      typeVehicle: 'Tugboat River Going',
      source: 'river'
    });
  }

  if (tugboatSeaGroup.value.length > 0) {
    options.push({
      typeDeviceName: 'Tugboat Sea Going',
      typeVehicle: 'Tugboat Sea Going',
      source: 'sea'
    });
  }
  return options;
});

const deviceOptions = computed(() => {
  if (!selectedType.value) return [];

  const selectedOption = typeOptions.value.find(option => option.typeDeviceName === selectedType.value);
  if (!selectedOption) return [];

  let devices = [];
  
  if (selectedOption.source === 'barge') {
    const group = bargeGruop.value.find(item => item.TypeDevicename === selectedType.value);
    if (group) devices = group.Devices;
  } 
  else if (selectedOption.source === 'river') {
    tugboatRiverGroup.value.forEach(group => {
      devices = devices.concat(group.Devices);
    });
  }
  else if (selectedOption.source === 'sea') {
    tugboatSeaGroup.value.forEach(group => {
      devices = devices.concat(group.Devices);
    });
  }
  return devices
  .filter(device => !device.DeviceLabel.toLowerCase().includes('crane'))
  .map(device => ({
    deviceId: device.DeviceId,
    deviceName: device.DeviceLabel
  }));
});

const handleTypeChange = () => {
  selectedMeasurement.value = null;
  selectedDevices.value = null;
  measurementList.value = [];
};

const resetFilters = () => {
  selectedType.value = null;
  selectedDevices.value = null;
  selectedMeasurement.value = [];
  startDate.value = null;
  endDate.value = null;
  showResult.value = false;
  vehicleError.value = false;
  deviceError.value = false;
  measurementError.value = false;
  startDateError.value = false;
  endDateError.value = false;
};

const searchRecords = async () => {
  try {
    searchLoading.value = true;
    showResult.value = true;
    error.value = null;
    isChartLoaded.value = false;

    if (!selectedDevices.value || !selectedMeasurement.value || !startDate.value || !endDate.value) {
      throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    const intervalMinutes = {
      '5m': 5,
      '15m': 15,
      '30m': 30,
      '1h': 60,
      '1d': 1440,
      '1w': 10080,
      '1M': 43200
    };

    const effectiveInterval = selectedInterval.value === 'auto' 
      ? calculateAutoInterval() 
      : selectedInterval.value;

    const interval = intervalMinutes[effectiveInterval] || 5;

    const start = formatTimeASP(startDate.value);
    const end = formatTimeASP(endDate.value);

    // const response = await $api.get('/MachineStatus/RealtimeChartData', {
    const response = await $api.get('/Report/reportchartdata', {
      params: {
        dev_id: selectedDevices.value,
        start: start,
        end: end,
        interval: interval,
        mes_id: selectedMeasurement.value
      }
    });

    console.log(response.data);
    

    // if (!response.data || response.data.length === 0) {
    //   throw new Error('ไม่พบข้อมูลสำหรับเงื่อนไขที่เลือก');
    // }

    const apiData = response.data[0];
    
    // if (!apiData.Xdata || !apiData.Ydata || !apiData.Ydata[0] || !apiData.Ydata[0].data) {
    //   throw new Error('รูปแบบข้อมูลจาก API ไม่ถูกต้อง');
    // }

    prepareChartData(apiData);
    isChartLoaded.value = true;

  } catch (err) {
    console.error('Error searching records:', err);
    error.value = err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
    chartData.value = null;
    isChartLoaded.value = false;
  } finally {
    searchLoading.value = false;
  }
};

const downloadReport = async (format) => {
  if (!showResult.value || !chartData.value || !chartData.value.series || chartData.value.series.length === 0) {
    error.value = 'No data available to download';
    alert('ไม่มีข้อมูลสำหรับดาวน์โหลด');
    return;
  }

  const start = startDate.value ? formatDateForFilename(startDate.value) : 'nodate';
  const end = endDate.value ? formatDateForFilename(endDate.value) : 'nodate';
  const filename = `Historical_Chart_Report_${start}_${end}`;

  if (format === 'CSV') {
    const headers = ['Timestamp,Value,Unit'];
    const rows = [];
    
    const series = chartData.value.series[0].data;
    const unit = chartData.value.options.yaxis.title.text || '';
    
    series.forEach(item => {
      rows.push(`"${item.x}","${item.y}","${unit}"`);
    });

    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else if (format === 'JPG') {
      if (chart.value) {
      chart.value.chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = `${filename}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }
};

const validateAndSearch = () => {
  let isValid = true;
  
  vehicleError.value = false;
  deviceError.value = false;
  measurementError.value = false;
  startDateError.value = '';
  endDateError.value = '';
  
  if (!selectedType.value) {
    vehicleError.value = true;
    isValid = false;
  }

  if (!selectedDevices.value) {
    deviceError.value = true;
    isValid = false;
  }

  if (!selectedMeasurement.value) {
    measurementError.value = true;
    isValid = false;
  }

  if (!startDate.value) {
    startDateError.value = 'Start date is required';
    isValid = false;
  }
  
  if (!endDate.value) {
    endDateError.value = 'End date is required';
    isValid = false;
  }

  if (isValid) {
    searchRecords();
  }
};

const formatTimeASP = (dt) => {
  var dateTime = new Date(dt);
  var month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
  var day = ("0" + dateTime.getDate()).slice(-2);
  var year = dateTime.getFullYear();
  var hour = ("0" + dateTime.getHours()).slice(-2);
  var minute = ("0" + dateTime.getMinutes()).slice(-2);
  var sec = ("0" + dateTime.getSeconds()).slice(-2);
  return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + sec;
};

const formatDateForFilename = (date) => {
  if (!date) return '';
  const dateTime = new Date(date);
  const year = dateTime.getFullYear();
  const month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
  const day = ("0" + dateTime.getDate()).slice(-2);
  const hour = ("0" + dateTime.getHours()).slice(-2);
  const minute = ("0" + dateTime.getMinutes()).slice(-2);
  const second = ("0" + dateTime.getSeconds()).slice(-2);
  return `${year}${month}${day}_${hour}${minute}${second}`;
};

const calculateAutoInterval = () => {
  if (!startDate.value || !endDate.value) {
    return '5m';
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const diffInMs = end - start;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 1) {
    return '5m'; // น้อยกว่า 1 วัน
  } else if (diffInDays <= 3) {
    return '15m'; // 1-3 วัน
  } else if (diffInDays <= 7) {
    return '30m'; // 3-7 วัน
  } else if (diffInDays <= 28) { // 4 สัปดาห์
    return '1h'; // 1-4 สัปดาห์
  } else if (diffInDays <= 90) { // ~3 เดือน
    return '1d'; // 1-3 เดือน
  } else {
    return '1w'; // มากกว่า 3 เดือน
  }
};

const getEffectiveInterval = () => {
  if (selectedInterval.value && selectedInterval.value !== 'auto') {
    return selectedInterval.value;
  }
  return calculateAutoInterval();
};

const getDisplayInterval = () => {
  if (!startDate.value || !endDate.value) {
    return { id: 'auto', title: 'Auto' };
  }
  
  const interval = getEffectiveInterval();
  const found = intervalList.value.find(item => item.id === interval);
  return found || { id: interval, title: `${interval} (Auto)` };
};

const prepareChartData = (apiData) => {
  try {
    const xCategories = apiData.Xdata || [];
    const yValues = apiData.Ydata?.[0]?.data || [];

    const seriesData = xCategories.map((x, index) => {
      const yValue = yValues[index] !== null && yValues[index] !== undefined 
        ? yValues[index] 
        : null;
      
      return {
        x: x,
        y: yValue
      };
    }).filter(item => item.y !== null);

    chartSeries.value = [{
      name: apiData.ChartName || 'Data',
      data: seriesData
    }];

    chartOptions.value = {
      chart: {
        height: 680,
        type: 'line',
        zoom: {
          enabled: true
        },
        toolbar: {
          show: true
        }
      },
      colors: ["#FAC12A"],
      stroke: {
        curve: 'smooth',
        width: 2
      },
      markers: {
        size: 5,
        hover: {
          size: 7
        }
      },
      xaxis: {
        type: 'category',
        categories: xCategories
      },
      yaxis: {
        title: {
          text: apiData.Unit?.[0]?.MeasurementUnit || 'Value'
        },
        min: Math.min(...yValues.filter(val => val !== null)),
        max: Math.max(...yValues.filter(val => val !== null))
      },
      tooltip: {
        enabled: true,
        intersect: false,
        shared: true
      },
      noData: {
        text: "No data available",
        align: 'center',
        verticalAlign: 'middle',
        style: {
          color: "#666",
          fontSize: '14px'
        }
      }
    };

    chartData.value = {
      series: chartSeries.value,
      options: chartOptions.value
    };
  } catch (error) {
    console.error('Error preparing chart data:', error);
    throw new Error('Failed to prepare chart data');
  }
};

onMounted(async() => {
  await initialize();
  await fetchDeviceData();
  await fetchMeasurementList();
});

watch([startDate, endDate], () => {
  if (startDate.value && endDate.value) {
    selectedInterval.value = 'auto';
  }
}, { deep: true });

watch(selectedDevices, (newVal) => {
  if (newVal) {
    fetchMeasurementList();
  } else {
    measurementList.value = [];
    selectedMeasurement.value = null;
  }
});
</script>

<style scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.download-btn {
  background-color: var(--yellow);
  color: var(--white);
  border-radius: 24px;  
}

.cancel-btn {
  color: #000000;
  border: 1px solid #E3E3E3;
  border-radius: 24px;
}

.search-btn {
  background-color: #223368;
  color: #ffffff;
  border-radius: 24px;
}

.error--text {
  color: #DC2B2B;
  font-weight: bold;
}

.error-border {
  border: 1px solid #DC2B2B;
  border-radius: 4px;
}

.error-message {
  font-family: 'Inter', sans-serif;
  color: #DC2B2B;
  font-size: 12px;
  margin-top: 4px;
}
</style>