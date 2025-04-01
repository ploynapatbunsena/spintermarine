<template>
  <v-row>
    <v-col cols="3">
      <div class="indicator" :style="getStyle(thermalComfort, 26.5)">
        Thermal<br>Comport
      </div>
    </v-col>
    <v-col cols="3">
      <div class="indicator" :style="getStyle(co2, 2000)">CO2</div>
    </v-col>
    <v-col cols="3">
      <div class="indicator" :style="getStyle(pm25, 37.5)">PM2.5</div>
    </v-col>
    <v-col cols="3">
      <div class="indicator" :style="getStyle(tvocs, 2000)">TVOCs</div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Indicator",
  data() {
    return {
      thermalComfort: this.getRandomValue(20, 30),
      co2: this.getRandomValue(400, 2000),
      pm25: this.getRandomValue(10, 50),
      tvocs: this.getRandomValue(100, 2500),
    }
  },

  methods: {
    getStyle(value, threshold) {
      return {
        backgroundColor: value > threshold ? "#e3e5dd" : "#84c299",
        color: value > threshold ? "#464647" : "#FFFFFF",
        textAlign: "center",
      }
    },

    getRandomValue(min,max) {
      return Math.random() * (max - min) + min;
    },

    updateValues() {
      this.thermalComfort = this.getRandomValue(20, 30);
      this.co2 = this.getRandomValue(400, 2000);
      this.pm25 = this.getRandomValue(10, 50);
      this.tvocs = this.getRandomValue(100, 2500);
    }
  },

  mounted() {
    this.interval = setInterval(this.updateValues, 7000);
  },

  beforeUnmount() {
    clearInterval(this.interval);
  }
};
</script>

<style scoped>
.indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 130px;
  border: 1px solid #ddd;
  font-size: 28px;
  line-height: 32px;
  font-weight: 400;
}
</style>