<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container>
      <div class="title">ChartHistorical Report</div>

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
                density="comfortable"
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
                density="comfortable"
                :disabled="!selectedVehicle"
              ></v-select>
            </v-col>
            <!-- Measuremnet -->
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedMeasurement"
                :items="measurementList"
                item-title="title"
                item-value="id"
                label="Measurement"
                variant="outlined"
                density="comfortable"
                :disabled="!selectedDevice"
              ></v-select>
            </v-col>
            <!-- Date Pickers -->
            <!-- Start Date -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <!-- End Date -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="endDate"
                label="End Date"
                type="date"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <!-- Interval -->
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedInterval"
                :items="intervalList"
                item-title="title"
                item-value="id"
                label="Interval"
                variant="outlined"
                density="comfortable"
              ></v-select>
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
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import { computed, ref } from 'vue';
import { barges, tugboats } from '@/data/config.js';
import '@/assets/colors.scss'

export default {
  name: 'ChartHistorical',
  components: {
    NavigationBar,
    SpaceBar,
  },

  setup() {
    const selectedVehicle = ref(null);
    const selectedDevice = ref(null);
    const selectedMeasurement = ref(null);
    const selectedInterval = ref(null);
    const startDate = ref('');
    const endDate = ref('');
    const showResult = ref(false);

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
          { id: "all", title: "Select All" },
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
          { id: "all", title: "Select All" },
          ...selectedBargeData.items.map(item => ({
            id: item.id,
            title: item.title
          }))
        ]
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

    const intervalList = computed(() => {
      const intervals = [];
      for (let i = 5; i <= 60; i += 5) {
        intervals.push({
          id: i,
          title: `${i} นาที`
        });
      }
      return intervals;
    });

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
      selectedInterval.value = null;
      startDate.value = '';
      endDate.value = '';
      showResult.value = false;
    };

    const searchRecords = () => {
      return null;
    };

    const downloadReport = () => {

    };

    return {
      selectedVehicle,
      selectedDevice,
      selectedMeasurement,
      selectedInterval,
      startDate,
      endDate,
      vehicleList,
      deviceList,
      measurementList,
      intervalList,
      onVehicleChange,
      onDeviceChange,
      resetFilters,
      searchRecords,
      downloadReport,
    };
  }
}
</script>

<style scoped>
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

</style>