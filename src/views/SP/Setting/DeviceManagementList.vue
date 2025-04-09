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
        <v-container fluid class="px-10">
          <div class="title">Device Management</div>
          <v-card class="mt-4">
            <v-card-text class="mx-6 my-6">
              <v-row>
                <!-- Vehicle Dropdown -->
                <v-col cols="12" md="4">
                  <v-select
                    label="Vehicle"
                    variant="outlined"
                    density="compact"
                    :items="vehicleItems"
                    v-model="selectedVehicle"
                    item-title="name"
                    item-value="name"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-row>
                    <v-col cols="6" md="4">
                      <v-btn
                        prepend-icon="mdi-close"
                        class="cancel-btn"
                        @click="resetFilters"
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                    <v-col cols="6" md="4">
                      <v-btn
                        prepend-icon="mdi-magnify"
                        class="search-btn"
                        @click="searchRecords"
                      >
                        Search
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text v-if="showResult" class="mx-6">
              <v-data-table
                :headers="headers"
                :items="filteredItems"
                class="elevation-1 mb-12 striped-table custom-table"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.DeviceId }}</td>
                    <td>{{ item.DeviceName }}</td>
                    <td>{{ item.DeviceLabel }}</td>
                    <td class="description">{{ item.Note }}</td>
                    <td class="action">{{ item.IsActive ? 'Active' : 'Inactive' }}</td>
                    <td class="d-flex justify-center align-center">
                      <v-icon v-if="permissions.IsWrite" icon="mdi-pencil-outline" class="edit" @click="editDevice(item.DeviceId)"></v-icon>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
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
import { ref, onMounted, inject } from 'vue';
import router from '@/router';

const $api = inject('$api');
const showResult = ref(false);
const vehicleItems = ref([]);
const selectedVehicle = ref(null);
const deviceList = ref([]);
const filteredItems = ref([]);

const headers = ref([
  { title: 'Device ID', key: 'DeviceId', align: 'start' },
  { title: 'Device Name', key: 'DeviceName', align: 'start' },
  { title: 'Device Label', key: 'DeviceLabel', align: 'start' },
  { title: 'Description', key: 'Note', align: 'start' },
  { title: 'Action', key: 'IsActive', align: 'center', sortable: false },
  { title: 'Edit', key: 'edit', align: 'center', sortable: false },
]);

const fetchDeviceList = async () => {
  try {
    const response = await $api.put('/device/GetDeviceListProfile', {
      DeviceId: ''
    });
    deviceList.value = response.data;
    const uniqueVehicles = new Set();
    vehicleItems.value = deviceList.value.map(device => {
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

const resetFilters = () => {
  selectedVehicle.value = null;
  showResult.value = false;
  filteredItems.value = [];
};

const searchRecords = () => {
  if (selectedVehicle.value) {
    filteredItems.value = deviceList.value.filter(device => {
      if (device.TypeVehicle === 'Barge') {
        return device.TypeDevicename === selectedVehicle.value;
      } else if (device.TypeVehicle === 'Tugboat river going') {
        return 'Tugboat River going' === selectedVehicle.value;
      } else if (device.TypeVehicle === 'Tugboat sea going') {
        return 'Tugboat Sea going' === selectedVehicle.value;
      }
      return false;
    });
    showResult.value = true;
  } else {
    showResult.value = false;
  }
};

const editDevice = (deviceId) => {
  router.push({ name: "DeviceManagementForm", params: { deviceId }})
}

onMounted(() => {
  fetchDeviceList();
});
</script>

<style scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.cancel-btn {
  background-color: #DC2B2B;
  color: #ffffff;
  border-radius: 10px;
}

.search-btn {
  background-color: #223368;
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

td.action {
  color: #14CA74 !important; /* บังคับ CSS */
  text-align: center;
}

td.description {
  font-family: 'Sarabun', sans-serif;
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

</style>