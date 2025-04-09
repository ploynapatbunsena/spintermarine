<template>
  <v-container>
    <v-row>
      <!-- Running Hour6 -->
      <v-col class="d-flex align-center card">
        <div class="icon running-hour">
          <v-icon style="font-size: 5vh;" icon="mdi-clock-outline"></v-icon>
        </div>
        <div class="text-side">
          <p class="text-grey">Running Hour</p>
          <p class="text-value">0 hour</p>
        </div>
      </v-col>
      <!-- Battery -->
      <v-col class="d-flex align-center card">
        <div class="icon battery-volts">
          <span class="material-symbols-rounded">charger</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Battery Volts</p>
          <p class="text-value">0 V</p>
        </div>
      </v-col>
      <!-- Wind Speed -->
      <v-col class="d-flex align-center card">
        <div class="icon wind-speed">
          <v-icon style="font-size: 5vh;" icon="mdi-weather-windy"></v-icon>
        </div>
        <div class="text-side">
          <p class="text-grey">Wind Speed</p>
          <p class="text-value">0 km/hr</p>
        </div>
      </v-col>
    </v-row>
    <!-- roe 2 -->
    <v-row>
      <!-- %Throttle -->
      <v-col class="d-flex align-center card">
        <div class="icon throttle">
          <span class="material-symbols-rounded">speed</span>
        </div>
        <div class="text-side">
          <p class="text-grey">%Throttle</p>
          <p class="text-value">0%</p>
        </div>
      </v-col>
      <!-- Total Fuel Consumption -->
      <v-col class="d-flex align-center card">
        <div class="icon total-fuel">
          <span class="material-symbols-rounded">oil_barrel</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Total Fuel Consumption</p>
          <p class="text-value">0 L</p>
        </div>
      </v-col>
      <!-- Fuel Rate -->
      <v-col class="d-flex align-center card">
        <div class="icon fuel-rate">
          <span class="material-symbols-rounded">speed</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Fuel Rate</p>
          <p class="text-value">0 m³/h </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '@/assets/colors.scss'

export default {
  name: 'GeneralInfo',
}
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid var(--bg-soline);
  border-radius: 20px;
  margin: 12px;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6vh;
  height: 6vh;
  border-radius: 1.5vh;
}

.material-symbols-rounded {
  font-size: 5vh;
}

.running-hour {
  background-color: var(--bg-blue);
  color: var(--symbol-blue);
}

.battery-volts {
  background-color: var(--bg-lightsky);
  color: var(--symbol-lightsky);
}

.wind-speed {
  background-color: var(--bg-wind);
  color: var(--white);
}

.throttle {
  background-color: var(--light-red);
  color: var(--red);
}

.total-fuel {
  background-color: var(--bg-mint);
  color: var(--symbol-mint);
}

.fuel-rate {
  background-color: var(--bg-yellow);
  color: var(--symbol-yellow);
}

.text-side {
  display: flex;
  flex-direction: column;
  margin-left: 24px;
}

.text-grey {
  color: var(--gray);
  font-size: 1.5vh;
}

.text-value {
  color: var(--black);
  font-size: 2.5vh;
  font-weight: 600;
}

</style>