<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Report on Barge Tilt</div>
      <div class="title-thai">รายงานความเอียงทุ่น (แนวแกน X)</div>
      <v-card class="mt-4">
        <v-card-text class="mx-16 my-6">
          <v-row>
            <!-- Device Dropdown -->
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
            <!-- Date Pickers -->
            <v-col cols="12" md="3">
              <datePicker
                v-model="startDate"
                label="Start Date"
                :max="endDate || null"
                enable-seconds
                teleport
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
                format="yyyy-MM-dd HH:mm:ss"
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
                <!-- <v-col cols="6" md="4">
                  <v-btn
                    class="download-btn elevation-0 text-none"
                    @click="downloadReport"
                    :disabled="!showResult"
                  >
                    Download
                  </v-btn>
                </v-col> -->
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
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, inject, onMounted, ref } from 'vue';

const $api = inject('$api');
const apexchart = ref(VueApexCharts);
const datePicker = VueDatePicker;
// Data
const selectedBarges = ref([]);
const bargeOptions = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const showResult = ref(false);
const searchLoading = ref(false);
const error = ref(null);
const series = ref([]);

// Error handling
const deviceError = ref('');
const startDateError = ref('');
const endDateError = ref('');

// Fetch barge data
const fetchDeviceBargesGrouped = async () => {
  try {
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
  }
};

// Form validation
const validateForm = () => {
  let isValid = true;
  deviceError.value = false;
  startDateError.value = false;
  endDateError.value = false;
  
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

// Select all toggle
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

// Reset filters
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

// Format date for API
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} 00:00:00`;
};

// Process chart data from API response
const processChartData = (data) => {
  const categories = data.map(item => item.TypeDevicename);
  const seriesData = data.map(item => {
    const totalAlert = item.MeasurementAlertCount.find(m => m.Total !== undefined)?.Total || 0;
    return totalAlert;
  });

  return {
    series: [{
      name: "Count Of Alert (Barge Tilt)",
      data: seriesData
    }],
    categories
  };
};

// Search records
const searchRecords = async () => {
  try {
    searchLoading.value = true;
    showResult.value = false;
    error.value = null;

    const request = {
      DeviceId: selectedBarges.value,
      StartDateTime: formatDate(startDate.value),
      EndDatetime: formatDate(endDate.value),
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

// Download report (placeholder)
// const downloadReport = () => {
//   console.log('Download report');
// };

// Chart options
const chartOptions = ref({
  chart: {
    height: 680,
    type: "bar",
    toolbar: { 
      show: true,
      tools: {
        download: false // We have our own download button
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

.download-btn {
  background-color: #FAC12A;
  color: #ffffff;
  border-radius: 10px;  
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
  font-family: 'Sarabun', sans-serif;
  color: #DC2B2B;
  font-size: 12px;
  margin-top: 4px;
}
</style>