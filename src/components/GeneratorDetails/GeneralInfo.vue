<template>
  <v-container >
    <v-row class="ga-10 justify-center">
      <v-col cols="auto" class="d-flex align-center card">
        <div class="icon engine-state">
          <span class="material-symbols-rounded">vital_signs</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Engine State</p>
          <p class="text-value">Running</p>
        </div>
      </v-col>
      <v-col cols="auto" class="d-flex align-center card">
        <div class="icon running-hour">
          <span class="material-symbols-rounded">schedule</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Running Hour</p>
          <p class="text-value">526 hour</p>
        </div>
      </v-col>
    </v-row>
    <v-row class="ga-10 justify-center">
      <v-col cols="auto" class="d-flex align-center card">
        <div class="icon battery-volts">
          <span class="material-symbols-rounded">charger</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Battery Volts</p>
          <p class="text-value">24 V</p>
        </div>
      </v-col>
      <v-col cols="auto" class="d-flex align-center card">
        <div class="icon act-power">
          <span class="material-symbols-rounded">speed</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Act Power</p>
          <p class="text-value">190 kW</p>
        </div>
      </v-col>
    </v-row>
    <v-row class="ga-10 justify-center">
      <v-col cols="auto" class="d-flex align-center card">
        <div class="icon oil-pressure">
          <span class="material-symbols-rounded">speed</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Oil Pressure</p>
          <p class="text-value">1 bar</p>
        </div>
      </v-col>
      <v-col cols="auto" class="d-flex align-center card">
        <div class="icon water-temp">
          <span class="material-symbols-rounded">device_thermostat</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Water Temperature</p>
          <p class="text-value">80 °C</p>
        </div>
      </v-col>
    </v-row>
    <v-row class="ga-10 justify-center">
      <v-col cols="auto" class="d-flex align-center card">
        <div class="icon fuel-consumption">
          <span class="material-symbols-rounded">oil_barrel</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Total Fuel Consumptions</p>
          <p class="text-value">73000 l</p>
        </div>
      </v-col>
      <v-col cols="auto" class="d-flex align-center card">
        <div class="icon rpm">
          <span class="material-symbols-rounded">speed</span>
        </div>
        <div class="text-side">
          <p class="text-grey">RPM</p>
          <p class="text-value">1550 RPM</p>
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
.material-symbols-rounded {
  font-size: 52px;
}

.text-side {
  display: flex;
  flex-direction: column;
  margin-left: 24px;
}

.text-grey {
  color: var(--gray);
  font-size: 16px;
}

.text-value {
  color: var(--black);
  font-size: 24px;
  font-weight: 600;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 1rem;
}

.engine-state {
  background-color: var(--bg-green);
  color: var(--symbol-green);
}

.running-hour {
  background-color: var(--bg-blue);
  color: var(--symbol-blue);
}

.battery-volts {
  background-color: var(--bg-sky);
  color: var(--symbol-sky);
}

.act-power {
  background-color: var(--bg-purple);
  color: var(--symbol-purple);
}

.oil-pressure {
  background-color: var(--bg-yellow);
  color: var(--symbol-yellow);
}

.water-temp {
  background-color: var(--bg-lightsky);
  color: var(--symbol-lightsky);
}

.fuel-consumption {
  background-color: var(--bg-mint);
  color: var(--symbol-mint);
}

.rpm {
  background-color: var(--bg-red);
  color: var(--symbol-red);
}

.card {
  border: 1px solid var(--bg-soline);
  border-radius: 20px;
  margin-top: 8px;
  width: 346px;
}
</style>