<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Report on %Throttle vs. RPM vs. Fuel Rate</div>
      <div class="title-thai">รายงาน %คันเร่ง ต่อ RPM ต่อ อัตราการใช้ชื้อเพลิง สำหรับเรือยนต์</div>
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
                <!-- <v-col cols="6" md="4" class="px-0">
                  <v-btn
                    class="download-btn"
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

const datePicker = VueDatePicker;
const apexchart = VueApexCharts;
const $api = inject('$api');
const showResult = ref(false);
const searchLoading = ref(false);
const error = ref(null);
const series = ref([]);
const tugboatDevices = ref([]);
const selectedTugboats = ref([]);
const startDate = ref(null);
const endDate = ref(null);

const deviceError = ref('');
const startDateError = ref('');
const endDateError = ref('');

const validateForm = () => {
  let isValid = true;
  deviceError.value = false;
  startDateError.value = false;
  endDateError.value = false;
  
  if (selectedTugboats.value.length === 0) {
    deviceError.value = 'กรุณาเลือกอุปกรณ์อย่างน้อย 1 รายการ';
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

// Create dropdown options
const tugboatOptions = computed(() => {
  return tugboatDevices.value.flatMap(group => 
    group.Devices.map(device => ({
      deviceId: device.DeviceId,
      deviceName: device.DeviceName,
      type: group.TypeDevicename
    }))
  );
});

// Check if all devices are selected
const isAllSelected = computed(() => {
  return selectedTugboats.value.length === tugboatOptions.value.length;
});

// Check if partial selection exists
const isPartialSelection = computed(() => {
  return selectedTugboats.value.length > 0 && !isAllSelected.value;
});

// Toggle select all devices
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTugboats.value = [];
  } else {
    selectedTugboats.value = tugboatOptions.value.map(option => option.deviceId);
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

const formatDate = (date) => {
  if (!date) return '';
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const processChartData = (devices) => {
  const allSeriesData = {
    rpm: [],
    fuel: [],
    throttle: [],
    times: new Set() // ใช้ Set เพื่อเก็บเวลาทั้งหมดโดยไม่ซ้ำ
  };

  devices.forEach(device => {
    const measurements = device.Measurement || [];
    
    // ดึงข้อมูลแต่ละ measurement
    const rpmMeas = measurements.find(m => m.measurementname === 'RPM');
    const fuelMeas = measurements.find(m => m.measurementname === 'Fuel Rate');
    const throttleMeas = measurements.find(m => m.measurementname === '%Throttle');

    // เก็บ Xdata จากทุก measurement
    if (rpmMeas?.Xdata) rpmMeas.Xdata.forEach(time => allSeriesData.times.add(time));
    if (fuelMeas?.Xdata) fuelMeas.Xdata.forEach(time => allSeriesData.times.add(time));
    if (throttleMeas?.Xdata) throttleMeas.Xdata.forEach(time => allSeriesData.times.add(time));
  });

  // แปลง Set เป็น Array และเรียงลำดับเวลา
  const allTimes = Array.from(allSeriesData.times).sort((a, b) => new Date(a) - new Date(b));

  // เตรียมข้อมูลสำหรับแต่ละจุดเวลา
  allTimes.forEach(time => {
    // หาค่า RPM ที่ตรงกับเวลานี้
    const rpmValue = devices.flatMap(device => {
      const meas = device.Measurement?.find(m => m.measurementname === 'RPM');
      if (!meas) return null;
      const index = meas.Xdata?.indexOf(time);
      return index !== -1 ? meas.Ydata[0]?.data[index] : null;
    }).find(val => val !== null) || null;

    // หาค่า Fuel Rate ที่ตรงกับเวลานี้
    const fuelValue = devices.flatMap(device => {
      const meas = device.Measurement?.find(m => m.measurementname === 'Fuel Rate');
      if (!meas) return null;
      const index = meas.Xdata?.indexOf(time);
      return index !== -1 ? meas.Ydata[0]?.data[index] : null;
    }).find(val => val !== null) || null;

    // หาค่า %Throttle ที่ตรงกับเวลานี้
    const throttleValue = devices.flatMap(device => {
      const meas = device.Measurement?.find(m => m.measurementname === '%Throttle');
      if (!meas) return null;
      const index = meas.Xdata?.indexOf(time);
      return index !== -1 ? meas.Ydata[0]?.data[index] : null;
    }).find(val => val !== null) || null;

    // เพิ่มข้อมูลถ้ามีค่าอย่างน้อย 1 ค่าไม่ใช่ null
    if (rpmValue !== null || fuelValue !== null || throttleValue !== null) {
      allSeriesData.rpm.push(rpmValue);
      allSeriesData.fuel.push(fuelValue);
      allSeriesData.throttle.push(throttleValue);
      allSeriesData.times.add(time);
    }
  });

  // สร้าง categories (เวลา) สำหรับแกน X
  const categories = Array.from(allSeriesData.times).sort((a, b) => new Date(a) - new Date(b));

  // สร้าง series สำหรับ ApexCharts
  const series = [
    {
      name: 'RPM',
      type: 'line',
      data: allSeriesData.rpm
    },
    {
      name: 'Fuel Rate',
      type: 'line',
      data: allSeriesData.fuel
    },
    {
      name: '%Throttle',
      type: 'line',
      data: allSeriesData.throttle
    }
  ];

  return { series, categories };
};

const searchRecords = async () => {
  try {
    searchLoading.value = true;
    showResult.value = false;
    error.value = null;

    const request = {
      DeviceId: selectedTugboats.value,
      StartDateTime: formatDate(startDate.value),
      EndDatetime: formatDate(endDate.value),
    };
    
    const response = await $api.put('MachineStatus/RealtimeChartDataReport06/multiple', request);
    
    if (!response.data || response.data.length === 0) {
      error.value = 'No data found for the selected criteria';
      return;
    }

    const processedData = processChartData(response.data);
    
    series.value = processedData.series;
    showResult.value = true;
  } catch (err) {
    console.error('Error searching records:', err);
    error.value = 'Failed to load chart data. Please try again.';
  } finally {
    searchLoading.value = false;
  }
};

// const downloadReport = () => {
//   // Implement download functionality
//   console.log('Download report');
// };

const chartOptions = ref({
  chart: {
    height: 680,
    type: "line",
    stacked: false,
    zoom: {
      enabled: true
    }
  },
  colors: ["#352B54", "#FAC12A", "#DC2B2B"],
  stroke: { 
    curve: 'smooth',
    width: 2
  },
  markers: {
    size: 4
  },
  fill: { 
    opacity: 1 
  },
  dataLabels: { 
    enabled: false 
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false, // เพื่อแสดงเวลาตาม timezone ท้องถิ่น
      format: 'dd MMM yyyy HH:mm' // รูปแบบการแสดงเวลา
    }
  },
  yaxis: [
    {
      seriesName: "RPM",
      axisTicks: { show: true },
      labels: { 
        style: { colors: "#352B54" },
        formatter: function(val) {
          return val.toFixed(0); // แสดงเป็นจำนวนเต็ม
        }
      },
      title: { text: "RPM (RPM)", style: { color: "#352B54" } },
    },
    {
      seriesName: "Fuel Rate",
      opposite: true,
      axisTicks: { show: true },
      labels: { 
        style: { colors: "#FAC12A" },
        formatter: function(val) {
          return val.toFixed(2); // แสดงทศนิยม 2 ตำแหน่ง
        }
      },
      title: { text: "Fuel Rate (L/hr)", style: { color: "#FAC12A" } },
    },
    {
      seriesName: "%Throttle",
      axisTicks: { show: true },
      labels: { 
        style: { colors: "#DC2B2B" },
        formatter: function(val) {
          return val.toFixed(0) + '%'; // แสดงเป็นเปอร์เซ็นต์
        }
      },
      title: { text: "%Throttle", style: { color: "#DC2B2B" } },
    },
  ],
  legend: {
    horizontalAlign: "center",
    offsetY: 16,
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    x: {
      format: 'dd MMM yyyy HH:mm:ss'
    }
  },
  noData: {
    text: "No data available",
    align: 'center',
    verticalAlign: 'middle',
    style: {
      color: "#666",
      fontSize: '16px'
    }
  }
});

onMounted(() => {
  fetchTugboatData();
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