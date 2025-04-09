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
              :items="formattedItems"
              item-value="deviceName"
              class="elevation-0"
              :items-per-page="-1"
              hide-default-footer
              style="width: 100%; height: 100%; font-size: 1.5vh; padding: 1vh;"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td class="text-custom" style="padding: 1vh;">{{ item.date || '-' }}</td>
                  <td class="text-custom" style="padding: 1vh;">{{ item.deviceName }}</td>
                  <td class="text-custom" style="padding: 1vh;">
                    <v-chip style="padding: 1.5vh;" :class="getStatusColor(item.status)">
                      {{ item.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-icon class="edit" style="padding: 1vh;" @click="openEditDialog(item)">
                      mdi-pencil-outline
                    </v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
      <!-- Crane -->
      <div class="card-table">
        <p class="header-table">Crane Status</p>
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="formattedCranes"
              item-value="deviceName"
              class="elevation-0"
              hide-default-footer
              style="width: 100%; height: 100%; font-size: 1.5vh; padding: 1vh;"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td class="text-custom" style="padding: 1vh;">{{ item.date || '-' }}</td>
                  <td class="text-custom" style="padding: 1vh;">{{ item.deviceName }}</td>
                  <td class="text-custom" style="padding: 1vh;">
                    <v-chip style="padding: 1.5vh;" :class="getStatusColor(item.status)">
                      {{ item.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-icon class="edit" style="padding: 1vh;" @click="openEditDialog(item)">
                      mdi-pencil-outline
                    </v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
    
    <!-- Dialog for editing status -->
    <v-dialog v-model="editDialog" max-width="50vw">
      <v-card class="rounded-lg pa-6">
        <v-card-title class="card-dialog">แก้ไขรายการ</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="6">
              <div>
                <p class="title-field">Date</p>
                <div class="default-field">
                  <p>{{ selectedItem?.date || '-' }}</p>
                </div>
              </div>
            </v-col>
            <v-col cols="12" lg="6">
              <div>
                <p class="title-field">Device Name</p>
                <div class="default-field">
                  <p>{{ selectedItem?.deviceName || '-' }}</p>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p class="title-field">Status</p>
              <v-row class="status-buttons">
                <v-col
                  v-for="status in (isCrane ? craneStatusOptions : generatorStatusOptions)"
                  :key="status.value"
                  cols="12" lg="4"
                >
                  <v-btn
                    class="status-btn"
                    :style="{
                      backgroundColor: selectedStatus === status.value ? status.color : '#FFFFFF',
                      color: selectedStatus === status.value ? '#FFFFFF' : '#D9D9D9',
                      border: `2px solid ${selectedStatus === status.value ? 'transparent' : '#D9D9D9'}`,
                    }"
                    
                    elevation="0"
                    block
                    @click="selectStatus(status.value)"
                  >
                    {{ status.text }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card-actions class="d-flex align-center justify-center">
              <v-btn class="cancel-btn" @click="editDialog = false">Cancel</v-btn>
              <v-btn class="save-btn" @click="saveStatus">Save</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import '@/assets/colors.scss';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { mockStatus } from '@/data/mockValue';

const excludedDeviceNames = [
  'Barge CRANE 1',
  'Barge CRANE 2',
  'Barge CRANE 3',
  'Barge Master'
];
// รับ typeDeviceName จาก route params
const route = useRoute();
const typeDeviceName = computed(() => route.params.typeDeviceName);
// Mock data สำหรับสถานะ
const devices = ref(mockStatus);
// เก็บวันที่อัปเดตล่าสุด
const lastUpdatedDates = ref({});

// กรองข้อมูล Generator และ Crane ตาม typeDeviceName
const generators = computed(() => {
  return devices.value.filter(device => 
    device.typedevicename === typeDeviceName.value &&
    !excludedDeviceNames.includes(device.devicename)
  ).map(device => ({
    id: device.deviceid,
    deviceName: device.devicelabel,
    status: getStatusText(device.data[0]?.Data[0]?.data ?? 0, false),
    date: lastUpdatedDates.value[device.deviceid] || '-'
  }));
});

const cranes = computed(() => {
  return devices.value.filter(device => 
    device.typedevicename === typeDeviceName.value && 
    device.devicename.includes('CRANE')
  ).map(device => ({
    id: device.deviceid,
    deviceName: device.devicelabel,
    status: getStatusText(device.data[0]?.Data[0]?.data ?? 0, true),
    date: lastUpdatedDates.value[device.deviceid] || '-'
  }));
});
const headers = [
  { title: 'Date', key: 'date', width: '12.15vw' },
  { title: 'Device Name', key: 'deviceName', width: '43.6vw' },
  { title: 'Status', key: 'status', width: '16.3vw' },
  { title: 'Action', key: 'action', sortable: false, width: '9.3vw' }
];

// ตัวเลือกสถานะสำหรับ Generator และ Crane
const generatorStatusOptions = [
  { text: 'Standby', value: 1, color: '#00B8F2' },
  { text: 'Running', value: 2, color: '#28A745' },
  { text: 'Running/Maintenance', value: 3, color: '#8DEB51' },
  { text: 'Standby/Maintenance', value: 4, color: '#007BFF' },
  { text: 'Down', value: 5, color: '#000000' }
];

const craneStatusOptions = [
  { text: 'Standby', value: 1, color: '#00B8F2' },
  { text: 'Running', value: 2, color: '#28A745' },
  { text: 'Maintenance', value: 3, color: '#000000' }
];

const getStatusText = (status, isCrane) => {
  if (isCrane) {
    switch (status) {
      case 0: default: return 'Unknown';
      case 1: return 'Standby';
      case 2: return 'Running';
      case 3: return 'Maintenance';
    }
  } else {
    switch (status) {
      case 0: default: return 'Unknown';
      case 1: return 'Standby';
      case 2: return 'Running';
      case 3: return 'Standby/Maintenance';
      case 4: return 'Running/Maintenance';
      case 5: return 'Down';
    }
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Standby': return 'status-standby';
    case 'Running': return 'status-running';
    case 'Running/Maintenance': return 'status-running-maintenance';
    case 'Standby/Maintenance': return 'status-standby-maintenance';
    case 'Down': return 'status-down';
    case 'Maintenance': return 'status-down';
    case 'Unknown': default: return 'status-unknown';
  }
};

// State สำหรับ dialog
const editDialog = ref(false);
const selectedItem = ref(null);
const selectedStatus = ref(null);
const isCrane = ref(false);

const openEditDialog = (item) => {
  selectedItem.value = item;
  isCrane.value = item.deviceName.includes('CRANE');

  if (isCrane.value) {
    switch (item.status) {
      case 'Standby': selectedStatus.value = 1; break;
      case 'Running': selectedStatus.value = 2; break;
      case 'Maintenance': selectedStatus.value = 3; break;
      case 'Unknown': default: selectedStatus.value = 0; break;
    }
  } else {
    switch (item.status) {
      case 'Standby': selectedStatus.value = 1; break;
      case 'Running': selectedStatus.value = 2; break;
      case 'Running/Maintenance': selectedStatus.value = 3; break;
      case 'Standby/Maintenance': selectedStatus.value = 4; break;
      case 'Down': selectedStatus.value = 5; break;
      case 'Unknown': default: selectedStatus.value = 0; break;
    }
  }

  editDialog.value = true;
};

const selectStatus = (status) => {
  selectedStatus.value = status;
};

const saveStatus = () => {
  if (selectedItem.value) {
    const device = devices.value.find(d => d.deviceid === selectedItem.value.id);
    if (device && Array.isArray(device.data) && device.data[0]?.Data?.[0]) {
      device.data[0].Data[0].data = selectedStatus.value; // อัปเดตสถานะ
      lastUpdatedDates.value[selectedItem.value.id] = new Date().toLocaleString(); // อัปเดตวันที่เป็นเวลาปัจจุบัน
    }
  }
  editDialog.value = false;
};

const formattedItems = computed(() => generators.value);
const formattedCranes = computed(() => cranes.value);

</script>

<style scoped>
.status-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5vh;
  border-radius: 1vh;
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
  font-size: 2vh;
  font-weight: 700;
  text-align: center;
  font-family: 'Sarabun', sans-serif;
  padding: 12px;
}

.card-dialog {
  font-family: 'Sarabun', sans-serif;
  font-size: 2vh;
}

.title-field {
  font-family: 'Poppins', sans-serif;
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
    font-family: 'Poppins', sans-serif;
    font-size: 1.5vh;
  }
}

.cancel-btn {
  background-color: var(--red);
  color: var(--white);
  border-radius: 1vh;
  padding: 2vh 2vw;
  font-size: 1.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.save-btn {
  background-color: var(--primary);
  color: var(--white);
  border-radius: 1vh;
  padding: 2vh 2vw;
  font-size: 1.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
  background-color: #d8d8d8;
}

.text-custom {
  font-size: 1.5vh;
}
</style>