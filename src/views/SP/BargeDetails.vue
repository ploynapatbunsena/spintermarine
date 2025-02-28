<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container class="d-flex align-center justify-center">
      <v-row v-if="barge" class="d-flex align-center justify-center">
        <div class="title my-8">{{ barge.name }}</div>
        <v-col cols="12" class="d-flex justify-center">
          <v-card elevation="0" class="background">
            <v-row>
              <v-col
                v-for="item in barge.items.slice(0, 5)" 
                :key="item.id"
                class="d-flex justify-center"
                cols="auto"
              >
                <v-card
                  class="gen-card pa-0 d-flex flex-column align-center" 
                  @click="goToItemDetail(item.id)"
                >
                  <div class="gen-status" :class="getStatusClass(item.status)">
                    <span 
                      class="material-symbols-rounded status-icon" 
                      :class="getStatusClass(item.status)"
                    >
                      {{ getStatusIcon(item.status) }}
                    </span>
                    <p class="gen-name">{{ item.title }}</p>
                  </div>
                  <v-img
                    :src="require('@/assets/Images/generator.png')"
                    class="gen-img"
                  />
                  <div class="gen-details">
                    <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                      <v-col cols="8">Act Power</v-col>
                      <v-col cols="4">270</v-col>
                    </v-row>
                    <v-row no-gutters class="column-detail">
                      <v-col cols="8">RPM</v-col>
                      <v-col cols="4">2098</v-col>
                    </v-row>
                    <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                      <v-col cols="8">Coolant temp</v-col>
                      <v-col cols="4">65°C</v-col>
                    </v-row>
                    <v-row no-gutters class="column-detail">
                      <v-col cols="8">Oil Pressure</v-col>
                      <v-col cols="4">0.8 bar</v-col>
                    </v-row>
                    <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                      <v-col cols="8">Fuel Consumption/hr</v-col>
                      <v-col cols="4">3.7 Lt.</v-col>
                    </v-row>
                  </div>
                </v-card>  
              </v-col>

              <!-- คอลัมน์ "Crane" ที่ขนาด 1114x542 px -->
              <v-col class="d-flex justify-center" cols="auto">
                <v-card class="crane-card" elevation="0">
                  <div class="d-flex justify-space-between align-center">
                    <p class="header ml-4">Crane</p>
                    <router-link :to="{ name: 'StatusEditForm', params: { id: barge.id } }">
                      <v-icon icon="mdi-pencil-outline" class="edit"></v-icon>
                    </router-link>
                  </div>
                  <v-row class="mx-2">
                    <v-col
                      v-for="crane in barge.cranes"
                      :key="crane.id"
                      cols="4">
                      <!-- Card - Crane -->
                      <v-card class="d-flex flex-column align-center rounded-lg">
                        <div
                          class="crane-title"
                          :class="getStatusClass(crane.status)"
                        >{{ crane.title }}</div>
                        <v-img
                          :src="require('@/assets/Images/crane.png')"
                          class="crane-img"
                          cover
                        ></v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                  <!-- Status Summary -->
                  <v-row class="d-flex mx-2">
                    <v-col cols="4">
                      <v-card>
                        <div class="d-flex justify-space-between align-center mx-4 my-2">
                          <p class="text-status">Standby</p>
                          <span class="text-blue">{{ craneStatusCount.standby }}</span>
                        </div>
                        <div class="bottom-line-blue"></div>
                      </v-card>
                    </v-col>
                    <v-col cols="4">
                      <v-card>
                        <div class="d-flex justify-space-between align-center mx-4 my-2">
                          <p class="text-status">Running</p>
                          <span class="text-green">{{ craneStatusCount.running }}</span>
                        </div>
                        <div class="bottom-line-green"></div>
                      </v-card>
                    </v-col>
                    <v-col cols="4">
                      <v-card>
                        <div class="d-flex justify-space-between align-center mx-4 my-2">
                          <p class="text-status">Maintenance</p>
                          <span class="text-black">{{ craneStatusCount.maintenance }}</span>
                        </div>
                        <div class="bottom-line-black"></div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <!-- Row ที่สองของ Generator -->
            <v-row>
              <v-col
                v-for="item in barge.items.slice(5, 10)"
                :key="item.id"
                class="d-flex justify-center"
                cols="auto"
              >
                <v-card 
                  class="gen-card pa-0 d-flex flex-column align-center" 
                  @click="goToItemDetail(item.id)"
                >
                <!-- สีกรอบแสดงสี status -->
                  <div class="gen-status" :class="getStatusClass(item.status)">
                    <span 
                      class="material-symbols-rounded status-icon" 
                      :class="getStatusClass(item.status)"
                    >
                      {{ getStatusIcon(item.status) }}
                    </span>
                    <p class="gen-name">{{ item.title }}</p>
                  </div>
                  <v-img
                    :src="require('@/assets/Images/generator.png')"
                    class="gen-img"
                  />
                  <div class="gen-details">
                    <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                      <v-col cols="8">Act Power</v-col>
                      <v-col cols="4">270</v-col>
                    </v-row>
                    <v-row no-gutters class="column-detail">
                      <v-col cols="8">RPM</v-col>
                      <v-col cols="4">2098</v-col>
                    </v-row>
                    <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                      <v-col cols="8">Coolant temp</v-col>
                      <v-col cols="4">65°C</v-col>
                    </v-row>
                    <v-row no-gutters class="column-detail">
                      <v-col cols="8">Oil Pressure</v-col>
                      <v-col cols="4">0.8 bar</v-col>
                    </v-row>
                    <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                      <v-col cols="8">Fuel Consumption/hr</v-col>
                      <v-col cols="4">3.7 Lt.</v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>

              <!-- เพิ่มคอลัมน์เปล่าเมื่อมี items น้อยกว่า 10 -->
              <template v-if="barge.items.length < 10">
                <v-col
                  v-for="i in 10 - barge.items.length"
                  :key="`empty-${i}`"
                  class="d-flex justify-center"
                  cols="auto"
                >
                  <v-card class="gen-card pa-0 d-flex flex-column align-center" style="visibility: hidden;">
                    <!-- คอลัมน์เปล่า -->
                  </v-card>
                </v-col>
              </template>

              <!-- คอลัมน์ "Gasoline Tank" ที่ขนาด 1114x542 px -->
              <v-col class="d-flex justify-center" cols="auto">
                <v-card class="gasoline-card" elevation="0">
                  <GasolineTank />
                </v-card>
              </v-col>
            </v-row>

            <!-- Row ที่สามของ Generator -->
            <v-row>
              <!-- Tilt Barge -->
              <v-col cols="auto">
                <v-card class="pa-4 rounded-xl" style="height: 100%;">
                  <p class="tilt-header mb-3">ระดับความเอียงทุ่น</p>
                  <!-- Barge Img -->
                  <v-row>
                    <v-col>
                      <v-img class="bg_barge" :src="require('@/assets/Images/bg_barge_tilt.png')">
                        <v-img class="barge-img" :src="require('@/assets/Images/barge_front.png')"></v-img>
                      </v-img>
                    </v-col>
                    <v-col>
                      <v-img class="bg_barge" :src="require('@/assets/Images/bg_barge_tilt.png')">
                        <v-img cover :src="require('@/assets/Images/barge_side.png')"></v-img>
                      </v-img>
                    </v-col>
                  </v-row>
                  <!-- Gauge Chart -->
                  <v-row>
                    <v-col class="gauge-chart">
                      <GaugeTiltLevel label="X" :value="2" />
                    </v-col>
                    <v-col class="gauge-chart">
                      <GaugeTiltLevel label="Y" :value="2" />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              
              <!-- Map -->
              <v-col cols="auto">
                <v-card class="rounded-xl" style="height: 100%;">
                  <MapOfBarge />
                </v-card>
              </v-col>
              
              <!-- Notification Table-->
              <v-col cols="auto">
                <v-card class="pa-4 rounded-xl h-100">
                  <div class="d-flex justify-space-between align-center">
                    <p class="header ml-4">Notification</p>
                    <router-link :to="{ name: 'NotificationReport'}">
                      <v-icon icon="mdi-pencil-outline" class="edit"></v-icon>
                    </router-link>
                  </div>
                  <NoticeTable />
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <router-view />
    </v-container>
  </v-app>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import GasolineTank from '@/components/BargeDetails/GasolineTank.vue';
import GaugeTiltLevel from '@/components/BargeDetails/GaugeTiltLevel.vue';
import MapOfBarge from '@/components/BargeDetails/MapOfBarge.vue';
import NoticeTable from '@/components/NoticeTable.vue';
import { barges } from '@/data/config';
import '@/assets/colors.scss';

export default {
  props: ['id'],
  components: {
    NavigationBar,
    SpaceBar,
    GasolineTank,
    GaugeTiltLevel,
    MapOfBarge,
    NoticeTable
  },

  computed: {
    barge() {
      return barges.find(barge => barge.id === this.id) || null;
    },
    craneStatusCount() {
      if (!this.barge || !this.barge.cranes) return { standby: 0, running: 0, maintenance: 0 };

      return {
        standby: this.barge.cranes.filter(crane => crane.status === 'standby').length,
        running: this.barge.cranes.filter(crane => crane.status === 'running').length,
        maintenance: this.barge.cranes.filter(crane => crane.status === 'maintenance').length,
      };
    },

    virtualNotices () {
      return [...Array(10).keys()].map(i => {
        const notice = { ...this.notices[i % this.notices.length] }
        notice.name = `${notice.name} #${i}`
        return notice
      })
    },
  },

  methods: {
    goToItemDetail(itemId) {
      this.$router.push(`/Barge/${this.id}/${itemId}`);
    },

    getStatusClass(status) {
      switch (status) {
        case 'standby':
          return 'status-standby'
        case 'running':
          return 'status-running';
        case 'standby-maintenance':
          return 'status-standby-maintenance'
        case 'running-maintenance':
          return 'status-running-maintenance'
        case 'down':
        case 'maintenance': 
          return 'status-down';
        case 'warning':
          return 'status-warning';
        case 'danger':
          return 'status-danger';
        default:
          return '';
      }
    },

    getStatusIcon(status) {
      switch (status) {
        case "running-maintenance":
          return "construction";
        case "standby-maintenance":
          return "construction";
        default:
          return "";
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 600;
}

.background {
  width: 3764px;
  height: 1860px;
  padding: 24px;
}

.gen-card {
  width: 483px;
  height: 542px;
  background: white;
  border-radius: 8px;
}

.gen-img {
  width: 340px;
  height: 172px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gen-status {
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gen-name {
  text-align: center;
  font-size: 24px;
  color: #FFFFFF;
}

.gen-details {
  font-size: 24px;
  width: 100%;
}

.column-detail {
  width: 100%;
  height: 54px;
  padding-left: 24px;
}

.header  {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 16px;
}

.crane-card {
  margin-left: 24px;
  width: 1114px;
  height: 542px;
  border-radius: 24px;
}

.crane-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  width: 100%;
  height: 64px;
  color: #FFFFFF;
}

.crane-img {
  width: 226px;
  height: 270px;
  margin: 16px 0;
}

.crane-status {
  font-size: 18px;
  font-weight: bold;
  text-transform: capitalize;
}

.status-summary {
  margin-top: 24px;
  font-size: 18px;
  font-weight: bold;
}

.gasoline-card {
  width: 1114px;
  height: 542px;
  margin-left: 24px;
  background: #F0F0F0;
  border-radius: 24px; 
}

.status-standby {
  background-color: var(--sky);
}

.status-running {
  background-color: var(--dark-green);
}

.status-standby-maintenance {
  background-color: var(--primary);
}

.status-running-maintenance {
  background-color: var(--light-green);
}

.status-down {
  background-color: var(--black);
}

.status-warning {
  background-color: var(--yellow);
}

.status-danger {
  background-color: var(--red);
}

.material-symbols-rounded {
  font-size: 48px;
  color: var(--white);

  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

.text-blue {
  font-family: 'Inter', serif;
  color: var(--sky);
  font-size: 40px;
}

.text-green {
  font-family: 'Inter', serif;
  color: var(--dark-green);
  font-size: 40px;
}

.text-black {
  font-family: 'Inter', serif;
  color: var(--black);
  font-size: 40px;
}

.crane-value {
  font-family: 'Inter', serif;
  font-size: 21px;
  font-weight: 600;
}

.bottom-line-blue {
  border: 6px solid var(--sky);
}

.bottom-line-green {
  border: 6px solid var(--dark-green);
}

.bottom-line-black {
  border: 6px solid var(--black);
}

.text-status {
  font-size: 24px;
  font-weight: 400;
}

.edit {
  width: 46px;
  height: 36px;
  border-radius: 24px;
  font-size: 32px;
  color: var(--symbol-blue);
  background-color: var(--bg-light-tugboat);
}

.tilt-header {
  font-family: 'Sarabun', serif;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
}

.barge-img {
  width: 380px;
  height: 298px;
}

.bg_barge {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 602px;
  height: 356px;
  border-radius: 16px;
}

.gauge-chart {
  width: 602px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wind-speed-card {
  width: 480px;
  height: 296px;
  background-color: var(--light-sky);
  padding: 24px;
  box-sizing: border-box;
}

.noti-report {
  width: 1114px;
  height: 542px;
}
</style>