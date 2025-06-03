<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Report on RPM and Speed and %Throttle Affected by Wind Speed of Tugboat</div>
      <div class="title-thai">รายงาน RPM และ ความเร็ว และ %คันเร่ง ที่ถูกกระทบด้วยความเร็วลมของเรือยนต์</div>
      <v-card class="mt-4">
        <v-card-text class="mx-16 my-6">
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedTugboats"
                :items="tugboatOptions"
                item-title="deviceName"
                item-value="deviceId"
                label="Device"
                variant="outlined"
                density="compact"
                multiple
                clearable
                :error-messages="deviceError"
                :error="!!deviceError"
              >
                <template v-slot:prepend-item>
                  <v-list-item title="Select All" @click="toggleSelectAll">
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :color="isPartialSelection ? 'indigo-darken-4' : undefined"
                        :indeterminate="isPartialSelection"
                        :model-value="isAllSelected"
                      ></v-checkbox-btn>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ index }">
                  <span v-if="index === 0">{{ selectedTugboats.length }} selected</span>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-checkbox-btn :model-value="selectedTugboats.includes(item.raw.deviceId)"></v-checkbox-btn>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="3">
              <datePicker
                v-model="startDate"
                label="Start Date"
                :max="endDate || null"
                enable-seconds
                teleport
                format="yyyy-MM-dd HH:mm:ss"
                :max-date="new Date()"
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
                format="yyyy-MM-dd HH:mm:ss"
                :max-date="new Date()"
                placeholder="Select End Date"
                :class="{ 'error-border': endDateError }"
              ></datePicker>
              <div v-if="endDateError" class="error-message">{{ endDateError }}</div>
            </v-col>
            <v-col cols="12" md="3">
              <v-row>
                <v-col cols="6" md="3">
                  <v-btn
                    class="cancel-btn elevation-0 text-none"
                    @click="resetFilters"
                  >
                    Cancel
                  </v-btn>
                </v-col>
                <v-col cols="6" md="3">
                  <v-btn
                    class="search-btn elevation-0 text-none"
                    @click="validateAndSearch"
                    :loading="searchLoading"
                  >
                    Search
                  </v-btn>
                </v-col>
                <v-col cols="6" md="4">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        :disabled="!permissionExport('0101020300') || !showResult"
                        class="download-btn elevation-0 text-none"
                        v-bind="props"
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

        <v-card-text v-if="showResult && !searchLoading">
          <apexchart
            ref="chart"
            type="line"
            height="680"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </v-card-text>
      </v-card> 
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import { computed, inject, onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@/assets/colors.scss';
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router';

const datePicker = VueDatePicker;
const apexchart = VueApexCharts;
const $api = inject('$api');
const router = useRouter()
const showResult = ref(false);
const searchLoading = ref(false);
const error = ref(null);
const series = ref([]);
const tugboatDevices = ref([]);
const selectedTugboats = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const chart = ref(null);
const deviceError = ref('');
const startDateError = ref('');
const endDateError = ref('');
const permission = ref(null);

const chartOptions = ref({
  chart: {
    height: 680,
    type: "line",
    stacked: false,
    animations: {
      enabled: false
    }
  },
  colors: ["#352B54", "#FAC12A", "#DC2B2B", "#4D97FF"],
  fill: { opacity: 1 },
  dataLabels: { enabled: false },
  xaxis: { 
    categories: [],
    labels: {
      trim: true,
      hideOverlappingLabels: true
    }
  },
  yaxis: [
    {
      seriesName: "RPM",
      axisTicks: { show: true },
      axisBorder: { show: true, color: "#352B54" },
      labels: { style: { colors: "#352B54" } },
      title: { text: "RPM (RPM)", style: { color: "#352B54" } },
    },
  ],
  legend: {
    horizontalAlign: "center",
    offsetY: 16,
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false
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
});

const tugboatOptions = computed(() => {
  return tugboatDevices.value.flatMap(group => 
    group.Devices.map(device => ({
      deviceId: device.DeviceId,
      deviceName: device.DeviceName,
      type: group.TypeDevicename
    }))
  );
});

const isAllSelected = computed(() => {
  return selectedTugboats.value.length === tugboatOptions.value.length;
});

const isPartialSelection = computed(() => {
  return selectedTugboats.value.length > 0 && !isAllSelected.value;
});

const formatTimeShow = (datetime) => {
  if (datetime==null) {
    return null
  } else {
    var dateTime = new Date(datetime);
    var month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
    var day = ("0" + dateTime.getDate()).slice(-2);
    var year = dateTime.getFullYear();
    var hour = ("0" + dateTime.getHours()).slice(-2);
    var minute = ("0" + dateTime.getMinutes()).slice(-2);
    var sec = ("0" + dateTime.getSeconds()).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec;
  }
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

const processChartData = (devices) => {
  const categories = devices.map(device => device.DeviceName);
  const seriesData = [
    { name: 'RPM', type: 'bar', data: [] },
    { name: 'Speed', type: 'bar', data: [] },
    { name: '%Throttle', type: 'bar', data: [] },
    { name: 'Wind Speed', type: 'line', data: [] },
  ];

  devices.forEach(device => {
    const measurements = device.Measurement || [];
    seriesData[0].data.push(measurements.find(m => m.measurementname === 'RPM')?.AvgValue ?? 0);
    seriesData[1].data.push(measurements.find(m => m.measurementname === 'Speed')?.AvgValue ?? 0);
    seriesData[2].data.push(measurements.find(m => m.measurementname === '%Throttle')?.AvgValue ?? 0);
    seriesData[3].data.push(measurements.find(m => m.measurementname === 'Wind-Speed')?.AvgValue ?? 0);
  });

  return { series: seriesData, categories };
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTugboats.value = [];
  } else {
    selectedTugboats.value = tugboatOptions.value.map(option => option.deviceId);
  }
};

const validateForm = () => {
  let isValid = true;
  deviceError.value = '';
  startDateError.value = '';
  endDateError.value = '';
  
  if (selectedTugboats.value.length === 0) {
    deviceError.value = 'Device is required';
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
  
  return isValid;
};

const validateAndSearch = () => {
  if (validateForm()) {
    searchRecords();
  }
};

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepage');
  }

  const permissionList = JSON.parse(menuPermission);
  const foundPermission = permissionList.find(item => item.MenuId === '0101020300');
  permission.value = foundPermission;
  
  if (!foundPermission || !foundPermission.IsActive) {
    return router.push('/Homepage');
  }
};

const permissionExport = (menuId) => {
  if (!permission.value || permission.value.MenuId !== menuId) {
    return false;
  }
  return permission.value?.IsExport;
};

const fetchTugboatData = async () => {
  try {
    error.value = null;

    const [riverResponse, seaResponse] = await Promise.all([
      $api.get('/MachineStatus/GetTugboatRiver'),
      $api.get('/MachineStatus/GetTugboatSea')
    ]);

    tugboatDevices.value = [...riverResponse.data, ...seaResponse.data];
  } catch (err) {
    console.error('Failed to fetch tugboat data:', err);
    error.value = 'Failed to load device list. Please try again.';
  }
};

const searchRecords = async () => {
  try {
    searchLoading.value = true;
    showResult.value = false;
    error.value = null;

    const deviceIds = [...selectedTugboats.value];

    const request = {
      DeviceId: deviceIds,
      StartDateTime: formatTimeShow(startDate.value),
      EndDatetime: formatTimeShow(endDate.value),
    };
    
    const response = await $api.put('MachineStatus/RealtimeChartDataReport03/multiple', request);
    
    if (!response.data || response.data.length === 0) {
      error.value = 'No data found for the selected criteria';
      return;
    }

    const processedData = processChartData(response.data);
    
    series.value = processedData.series;
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: processedData.categories,
      },
    };

    showResult.value = true;
  } catch (error) {
    console.error('Error searching records:', error);
    error.value = 'Failed to load chart data. Please try again.';
  } finally {
    searchLoading.value = false;
  }
};

const downloadReport = (format) => {
  if (!showResult.value || !series.value.length) {
    error.value = 'No data available to download';
    return;
  }

  const start = startDate.value ? formatDateForFilename(startDate.value) : 'nodate';
    const end = endDate.value ? formatDateForFilename(endDate.value) : 'nodate';
  const filename = `รายงาน_RPM_และ_ความเร็ว_และ_%คันเร่ง_ที่ถูกกระทบด้วยความเร็วลมของเรือยนต์_${start}_${end}`;

  if (format === 'CSV') {
    const headers = ['Device Name,RPM,Speed,%Throttle,Wind Speed'];
    const rows = [];
    
    const categories = chartOptions.value.xaxis.categories || [];
    const rpmData = series.value.find(s => s.name === 'RPM')?.data || [];
    const speedData = series.value.find(s => s.name === 'Speed')?.data || [];
    const throttleData = series.value.find(s => s.name === '%Throttle')?.data || [];
    const windSpeedData = series.value.find(s => s.name === 'Wind Speed')?.data || [];
    
    categories.forEach((deviceName, index) => {
      const row = [
        `"${deviceName}"`,
        rpmData[index] !== null ? rpmData[index] : '',
        speedData[index] !== null ? speedData[index] : '',
        throttleData[index] !== null ? throttleData[index] : '',
        windSpeedData[index] !== null ? windSpeedData[index] : ''
      ].join(',');
      rows.push(row);
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
      }).catch(err => {
        console.error('Error generating chart image:', err);
        error.value = 'Failed to generate image for download';
      });
    }
  }
};

const resetFilters = () => {
  selectedTugboats.value = [];
  startDate.value = null;
  endDate.value = null;
  showResult.value = false;
  error.value = null;
  deviceError.value = '';
  startDateError.value = '';
  endDateError.value = '';
};

onMounted(async() => {
  await initialize();
  await fetchTugboatData();
});
</script>

<style scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.title-thai {
  font-family: 'Sarabun', sans-serif;
  font-size: 1.5vh;
  font-weight: 400;
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