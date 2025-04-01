<template>
  <v-app>
    <div class="dashboard-background"></div>
    <v-row style="z-index: 1; padding: 64px;">
      <!-- Left Side -->
      <v-col cols="4" class="d-flex flex-column justify-end">
        <v-card class="left-side" elevation="0">
          <BuildingMeasurement
            :totalPeople="totalPeople"
            :totalEnergy="totalEnergy"
            :totalThermal="totalThermal"
            :totalCO2="totalCO2"
            :totalPM25="totalPM25"
            :totalTVOCS="totalTVOCS"
          />
        </v-card>
      </v-col>

      <v-col cols="4"></v-col>
      <!-- Right Side -->
      <v-col cols="4" class="d-flex flex-column align-end" >
        <v-row>
          <v-col cols="12" style="padding: 0px;">
            <CandleStick @update-total="updateTotal"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import CandleStick from '@/components/ArchDashboard/CandleStick.vue';
import BuildingMeasurement from '@/components/ArchDashboard/BuildingMeasurement.vue';

export default {
  name: "ArchDashboard",
  components: {
    CandleStick,
    BuildingMeasurement
  },

  data() {
    return {
      totalPeople: 0,
      totalEnergy: 0,
      totalThermal: 0,
      totalCO2: 0,
      totalPM25: 0,
      totalTVOCS: 0,
    };
  },

  methods: {
    updateTotal(data) {
      this.totalPeople = data.totalPeople;
      this.totalEnergy = data.totalEnergy;
      this.totalThermal = data.totalThermal;
      this.totalCO2 = data.totalCO2;
      this.totalPM25 = data.totalPM25;
      this.totalTVOCS = data.totalTVOCS;
    }
  },
};
</script>

<style scoped>
* {
  font-family: 'Segoe UI', sans-serif;
  overflow: hidden;
}

.dashboard-background {
  background-image: url('../../assets/Images/Dashboard_Background.png');
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.left-side {
  width: 1200px;
  height: 1300px;
  background-color: transparent;
}

.right-side {
  width: 950px;
  height: 450px;
  background-color: transparent;
}
</style>
