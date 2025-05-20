<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Report on Fuel Rate per RPM for Evaluating Engine Efficiency of Motor Barge</div>
      <div class="title-thai">รายงานอัตราการใช้ชื้อเพลิง ต่อ RPM เพื่อดูประสิทธิภาพเครื่องยนต์ของทุ่น</div>
      <v-card class="mt-4">
        <v-card-text class="mx-16 my-6">
          <v-row>
            <!-- TypeDevicename Dropdown -->
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedType"
                :items="typeOptions"
                item-title="typeDevicename"
                item-value="typeDevicename"
                label="Barge"
                variant="outlined"
                density="compact"
                clearable
                :error-messages="typeError"
                :error="!!typeError"
                @update:modelValue="handleTypeChange"
              ></v-select>
            </v-col>
            <!-- Device Dropdown -->
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedDevices"
                :items="deviceOptions"
                item-title="deviceName"
                item-value="deviceId"
                label="Generator Devices"
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
                  <span v-if="index === 0">{{ selectedDevices.length }} selected</span>
                </template>
              </v-select>
            </v-col>

            <!-- Date Pickers -->
            <v-col cols="12" md="2">
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
            <v-col cols="12" md="2">
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
          <!-- </v-row> -->
          <!-- <v-row> -->
            <v-col cols="12" md="3">
              <v-btn
                class="cancel-btn elevation-0 text-none mr-4"
                @click="resetFilters"
              >
                Cancel
              </v-btn>
              <v-btn
                class="search-btn elevation-0 text-none mr-4"
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
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import VueApexCharts from 'vue3-apexcharts';
import VueDatePicker from '@vuepic/vue-datepicker';
import { computed, inject, onMounted, ref } from 'vue';
import '@vuepic/vue-datepicker/dist/main.css'

const $api = inject('$api');
const apexchart = ref(VueApexCharts);
const datePicker = VueDatePicker;

// Data
const bargeData = ref([]);
const selectedType = ref(null);
const selectedDevices = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const showResult = ref(false);
const searchLoading = ref(false);
const error = ref(null);
const series = ref([]);
const chart = ref(null);

// Error handling
const typeError = ref('');
const deviceError = ref('');
const startDateError = ref('');
const endDateError = ref('');

// Fetch barge data
const fetchDeviceBargesGrouped = async () => {
  try {
    const response = await $api.get('/MachineStatus/GetDeviceBargesGrouped');
    bargeData.value = response.data;

  } catch (error) {
    console.error('Failed to fetch barge data:', error);
    error.value = 'Failed to load barge list. Please try again.';
  }
};

const typeOptions = computed(() => {
  return bargeData.value.map(group => ({
    typeDevicename: group.TypeDevicename
  }));
});

const deviceOptions = computed(() => {
  if (!selectedType.value) return [];
  
  const selectedGroup = bargeData.value.find(group => 
    group.TypeDevicename === selectedType.value
  );
  
  if (!selectedGroup) return [];
  
  return selectedGroup.Devices
    .filter(device => device.DeviceName.includes('GEN'))
    .map(device => ({
      deviceId: device.DeviceId,
      deviceName: device.DeviceLabel
    }));
});

// Handle type selection change
const handleTypeChange = () => {
  selectedDevices.value = [];
};

// Select all toggle
const isAllSelected = computed(() => {
  return selectedDevices.value.length === deviceOptions.value.length;
});

const isPartialSelection = computed(() => {
  return selectedDevices.value.length > 0 && !isAllSelected.value;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedDevices.value = [];
  } else {
    selectedDevices.value = deviceOptions.value.map(option => option.deviceId);
  }
};

// Form validation
const validateForm = () => {
  let isValid = true;
  typeError.value = '';
  deviceError.value = '';
  startDateError.value = '';
  endDateError.value = '';
  
  if (!selectedType.value) {
    typeError.value = 'Barge is required';
    isValid = false;
  }
  
  if (selectedDevices.value.length === 0) {
    deviceError.value = 'Generator is required';
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

// Reset filters
const resetFilters = () => {
  selectedType.value = null;
  selectedDevices.value = [];
  startDate.value = null;
  endDate.value = null;
  showResult.value = false;
  error.value = null;
  typeError.value = '';
  deviceError.value = '';
  startDateError.value = '';
  endDateError.value = '';
};

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

// Process chart data from API response
const processChartData = (data) => {
  const categories = [];
  const rpmData = [];
  const fuelData = [];

  data.forEach(device => {
    const measurements = device.Measurement || [];
    
    const rpmMeasurement = measurements.find(m => m.measurementname === 'RPM');
    const fuelMeasurement = measurements.find(m => m.measurementname === 'Fuel Rate');

    if (rpmMeasurement?.AvgValue !== null && rpmMeasurement?.AvgValue !== undefined) {
      categories.push(device.DeviceName);
      rpmData.push(rpmMeasurement.AvgValue);
    }

    if (fuelMeasurement?.AvgValue !== null && fuelMeasurement?.AvgValue !== undefined) {
      fuelData.push(fuelMeasurement.AvgValue);
    }
  });

  return {
    series: [
      {
        name: "RPM",
        data: rpmData
      },
      {
        name: "Fuel Rate",
        data: fuelData
      }
    ],
    categories
  };
};

// Search records
const searchRecords = async () => {
  try {
    searchLoading.value = true;
    showResult.value = false;
    error.value = null;

    const deviceIds = [...selectedDevices.value];

    const request = {
      DeviceId: deviceIds,
      StartDateTime: formatTimeShow(startDate.value),
      EndDatetime: formatTimeShow(endDate.value),
    };
    console.log(request);
    
    const response = await $api.put('MachineStatus/RealtimeChartDataReport05/multiple', request);
    
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

  const filename = `${formatDateForFilename(startDate.value)}_${formatDateForFilename(endDate.value)}`;

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
    stacked: false,
    toolbar: { 
      show: true,
      tools: {
        download: false // We have our own download button
      }
    },
  },
  colors: ["#352B54", "#FAC12A"],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: [],
    labels: {
      trim: true,
      hideOverlappingLabels: true,
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: [
    {
      title: {
        text: "RPM",
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
    {
      opposite: true,
      title: {
        text: "Fuel Rate (L/hr)",
        style: {
          color: "#FAC12A",
          fontSize: '14px'
        }
      },
      labels: {
        style: {
          colors: "#FAC12A"
        }
      }
    }
  ],
  tooltip: {
    enabled: true,
    y: {
      formatter: function (val, { seriesIndex }) {
        return seriesIndex === 0 ? val + " RPM" : val + " L/hr";
      }
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
    offsetY: 10
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

onMounted(() => {
  fetchDeviceBargesGrouped();
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

.download-btn {
  background-color: #FAC12A;
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
  font-family: 'Sarabun', sans-serif;
  color: #DC2B2B;
  font-size: 12px;
  margin-top: 4px;
}
</style>