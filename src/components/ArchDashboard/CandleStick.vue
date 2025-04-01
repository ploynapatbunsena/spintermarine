<template>
  <!-- Loop through each floor in reversed order -->
  <div v-for="(floor, index) in reversedFloors" :key="`floor-${index}`">
    <v-card class="right-side elevation-0">
      <!-- Chart 1: People Distribution -->
      <div class="chart-container" style="margin-bottom: 43px;">
        <!-- กล่องแสดงเปอร์เซ็นต์ -->
        <div class="box-percent" :style="{backgroundColor: '#F2C94C'}">
          <p class="text-percent">{{ floor.percentage }}%</p>
          <!-- <p class="text-percent">{{ floor.people }}</p> -->
        </div>
        
        <!-- เส้นกราฟ -->
        <div class="line-chart"></div>
        
        <!-- แท่งกราฟที่ยาวออกตามเปอร์เซ็นต์ -->
        <div 
          class="box-chart" 
          :style="{ 
            width: `${(floor.percentage / 100) * chartMaxWidth}px`,
            backgroundColor: '#F2C94C',
            left: `${Math.min(140 + (floor.scaleStart * (chartMaxWidth / 100)), 930 - ((floor.percentage / 100) * chartMaxWidth))}px`
          }"
        ></div>
        <!-- จุดเริ่มต้นและสิ้นสุดของกราฟ -->
        <div class="box-grey start-point" ></div>
        <div class="box-grey end-point" :style="{ left: '930px' }"></div>
      </div>
      
      <!-- Chart 2: Energy Usage -->
      <div class="chart-container" style="margin-bottom: 43px;">
        <!-- กล่องแสดงเปอร์เซ็นต์ -->
        <div class="box-percent" :style="{backgroundColor: '#f58465', left: '140px'}">
          <p class="text-percent">{{ floor.energyPercentage }}%</p>
          <!-- <p class="text-percent">{{ floor.energy }}</p> -->
        </div>
        
        <!-- เส้นกราฟ -->
        <div class="line-chart-energy"></div>
        
        <!-- แท่งกราฟที่ยาวออกตามเปอร์เซ็นต์ -->
        <div
          class="box-chart" 
          :style="{ 
            width: `${(floor.energyPercentage / 100) * chartMaxWidthEnergy}px`,
            backgroundColor: '#f58465',
            left: `${Math.min(280 + (floor.energyScaleStart * (chartMaxWidthEnergy / 100)), 930 - ((floor.energyPercentage / 100) * chartMaxWidthEnergy))}px`
          }"
        ></div>
        
        <!-- จุดเริ่มต้นและสิ้นสุดของกราฟ -->
        <div class="box-grey start-point-energy"></div>
        <div class="box-grey end-point" :style="{ left: '930px' }"></div>
      </div>

      <!-- Chart 3: Indicator -->
      <div class="indicator-squares">
        <v-row>
          <v-col cols="3">
            <div class="indicator" :style="getStyle(floor.thermal, 26.5)">Thermal<br>Comport
              <!-- {{ (floor.thermal).toFixed(2) }} -->
            </div>
          </v-col>
          <v-col cols="3">
            <div class="indicator" :style="getStyle(floor.co2, 2000)">CO2
              <!-- {{ floor.co2.toFixed(1) }} -->
            </div>
          </v-col>
          <v-col cols="3">
            <div class="indicator" :style="getStyle(floor.pm25, 37.5)">PM2.5
              <!-- {{ floor.pm25.toFixed(1) }} -->
            </div>
          </v-col>
          <v-col cols="3">
            <div class="indicator" :style="getStyle(floor.tvocs, 2000)">TVOCs
              <!-- {{ floor.tvocs.toFixed(1) }} -->
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "CandleStick",

  data() {
    return {
      totalPeople: 0,
      totalEnergy: 0,
      totalCO2: 0,
      totalPM25: 0,
      totalTVOCS: 0,
      totalThermal: 0,

      floors: [],
      chartMaxWidth: 790,
      chartMaxWidthEnergy: 670,
      interval: null,
    }
  },
  
  watch: {
    totalPeople: "emitUpdate",
    totalEnergy: "emitUpdate",
    totalThermal: "emitUpdate",
    totalCO2: "emitUpdate",
    totalPM25: "emitUpdate",
    totalTVOCS: "emitUpdate",
  },
  
  computed: {
    reversedFloors() {
      // แสดงชั้นสูงสุดไว้ด้านบน (3rd, 2nd, 1st)
      return [...this.floors].reverse();
    }
  },
  
  mounted() {
    this.generateRandomData();
    this.interval = setInterval(this.generateRandomData, 3000);
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },
  
  methods: {
    getStyle(value, threshold) {
      return {
        backgroundColor: value > threshold ? "#e3e5dd" : "#84c299",
        color: value > threshold ? "#464647" : "#FFFFFF",
      }
    },

    generateRandomData() {
      // ---------- สุ่มข้อมูลผู้อยู่อาศัย ----------
      this.totalPeople = Math.floor(Math.random() * 501);
      const totalPeople = this.totalPeople
      
      // ---------- สุ่มข้อมูลผู้อยู่อาศัย ----------
      const floor1People = Math.floor(Math.random() * (0.30 - 0.15) * totalPeople) + Math.floor(0.15 * totalPeople);
      const floor2People = Math.floor(Math.random() * (0.70 - 0.40) * totalPeople) + Math.floor(0.40 * totalPeople);
      const floor3People = totalPeople - floor1People - floor2People;
      
      // คำนวณเปอร์เซ็นต์
      const floor1Percent = Math.round((floor1People / totalPeople) * 100) || 0;
      const floor2Percent = Math.round((floor2People / totalPeople) * 100) || 0;
      const floor3Percent = Math.round((floor3People / totalPeople) * 100) || 0;
      
      // คำนวณ scale ตามเงื่อนไข
      const floor1ScaleStart = 0
      const floor1ScaleEnd = floor1Percent
      
      const floor2ScaleStart = floor1ScaleEnd
      const floor2ScaleEnd = floor2ScaleStart + floor2Percent
      
      const floor3ScaleStart = floor2ScaleEnd
      const floor3ScaleEnd = floor3ScaleStart + floor3Percent
      
      // ---------- สุ่มข้อมูลการใช้พลังงาน ----------
      this.totalEnergy = Math.floor(Math.random() * 551);
      const totalEnergy = this.totalEnergy;
      
      // ---------- สุ่มข้อมูลการใช้พลังงาน ----------
      const floor1Energy = Math.floor(Math.random() * (0.25 - 0.10) * totalEnergy) + Math.floor(0.10 * totalEnergy);
      const floor2Energy = Math.floor(Math.random() * (0.50 - 0.30) * totalEnergy) + Math.floor(0.30 * totalEnergy);
      const floor3Energy = totalEnergy - floor1Energy - floor2Energy;
      
      // คำนวณเปอร์เซ็นต์การใช้พลังงาน
      const floor1EnergyPercent = Math.round((floor1Energy / totalEnergy) * 100) || 0;
      const floor2EnergyPercent = Math.round((floor2Energy / totalEnergy) * 100) || 0;
      const floor3EnergyPercent = Math.round((floor3Energy / totalEnergy) * 100) || 0;
      
      // คำนวณ scale สำหรับการใช้พลังงาน
      const floor1EnergyScaleStart = 0
      const floor1EnergyScaleEnd = floor1EnergyPercent
      
      const floor2EnergyScaleStart = floor1EnergyScaleEnd
      const floor2EnergyScaleEnd = floor2EnergyScaleStart + floor2EnergyPercent
      
      const floor3EnergyScaleStart = floor2EnergyScaleEnd
      const floor3EnergyScaleEnd = floor3EnergyScaleStart + floor3EnergyPercent

      // คำนวณความร้อน
      const floor1Thermal = parseFloat(Math.random() * (28 - 20) + 20);
      const floor2Thermal = parseFloat(Math.random() * (28 - 20) + 20);
      const floor3Thermal = parseFloat(Math.random() * (28 - 20) + 20);
      this.totalThermal = floor1Thermal + floor2Thermal + floor3Thermal;

      // คำนวณคาร์บอน
      const floor1CO2 = parseFloat(Math.random() * (2500 - 500) + 500);
      const floor2CO2 = parseFloat(Math.random() * (2500 - 500) + 500);
      const floor3CO2 = parseFloat(Math.random() * (2500 - 500) + 500);
      this.totalCO2 = floor1CO2 + floor2CO2 + floor3CO2;

      // คำนวณPM25
      const floor1PM25 = parseFloat(Math.random() * (50 - 0) + 0);
      const floor2PM25 = parseFloat(Math.random() * (50 - 0) + 0);
      const floor3PM25 = parseFloat(Math.random() * (50 - 0) + 0);
      this.totalPM25 = floor1PM25 + floor2PM25 + floor3PM25;

      // คำนวณtvocs
      const floor1TVOC = parseFloat(Math.random() * (2500 - 500) + 500);
      const floor2TVOC = parseFloat(Math.random() * (2500 - 500) + 500);
      const floor3TVOC = parseFloat(Math.random() * (2500 - 500) + 500);
      this.totalTVOCS = floor1TVOC + floor2TVOC + floor3TVOC;

      this.floors = [
        {
          // ข้อมูลผู้อยู่อาศัย
          people: floor1People,
          percentage: floor1Percent,
          scaleStart: floor1ScaleStart,
          scaleEnd: floor1ScaleEnd,
          
          // ข้อมูลการใช้พลังงาน
          energy: floor1Energy,
          energyPercentage: floor1EnergyPercent,
          energyScaleStart: floor1EnergyScaleStart,
          energyScaleEnd: floor1EnergyScaleEnd,

          thermal: floor1Thermal,
          co2: floor1CO2,
          pm25: floor1PM25,
          tvocs: floor1TVOC,
          
          ordinal: '1st'
        },
        {
          // ข้อมูลผู้อยู่อาศัย
          people: floor2People,
          percentage: floor2Percent,
          scaleStart: floor2ScaleStart,
          scaleEnd: floor2ScaleEnd,
          
          // ข้อมูลการใช้พลังงาน
          energy: floor2Energy,
          energyPercentage: floor2EnergyPercent,
          energyScaleStart: floor2EnergyScaleStart,
          energyScaleEnd: floor2EnergyScaleEnd,

          thermal: floor2Thermal,
          co2: floor2CO2,
          pm25: floor2PM25,
          tvocs: floor2TVOC,
          
          ordinal: '2nd'
        },
        {
          // ข้อมูลผู้อยู่อาศัย
          people: floor3People,
          percentage: floor3Percent,
          scaleStart: floor3ScaleStart,
          scaleEnd: floor3ScaleEnd,
          
          // ข้อมูลการใช้พลังงาน
          energy: floor3Energy,
          energyPercentage: floor3EnergyPercent,
          energyScaleStart: floor3EnergyScaleStart,
          energyScaleEnd: floor3EnergyScaleEnd,

          thermal: floor3Thermal,
          co2: floor3CO2,
          pm25: floor3PM25,
          tvocs: floor3TVOC,
          
          ordinal: '3rd'
        }
      ]
    },
    
    regenerateRandomData() {
      this.generateRandomData()
    },

    emitUpdate() {
      this.$emit("update-total", {
        totalPeople: this.totalPeople,
        totalEnergy: this.totalEnergy,
        totalThermal: this.totalThermal,
        totalCO2: this.totalCO2,
        totalPM25: this.totalPM25,
        totalTVOCS: this.totalTVOCS,
      });
    },
  },
}
</script>

<style scoped>
* {
  font-family: 'Segoe UI', sans-serif;
}

.floor-row {
  display: flex;
  align-items: center;
  position: relative;
  height: 120px;
}

.chart-container {
  position: relative;
  width: 100%;
  max-width: 950px;
  height: 120px;
  display: flex;
  align-items: center;
}

.box-percent {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  position: absolute;
  left: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.text-percent {
  margin: 0;
  font-size: 48px;
  font-weight: 600;
  color: white;
}

.box-grey {
  width: 20px;
  height: 20px;
  background-color: #c4c4c4;
  position: absolute;
  z-index: 1;
}

.start-point {
  left: 120px;
}

.start-point-energy {
  left: 260px;
}

.end-point {
  right: 0;
}

.line-chart {
  width: 100%;
  height: 1px;
  background-color: #464647;
  position: absolute;
  left: 140px;
  width: calc(100% - 140px);
  z-index: 0;
}

.line-chart-energy {
  width: 100%;
  height: 1px;
  background-color: #464647;
  position: absolute;
  left: 280px;
  width: calc(100% - 280px);
  z-index: 0;
}

.box-chart {
  height: 40px;
  min-width: 1px;
  transition: width 0.5s ease-in-out, left 0.5s ease-in-out;
  position: absolute;
  z-index: 0;
}

.indicator-squares {
  margin-left: 280px;
  display: flex;
}

.right-side {
  width: 950px;
  height: 450px;
  background-color: transparent;
  margin-top: 180px;
}

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
  background-color: #84c299;
  color: #FFFFFF;
}
</style>