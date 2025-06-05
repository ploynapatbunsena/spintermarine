<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div v-if="!loading">
        <div class="title">Report on Barge Tilt</div>
        <div class="title-thai">รายงานความเอียงทุ่น</div>
        <v-card class="mt-4">
          <v-card-text class="mx-4 my-6">
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedBarges"
                  :items="bargeOptions"
                  item-title="typeDevicename"
                  item-value="deviceId"
                  label="Barge"
                  variant="outlined"
                  density="compact"
                  multiple
                  clearable
                  :error-messages="deviceError ? 'Device is required' : ''"
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
                    <span v-if="index === 0">{{ selectedBarges.length }} selected</span>
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
              <v-col cols="12" md="6" lg="3">
                <v-row>
                  <v-col cols="4" md="3" sm="4">
                    <v-btn
                      class="cancel-btn elevation-0 text-none"
                      @click="resetFilters"
                    >
                      Cancel
                    </v-btn>
                  </v-col>
                  <v-col cols="4" md="3" sm="4">
                    <v-btn
                      class="search-btn elevation-0 text-none"
                      @click="validateAndSearch"
                      :loading="searchLoading"
                    >
                      Search
                    </v-btn>
                  </v-col>
                  <v-col cols="4" md="4" sm="4">
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          :disabled="!permissionExport('0101020800') || !showResult"
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
              type="bar"
              height="680"
              :options="chartOptions"
              :series="series"
            ></apexchart>
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
import VueApexCharts from 'vue3-apexcharts';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed, inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const $api = inject('$api');
const router = useRouter()
const apexchart = VueApexCharts;
const datePicker = VueDatePicker;
const chart = ref(null);
const selectedBarges = ref([]);
const bargeOptions = ref([]);
const endDate = ref(new Date());
const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 7)));
const showResult = ref(false);
const searchLoading = ref(false);
const error = ref(null);
const series = ref([]);
const loading = ref(true);
const permission = ref(null);

const deviceError = ref('');
const startDateError = ref('');
const endDateError = ref('');

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepage');
  }

  const permissionList = JSON.parse(menuPermission);
  const foundPermission = permissionList.find(item => item.MenuId === '0101020800');
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

const fetchDeviceBargesGrouped = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await $api.get('/MachineStatus/GetDeviceBargesGrouped');
    
    bargeOptions.value = response.data.flatMap(group => {
      const bargeMaster = group.Devices.find(device => 
        device.DeviceName === 'Barge Master'
      );
      
      return bargeMaster ? [{
        typeDevicename: group.TypeDevicename,
        deviceId: bargeMaster.DeviceId
      }] : [];
    });
    
  } catch (err) {
    console.error('Failed to fetch barge data:', err);
    error.value = 'Failed to load barge list. Please try again.';
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  deviceError.value = '';
  startDateError.value = '';
  endDateError.value = '';
  
  if (selectedBarges.value.length === 0) {
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

const isAllSelected = computed(() => {
  return selectedBarges.value.length === bargeOptions.value.length;
});

const isPartialSelection = computed(() => {
  return selectedBarges.value.length > 0 && !isAllSelected.value;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedBarges.value = [];
  } else {
    selectedBarges.value = bargeOptions.value.map(option => option.deviceId);
  }
};

const resetFilters = () => {
  selectedBarges.value = [];
  startDate.value = '';
  endDate.value = '';
  showResult.value = false;
  error.value = null;
  deviceError.value = '';
  startDateError.value = '';
  endDateError.value = '';
};

const formatTimeShow = (datetime) => {
  if (datetime == null) {
    return null;
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
  const deviceData = devices.map(device => ({
    type: device.TypeDevicename,
    total: device.MeasurementAlertCount.find(m => m.Total !== undefined)?.Total || 0
  }));

  deviceData.sort((a, b) => b.total - a.total);

  const categories = deviceData.map(device => device.type);
  const seriesData = deviceData.map(device => device.total);

  return {
    series: [{
      name: "Count Of Alert (Barge Tilt)",
      data: seriesData
    }],
    categories
  };
};

const searchRecords = async () => {
  try {
    searchLoading.value = true;
    showResult.value = false;
    error.value = null;

    const deviceIds = [...selectedBarges.value];

    const request = {
      DeviceId: deviceIds,
      StartDateTime: formatTimeShow(startDate.value),
      EndDatetime: formatTimeShow(endDate.value),
    };
    
    const response = await $api.put('MachineStatus/RealtimeChartDataReport08/multiple', request);
    
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
  } catch (err) {
    console.error('Error searching records:', err);
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

  const filename = `รายงานความเอียงทุ่น_${formatDateForFilename(startDate.value)}_${formatDateForFilename(endDate.value)}`;

  if (format === 'CSV') {
    // CSV Download
    const categories = chartOptions.value.xaxis.categories;
    const data = series.value[0].data;
    const csvRows = ['Barge,Alert Count'];

    categories.forEach((category, index) => {
      csvRows.push(`"${category}",${data[index]}`);
    });

    const csvContent = csvRows.join('\n');
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
    // JPG Download
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

const chartOptions = ref({
  chart: {
    height: 680,
    type: "bar",
    toolbar: { 
      show: true,
      tools: {
        download: false
      }
    },
  },
  colors: ["#352B54"],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'category',
    categories: [],
    labels: {
      trim: true,
      hideOverlappingLabels: true,
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    title: {
      text: "Count Of Alert (Barge Tilt)",
      style: {
        color: "#352B54",
        fontSize: '14px'
      }
    },
    labels: {
      style: {
        colors: "#352B54"
      }
    }
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: function (val) {
        return val + " alerts";
      }
    }
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

onMounted(async () => {
  await initialize();
  await fetchDeviceBargesGrouped();
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
  background-color: #FAC12A;
  color: #ffffff;
  border-radius: 24px;
  font-size: 1.3vh;
}

.cancel-btn {
  color: #000000;
  border: 1px solid #E3E3E3;
  border-radius: 24px;
  font-size: 1.5vh;
}

.search-btn {
  background-color: #223368;
  color: #ffffff;
  border-radius: 24px;
  font-size: 1.5vh;
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
  font-family: 'Sarabun', sans-serif;
  color: #DC2B2B;
  font-size: 12px;
  margin-top: 4px;
}

.apexcharts-toolbar {
  display: none !important;
}
</style>