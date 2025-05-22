<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Device Management</div>
      <v-card class="mt-4">
        <v-card-text class="card-text">
          <v-row>
            <v-col cols="12" sm="12" lg="4">
              <div class="header">
                <span class="material-symbols-rounded">border_color</span>
                <p>Device Details</p>
              </div>
              <div class="device-detail">
                <p>Vehicel Type</p>
                <v-select
                  variant="outlined"
                  density="compact"
                  :items="vehicleItems"
                  v-model="deviceData.TypeDevicename"
                  item-title="name"
                  item-value="name"
                ></v-select>
              </div>
              <div class="device-detail">
                <p class="label">Device Name</p>
                <v-text-field
                  v-model="deviceData.DeviceName"
                  variant="outlined" 
                  density="compact" 
                  class="input-field"
                  readonly
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
            </v-col>
            <v-col cols="12" sm="12" lg="4"></v-col>
            <v-col cols="12" sm="12" lg="4" class="h-100">
              <div class="header">
                <span class="material-symbols-rounded">add_photo_alternate</span>
                <p>Device Profile</p>
              </div>
              <v-img
                :src="preview"
                :height="340"
                class="image-preview"
                style="cursor: pointer;"
                @click="showUploadDialog = true"
              ></v-img>

              <v-dialog v-model="showUploadDialog" max-width="600">
                <template v-slot:default>
                  <v-card rounded="xl">
                    <v-card-title class="d-flex justify-space-between align-center">
                      <div class="text-medium-emphasis pa-5" style="font-family: 'Inter', sans-serif;">
                        Upload New Device Profile
                      </div>
                      <v-btn
                        icon="mdi-close"
                        variant="text"
                        @click="cancelUpload"
                      ></v-btn>
                    </v-card-title>
                    <v-card-text>
                      <DropZone @file-selected="handleFileSelected" />
                    </v-card-text>
                    <v-card-actions class="pa-5">
                      <v-btn class="cancel-btn text-none" @click="cancelUpload">Cancel</v-btn>
                      <v-btn class="save-btn text-none" @click="confirmUpload">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
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
                  label="Measurement"
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
              <v-btn class="cancel-btn text-none" @click="resetForm" elevation="0"> Cancel </v-btn>
              <v-btn class="save-btn text-none" @click="saveRecord" elevation="0"> Save </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mt-6">
        <v-data-table
          :headers="headers"
          :items="measurementAll"
          items-per-page="-1"
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
              <td class="action">{{ item.IsActive ? 'Active' : 'Inactive' }}</td>
              <td>
                <v-icon
                  icon="mdi-pencil" 
                  class="edit"
                  @click="editMeasurement(item)"
                ></v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <v-snackbar
      v-model="showAlert"
      :color="alertType"
      :timeout="3000"
      location="top right"
      class="alert-banner"
      rounded="lg"
    >
      <div class="pa-5" style="font-family: 'Inter', sans-serif; font-size: 1.5vh;">
        <v-icon class="ma-2">
          {{ alertIcon }}
        </v-icon>
        {{ alertMessage }}
      </div>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import DropZone from '../DropZone.vue';
import { inject, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $api = inject('$api');
const route = useRoute();
const router = useRouter();
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
const originalDeviceData = ref({});
const initialDeviceData = ref({});
const showAlert = ref(false);
const alertType = ref('success');
const alertIcon = ref('mdi-check-circle') 
const alertMessage = ref('');
const deviceList = ref([]);
const vehicleItems = ref([]);
const showUploadDialog = ref(false);
const deviceImage = ref(null);
const preview = ref('https://picsum.photos/id/11/10/6');
const originalPreview = ref('https://picsum.photos/id/11/10/6');
const loading = ref(true);

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

const showSuccessAlert = (message) => {
  showAlert.value = true;
  alertType.value = 'success';
  alertMessage.value = message;
  alertIcon.value = 'mdi-check-circle';
};

const showErrorAlert = (message) => {
  showAlert.value = true;
  alertType.value = 'error';
  alertMessage.value = message;
  alertIcon.value = 'mdi-alert-circle'
};

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepage');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101030400');

  if (!permission || !permission.IsActive) {
    return router.push('/Homepage');
  }
};

const fetchDeviceData = async () => {
  try {
    loading.value = true;

    const response = await $api.put('/Device/GetDevice', {
      DeviceId: deviceId.value
    });

    originalDeviceData.value = { ...response.data };
    initialDeviceData.value = {
      DeviceId: response.data.DeviceId,
      DeviceName: response.data.DeviceName,
      DeviceLabel: response.data.DeviceLabel,
      Note: response.data.Note,
      TypeDevicename: response.data.TypeDevicename,
    };
    deviceData.value = {
      DeviceId: response.data.DeviceId,
      DeviceName: response.data.DeviceName,
      DeviceLabel: response.data.DeviceLabel,
      Note: response.data.Note,
      TypeDevicename: response.data.TypeDevicename,
      DeviceImage: response.data.DeviceImage
    };
    measurementAll.value = response.data.Measurement.map(m => ({ ...m })) || [];
    
  } catch (error) {
    console.error('Failed to fetch device data:', error);
    measurementAll.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchDeviceList = async () => {
  try {
    const response = await $api.put('/device/GetDeviceListProfile', {
      DeviceId: ''
    });
    deviceList.value = response.data;
    const uniqueVehicles = new Set();
    vehicleItems.value = deviceList.value
      .map(device => {
        if (device.TypeVehicle === 'Barge') {
          return { name: device.TypeDevicename };
        } else if (device.TypeVehicle === 'Tugboat river going') {
          return { name: 'Tugboat River going' };
        } else if (device.TypeVehicle === 'Tugboat sea going') {
          return { name: 'Tugboat Sea going' };
        }
        return null;
      })
      .filter(item => item && !uniqueVehicles.has(item.name) && uniqueVehicles.add(item.name));
  } catch (error) {
    console.error('Failed to fetch device list:', error);
  }
};

const fetchDeviceProfile = async () => {
  try {
    loading.value = true;

    const filename = await deviceData.value?.DeviceImage
    const response = await $api.get('/Device/Image/' + filename);
    
    if (response.data && response.data.src) {
      preview.value = response.data.src;
      originalPreview.value = response.data.src;
    } else {
      preview.value = 'https:/https://picsum./picsum.photos/id/11/10/6';
      originalPreview.value = 'photos/id/11/10/6';
    }
  } catch (error) {
    console.error('Failed to fetch image:', error);
    preview.value = 'https://picsum.photos/id/11/10/6';
    originalPreview.value = 'https://picsum.photos/id/11/10/6';
  } finally {
    loading.value = false;
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
  deviceData.value = { ...initialDeviceData.value };
  selectedMeasurementId.value = null;
  selectedMeasurement.value = {
    ValueMin: 0,
    ValueMax: 0,
    ThresholdMinWarning: 0,
    ThresholdMaxWarning: 0,
    ThresholdMinDanger: 0,
    ThresholdMaxDanger: 0
  };
  dropzoneFile.value = null;
  preview.value = originalPreview.value;
  deviceImage.value = null;
};

const handleFileSelected = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    dropzoneFile.value = file;
    deviceImage.value = null;
  } else {
    dropzoneFile.value = null;
    preview.value = originalPreview.value;
    deviceImage.value = null;
  }
};

const confirmUpload = () => {
  if (!dropzoneFile.value) {
    showErrorAlert('Please select an image');
    return;
  }
  // showSuccessAlert('Upload image successfully!')
  showUploadDialog.value = false;
};

const cancelUpload = () => {
  dropzoneFile.value = null;
  preview.value = originalPreview.value;
  deviceImage.value = null;
  showUploadDialog.value = false;
};

const saveRecord = async () => {
  try {
    const memberData = JSON.parse(localStorage.getItem('member'));
    const memberId = memberData.MemberId;
    const modifiedDatetime = new Date().toISOString();
    let newImageName = null;

    // Upload image if exists
    if (dropzoneFile.value) {
      const formData = new FormData();
      formData.append('image', dropzoneFile.value);
      formData.append('deviceId', deviceId.value);
      const uploadResponse = await $api.post('/Device/Upload/Image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (uploadResponse.data) {
        newImageName = uploadResponse.data;
        deviceImage.value = newImageName;
        deviceData.value.DeviceImage = newImageName;
      }
    }

    // Update measurement data
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

    // Prepare payload including Vehicle Type
    const payload = {
      ...originalDeviceData.value,
      DeviceLabel: deviceData.value.DeviceLabel,
      Note: deviceData.value.Note,
      TypeDevicename: deviceData.value.TypeDevicename, // Include Vehicle Type
      DeviceImage: newImageName || originalDeviceData.value.DeviceImage,
      ModifiedBy: memberId,
      ModifiedDatetime: modifiedDatetime,
      Measurement: measurementAll.value.map(m => ({
        ...m,
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

    const updateResponse = await $api.put('/Device/Update', payload);
    console.log('Update response:', updateResponse.data);
    
    showSuccessAlert('Device updated successfully!');

    await fetchDeviceData();
    
    if (deviceData.value.DeviceImage) {
      await fetchDeviceProfile();
    }

    resetForm();

  } catch (error) {
    console.error('Failed to save device data:', error);
    showErrorAlert('Failed to update device information: ' + (error.message || 'Unknown error'));
  }
};

onMounted(async () => {
  await initialize();
  await fetchDeviceData();
  await fetchDeviceList();
  await fetchDeviceProfile();
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 2vh;
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

// .cancel-btn {
//   background-color: #DC2B2B;
//   color: #ffffff;
//   border-radius: 10px;
//   font-family: 'Inter', sans-serif;
// }

.cancel-btn {
  color: #000000;
  border-radius: 24px;
  border: 1px solid #E3E3E3;
  font-family: 'Inter', sans-serif;
  width: 5vw;
}

.cancel-btn:hover {
  // background-color: #FF1744;
  background-color: #FAFAFA;
  // color: #ffffff;
  color: #000000;
}

.save-btn {
  background-color: #1476FF;
  color: #ffffff;
  border-radius: 24px;
  font-family: 'Inter', sans-serif;
  width: 5vw;
}

.save-btn:hover {
  background-color: #249dff;
  color: #ffffff;
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
  color: #14CA74 !important;
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

.image-preview {
  border-radius: 8px;
  cursor: pointer;
  background-color: #F7F9FC;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  object-fit: contain;
}
</style>