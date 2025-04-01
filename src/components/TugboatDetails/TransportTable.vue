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
                    <p class="text-value">1450 RPM</p>
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
                    <p class="text-value">80 km/h</p>
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
                    <p class="text-value">13%</p>
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
                    <p class="text-value">9 km/h</p>
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

<script>
import '@/assets/colors.scss'

export default {
  props: {
    selectedBoat: Object, // รับข้อมูลเรือยนต์จาก GPSVessel.vue
  },
  name: 'TransportTable',
  data() {
    return {
      localSelectedBoat: this.selectedBoat,
      selectedVessel: null,
      headers: [
        { title: 'Barge Name', key: 'bargeName' },
        { title: 'Origin', key: 'origin' },
        { title: 'Destination', key: 'destination' },
        { title: 'Vessel', key: 'vessel' },
        { title: 'Job Order', key: 'jobOrder' },
        { title: 'Cargo', key: 'cargo' },
        { title: 'ETA', key: 'eta' },
      ],
      vesselHeaders: [
        { title: 'Tugboat Name', key: 'tugboatName' },
        { title: 'Vessel', key: 'vessel' },
        { title: 'Job Order', key: 'jobOrder' },
        { title: 'Cargo', key: 'cargo' },
      ],
      vessels: [
        "MV. SMOOTH SEA",
        "MV. GOLDEN FLAVOR GROUP",
        "MV. ALIKI FORCE",
        "MV. VENETIA",
      ],
      vesselData: {
        "MV. SMOOTH SEA": [
          { tugboatName: 'Tugboat A', vessel: 'MV. SMOOTH SEA', jobOrder: 'JO-001', cargo: 'Coal', },
          { tugboatName: 'Tugboat B', vessel: 'MV. SMOOTH SEA', jobOrder: 'JO-002', cargo: 'Wood', }
        ],
          "MV. GOLDEN FLAVOR GROUP": [
            { tugboatName: 'Tugboat C', vessel: 'MV. GOLDEN FLAVOR GROUP', jobOrder: 'JO-003', cargo: 'Rice', },
            { tugboatName: 'Tugboat D', vessel: 'MV. GOLDEN FLAVOR GROUP', jobOrder: 'JO-004', cargo: 'Wheat', }
          ],
        "MV. ALIKI FORCE": [
          { tugboatName: 'Tugboat E', vessel: 'MV. ALIKI FORCE', jobOrder: 'JO-005', cargo: 'Steel', },
          { tugboatName: 'Tugboat F', vessel: 'MV. ALIKI FORCE', jobOrder: 'JO-006', cargo: 'Aluminum', }
        ],
        "MV. VENETIA": [
          { tugboatName: 'Tugboat G', vessel: 'MV. VENETIA', jobOrder: 'JO-007', cargo: 'Oil', },
          { tugboatName: 'Tugboat H', vessel: 'MV. VENETIA', jobOrder: 'JO-008', cargo: 'Gas', },
          { tugboatName: 'Tugboat I', vessel: 'MV. VENETIA', jobOrder: 'JO-009', cargo: 'Fertilizer', }
        ]
      }
    };
  },

  watch: {
    // เมื่อ prop selectedBoat เปลี่ยน ให้อัพเดท localSelectedBoat และรีเซ็ต selectedVessel
    selectedBoat: {
      handler(newVal) {
        if (newVal) {
          this.localSelectedBoat = newVal;
          this.selectedVessel = null;
        }
      },
      immediate: true
    }
  },

  computed: {
    isBoatSelected() {
      return this.localSelectedBoat !== null && this.selectedVessel === null;
    },

    isVesselSelected() {
      return this.selectedVessel !== null;
    }
  },

  methods: {
    toggleVessel(vessel) {
      if (this.selectedVessel === vessel) {
        // ถ้าคลิกที่เรือที่เลือกอยู่แล้ว ให้ยกเลิกการเลือก
        this.selectedVessel = null;
        
        // ถ้ามี selectedBoat จากพาเรนต์ ให้แสดงข้อมูลนั้นแทน
        if (this.selectedBoat) {
          this.localSelectedBoat = this.selectedBoat;
        }
      } else {
        // เลือกเรือใหม่ และซ่อนข้อมูล selectedBoat
        this.selectedVessel = vessel;
        this.localSelectedBoat = null;
      }
    },

    getVesselData(vessel) {
      return this.vesselData[vessel] || [];
    }
  }
}
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