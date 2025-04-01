<template>
  <!-- Loop through each floor in reversed order -->
  <div v-for="(floor, index) in reversedFloors" :key="`floor-${index}`">
    <v-card class="right-side elevation-0">
      <!-- Chart 1: People Distribution -->
      <div class="chart-container" style="margin-bottom: 43px;">
        <!-- กล่องแสดงเปอร์เซ็นต์ -->
        <div class="box-percent" :style="{backgroundColor: '#F2C94C'}">
          <p class="text-percent">{{ floor.percentage }}%</p>
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
            <div class="indicator">Thermal<br>Comport</div>
          </v-col>
          <v-col cols="3">
            <div class="indicator">Humidity</div>
          </v-col>
          <v-col cols="3">
            <div class="indicator">PM2.5</div>
          </v-col>
          <v-col cols="3">
            <div class="indicator">TVOCs</div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalPeople: 1000,
      totalEnergy: 5000, // หน่วยเป็น kWh
      floors: [],
      chartMaxWidth: 790,
      chartMaxWidthEnergy: 670, // ความกว้างสูงสุดของกราฟ
      interval: null, // เก็บค่า interval
    }
  },
  
  computed: {
    reversedFloors() {
      // แสดงชั้นสูงสุดไว้ด้านบน (3rd, 2nd, 1st)
      return [...this.floors].reverse();
    }
  },
  
  mounted() {
    this.generateRandomData();
    this.interval = setInterval(this.generateRandomData, 7000);
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },
  
  methods: {
    generateRandomData() {
      // ---------- สุ่มข้อมูลผู้อยู่อาศัย ----------
      const totalPeople = this.totalPeople
      
      // สุ่มจำนวนคนชั้นที่ 1 (ประมาณ 15-30%)
      const floor1People = Math.floor(Math.random() * (0.30 - 0.15) * totalPeople) + Math.floor(0.15 * totalPeople)
      
      // สุ่มจำนวนคนชั้นที่ 2 (ประมาณ 40-70%)
      // const floor2People = Math.floor(Math.random() * (0.70 - 0.40) * totalPeople + 0.40 * totalPeople)
      const floor2People = Math.floor(Math.random() * (0.70 - 0.40) * totalPeople) + Math.floor(0.40 * totalPeople)
      
      // คนชั้นที่ 3 คือส่วนที่เหลือ
      const floor3People = totalPeople - floor1People - floor2People
      
      // คำนวณเปอร์เซ็นต์
      const floor1Percent = Math.round((floor1People / totalPeople) * 100)
      const floor2Percent = Math.round((floor2People / totalPeople) * 100)
      const floor3Percent = Math.round((floor3People / totalPeople) * 100)
      
      // คำนวณ scale ตามเงื่อนไข
      const floor1ScaleStart = 0
      const floor1ScaleEnd = floor1Percent
      
      const floor2ScaleStart = floor1ScaleEnd
      const floor2ScaleEnd = floor2ScaleStart + floor2Percent
      
      const floor3ScaleStart = floor2ScaleEnd
      const floor3ScaleEnd = floor3ScaleStart + floor3Percent
      
      // ---------- สุ่มข้อมูลการใช้พลังงาน ----------
      const totalEnergy = this.totalEnergy
      
      // สุ่มการใช้พลังงานชั้นที่ 1 (ประมาณ 10-25%)
      const floor1Energy = Math.floor(Math.random() * (0.25 - 0.10) * totalEnergy + 0.10 * totalEnergy)
      
      // สุ่มการใช้พลังงานชั้นที่ 2 (ประมาณ 30-50%)
      const floor2Energy = Math.floor(Math.random() * (0.50 - 0.30) * totalEnergy + 0.30 * totalEnergy)
      
      // การใช้พลังงานชั้นที่ 3 คือส่วนที่เหลือ
      const floor3Energy = totalEnergy - floor1Energy - floor2Energy
      
      // คำนวณเปอร์เซ็นต์การใช้พลังงาน
      const floor1EnergyPercent = Math.round((floor1Energy / totalEnergy) * 100)
      const floor2EnergyPercent = Math.round((floor2Energy / totalEnergy) * 100)
      const floor3EnergyPercent = Math.round((floor3Energy / totalEnergy) * 100)
      
      // คำนวณ scale สำหรับการใช้พลังงาน
      const floor1EnergyScaleStart = 0
      const floor1EnergyScaleEnd = floor1EnergyPercent
      
      const floor2EnergyScaleStart = floor1EnergyScaleEnd
      const floor2EnergyScaleEnd = floor2EnergyScaleStart + floor2EnergyPercent
      
      const floor3EnergyScaleStart = floor2EnergyScaleEnd
      const floor3EnergyScaleEnd = floor3EnergyScaleStart + floor3EnergyPercent
      
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
          
          ordinal: '3rd'
        }
      ]
    },
    
    regenerateRandomData() {
      this.generateRandomData()
    }
  },
}
</script>

<style scoped>
* {
  font-family: 'Segoe UI', sans-serif;
}
/* ชั้นแต่ละชั้น */
.floor-row {
  display: flex;
  align-items: center;
  position: relative;
  height: 120px;
}

/* คอนเทนเนอร์สำหรับทั้ง chart */
.chart-container {
  position: relative;
  width: 100%;
  max-width: 950px;
  height: 120px;
  display: flex;
  align-items: center;
}

/* กล่องแสดงเปอร์เซ็นต์ */
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

/* จุดเริ่มต้นและสิ้นสุดของกราฟ */
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

/* เส้นกราฟพื้นหลัง */
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
/* แท่งกราฟที่ยาวออกทางขวาตามเปอร์เซ็นต์ */
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

.indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  /* width: 100%; */
  height: 130px;
  border: 1px solid #ddd;
  background-color: #84c299;
  font-size: 28px;
  line-height: 32px;
  font-weight: 400;
  color: #FFFFFF;
}

.right-side {
  width: 950px;
  height: 450px;
  background-color: transparent;
  margin-top: 180px;
}
</style>