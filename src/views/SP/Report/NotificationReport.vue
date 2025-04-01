<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container>
      <div class="title">Notification Report</div>
      
      <!-- Filter Form -->
      <v-card class="mt-4">
        <v-card-text class="mx-16 my-6">
          <v-row>
            <!-- Vehicle Dropdown -->
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedVehicle"
                :items="vehicleList"
                item-title="name"
                item-value="id"
                label="Vehicle"
                @update:model-value="onVehicleChange"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
            
            <!-- Device Dropdown -->
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedDevice"
                :items="deviceList"
                item-title="title"
                item-value="id"
                label="Device"
                variant="outlined"
                density="compact"
                :disabled="!selectedVehicle"
                @update:model-value="onDeviceChange"
              ></v-select>
            </v-col>
            
            <!-- Measurement Dropdown -->
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedMeasurement"
                :items="measurementList"
                item-title="title"
                item-value="id"
                label="Measurement"
                variant="outlined"
                density="compact"
                :disabled="!selectedDevice"
              ></v-select>
            </v-col>
            
            <!-- Status Dropdown -->
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedStatus"
                :items="statusList"
                item-title="name"
                item-value="value"
                label="Status"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
            
            <!-- Date Pickers -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="3">
              <v-text-field
                v-model="endDate"
                label="End Date"
                type="date"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <!-- Action Buttons -->
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn
                prepend-icon="mdi-close"
                class="cancel-btn mr-2"
                @click="resetFilters"
              >
                Cancel
              </v-btn>
              <v-btn
                prepend-icon="mdi-magnify"
                class="search-btn mr-2"
                @click="searchRecords"
              >
                Search
              </v-btn>
              <v-btn
                prepend-icon="mdi-arrow-down"
                class="download-btn"
                @click="downloadReport"
              >
                Download
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- Results Table -->
        <v-card-text v-if="showTable" class="mx-16">
          <v-data-table
            :headers="headers"
            :items="results"
            item-value="id"
            class="elevation-1 mb-12 striped-table custom-table"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ item.deviceName }}</td>
                <td>{{ item.measurement }}</td>
                <td>{{ item.ticketNumber || '-' }}</td>
                <td>Value is in the dangerous zone</td>
                <td>
                  <v-chip :class="getStatusColor(item.status)">
                    {{ item.status }}
                  </v-chip>
                </td>
                <td>
                  <v-icon
                    icon="mdi-pencil-outline"
                    class="edit"
                    @click="openEditDialog(item)"
                  ></v-icon>
                </td>
              </tr>
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
              <v-col cols="6" md="6">
                <div>
                  <p class="title-field">Date</p>
                  <div class="default-field">
                    <p>{{ formatDate(editedItem.date) }}</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="6" md="6">
                <div>
                  <p class="title-field">Device Name</p>
                  <div class="default-field">
                    <p>{{ editedItem.deviceName }}</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="6" md="6">
                <div>
                  <p class="title-field">Measuremnet</p>
                  <div class="default-field">
                    <p>{{ editedItem.measurement }}</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="6" md="6">
                <div>
                  <p class="title-field-thai">เลขใบแจ้งซ่อม</p>
                    <v-text-field
                      v-model="editedItem.ticketNumber"
                      variant="outlined"
                      :disabled="!!originalTicketNumber"
                      style="
                        width: 362px;
                        border-radius: 10px;
                        color: var(--grey-02);
                        font-family: 'Poppins', sans-serif;"
                    ></v-text-field>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="d-flex align-center justify-center mb-8 ga-8">
            <v-btn class="cancel-btn" @click="closeDialog">Cancel</v-btn>
            <v-btn class="save-btn" @click="saveTicket" :disabled="!!originalTicketNumber">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import { ref, computed } from 'vue';
import { barges, tugboats } from '@/data/config.js';
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import '@/assets/colors.scss'

export default {
  name: 'NotificationReport',
  components: {
    NavigationBar,
    SpaceBar,
  },

  data() {
    return {
      headers: [
        { title: "Date", key: "date" },
        { title: "Device Name", key: "deviceName" },
        { title: "Measurement", key: "measurement" },
        { title: "เลขใบแจ้งซ่อม", key: "ticketNumber" },
        { title: "Details", key: "details", sortable: false },
        { title: "Status", key: "status" },
        { title: "Action", key: "action", sortable: false },
      ],
    };
  },

  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'รอแจ้งซ่อม':
          return 'status-pending';
        case 'ดำเนินการเสร็จสิ้น':
          return 'status-finish';
        default:
          return '';
      }
    }
  },
  
  setup() {
    const selectedVehicle = ref(null);
    const selectedDevice = ref(null);
    const selectedMeasurement = ref(null);
    const selectedStatus = ref('all');
    const startDate = ref('');
    const endDate = ref('');
    const results = ref([]);
    const showTable = ref(false);
    const dialog = ref(false);
    const editedItem = ref({});
    const editedIndex = ref(-1);
    const originalTicketNumber = ref('');
    
    const defaultBargeMeasurements = [
      { id: 'all', title: 'Select All' },
      { id: 'axis-x', title: 'Axis - X' },
      { id: 'axis-y', title: 'Axis - Y' },
      { id: 'oil-pressure', title: 'Oil Pressure' },
      { id: 'water-temp', title: 'Water Temperature' },
      { id: 'rpm', title: 'RPM' },
      { id: 'battery', title: 'Battery' }
    ];
    
    const defaultTugboatMeasurements = [
      { id: 'all', title: 'Select All' },
      { id: 'oil-pressure', title: 'Oil Pressure' },
      { id: 'water-temp', title: 'Water Temperature' },
      { id: 'rpm', title: 'RPM' },
      { id: 'wind-speed', title: 'Wind Speed' },
      { id: 'battery', title: 'Battery' }
    ];
    
    const vehicleList = computed(() => {
      const list = [
        ...barges.map(barge => ({
          id: barge.id,
          name: barge.name
        })),
        {
          id: 'Tugboats',
          name: 'Tugboats'
        }
      ];
      return list;
    });
    
    const deviceList = computed(() => {
      if (!selectedVehicle.value) return [];
      
      if (selectedVehicle.value === 'Tugboats') {
        const list = [
          { id: 'all', title: 'Select All' },
          ...tugboats.map(tugboat => ({
            id: tugboat.id,
            title: tugboat.name
          }))
        ];
        return list;
      } else {
        const selectedBargeData = barges.find(b => b.id === selectedVehicle.value);
        if (!selectedBargeData) return [];
        
        return [
          { id: 'all', title: 'Select All' },
          ...selectedBargeData.items.map(item => ({
            id: item.id,
            title: item.title
          }))
        ];
      }
    });
    
    const measurementList = computed(() => {
      if (!selectedVehicle.value || !selectedDevice.value) return [];
      
      if (selectedVehicle.value === 'Tugboats') {
        return defaultTugboatMeasurements;
      } else {
        const selectedBarge = barges.find(b => b.id === selectedVehicle.value);
        if (!selectedBarge) return defaultBargeMeasurements;
        
        if (selectedDevice.value === 'all') {
          return defaultBargeMeasurements;
        } else {
          const selectedItem = selectedBarge.items.find(item => item.id === selectedDevice.value);
          if (!selectedItem || !selectedItem.measuremnets) return defaultBargeMeasurements;
          
          return [
            { id: 'all', title: 'Select All' },
            ...selectedItem.measuremnets.map(m => ({
              id: m.id,
              title: m.title
            }))
          ];
        }
      }
    });
    
    const statusList = ref([
      { name: 'Select All', value: 'all' },
      { name: 'รอแจ้งซ่อม', value: 'pending' },
      { name: 'ดำเนินการเสร็จสิ้น', value: 'completed' }
    ]);
    
    const onVehicleChange = () => {
      selectedDevice.value = null;
      selectedMeasurement.value = null;
    };
    
    const onDeviceChange = () => {
      selectedMeasurement.value = null;
    };
    
    const resetFilters = () => {
      selectedVehicle.value = null;
      selectedDevice.value = null;
      selectedMeasurement.value = null;
      selectedStatus.value = 'all';
      startDate.value = '';
      endDate.value = '';
      showTable.value = false;
    };
    
    const parseDate = (dateString) => {
      if (!dateString) return null;
      return new Date(dateString);
    };
    
    const searchRecords = () => {
      const mockData = [];
      const startDateObj = parseDate(startDate.value);
      const endDateObj = parseDate(endDate.value);
      
      const adjustedEndDateObj = endDateObj ? new Date(endDateObj) : null;
      if (adjustedEndDateObj) {
        adjustedEndDateObj.setDate(adjustedEndDateObj.getDate() + 1);
      }
      
      if (selectedVehicle.value === 'Tugboats') {
        let devicesToShow = [];
        
        if (selectedDevice.value === 'all') {
          devicesToShow = tugboats;
        } else {
          devicesToShow = tugboats.filter(t => t.id === selectedDevice.value);
        }
        
        devicesToShow.forEach(device => {
          let measurementsToShow = [];
          if (selectedMeasurement.value === 'all' || !selectedMeasurement.value) {
            measurementsToShow = device.measuremnets || defaultTugboatMeasurements.filter(m => m.id !== 'all');
          } else {
            measurementsToShow = device.measuremnets.filter(m => m.id === selectedMeasurement.value) || [];
          }
          
          measurementsToShow.forEach(measurement => {
            const randomDate = generateDateInRange(startDateObj, adjustedEndDateObj);
            
            mockData.push({
              id: `${device.id}-${measurement.id}`,
              date: randomDate,
              deviceName: device.name,
              measurement: measurement.title,
              ticketNumber: '',
              status: 'รอแจ้งซ่อม'
            });
          });
        });
      } else {
        const selectedBarge = barges.find(b => b.id === selectedVehicle.value);
        if (!selectedBarge) return;
        
        let devicesToShow = [];
        
        if (selectedDevice.value === 'all') {
          devicesToShow = selectedBarge.items;
        } else {
          devicesToShow = selectedBarge.items.filter(i => i.id === selectedDevice.value);
        }
        
        devicesToShow.forEach(device => {
          let measurementsToShow = [];
          if (selectedMeasurement.value === 'all' || !selectedMeasurement.value) {
            measurementsToShow = device.measuremnets || defaultBargeMeasurements.filter(m => m.id !== 'all');
          } else {
            if (device.measuremnets) {
              measurementsToShow = device.measuremnets.filter(m => m.id === selectedMeasurement.value);
            } else {
              measurementsToShow = defaultBargeMeasurements.filter(m => m.id === selectedMeasurement.value && m.id !== 'all');
            }
          }
          
          measurementsToShow.forEach(measurement => {
            const randomDate = generateDateInRange(startDateObj, adjustedEndDateObj);
            
            mockData.push({
              id: `${device.id}-${measurement.id}`,
              date: randomDate,
              deviceName: device.title,
              measurement: measurement.title,
              ticketNumber: '',
              status: 'รอแจ้งซ่อม'
            });
          });
        });
      }
      
      let filteredData = mockData;
      if (selectedStatus.value !== 'all') {
        const statusMap = {
          'pending': 'รอแจ้งซ่อม',
          'completed': 'ดำเนินการเสร็จสิ้น'
        };
        filteredData = mockData.filter(item => item.status === statusMap[selectedStatus.value]);
      }
      
      if (startDateObj || adjustedEndDateObj) {
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.date);
          
          const afterStart = startDateObj ? itemDate >= startDateObj : true;
          const beforeEnd = adjustedEndDateObj ? itemDate < adjustedEndDateObj : true;
          
          return afterStart && beforeEnd;
        });
      }
      
      results.value = filteredData;
      showTable.value = true;
    };
    
    const generateDateInRange = (startDate, endDate) => {
      const now = new Date();
      
      let start = startDate;
      let end = endDate;
      
      if (!start && !end) {
        start = new Date(now);
        start.setDate(start.getDate() - 30);
        end = now;
      } else if (start && !end) {
        end = now;
      } else if (!start && end) {        
        start = new Date(end);
        start.setDate(start.getDate() - 30);
      }

      const timeDiff = end.getTime() - start.getTime();
      return new Date(start.getTime() + Math.random() * timeDiff);
    };
    
    const downloadReport = () => {
      alert('Downloading report...');
      // Implement download functionality
    };
    
    const openEditDialog = (item) => {
      editedIndex.value = results.value.findIndex(r => r.id === item.id);
      editedItem.value = Object.assign({}, item);
      originalTicketNumber.value = item.ticketNumber || '';
      dialog.value = true;
    };
    
    const closeDialog = () => {
      dialog.value = false;
      editedItem.value = {};
      editedIndex.value = -1;
    };
    
    const saveTicket = () => {
      if (editedIndex.value > -1) {
        results.value[editedIndex.value].ticketNumber = editedItem.value.ticketNumber;
        results.value[editedIndex.value].status = 'ดำเนินการเสร็จสิ้น';
        results.value[editedIndex.value].date = new Date();
      }
      closeDialog();
    };
    
    const formatDate = (date) => {
      if (!date) return '';
      
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return {
      selectedVehicle,
      selectedDevice,
      selectedMeasurement,
      selectedStatus,
      startDate,
      endDate,
      vehicleList,
      deviceList,
      measurementList,
      statusList,
      results,
      showTable,
      dialog,
      editedItem,
      onVehicleChange,
      onDeviceChange,
      resetFilters,
      searchRecords,
      downloadReport,
      openEditDialog,
      closeDialog,
      saveTicket,
      formatDate,
      originalTicketNumber,
    };
  }
}
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
  font-size: 20px;
  font-weight: 600;
}

.cancel-btn {
  background-color: var(--red);
  color: var(--white);
  border-radius: 10px;
}

.search-btn {
  background-color: var(--light-blue);
  color: var(--white);
  border-radius: 10px;  
}

.download-btn {
  background-color: var(--yellow);
  color: var(--white);
  border-radius: 10px;  
}

.card-dialog {
  font-family: 'Sarabun', sans-serif;
  font-size: 20px;
}

.title-field {
  font-family: 'Poppins', sans-serif;
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

.cancel-btn {
  background-color: var(--red);
  color: var(--white);
  border-radius: 14px;
  padding: 0px 20px;
}

.save-btn {
  background-color: var(--primary);
  color: var(--white);
  border-radius: 14px;
  padding: 0px 20px;
}
</style>