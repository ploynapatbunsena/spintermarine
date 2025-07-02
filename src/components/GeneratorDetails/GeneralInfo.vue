<template>
  <v-container>
    <v-row class="gap-10">
      <v-col cols="12" sm="6" lg="6" class="d-flex align-center card">
        <div
          class="icon engine-state"
          :style="{ backgroundColor: status.color }"
        >
          <span class="material-symbols-rounded">vital_signs</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Engine State</p>
          <p class="text-value">{{ status.text }}</p>
        </div>
      </v-col>
      <v-col cols="12" sm="6" lg="6" class="d-flex align-center card">
        <div class="icon running-hour">
          <span class="material-symbols-rounded">schedule</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Running Hour</p>
          <p class="text-value">
            {{ measurements["Hour Meter"].value }}
            {{ measurements["Hour Meter"].unit }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" lg="6" class="d-flex align-center card">
        <div class="icon battery-volts">
          <span class="material-symbols-rounded">charger</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Battery Volts</p>
          <p class="text-value">
            {{ measurements["Battery Volts"].value }}
            {{ measurements["Battery Volts"].unit }}
          </p>
        </div>
      </v-col>
      <v-col cols="12" sm="6" lg="6" class="d-flex align-center card">
        <div class="icon act-power">
          <span class="material-symbols-rounded">speed</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Actual Power</p>
          <p class="text-value">
            {{ measurements["Actual Power"].value }}
            {{ measurements["Actual Power"].unit }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" lg="6" class="d-flex align-center card">
        <div class="icon oil-pressure">
          <span class="material-symbols-rounded">speed</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Oil Pressure</p>
          <p class="text-value">
            {{ measurements["Oil Pressure"].value }}
            {{ measurements["Oil Pressure"].unit }}
          </p>
        </div>
      </v-col>
      <v-col cols="12" sm="6" lg="6" class="d-flex align-center card">
        <div class="icon water-temp">
          <span class="material-symbols-rounded">device_thermostat</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Water Temperature</p>
          <p class="text-value">
            {{ measurements["Water Temp"].value }}
            {{ measurements["Water Temp"].unit }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" lg="6" class="d-flex align-center card">
        <div class="icon fuel-consumption">
          <span class="material-symbols-rounded">oil_barrel</span>
        </div>
        <div class="text-side">
          <p class="text-grey">Total Fuel Consumptions</p>
          <p class="text-value">
            {{ measurements["Total Fuel Consumption"].value }}
            {{ measurements["Total Fuel Consumption"].unit }}
          </p>
        </div>
      </v-col>
      <v-col cols="12" sm="6" lg="6" class="d-flex align-center card">
        <div class="icon rpm">
          <span class="material-symbols-rounded">speed</span>
        </div>
        <div class="text-side">
          <p class="text-grey">RPM</p>
          <p class="text-value">
            {{ measurements["RPM"].value }} {{ measurements["RPM"].unit }}
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import "@/assets/colors.scss"

defineProps({
  measurements: {
    type: Object,
    default: () => ({
      "Hour Meter": { value: "0", unit: "Hr" },
      "Battery Volts": { value: "0", unit: "V" },
      "Actual Power": { value: "0", unit: "kW" },
      "Oil Pressure": { value: "0", unit: "bar" },
      "Water Temp": { value: "0", unit: "°C" },
      "Total Fuel Consumption": { value: "0", unit: "L" },
      RPM: { value: "0", unit: "RPM" },
    }),
  },
  status: {
    type: Object,
    default: () => ({ text: "N/A" }),
  },
})
</script>

<style lang="scss" scoped>
.material-symbols-rounded {
  font-size: 5vh;
}

.text-side {
  display: flex;
  flex-direction: column;
  margin-left: 2vh;
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

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6vh;
  height: 6vh;
  border-radius: 1.5vh;
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
  border-radius: 2vh;
  margin-top: 2vh;
}
</style>
