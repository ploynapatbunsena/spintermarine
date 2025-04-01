<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container>
      <v-row v-if="barge && item">
        <!-- Title อยู่ตรงกลางหน้า -->
        <v-col cols="12" class="position-relative d-flex align-center">
          <div style="width: 80px;"></div>
          <div class="title flex-grow-1 text-center">{{ item.title }}</div>
          <div style="width: 80px;">
            <AlertFunction :item="item"/>
          </div>
        </v-col>

        <!-- คอลัมน์แรก: 4 Gauge 2x2 -->
        <v-col cols="6">
          <v-row>
            <v-col cols="6">
              <v-card class="gauge-card">
                <GagueChart
                  title="Act Power"
                  :value="250"
                  :maxValue="300"
                  :delimiters="[
                    (200 / 300) * 100,
                    (250 / 300) * 100
                  ]"
                  :colors="[
                    '#3DCC5B',
                    '#FFD54F', 
                    '#F44336'
                  ]"
                  :labels="['200', '250']"
                  :rangeLabel="['0', '300']"
                  centralLabel="250 kW"
                />
              </v-card>
            </v-col>
            <v-col cols="6">
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
          </v-row>
          <v-row>
            <v-col cols="6">
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
            <v-col cols="6">
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
        </v-col>

        <!-- คอลัมน์ที่สอง: General Info -->
        <v-col cols="6">
          <v-card class="rounded-xl h-100">
            <v-card-title class="d-flex justify-center my-4 font-weight-bold">General Information</v-card-title>
            <v-card-text class="px-10">
              <GeneralInfo />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- image generator -->
      <v-row>
        <v-col cols="6">
          <v-card class="rounded-xl gen-img">
            <GeneratorImage />
          </v-card>
        </v-col>
        <!-- notification table -->
         <v-col cols="6">
          <v-card class="pa-2 rounded-xl">
            <NoticeTable />
          </v-card> 
         </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { barges } from '@/data/config';
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import GagueChart from '@/components/GeneratorDetails/GagueChart.vue';
import GeneralInfo from '@/components/GeneratorDetails/GeneralInfo.vue';
import GeneratorImage from '@/components/GeneratorDetails/GeneratorImage.vue';
import NoticeTable from '@/components/GeneratorDetails/NoticeTable.vue';
import AlertFunction from '@/components/BargeDetails/AlertFunction.vue';

export default {
  props: ['id', 'itemId'],
  components: {
    NavigationBar,
    SpaceBar,
    GagueChart,
    GeneralInfo,
    GeneratorImage,
    NoticeTable,
    AlertFunction
  },
  computed: {
    barge() {
      return barges.find(barge => barge.id === this.id) || null;
    },
    item() {
      return this.barge?.items.find(item => item.id === this.itemId) || null;
    }
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.gauge-card {
  border-radius: 24px;
  height: 242px;
}

.gen-img {
  background-color: var(--bg-gen);
  padding: 20px;
}

</style>
