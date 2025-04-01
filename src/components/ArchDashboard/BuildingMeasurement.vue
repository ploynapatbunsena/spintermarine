<template>
    <div class="time-section">Time: {{ startTime }}-{{ endTime }}</div>
    <!-- Row 1 -->
    <div class="row">
      <!-- People Counting -->
      <div class="large-box yellow">
        <p class="header">People Counting</p>
        <p class="value">{{ totalPeople }}</p>
        <div class="footer-box">
          <v-img class="footer-logo" :src="require('@/assets/Icons/CU/people_white.png')"></v-img>
          <p class="unit">People</p>
        </div>
      </div>
      <!-- Indoor TVOC -->
      <div class="small-section">
        <div class="logo-section">
          <div class="logo">  
            <v-img class="logo-white" :src="require('@/assets/Icons/CU/voc_white.png')"></v-img>
          </div>
          <p class="text-class">Indoor <br> TVOC</p>
        </div>
        <div class="small-box" :style="getStyleIndoor(averageTVOC, 2000)">
          <p class="value">{{ averageTVOC }}</p>
          <p class="unit">ppb</p>
        </div>
      </div>
      <!-- Indoor PM2.5 -->
      <div class="small-section">
        <div class="logo-section">
          <div class="logo">
            <v-img class="logo-white" :src="require('@/assets/Icons/CU/PM2.5_white.png')"></v-img>
          </div>
          <p class="text-class">Indoor <br> PM2.5</p>
        </div>
        <div class="small-box" :style="getStyleIndoor(averagePM25, 37.5)">
          <p class="value">{{ averagePM25 }}</p>
          <p class="unit">µg/m³</p>
        </div>
      </div>
    </div>

    <!-- Row 2 -->
    <div class="row">
      <!-- Indoor Temperature -->
      <div class="small-section">
        <div class="logo-section">
          <div class="logo">
            <v-img class="logo-white" :src="require('@/assets/Icons/CU/temp_white.png')"></v-img>
          </div>
          <p class="text-class">Indoor <br> Temperature</p>
        </div>
        <div class="small-box" :style="getStyleIndoor(averageThermal, 26.5)">
          <p class="value">{{ averageThermal }}</p>
          <p class="unit">celsius</p>
        </div>
      </div>
      <!-- Carbon Emission -->
      <div class="large-box green">
        <p class="header">Carbon Emission</p>
        <p class="value">{{ carbonEmission }}</p>
        <div class="footer-box">
          <v-img class="footer-logo" :src="require('@/assets/Icons/CU/co2footprint_white.png')"></v-img>
          <p class="unit">kg CO2 e</p>
        </div>
      </div>
      <!-- Outdoor PM2.5 -->
      <div class="small-section">
        <div class="logo-section">
          <div class="logo">
            <v-img class="logo-white" :src="require('@/assets/Icons/CU/PM2.5_white.png')"></v-img>
          </div>
          <p class="text-class">Outdoor <br> PM2.5</p>
        </div>
        <div class="small-box" :style="getStyleOrange(outdoorPM25, 50)">
          <p class="value">{{ outdoorPM25 }}</p>
          <p class="unit">µg/m³</p>
        </div>
      </div>
    </div>

    <!-- Row 3 -->
    <div class="row">
      <!-- Outdoor Temperature -->
      <div class="small-section">
        <div class="logo-section">
          <div class="logo">
            <v-img class="logo-white" :src="require('@/assets/Icons/CU/temp_white.png')"></v-img>
          </div>
          <p class="text-class">Outdoor <br> Temperature</p>
        </div>
        <div class="small-box" :style="getStyleOrange(outdoorTemp, 29.4)">
          <p class="value">{{ outdoorTemp }}</p>
          <p class="unit">celsius</p>
        </div>
      </div>
      <!-- Outdoor Humidity -->
      <div class="small-section">
        <div class="logo-section">
          <div class="logo">
            <v-img class="logo-white" :src="require('@/assets/Icons/CU/humid_white.png')"></v-img>
          </div>
          <p class="text-class">Outdoor <br> Humidity</p>
        </div>
        <div class="small-box" :style="getStyleHumid(outdoorHumid, 70)">
          <p class="value">{{ outdoorHumid }}</p>
          <p class="unit">%RH</p>
        </div>
      </div>
      <!-- Energy Usage -->
      <div class="large-box orange">
        <p class="header">Energy Usage</p>
        <p class="value">{{ totalEnergy }}</p>
        <div class="footer-box">
          <v-img class="footer-logo" :src="require('@/assets/Icons/CU/energy_white.png')"></v-img>
          <p class="unit">kWh</p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "BuildingMeasurement",
  props: {
    totalPeople: Number,
    totalEnergy: Number,
    totalThermal: Number,
    totalCO2: Number,
    totalPM25: Number,
    totalTVOCS: Number
  },

  data() {
    return {
      startTime: "09:00",
      endTime: "09:15",
      timer: null,
      outdoorTempValue: null,
      outdoorHumidValue: null,
      outdoorPM25Value: null
    }
  },

  computed: {
    carbonEmission() {
      return Math.round(this.totalEnergy * 0.566 || 0 );// ป้องกัน undefined
    },
    averageTVOC() {
      return Math.round(this.totalTVOCS / 3);
    },
    averagePM25() {
      return Math.round(this.totalPM25 / 3);
    },
    averageThermal() {
      return (this.totalThermal / 3).toFixed(2);
    },
    outdoorTemp() {
      return this.outdoorTempValue;
    },
    outdoorHumid() {
      return this.outdoorHumidValue;
    },
    outdoorPM25() {
      return this.outdoorPM25Value;
    }
  },

  created() {
    this.generateRandomData();  // เรียกใช้ให้มีค่าเริ่มต้น
    this.timer = setInterval(() => {
      this.incrementTime();
      this.generateRandomData();  // เรียกให้สุ่มค่าทุกๆ 7 วินาที
    }, 7000); // เรียกทุก 7 วินาที
  },

  beforeUnmount() {
    clearInterval(this.timer);
  },

  methods: {
    getStyleIndoor(value, threshold) {
      return {
        backgroundColor: value > threshold ? "#e3e5dd" : "#84c299",
        color: value > threshold ? "#464647" : "#FFFFFF",
        width: value > threshold ? "300px" : "280px"
      }
    },

    getStyleHumid(value, threshold) {
      return {
        backgroundColor: value > threshold ? "#0d4da1" : "#e3e5dd",
        color: value > threshold ? "#FFFFFF" : "#464647",
      }
    },

    getStyleOrange(value, threshold) {
      return {
        backgroundColor: value > threshold ? "#d88529 " : "#e3e5dd",
        color: value > threshold ? "#FFFFFF" : "#464647",
      }
    },

    generateRandomData() {
      this.outdoorTempValue = parseFloat(Math.random() * (40 - 20) + 20).toFixed(2);
      this.outdoorHumidValue = Math.round(Math.random() * (100 - 0) + 0);
      this.outdoorPM25Value = Math.round(Math.random() * (100 - 0) + 0);
    },

    incrementTime() {
      // แยกชั่วโมงและนาทีจาก startTime
      let [startHour, startMinute] = this.startTime.split(":").map(Number);
      let [endHour, endMinute] = this.endTime.split(":").map(Number);

      // เพิ่ม 15 นาทีใน startTime
      startMinute += 15;
      if (startMinute === 60) {
        startMinute = 0;
        startHour = (startHour + 1) % 24;
      }

      // เพิ่ม 15 นาทีใน endTime
      endMinute += 15;
      if (endMinute === 60) {
        endMinute = 0;
        endHour = (endHour + 1) % 24;
      }

      // อัปเดตค่า startTime และ endTime
      this.startTime = this.formatTime(startHour, startMinute);
      this.endTime = this.formatTime(endHour, endMinute);

    },
    formatTime(hour, minute) {
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    },
  }
};
</script>

<style lang="scss" scoped>
* {
  font-family: 'Segoe UI', sans-serif;
}

.time-section {
  display: flex;
  align-items: end;
  font-size: 72px;
  padding: 0px;
  height: 75px;
}

.row {
  display: flex;
  align-items: end;
  margin-top: 15px;
}

.large-box {
  display: flex;
  flex-direction: column;
  align-items: end;
  width: 390px;
  height: 390px;
  padding: 20px;
  color: #FFFFFF;
  position: relative;

  .header {
    font-size: 36px;
  }

  .value {
    font-size: 104px;
    font-weight: 700;
  }
}

.footer-box {
  display: flex;
  align-items: end;
  justify-content: space-between;

  .footer-logo {
    width: 160px;
    height: 160px;
    position: absolute;
    bottom: 20px;
    left: 20px;
  }

  .unit {
    font-size: 48px;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}

.yellow {
  background-color: #ecbd00;
}

.green {
  background-color: #155138 ;
}

.orange {
  background-color: #f58465 ;
}

.small-section {
  margin-left: 15px;
  margin-right: 110px;
}

.small-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 280px;
  height: 280px;
  background-color: #84c299;
  padding: 20px;
  color: #FFFFFF;
  position: relative;

  .value {
    font-size: 96px;
    font-weight: 700;
  }

  .unit {
    font-size: 40px;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  width: 110px;
  height: 110px;
  background-color: #464646;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-white {
  width: 100px;
  height: 100px;
}

.text-class {
  font-size: 24px;
  margin-left: 15px;
}

</style>