<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container>
      <v-row v-if="tugboat" class="d-flex align-center">
        <v-col cols="12" class="position-relative d-flex align-center">
          <div style="width: 80px;"></div>
          <div class="title flex-grow-1 text-center">{{ tugboat.name }}</div>
          <div style="width: 80px;">
            <AlertFunction :tugboat="tugboat"/>
          </div>
        </v-col>
        <v-col cols="12"> 
          <v-row>
            <!-- Map --> 
            <v-col cols="3" class="d5-flex justify-center align-center">
              <v-card class="card-map rounded-xl" elevation="1" :to="{ name: 'GPS_Tracker', params: 'id' }">
                <p class="card-title">ตำแหน่งเรือ</p>
                <div id="mapContainer">
                  <v-img :src="require('@/assets/Icons/compass_map.svg')" style="z-index: 999; width: 130px; top: 32px;"></v-img>
                </div>
              </v-card>
            </v-col>
            <v-col>
              <!-- Gauge Chart -->
              <v-row>
                <v-col>
                  <v-card class="gauge-card">
                    <GagueChart
                      title="Water Temperature"
                      :value="80" 
                      :maxValue="100"
                      :delimiters="[
                        (92 / 100) * 100,
                        (95 / 100) * 100,
                      ]"
                      :colors="[
                        '#3DCC5B',
                        '#FFD54F', 
                        '#F44336'
                      ]"
                      :labels="['92°', '95°']"
                      :rangeLabel="['0', '100']"
                      centralLabel="80°"
                    />
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="gauge-card">
                    <GagueChart
                      title="Oil Pressure"
                      :value="0.6"
                      :maxValue="10"
                      :delimiters="[
                        (1 / 10) * 100,
                        (2 / 10) * 100,
                      ]"
                      :colors="[
                        '#F44336',
                        '#FFD54F', 
                        '#3DCC5B'
                      ]"
                      :labels="['1', '2']"
                      :rangeLabel="['0', '10']"
                      centralLabel="0.6 bar"
                    />
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="gauge-card">
                    <GagueChart
                      title="RPM"
                      :value="1550"
                      :maxValue="2000"
                      :delimiters="[
                        (1850 / 2000) * 100,
                        (1900 / 2000) * 100,
                      ]"
                      :colors="[
                        '#3DCC5B',
                        '#FFD54F',
                        '#F44336',
                      ]"
                      :labels="['1850', '1900']"
                      :rangeLabel="['0', '2000']"
                      centralLabel="1550 RPM"
                    />
                  </v-card>
                </v-col>
              </v-row>
              <!-- General Info -->
              <v-row>
                <v-col cols="12">
                  <v-card class="tugboat-info rounded-xl">
                    <GeneralInfo />
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card class="pa-2 rounded-xl">
                <FuelTank />
              </v-card>
            </v-col>
            <v-col>
              <v-card class="pa-2 rounded-xl">
                <NoticeTable />
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import { tugboats } from '@/data/config';
import { onMounted, ref,  computed} from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconUrl from '@/assets/Images/ship_location.png';
import GagueChart from '@/components/GeneratorDetails/GagueChart.vue';
import GeneralInfo from '@/components/TugboatDetails/GeneralInfo.vue';
import FuelTank from '@/components/TugboatDetails/FuelTank.vue';
import NoticeTable from '@/components/GeneratorDetails/NoticeTable.vue';
import AlertFunction from '@/components/AlertFunction.vue';

export default {
  props: ['id'],
  components: {
    NavigationBar,
    SpaceBar,
    GagueChart,
    GeneralInfo,
    FuelTank,
    NoticeTable,
    AlertFunction,
  },

  setup(props) {
    const map = ref(null);
    const marker = ref(null);
    const position = ref(null);

    // ฟังก์ชั่นสำหรับสร้างตำแหน่งแบบสุ่ม
    const generateRandomPosition = () => {
      // พิกัดในบริเวณอ่าวไทย (ตัวอย่างเท่านั้น)
      const lat = 13.0 + Math.random() * 2; // ประมาณกรุงเทพ ถึงชลบุรี
      const lng = 100.0 + Math.random() * 2; // ประมาณอ่าวไทย
      return [lat, lng];
    };

    // ฟังก์ชั่นสำหรับอัพเดทตำแหน่ง
    const updatePosition = () => {
      position.value = generateRandomPosition();
      
      if (marker.value) {
        marker.value.setLatLng(position.value);
      } else if (map.value) {
        // สร้าง custom icon
        const shipIcon = L.icon({
          iconUrl: markerIconUrl,
          iconSize: [52, 52],
          iconAnchor: [32, 32],
          popupAnchor: [0, -16]
        });
        
        // เพิ่ม marker บนแผนที่
        marker.value = L.marker(position.value, { icon: shipIcon }).addTo(map.value);
        marker.value.bindPopup("ตำแหน่งเรือ: " + position.value[0].toFixed(4) + ", " + position.value[1].toFixed(4));
      }
      
      // ปรับตำแหน่งแผนที่ให้เห็น marker
      if (map.value) {
        map.value.setView(position.value, 10);
      }
    };

    onMounted(() => {
      // ต้องรอให้ DOM พร้อมก่อนสร้างแผนที่
      setTimeout(() => {
        // สร้างแผนที่
        map.value = L.map('mapContainer').setView([13.7563, 100.5018], 8);
        
        // เพิ่ม tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map.value);
        
        // สร้างตำแหน่งเริ่มต้น
        updatePosition();
        
        // จำลองการอัพเดทตำแหน่งทุก 10 วินาที
        const intervalId = setInterval(updatePosition, 10000);
        
        // ทำความสะอาด interval เมื่อ component ถูกทำลาย
        return () => {
          clearInterval(intervalId);
          if (map.value) {
            map.value.remove();
          }
        };
      }, 100);
    });

    return {
      tugboat: computed(() => {
        return tugboats.find(tugboat => tugboat.id === props.id) || null;
      })
    };
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: 600;
}

.card-map {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 12px;
}

.card-title {
  font-family: 'Sarabun', sans-serif;
  font-weight: 500;
  color: var(--dark-gray);
  margin-bottom: 8px;
}

#mapContainer {
  width: 400px;
  height: 450px;
  border-radius: 16px;
  z-index: 0;
}

.gauge-card {
  border-radius: 24px;
  height: 242px;
}

.tugboat-info {
  height: 242px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>