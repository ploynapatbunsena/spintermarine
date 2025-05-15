<template>
  <v-container style="background-color: #F9FAFB;">
    <v-row>
      <v-col cols="3">
        <v-card class="card rounded-lg elevation-0">
          <div class="vessel-header">
            <v-card-title class="vessel-title">VESSEL</v-card-title>
            <v-chip class="vessel-status" prepend-icon="mdi-circle-medium">Running</v-chip>
          </div>
          <v-card-text>
            <div 
              class="vessel-list" 
              v-for="(vessel, index) in vessels" 
              :key="index"
              @click="toggleVessel(vessel)"
              :class="{ 'selected-vessel': selectedVessel === vessel }"
            >
              <v-icon icon="mdi-anchor" color="#194185"></v-icon>
              <span class="ml-2">{{ vessel }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card v-if="isBoatSelected" class="card rounded-lg elevation-0">
          <div>
            <v-card-title class="table-header">{{ selectedBoat?.name }}</v-card-title>
          </div>
          <v-card-text v-if="selectedBoat">
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="selectedBoat.data"
                  item-value="bargeName"
                  class="elevation-0 striped-table custom-table"
                  :items-per-page="3"
                  :footer-props="{
                    'items-per-page-options': [3],
                    'show-first-last-page': true,
                    'show-current-page': true
                  }"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{ item.bargeName }}</td>
                      <td>{{ item.origin }}</td>
                      <td>{{ item.destination }}</td>
                      <td>{{ item.vessel }}</td>
                      <td>{{ item.jobOrder }}</td>
                      <td>{{ item.cargo }}</td>
                      <td>{{ item.eta }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="py-0">
                <v-card class="d-flex align-center measurement-card elevation-0">
                  <div class="icon rpm">
                    <span class="material-symbols-rounded">avg_pace</span>
                  </div>
                  <div class="text-side">
                    <p class="text-grey">RPM</p>
                    <p class="text-value">{{ rpm.value }} {{ rpm.unit }}</p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="3" class="py-0">
                <v-card class="d-flex align-center measurement-card elevation-0">
                  <div class="icon speed">
                    <span class="material-symbols-rounded">swap_driving_apps_wheel</span>
                  </div>
                  <div class="text-side">
                    <p class="text-grey">Speed</p>
                    <p class="text-value">{{ speed.value }} {{ speed.unit }}</p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="3" class="py-0">
                <v-card class="d-flex align-center measurement-card elevation-0">
                  <div class="icon throttle">
                    <span class="material-symbols-rounded">speed</span>
                  </div>
                  <div class="text-side">
                    <p class="text-grey">%Throttle</p>
                    <p class="text-value">{{ throttle.value }} {{ throttle.unit }}</p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="3" class="py-0">
                <v-card class="d-flex align-center measurement-card elevation-0">
                  <div class="icon wind-speed">
                    <span class="material-symbols-rounded">air</span>
                  </div>
                  <div class="text-side">
                    <p class="text-grey">Wind Speed</p>
                    <p class="text-value">{{ windSpeed.value }} {{ windSpeed.unit }}</p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card v-if="isVesselSelected" class="card rounded-lg elevation-0">
          <div>
            <v-card-title class="table-header">{{ selectedVessel }}</v-card-title>
          </div>
          <v-card-text>
            <v-data-table
              :headers="vesselHeaders"
              :items="getVesselData(selectedVessel)"
              item-value="id"
              class="elevation-0 striped-table custom-table"
              hide-default-footer
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.tugboatName }}</td>
                  <td>{{ item.vessel }}</td>
                  <td>{{ item.jobOrder }}</td>
                  <td>{{ item.cargo }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template> 

<script setup>
import { ref, computed, watch } from 'vue';
import '@/assets/colors.scss';

const props = defineProps({
  selectedBoat: {
    type: Object,
    default: null,
  },
});

const localSelectedBoat = ref(props.selectedBoat);
const selectedVessel = ref(null);

const headers = [
  { title: 'Barge Name', value: 'bargeName' },
  { title: 'Origin', value: 'origin' },
  { title: 'Destination', value: 'destination' },
  { title: 'Vessel', value: 'vessel' },
  { title: 'Job Order', value: 'jobOrder' },
  { title: 'Cargo', value: 'cargo' },
  { title: 'ETA', value: 'eta' },
];

const vesselHeaders = [
  { title: 'Tugboat Name', value: 'tugboatName' },
  { title: 'Vessel', value: 'vessel' },
  { title: 'Job Order', value: 'jobOrder' },
  { title: 'Cargo', value: 'cargo' },
];

const vessels = [
  'MV. SMOOTH SEA',
  'MV. GOLDEN FLAVOR GROUP',
  'MV. ALIKI FORCE',
  'MV. VENETIA',
];

const vesselData = {
  'MV. SMOOTH SEA': [
    { tugboatName: 'Tugboat A', vessel: 'MV. SMOOTH SEA', jobOrder: 'JO-001', cargo: 'Coal' },
    { tugboatName: 'Tugboat B', vessel: 'MV. SMOOTH SEA', jobOrder: 'JO-002', cargo: 'Wood' },
  ],
  'MV. GOLDEN FLAVOR GROUP': [
    { tugboatName: 'Tugboat C', vessel: 'MV. GOLDEN FLAVOR GROUP', jobOrder: 'JO-003', cargo: 'Rice' },
    { tugboatName: 'Tugboat D', vessel: 'MV. GOLDEN FLAVOR GROUP', jobOrder: 'JO-004', cargo: 'Wheat' },
  ],
  'MV. ALIKI FORCE': [
    { tugboatName: 'Tugboat E', vessel: 'MV. ALIKI FORCE', jobOrder: 'JO-005', cargo: 'Steel' },
    { tugboatName: 'Tugboat F', vessel: 'MV. ALIKI FORCE', jobOrder: 'JO-006', cargo: 'Aluminum' },
  ],
  'MV. VENETIA': [
    { tugboatName: 'Tugboat G', vessel: 'MV. VENETIA', jobOrder: 'JO-007', cargo: 'Oil' },
    { tugboatName: 'Tugboat H', vessel: 'MV. VENETIA', jobOrder: 'JO-008', cargo: 'Gas' },
    { tugboatName: 'Tugboat I', vessel: 'MV. VENETIA', jobOrder: 'JO-009', cargo: 'Fertilizer' },
  ],
};

// Computed properties สำหรับดึง lastValue จาก Mesurement
const rpm = computed(() => {
  const measurement = props.selectedBoat?.Mesurement?.find(m => m.measurementname === 'RPM');
  return {
    value: measurement?.lastValue !== null ? parseFloat(measurement.lastValue).toFixed(0) : '0',
    unit: measurement?.measurementunit || 'RPM',
  };
});

const speed = computed(() => {
  const measurement = props.selectedBoat?.Mesurement?.find(m => m.measurementname === 'Speed');
  return {
    value: measurement?.lastValue !== null ? parseFloat(measurement.lastValue).toFixed(1) : '0',
    unit: measurement?.measurementunit || 'km/h',
  };
});

const throttle = computed(() => {
  const measurement = props.selectedBoat?.Mesurement?.find(m => m.measurementname === '%Throttle');
  return {
    value: measurement?.lastValue !== null ? parseFloat(measurement.lastValue).toFixed(0) : '0',
    unit: measurement?.measurementunit || '%',
  };
});

const windSpeed = computed(() => {
  const measurement = props.selectedBoat?.Mesurement?.find(m => m.measurementname === 'Wind-Speed');
  return {
    value: measurement?.lastValue !== null ? parseFloat(measurement.lastValue).toFixed(1) : '0',
    unit: measurement?.measurementunit || 'm/s',
  };
});

const isBoatSelected = computed(() => {
  return localSelectedBoat.value !== null && selectedVessel.value === null;
});

const isVesselSelected = computed(() => {
  return selectedVessel.value !== null;
});

// Methods
const toggleVessel = (vessel) => {
  if (selectedVessel.value === vessel) {
    // ถ้าคลิกที่เรือที่เลือกอยู่แล้ว ให้ยกเลิกการเลือก
    selectedVessel.value = null;
    // ถ้ามี selectedBoat จาก props ให้แสดงข้อมูลนั้นแทน
    if (props.selectedBoat) {
      localSelectedBoat.value = props.selectedBoat;
    }
  } else {
    // เลือกเรือใหม่ และซ่อนข้อมูล selectedBoat
    selectedVessel.value = vessel;
    localSelectedBoat.value = null;
  }
};

const getVesselData = (vessel) => {
  return vesselData[vessel] || [];
};

// Watch: อัปเดต localSelectedBoat และรีเซ็ต selectedVessel เมื่อ selectedBoat เปลี่ยน
watch(
  () => props.selectedBoat,
  (newVal) => {
    if (newVal) {
      localSelectedBoat.value = newVal;
      selectedVessel.value = null;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid var(--bg-soline);
  border-radius: 16px;
  padding-bottom: 8px;
}

.vessel-header {
  display: flex;
  align-items: center;
  background-color: #0B0E2C;
  height: 46px;
}

.vessel-title {
  color: var(--yellow);
  font-size: 24px;
}

.vessel-status {
  height: 24px;
  border: 1px solid #28A745;
  color: #28A745;
  background-color:  rgba(100, 221, 23, 0.16);
  font-size: 10px;
}

.vessel-list {
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 12px;
  font-family: 'Inter', sans-serif;
  margin-bottom: 12px;
  font-size: 16px;
}

.table-header {
  display: flex;
  align-items: center;
  background-color: #FAC12A;
  height: 46px;
  text-transform: uppercase;
  font-size: 24px;
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: var(--bg-row); /* สีสำหรับแถวคี่ */
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff; /* สีสำหรับแถวคู่ */
}

/* เปลี่ยนสีตัวหนังสือของ header */
.custom-table :deep(thead th) {
  color: var(--black);
  font-size: 16px;
}

/* เปลี่ยนสีตัวหนังสือของ item */
.custom-table :deep(tbody td) {
  color: var(--dark-gray);
  font-size: 14px;
}

/* เปลี่ยนสีตัวหนังสือของแถวเมื่อ hover */
.custom-table :deep(tbody tr:hover td) {
  color: var(--black);
}

/* เปลี่ยนสีพื้นหลังของแถวเมื่อ hover */
.custom-table :deep(tbody tr:hover) {
  background-color: #f0f0f0; /* สีเทาอ่อน */
}

.custom-table {
  border: 1px solid #E5E7EB;
}

:deep(.v-data-table th) {
  height: 40px !important;
}

:deep(.v-data-table td) {
  height: 30px !important;
}

.selected-vessel {
  background-color: #e3f2fd;
  font-weight: bold;
}

:deep(.v-data-table-footer__items-per-page) {
  display: none;
}

:deep(.v-data-table-footer) {
  padding: 0;
}

.material-symbols-rounded {
  font-size: 42px;
}

.measurement-card {
  border: 1px solid var(--bg-soline);
  border-radius: 6px;
  padding: 10px;
}

.text-side {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}

.text-grey {
  color: var(--gray);
  font-size: 12px;
}

.text-value {
  color: var(--black);
  font-size: 20px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 6px;
}

.rpm {
  background-color: #DFFFE7;
  color: #00C7BE;
}

.speed {
  background-color: #E6E5FF;
  color: #AF52DE;
}

.throttle {
  background-color: #FFEBEB;
  color: #FF4D4D;
}

.wind-speed {
  background-color: #96D2FF;
  color: #FFFFFF;
}
</style>