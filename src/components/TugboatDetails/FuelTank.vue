<template>
  <v-container>
    <v-row>
      <!-- Main Tank -->
      <v-col>
        <div class="gasolineTank">
          <p class="gasoline-title">Main Tank</p>
          <div class="tank-container">
            <div class="tank">
              <div class="oil" :style="{ height: mainTank.oilPercentage + '%' }"></div>
              <div class="percentage">{{ mainTank.oilPercentage }}%</div>
            </div>
            <div class="details">
              <p>ปริมาณน้ำมัน: {{ mainTank.remainingVolume }}/{{ mainTank.totalCapacity }}L</p>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Feed Tank -->
      <v-col>
        <div class="gasolineTank">
          <p class="gasoline-title">Feed Tank</p>
          <div class="tank-container">
            <div class="tank">
              <div class="oil" :style="{ height: feedTank.oilPercentage + '%' }"></div>
              <div class="percentage">{{ feedTank.oilPercentage }}%</div>
            </div>
            <div class="details">
              <p>ปริมาณน้ำมัน: {{ feedTank.remainingVolume }}/{{ feedTank.totalCapacity }}L</p>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Total Tank -->
      <v-col>
        <div class="gasolineTank">
          <p class="gasoline-title">Total Tank</p>
          <div class="tank-container">
            <div class="tank">
              <div class="oil" :style="{ height: totalTank.oilPercentage + '%' }"></div>
              <div class="percentage">{{ totalTank.oilPercentage }}%</div>
            </div>
            <div class="details">
              <p>ปริมาณน้ำมัน: {{ totalTank.remainingVolume }}/{{ totalTank.totalCapacity }}L</p>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '@/assets/colors.scss';

export default {
  name: "FuelTank",
  data() {
    return {
      mainTank: {
        remainingVolume: 500, // ค่าเริ่มต้นตัวอย่าง (ลิตร)
        totalCapacity: 1000,  // ค่าเริ่มต้นตัวอย่าง (ลิตร)
      },
      feedTank: {
        remainingVolume: 200,
        totalCapacity: 500,
      },
      totalTank: {
        remainingVolume: 700,
        totalCapacity: 1500,
      },
    };
  },
  computed: {
    mainTankOilPercentage() {
      return this.calculatePercentage(this.mainTank.remainingVolume, this.mainTank.totalCapacity);
    },
    feedTankOilPercentage() {
      return this.calculatePercentage(this.feedTank.remainingVolume, this.feedTank.totalCapacity);
    },
    totalTankOilPercentage() {
      return this.calculatePercentage(this.totalTank.remainingVolume, this.totalTank.totalCapacity);
    },
  },
  methods: {
    calculatePercentage(remaining, total) {
      if (total === 0 || isNaN(remaining) || isNaN(total)) {
        return 0; // ป้องกัน NaN หรือการหารด้วย 0
      }
      return ((remaining / total) * 100).toFixed(2);
    },
  },
  created() {
    // รวม computed properties เข้ากับ object ของแต่ละแท็งก์เพื่อให้ใช้งานใน template ได้ง่ายขึ้น
    this.mainTank.oilPercentage = this.mainTankOilPercentage;
    this.feedTank.oilPercentage = this.feedTankOilPercentage;
    this.totalTank.oilPercentage = this.totalTankOilPercentage;
  },
  watch: {
    // อัปเดต oilPercentage เมื่อข้อมูลเปลี่ยนแปลง
    'mainTank.remainingVolume'() {
      this.mainTank.oilPercentage = this.mainTankOilPercentage;
    },
    'mainTank.totalCapacity'() {
      this.mainTank.oilPercentage = this.mainTankOilPercentage;
    },
    'feedTank.remainingVolume'() {
      this.feedTank.oilPercentage = this.feedTankOilPercentage;
    },
    'feedTank.totalCapacity'() {
      this.feedTank.oilPercentage = this.feedTankOilPercentage;
    },
    'totalTank.remainingVolume'() {
      this.totalTank.oilPercentage = this.totalTankOilPercentage;
    },
    'totalTank.totalCapacity'() {
      this.totalTank.oilPercentage = this.totalTankOilPercentage;
    },
  },
};
</script>

<style lang="scss" scoped>
.gasolineTank {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-soline);
  border-radius: 16px;
}

.gasoline-title {
  font-weight: 500;
  text-align: center;
  padding: 2.5vh 0px;
  font-size: 1.5vh;
}

.tank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tank {
  position: relative;
  width: 12vw;
  height: 12vh;
  border: 12px solid var(--white);
  border-radius: 6vh;
  background-color: var(--white);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-end;   
}

.oil {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to bottom, #FFF6DE 0%, #FEE114 100%);
  transition: height 0.5s ease;
  z-index: 1;
}

.percentage {
  font-family: 'Inter', serif;
  position: absolute;
  z-index: 2;
  bottom: 50%;
  left: 50%;
  transform: translateX(-50%);
  transform: translate(-50%, 50%);
  font-size: 3vh;
  font-weight: 600;
  color: #333;  
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.details {
  text-align: center;
  display: flex;
  align-items: center;
  padding: 32px 0px;

  p {
    font-family: 'Sarabun', serif;
    font-size: 1.5vh;
    font-weight: 500;
  }
}

</style>
