<template>
  <PermissionCheck 
    menu-id="0101030400" 
    :required-permissions="{
      IsRead: true,
      IsWrite: true
    }"
  >
    <template #default="{ permissions }">
      <v-app style="background-color: #F7F9FC;">
        <NavigationBar />
        <SpaceBar />
        <v-container>
          <div class="title">Management</div>
          <!-- Alert สำหรับแจ้งผลการบันทึก -->
          <v-alert
            v-model="showAlert"
            :type="alertType"
            class="mb-4"
            transition="fade-transition"
          >
            {{ alertMessage }}
          </v-alert>
          <v-card class="mt-4">
            <v-card-text class="card-text">
              <v-row>
                <v-col cols="12" sm="12" lg="4">
                  <div class="header">
                    <span class="material-symbols-rounded">border_color</span>
                    <p>Device Details</p>
                  </div>
                  <div class="device-detail">
                    <p class="label">Device Name</p>
                    <v-text-field
                      v-model="deviceData.DeviceName"
                      variant="outlined" 
                      density="compact" 
                      class="input-field"
                      disabled
                    ></v-text-field>
                  </div>
                  <div class="device-detail">
                    <p>Description</p>
                    <v-text-field
                      v-model="deviceData.Note"
                      variant="outlined" 
                      density="compact" 
                      class="input-field"
                      style="font-family: 'Sarabun', sans-serif;"
                    ></v-text-field>
                  </div>
                  <div class="device-detail">
                    <p class="label">Device Label</p>
                    <v-text-field
                      v-model="deviceData.DeviceLabel"
                      variant="outlined" 
                      density="compact"
                      class="input-field"
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" sm="12" lg="4"></v-col>
                <v-col cols="12" sm="12" lg="4" class="h-100">
                  <div class="header">
                    <span class="material-symbols-rounded">add_photo_alternate</span>
                    <p>Device Profile</p>
                  </div>
                  <div>
                    <DropZone @file-selected="handleFileSelected" />
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" lg="4">
                  <div class="header">
                    <span class="material-symbols-rounded">manufacturing</span>
                    <p>Configuration</p>
                  </div>
                  <div class="device-detail">
                    <p>Measurement</p>
                    <v-select
                      variant="outlined"
                      density="compact"
                      :items="measurementAll"
                      item-title="MeasurementName"
                      item-value="MeasurementId"
                      v-model="selectedMeasurementId"
                      @update:modelValue="loadMeasurementData"
                    ></v-select>
                  </div>
                  <div class="device-detail">
                    <p>Min</p>
                    <v-text-field
                      type="number"
                      variant="outlined" 
                      density="compact" 
                      class="input-field"
                      v-model.number="selectedMeasurement.ValueMin"
                    ></v-text-field>
                  </div>
                  <div class="device-detail">
                    <p>Min Danger</p>
                    <v-text-field 
                      type="number"
                      variant="outlined" 
                      density="compact"
                      class="input-field"
                      v-model.number="selectedMeasurement.ThresholdMinDanger"
                    ></v-text-field>
                  </div>
                  <div class="device-detail">
                    <p>Max Warning</p>
                    <v-text-field
                      type="number"
                      variant="outlined" 
                      density="compact"
                      class="input-field"
                      v-model.number="selectedMeasurement.ThresholdMaxWarning"
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" sm="12" lg="4" class="configuration-col">
                  <div class="device-detail">
                    <p>Min Warning</p>
                    <v-text-field
                      type="number"
                      variant="outlined" 
                      density="compact" 
                      class="input-field"
                      v-model.number="selectedMeasurement.ThresholdMinWarning"
                    ></v-text-field>
                  </div>
                  <div class="device-detail">
                    <p>Max</p>
                    <v-text-field
                      type="number"
                      variant="outlined" 
                      density="compact"
                      class="input-field"
                      v-model.number="selectedMeasurement.ValueMax"
                    ></v-text-field>
                  </div>
                  <div class="device-detail">
                    <p>Max Danger</p>
                    <v-text-field
                      type="number"
                      variant="outlined" 
                      density="compact"
                      class="input-field"
                      v-model.number="selectedMeasurement.ThresholdMaxDanger"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12" class="button-section">
                  <v-btn class="cancel-btn" @click芯="resetForm" elevation="0"> Cancel </v-btn>
                  <v-btn class="save-btn" @click="saveRecord" elevation="0" :disabled="!permissions.IsWrite"> Save </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card class="mt-6">
            <v-data-table
              :headers="headers"
              :items="measurementAll"
              hide-default-footer
              class="striped-table custom-table"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td class="text-start">{{ item.MeasurementName }}</td>
                  <td class="text-end">{{ item.ValueMin }}</td>
                  <td class="text-end">{{ item.ValueMax }}</td>
                  <td class="text-end">{{ item.ThresholdMinWarning }}</td>
                  <td class="text-end">{{ item.ThresholdMaxWarning }}</td>
                  <td class="text-end">{{ item.ThresholdMinDanger }}</td>
                  <td class="text-end">{{ item.ThresholdMaxDanger }}</td>
                  <td class="action">{{ item.IsActive }}</td>
                  <td style="display: flex; justify-content: center; align-items: center;">
                    <v-icon 
                      v-if="permissions.IsWrite" 
                      icon="mdi-pencil-outline" 
                      class="edit"
                      @click="editMeasurement(item)"
                    ></v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
      </v-app>
    </template>
  </PermissionCheck>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import PermissionCheck from '@/components/PermissionCheck.vue';
import DropZone from '../DropZone.vue';
import { inject, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const $api = inject('$api');
const route = useRoute();
const deviceData = ref({});
const deviceId = ref(route.params.deviceId);
const measurementAll = ref([]);
const selectedMeasurementId = ref(null);
const selectedMeasurement = ref({
  ValueMin: 0,
  ValueMax: 0,
  ThresholdMinWarning: 0,
  ThresholdMaxWarning: 0,
  ThresholdMinDanger: 0,
  ThresholdMaxDanger: 0
});
const dropzoneFile = ref(null);
const originalDeviceData = ref({}); // เก็บข้อมูลดั้งเดิมเพื่อใช้เปรียบเทียบ
// สถานะสำหรับ Alert
const showAlert = ref(false);
const alertType = ref('success');
const alertMessage = ref('');

const headers = ref([
  { title: 'Measurement', value: 'MeasurementName', align: 'start' },
  { title: 'Threshold Min', value: 'ValueMin', align: 'end' },
  { title: 'Threshold Max', value: 'ValueMax', align: 'end' },
  { title: 'Threshold Min Warning', value: 'ThresholdMinWarning', align: 'end' },
  { title: 'Threshold Max Warning', value: 'ThresholdMaxWarning', align: 'end' },
  { title: 'Threshold Min Danger', value: 'ThresholdMinDanger', align: 'end' },
  { title: 'Threshold Max Danger', value: 'ThresholdMaxDanger', align: 'end' },
  { title: 'Action', value: 'IsActive', align: 'center', sortable: false },
  { title: 'Edit', value: 'edit', align: 'center', sortable: false },
]);

const fetchDeviceData = async () => {
  try {
    const response = await $api.put('/Device/GetDevice', {
      DeviceId: deviceId.value
    });

    originalDeviceData.value = { ...response.data }; // เก็บข้อมูลดั้งเดิม
    deviceData.value = {
      DeviceId: response.data.DeviceId,
      DeviceName: response.data.DeviceName,
      DeviceLabel: response.data.DeviceLabel,
      Note: response.data.Note
    };
    measurementAll.value = response.data.Measurement.map(m => ({ ...m })) || [];
  } catch (error) {
    console.error('Failed to fetch device data:', error);
    measurementAll.value = [];
  }
};

const editMeasurement = (item) => {
  selectedMeasurementId.value = item.MeasurementId;
  selectedMeasurement.value = {
    MeasurementId: item.MeasurementId,
    MeasurementName: item.MeasurementName,
    ValueMin: item.ValueMin,
    ValueMax: item.ValueMax,
    ThresholdMinWarning: item.ThresholdMinWarning,
    ThresholdMaxWarning: item.ThresholdMaxWarning,
    ThresholdMinDanger: item.ThresholdMinDanger,
    ThresholdMaxDanger: item.ThresholdMaxDanger,
    IsActive: item.IsActive
  };
};

const loadMeasurementData = (measurementId) => {
  const measurement = measurementAll.value.find(m => m.MeasurementId === measurementId);
  if (measurement) {
    selectedMeasurement.value = { ...measurement };
  }
};

const resetForm = () => {
  selectedMeasurementId.value = null;
  selectedMeasurement.value = {
    ValueMin: 0,
    ValueMax: 0,
    ThresholdMinWarning: 0,
    ThresholdMaxWarning: 0,
    ThresholdMinDanger: 0,
    ThresholdMaxDanger: 0
  };
};

const saveRecord = async () => {
  try {
    // ดึง MemberId จาก localStorage
    const memberData = JSON.parse(localStorage.getItem('member') || '{}');
    const memberId = memberData.MemberId || 'unknown';
    const modifiedDatetime = new Date().toISOString();

    // อัปเดตข้อมูลใน measurementAll เฉพาะที่เลือก
    const index = measurementAll.value.findIndex(m => m.MeasurementId === selectedMeasurement.value.MeasurementId);
    if (index !== -1) {
      measurementAll.value[index] = {
        ...measurementAll.value[index],
        ValueMin: selectedMeasurement.value.ValueMin,
        ValueMax: selectedMeasurement.value.ValueMax,
        ThresholdMinWarning: selectedMeasurement.value.ThresholdMinWarning,
        ThresholdMaxWarning: selectedMeasurement.value.ThresholdMaxWarning,
        ThresholdMinDanger: selectedMeasurement.value.ThresholdMinDanger,
        ThresholdMaxDanger: selectedMeasurement.value.ThresholdMaxDanger,
        ModifiedBy: memberId,
        ModifiedDatetime: modifiedDatetime
      };
    }

    // สร้าง payload โดยคงข้อมูลดั้งเดิมไว้และอัปเดตเฉพาะฟิลด์ที่แก้ไขได้
    const payload = {
      ...originalDeviceData.value, // คงข้อมูลดั้งเดิมทั้งหมด
      DeviceLabel: deviceData.value.DeviceLabel, // อัปเดตเฉพาะฟิลด์ที่แก้ไขได้
      Note: deviceData.value.Note,
      ModifiedBy: memberId,
      ModifiedDatetime: modifiedDatetime,
      Measurement: measurementAll.value.map(m => ({
        ...m,
        // อัปเดตเฉพาะฟิลด์ที่แก้ไขได้ใน Measurement
        ValueMin: m.ValueMin,
        ValueMax: m.ValueMax,
        ThresholdMinWarning: m.ThresholdMinWarning,
        ThresholdMaxWarning: m.ThresholdMaxWarning,
        ThresholdMinDanger: m.ThresholdMinDanger,
        ThresholdMaxDanger: m.ThresholdMaxDanger,
        ModifiedBy: m.MeasurementId === selectedMeasurement.value.MeasurementId ? memberId : m.ModifiedBy,
        ModifiedDatetime: m.MeasurementId === selectedMeasurement.value.MeasurementId ? modifiedDatetime : m.ModifiedDatetime
      }))
    };

    
    await $api.put('/Device/Update', payload);
    
    showAlert.value = true;
    alertType.value = 'success';
    alertMessage.value = 'Device data saved successfully!';
    setTimeout(() => {
      showAlert.value = false;
    }, 1000);
    // รีเฟรชข้อมูลหลังบันทึก
    await fetchDeviceData();
    resetForm();
  } catch (error) {
    console.error('Failed to save device data:', error);
    showAlert.value = true;
    alertType.value = 'error';
    alertMessage.value = 'Failed to save device data: ' + (error.message || 'Unknown error');
    setTimeout(() => {
      showAlert.value = false;
    }, 1000);
  }
};

const handleFileSelected = (file) => {
  dropzoneFile.value = file;
};

onMounted(() => {
  fetchDeviceData();
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: 600;
}

.header {
  display: flex;
  justify-content: starrt;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  p {
    font-size: 16px;
    font-weight: 700;
  }
}

.device-detail {
  @media (min-width: 1024px) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 64px;
  }
}

.device-detail p {
  min-width: 120px;
  margin: 0;
}

.device-detail .label {
  min-width: 120px;
  margin: 0;
  position: relative;
}

.device-detail .label::after {
  content: '*';
  color: #E62020;
  margin-left: 4px;
}


.input-field :deep(.v-field__outline) {
  border-radius: 6px;
  color: #70707B;
}

:deep(.v-text-field input) {
  color: #4B4B4B;
}

.button-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}

.cancel-btn {
  background-color: #DC2B2B;
  color: #ffffff;
  border-radius: 10px;
}

.save-btn {
  background-color: #1476FF;
  color: #ffffff;
  border-radius: 10px;
}

.custom-table :deep(thead th) {
  color: #000000;
  font-weight: bold;
  font-size: 16px;
}

.custom-table :deep(tbody td) {
  color: #4B4B4B;
  font-size: 16px;
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: #F9F9FA;
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

.upload-img {
  background-color: #9F9F9F;
  width: 100%;
  height: 100%;
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

td.action {
  color: #14CA74 !important; /* บังคับ CSS */
  text-align: center;
}

.card-text {
  @media (min-width: 1024px) {
    margin: 24px 64px;
  }
}

.configuration-col {
  @media (min-width: 1024px) {
    margin-top: 110px;
  }
}
</style>