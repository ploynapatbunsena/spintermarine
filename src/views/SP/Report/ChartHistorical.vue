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
                  :disabled="!selectedDevices"
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
                <v-select
                  v-model="selectedInterval"
                  :items="intervalList"
                  item-title="title"
                  item-value="id"
                  label="Interval"
                  variant="outlined"
                  density="compact"
                ></v-select>
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
                <v-btn
                  class="download-btn elevation-0 text-none"
                  @click="downloadReport"
                >
                  Download
                </v-btn>
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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const $api = inject('$api');
const loading = ref(true);
const datePicker = VueDatePicker;
const bargeGruop = ref([]);
const tugboatRiverGroup = ref([]);
const tugboatSeaGroup = ref([]);
const selectedType = ref(null);
const selectedDevices = ref(null);
const measurementList = ref([]);
const selectedMeasurement = ref(null);
const showResult = ref(false);
const startDate = ref(null);
const endDate = ref(null);
const vehicleError = ref(false);
const deviceError = ref(false);
const measurementError = ref(false);
const startDateError = ref('');
const endDateError = ref('');

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
  console.log('option', options);
  
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
  console.log('device',devices);
  return devices
  .filter(device => !device.DeviceLabel.toLowerCase().includes('crane'))
  .map(device => ({
    deviceId: device.DeviceId,
    deviceName: device.DeviceLabel
  }));
});

const handleTypeChange = () => {
  selectedDevices.value = [];
};

const resetFilters = () => {
  selectedType.value = null;
  selectedDevices.value = [];
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

const validateAndSearch = () => {
  let isValid = true;
  
  vehicleError.value = false;
  deviceError.value = false;
  measurementError.value = false
  startDateError.value = false;
  endDateError.value = false;
  
  if (!selectedType.value) {
    vehicleError.value = 'Vehicle is required';
    isValid = false;
  }

  if (!selectedDevices.value) {
    deviceError.value = 'Device is required';
    isValid = false;
  }

  if (!measurementError.value) {
    measurementError.value = 'Measurement is required';
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

  if (!vehicleError.value && !deviceError.value) {
    searchRecords();
  }

  if (isValid) {
    searchRecords();
  }
  
  return isValid;
};

onMounted(() => {
  fetchDeviceData();
  fetchMeasurementList();
});

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
</style>