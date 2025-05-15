<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">แบบฟอร์มการแก้ไขสถานะทุ่น</div>
      <div class="card-table">
        <p class="header-table">Generator Status</p>
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="generatorDevices"
              :loading="loading"
              loading-text="Loading... Please wait"
              class="elevation-0"
              :items-per-page="-1"
              hide-default-footer
            >
              <template #item.lastTimestamp="{ item }">
                {{ formatDate(item.statusData.lastTimestamp) }}
              </template>
              <template #item.status="{ item }">
                <v-chip :class="getGeneratorStatusClass(item.statusData.statusValue)">
                  {{ getGeneratorStatusText(item.statusData.statusValue) }}
                </v-chip>
              </template>
              <template #item.actions="{ item }">
                <v-icon class="mr-2 edit" @click="openEditDialog(item, 'generator')">
                  mdi-pencil
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
      <div class="card-table">
        <p class="header-table">Crane Status</p>
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="craneDevices"
              :loading="loading"
              loading-text="Loading... Please wait"
              class="elevation-0"
              :items-per-page="-1"
              hide-default-footer
            >
              <template #item.lastTimestamp="{ item }">
                {{ formatDate(item.statusData.lastTimestamp) }}
              </template>
              <template #item.status="{ item }">
                <v-chip :class="getCraneStatusClass(item.statusData.statusValue)">
                  {{ getCraneStatusText(item.statusData.statusValue) }}
                </v-chip>
              </template>
              <template #item.actions="{ item }">
                <v-icon small class="mr-2 edit" @click="openEditDialog(item, 'crane')">
                  mdi-pencil
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
      <!-- Edit Dialog -->
      <v-dialog v-model="editDialog" max-width="900">
        <v-card class="rounded-lg pa-6">
          <v-card-title class="card-dialog">แก้ไขรายการ</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" lg="6">
                <div>
                  <p class="title-field">Date</p>
                  <v-text-field
                    density="compact"
                    style="font-size: 16px; font-family: 'Inter', sans-serif;"
                    variant="outlined"
                    readonly
                    rounded="lg"
                  >
                    {{ formatDate(editedItem.lastTimestamp) || '-' }}
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
                    readonly
                    rounded="lg"
                  >
                    {{ editedItem.deviceLabel || '-' }}
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div>
                  <p class="title-field">Status</p>
                  <v-row class="mt-2">
                    <v-col 
                      v-for="status in filteredStatusOptions" 
                      cols="12" sm="6" md="4" lg="4"
                      :key="status.value"
                    >
                      <v-btn
                        :style="{ backgroundColor: editedItem.status === status.value ? status.color : '#FFFFFF' }"
                        :color="editedItem.status === status.value ? '#000000' : '#D9D9D9'"
                        :variant="editedItem.status === status.value ? 'flat' : 'outlined'"
                        block
                        @click="editedItem.status = status.value"
                        class="status-btn"
                      >
                        {{ status.text }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-col cols="12" md="12" class="button-section">
            <v-btn class="cancel-btn text-none" variant="text" @click="closeEditDialog">Cancel</v-btn>
            <v-btn class="save-btn text-none" color="primary" variant="flat" @click="saveEditDialog">Save</v-btn>
          </v-col>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import '@/assets/colors.scss';
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';

const $api = inject('$api');
const route = useRoute();
const typeDeviceName = ref(route.params.typeDeviceName);
const devices = ref([]);
const loading = ref(false);
const editDialog = ref(false);
const currentDeviceType = ref('');
const editedItem = ref({
  DeviceId: '',
  deviceLabel: '',
  status: 0,
  lastTimestamp: '',
  originalItem: null
});

// Status options for different device types
const craneStatusOptions = [
  { text: 'Offline', value: 0, color: '#C0C0C0' },
  { text: 'Standby', value: 1, color: '#00B8F2' },
  { text: 'Running', value: 2, color: '#28A745' },
  { text: 'Maintenance', value: 3, color: '#000000' }
];

const generatorStatusOptions = [
  { text: 'Offline', value: 0, color: '#C0C0C0' },
  { text: 'Standby', value: 1, color: '#00B8F2' },
  { text: 'Running', value: 2, color: '#28A745' },
  { text: 'Standby/Maintenance', value: 3, color: '#007BFF' },
  { text: 'Running/Maintenance', value: 4, color: '#8DEB51' },
  { text: 'Down', value: 5, color: '#000000' },
];

const headers = [
  { title: 'Last Updated', value: 'lastTimestamp', sortable: true, width: '12.15vw' },
  { title: 'Device Name', value: 'DeviceLabel', sortable: true, width: '43.6vw' },
  { title: 'Status', value: 'status', sortable: true, width: '16.3vw' },
  { title: 'Actions', value: 'actions', sortable: false, width: '9.3vw' }
];

const craneDevices = computed(() => {
  return processedDevices.value.filter(device => device.DeviceName.includes('CRANE'));
});

const generatorDevices = computed(() => {
  return processedDevices.value.filter(device => device.DeviceName.includes('GEN'));
});

const processedDevices = computed(() => {
  return devices.value.map(device => {
    const statusMeasurement = device.Mesurement?.find(m => m.measurementname === 'Status') 
    || { lastvalue: '0', lastTimestamp: '' };
    
    return {
      ...device,
      statusData: {
        statusValue: parseInt(statusMeasurement.lastvalue) || 0,
        lastTimestamp: statusMeasurement.lastTimestamp || ''
      }
    };
  });
});

const filteredStatusOptions = computed(() => {
  const options = currentDeviceType.value === 'crane' 
    ? craneStatusOptions 
    : generatorStatusOptions;
  
  //ไม่แสดงสถานะ 0 (Offline) ในปุ่ม
  return options.filter(option => option.value !== 0);
});

const getCraneStatusText = (status) => {
  switch (status) {
    case 0: return 'Offline';
    case 1: return 'Standby';
    case 2: return 'Running';
    case 3: return 'Maintenance';
    default: return 'Unknow';
  }
};

const getCraneStatusClass = (status) => {
  switch (status) {
    case 0: return 'status-unknown';
    case 1: return 'status-standby';
    case 2: return 'status-running';
    case 3: return 'status-down';
    default: return 'status-unknown';
  }
};

const getGeneratorStatusText = (status) => {
  switch (status) {
    case 0: default: return 'Offline';
    case 1: return 'Standby';
    case 2: return 'Running';
    case 3: return 'Standby/Maintenance';
    case 4: return 'Running/Maintenance';
    case 5: return 'Down';
  }
};

const getGeneratorStatusClass = (status) => {
  switch (status) {
    case 0: return 'status-unknown';
    case 1: return 'status-standby';
    case 2: return 'status-running';
    case 3: return 'status-standby-maintenance';
    case 4: return 'status-running-maintenance';
    case 5: return 'status-down';
    default: return 'status-unknown';
  }
};

const fetchDeviceBargesGrouped = async () => {
  try {
    loading.value = true;
    const response = await $api.get('/MachineStatus/GetDeviceByTypeDeviceName', {
      params: { typeDeviceName: typeDeviceName.value }
    });
    devices.value = response.data;
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const openEditDialog = (item, deviceType) => {
  currentDeviceType.value = deviceType;
  editedItem.value = {
    DeviceId: item.DeviceId,
    deviceLabel: item.DeviceLabel,
    status: item.statusData.statusValue,
    lastTimestamp: item.statusData.lastTimestamp,
    originalItem: item
  };
  editDialog.value = true;
};

const closeEditDialog = () => {
  editDialog.value = false;
  editedItem.value = {
    DeviceId: '',
    deviceLabel: '',
    status: 0,
    lastTimestamp: '',
    originalItem: null
  };
};

const saveEditDialog = async () => {
  try {
    loading.value = true;
    
    const payload = {
      DeviceId: editedItem.value.DeviceId,
      Status: editedItem.value.status
    };

    const apiUrl = currentDeviceType.value === 'crane' 
      ? '/MachineStatus/upDateCraneStatus' 
      : '/MachineStatus/upDateGenStatus';

    await $api.put(apiUrl, payload);
    
    await fetchDeviceBargesGrouped();
    
  } catch (error) {
    console.error('Update error:', error);
    
  } finally {
    loading.value = false;
    closeEditDialog();
  }
};

onMounted(() => {
  fetchDeviceBargesGrouped();
});
</script>

<style scoped>
.status-btn {
  font-family: 'Inter', sans-serif;
  font-size: 1.5vh;
  border-radius: 24px;
  padding: 2vh 0vw;
  text-transform: none;
  font-weight: 300;
}

.edit {
  cursor: pointer;
  width: 2vw;
  height: 2vh;
  border-radius: 24px;
  font-size: 2vh;
  color: #1570EF;
  background-color: #E3F2FD;
}

.title {
  font-size: 3vh;
  font-weight: bold;
  text-align: center;
  font-family: 'Sarabun', sans-serif;
  padding: 12px;
}

.card-dialog {
  font-family: 'Sarabun', sans-serif;
  font-size: 2vh;
}

.title-field {
  font-size: 1.5vh;
  color: var(--gray);
  margin-bottom: 6px;
}

.default-field{
  background-color: var(--bg-row);
  padding: 1vh;
  border-radius: 10px;

  p {
    color: var(--grey-02);
    font-size: 1.5vh;
  }
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

.button-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}

.card-table {
  background-color: var(--light-blue);
  width: 100%;
  margin-top: 12px;
  padding: 12px;
}

.header-table {
  font-size: 1.5vh;
  color: var(--white);
  margin-bottom: 10px;
}

.v-card-text {
  padding: 0;
}

.status-standby {
  font-size: 1.5vh;
  color: var(--text-standby);
  background-color: var(--bg-standby);
}

.status-running {
  font-size: 1.5vh;
  color: var(--text-running);
  background-color: var(--bg-running);
}

.status-standby-maintenance {
  font-size: 1.5vh;
  color: var(--text-s-m);
  background-color: var(--bg-s-m);
}

.status-running-maintenance {
  font-size: 1.5vh;
  color: var(--text-gen);
  background-color: var(--bg-r-m);
}

.status-down {
  font-size: 1.5vh;
  color: var(--black);
  background-color: var(--gray);
}

.status-warning {
  color: var(--text-warning);
  background-color: var(--bg-warning);
}

.status-danger {
  color: var(--red);
  background-color: var(--bg-danger);
}

.status-unknown {
  font-size: 1.5vh;
  color: #000000;
  background-color: #C0C0C0;
}

.text-custom {
  font-size: 1.5vh;
}
</style>