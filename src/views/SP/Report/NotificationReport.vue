<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div v-if="!loading">
        <div class="title">Notification Report</div>
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
                  :error-messages="vehicleError"
                  :error="!!vehicleError"
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
                  :error-messages="deviceError"
                  :error="!!deviceError"
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
                  multiple
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
                    <span v-if="index === 0">{{ selectedMeasurement.length }} selected</span>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedStatuses"
                  :items="statusOptions"
                  item-title="text"
                  item-value="value"
                  label="Status"
                  variant="outlined"
                  density="compact"
                  multiple
                  clearable
                >
                  <template v-slot:prepend-item>
                    <v-list-item title="Select All" @click="toggleSelectAllStatus">
                      <template v-slot:prepend>
                        <v-checkbox-btn
                          :color="isPartialStatusSelection ? 'indigo-darken-4' : undefined"
                          :indeterminate="isPartialStatusSelection"
                          :model-value="isAllStatusSelected"
                        ></v-checkbox-btn>
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ index }">
                    <span v-if="index === 0">{{ selectedStatuses.length }} selected</span>
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
                ></datePicker>
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
                ></datePicker>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn
                  class="cancel-button elevation-0 text-none mr-4"
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
                  :disabled="!showResult"
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
            <v-data-table
              :headers="headers"
              :items="tableData"
              :items-per-page="-1"
              class="elevation-1"
            >
              <template v-slot:item.date="{ item }">
                {{ formatTimeShow(item.date) }}
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip :class="getStatusColor(item.status)">
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.action="{ item }">
                <v-icon
                  class="edit mr-2"
                  small
                  @click="editItem(item.originalData)"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <!-- Edit Dialog -->
        <v-dialog v-model="dialog" max-width="906">
          <v-card class="rounded-lg pa-6">
            <v-card-title class="card-dialog">แก้ไขรายการ</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div>
                    <p class="title-field">Date</p>
                    <v-text-field
                      density="compact"
                      style="font-size: 16px; font-family: 'Inter', sans-serif;"
                      variant="outlined"
                      disabled
                      rounded="lg"
                    >
                      {{ formatTimeShow(editedItem.date) }}
                    </v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div>
                    <p class="title-field">Device Name</p>
                    <v-text-field
                      density="compact"
                      style="font-size: 16px; font-family: 'Inter', sans-serif;"
                      variant="outlined"
                      disabled
                      rounded="lg"
                    >
                      {{ editedItem.deviceName }}
                    </v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div>
                    <p class="title-field">Measuremnet</p>
                    <v-text-field
                      density="compact"
                      style="font-size: 16px; font-family: 'Inter', sans-serif;"
                      variant="outlined"
                      disabled
                      rounded="lg"
                    >
                      {{ editedItem.measurement }}
                    </v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div>
                    <p class="title-field-thai">เลขใบแจ้งซ่อม</p>
                      <v-text-field
                        v-model="editedItem.solution"
                        variant="outlined"
                        require
                        rounded="lg"
                        density="compact"
                      ></v-text-field>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex align-center justify-center mb-8 ga-8">
              <v-btn class="cancel-btn text-none" @click="closeEditDialog">Cancel</v-btn>
              <v-btn class="save-btn text-none" @click="saveEditDialog">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import { ref, computed, inject, onMounted, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@/assets/colors.scss'
import '@vuepic/vue-datepicker/dist/main.css'

const $api = inject('$api');
const loading = ref(true);
const memberData = ref(JSON.parse(localStorage.getItem('member'))) || {};
const datePicker = VueDatePicker;
const bargeGruop = ref([]);
const tugboatRiverGroup = ref([]);
const tugboatSeaGroup = ref([]);
const selectedType = ref(null);
const selectedDevices = ref(null);
const measurementList = ref([]);
const selectedMeasurement = ref([]);
const selectedStatuses = ref([]);
const searchLoading = ref(false);
const tableData = ref([]);
const showResult = ref(false);
const startDate = ref(null);
const endDate = ref(null);
const dialog = ref(false);
const vehicleError = ref('');
const deviceError = ref('');
const error = ref(null);
const statusOptions = ref([
  { text: 'รอแจ้งซ่อม', value: false },
  { text: 'ดำเนินการเสร็จสิ้น', value: true }
]);
const editedItem = ref({
  date: '',
  deviceName: '',
  measurement: '',
  solution: '',
  originalData: null
});

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

// const formatTimeASP = (dt) => {
//   var dateTime = new Date(dt);
//   var month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
//   var day = ("0" + dateTime.getDate()).slice(-2);
//   var year = dateTime.getFullYear();
//   var hour = ("0" + dateTime.getHours()).slice(-2);
//   var minute = ("0" + dateTime.getMinutes()).slice(-2);
//   var sec = ("0" + dateTime.getSeconds()).slice(-2);
//   return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + sec;
// }
 
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
    return year + "-" + month + "-" + day + " " + hour + ":" + minute;
  }
};

const fetchMeasurementList = async () => {
  try {
    if (!selectedDevices.value) {
      measurementList.value = [];
      selectedMeasurement.value = [];
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

    selectedMeasurement.value = [];
  } catch (error) {
    console.error('Failed to fetch measurement list:', error);
    error.value = 'Failed to load measurement list. Please try again.';
    measurementList.value = [];
    selectedMeasurement.value = [];
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

const isAllSelected = computed(() => {
  return selectedMeasurement.value.length === measurementList.value.length;
});

const isPartialSelection = computed(() => {
  return selectedMeasurement.value.length > 0 && !isAllSelected.value;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedMeasurement.value = [];
  } else {
    selectedMeasurement.value = measurementList.value.map(option => option.measurementId);
  }
};

const isAllStatusSelected = computed(() => {
  return selectedStatuses.value.length === statusOptions.value.length;
});

const isPartialStatusSelection = computed(() => {
  return selectedStatuses.value.length > 0 && !isAllStatusSelected.value;
});

const toggleSelectAllStatus = () => {
  if (isAllStatusSelected.value) {
    selectedStatuses.value = [];
  } else {
    selectedStatuses.value = statusOptions.value.map(option => option.value);
  }
};

const handleTypeChange = () => {
  selectedDevices.value = [];
};

const resetFilters = () => {
  selectedType.value = null;
  selectedDevices.value = [];
  selectedMeasurement.value = [];
  selectedStatuses.value = [];
  startDate.value = null;
  endDate.value = null;
  showResult.value = false;
  vehicleError.value = false;
  deviceError.value = false;
};

const searchRecords = async () => {
  try {
    searchLoading.value = true;
    showResult.value = false;

    const requestBody = {
      DeviceId: selectedDevices.value
    };

    if (selectedMeasurement.value?.length > 0) {
      if (isAllSelected.value || selectedMeasurement.value.length === measurementList.value.length) {
        requestBody.MeasurementId = "";
      } else {
        requestBody.MeasurementId = selectedMeasurement.value.join(",");
      }
    } else {
      requestBody.MeasurementId = "";
    }

    if (selectedStatuses.value?.length > 0) {
      if (isAllStatusSelected.value || selectedStatuses.value.length === statusOptions.value.length) {
        requestBody.IsAccept = "";
      } else if (selectedStatuses.value.length === 1) {
        requestBody.IsAccept = selectedStatuses.value[0];
      } else {
        requestBody.IsAccept = selectedStatuses.value.join(",");
      }
    } else {
      requestBody.IsAccept = "";
    }

    const params = {};
    if (startDate.value) {params.start = adjustTime(startDate.value);}
    if (endDate.value) { params.end = adjustTime(endDate.value);}

    const config = params.start || params.end 
      ? { params } 
      : {};

    const response = await $api.put('/device/notificationlistStatus', requestBody, config);
    
    const filteredData = response.data.filter(item => item.Title.includes("Danger"));

    tableData.value = filteredData.map(item => ({
      date: item.ModifiedDatetime || item.AlertTime,
      deviceName: item.DeviceLabel,
      measurement: `${item.MeasurementLabel} (${item.MeasurementUnit})`,
      solution: item.Solution,
      details: item.Description,
      status: item.IsAccept ? 'ดำเนินการเสร็จสิ้น' : 'รอแจ้งซ่อม',
      originalData: item
    }));

    showResult.value = true;

  } catch (error) {
    console.error('Failed to fetch notification list:', error);
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    tableData.value = [];
  } finally {
    searchLoading.value = false;
  }
};

const adjustTime = (date) => {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 7);
  return adjustedDate.toISOString();
};

const headers = [
  { title: "Date", key: "date"},
  { title: "Device Name", key: "deviceName"},
  { title: "Measurement", key: "measurement" },
  { title: "เลขใบแจ้งซ่อม", key: "solution" },
  { title: "Details", key: "details", sortable: false },
  { title: "Status", key: "status" },
  { title: "Action", key: "action", sortable: false },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'รอแจ้งซ่อม':
      return 'status-pending';
    case 'ดำเนินการเสร็จสิ้น':
      return 'status-finish';
    default:
      return '';
  }
};

const saveEditDialog = async () => {
  try {
    if (!editedItem.value.solution) {
      alert('กรุณากรอกเลขใบแจ้งซ่อม');
      return;
    }

    const requestBody = {
      Id: editedItem.value.originalData.Id,
      CustomerId: memberData.value.CustomerId,
      DeviceId: editedItem.value.originalData.DeviceId,
      MeasurementId: editedItem.value.originalData.MeasurementId,
      Solution: editedItem.value.solution,
      ModifiedBy: memberData.value.MemberId
    };
    console.log('Saving with data:', requestBody);
    await $api.put('/device/notification/accept/single', requestBody);

    const index = tableData.value.findIndex(
      item => item.originalData.Id === editedItem.value.originalData.Id
    );
    
    if (index !== -1) {
      tableData.value[index].originalData.Solution = editedItem.value.solution;
      tableData.value[index].originalData.IsAccept = true;
      tableData.value[index].status = 'ดำเนินการเสร็จสิ้น';
      tableData.value[index].solution = editedItem.value.solution;
    }

    dialog.value = false;
  } catch (error) {
    console.error('Failed to save ticket:', error);
  }
};

const editItem = (item) => {
  editedItem.value = {
    date: item.ModifiedDatetime || item.AlertTime,
    deviceName: item.DeviceLabel,
    measurement: `${item.MeasurementLabel} (${item.MeasurementUnit})`,
    solution: item.Solution || '',
    originalData: item
  };
  dialog.value = true;
};

const closeEditDialog = () => {
  dialog.value = false;
};

// const validateAndSearch = () => {
//   let isValid = true;
  
//   vehicleError.value = '';
//   deviceError.value = '';
  
//   if (!selectedType.value) {
//     vehicleError.value = 'Vehicle is required';
//     isValid = false;
//   }

//   if (!selectedDevices.value) {
//     deviceError.value = 'Device is required';
//     isValid = false;
//   }

//   if (!vehicleError.value && !deviceError.value) {
//     searchRecords();
//   }

//   if (isValid) {
//     searchRecords();
//   }
  
//   return isValid;
// };

const validateAndSearch = () => {
  let isValid = true;
  
  vehicleError.value = '';
  deviceError.value = '';
  
  if (!selectedType.value) {
    vehicleError.value = 'Vehicle is required';
    isValid = false;
  }

  if (!selectedDevices.value) {
    deviceError.value = 'Device is required';
    isValid = false;
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
.status-pending {
  font-family: 'Sarabun', serif;
  color: var(--red);
  background-color: var(--light-red);
}

.status-finish {
  font-family: 'Sarabun', serif;
  color: var(--text-running);
  background-color: var(--bg-running);
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: var(--bg-row);
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

.custom-table :deep(thead th) {
  color: var(--black);
  font-weight: bold;
  font-size: 16px;
}

.custom-table :deep(tbody td) {
  color: var(--dark-gray);
  font-size: 16px;
}

.custom-table :deep(tbody tr:hover td) {
  color: var(--black);
}

.custom-table :deep(tbody tr:hover) {
  background-color: #f0f0f0;
}

.edit {
  cursor: pointer;
  width: 34px;
  height: 24px;
  border-radius: 24px;
  font-size: 20px;
  color: #1570EF;
  background-color: #E3F2FD;
}

.title {
  font-size: 2vh;
  font-weight: 600;
}

.download-btn {
  background-color: var(--yellow);
  color: var(--white);
  border-radius: 24px;  
}

.card-dialog {
  font-family: 'Sarabun', sans-serif;
  font-size: 20px;
}

.title-field {
  font-size: 16px;
  color: var(--gray);
  margin-bottom: 6px;
}

.title-field-thai {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  color: var(--gray);
  margin-bottom: 6px;
}

.default-field{
  width: 362px;
  height: 50px;
  background-color: var(--bg-row);
  padding: 12px;
  border-radius: 10px;

  p {
    color: var(--grey-02);
    font-family: 'Poppins', sans-serif;
  }
}

.cancel-button {
  color: #000000;
  border: 1px solid #E3E3E3;
  border-radius: 24px;
}

.search-btn {
  background-color: #223368;
  color: #ffffff;
  border-radius: 24px;
}

.cancel-btn {
  color: #000000;
  border-radius: 24px;
  border: 1px solid #E3E3E3;
  font-family: 'Inter', sans-serif;
  width: 5vw;
}

.save-btn {
  background-color: #1476FF;
  color: #ffffff;
  border-radius: 24px;
  font-family: 'Inter', sans-serif;
  width: 5vw;
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
  color: #DC2B2B;
  font-size: 12px;
  margin-top: 4px;
}
</style>