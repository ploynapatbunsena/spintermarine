<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="gasolineTank">
          <p class="gasoline-title">Main Tank</p>
          <div class="tank-container">
            <div class="tank">
              <div class="oil" :style="{ height: oilPercentage + '%' }"></div>
              <div class="percentage">{{ oilPercentage }}%</div>
            </div>
            <div class="details">
              <p>ปริมาณน้ำมัน: {{ remainingVolume }}/{{totalCapacity}}L</p>
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
              <div class="oil" :style="{ height: oilPercentage + '%' }"></div>
              <div class="percentage">{{ oilPercentage }}%</div>
            </div>
            <div class="details">
              <p>ปริมาณน้ำมัน: {{ remainingVolume }}/{{totalCapacity}}L</p>
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
              <div class="oil" :style="{ height: oilPercentage + '%' }"></div>
              <div class="percentage">{{ oilPercentage }}%</div>
            </div>
            <div class="details">
              <p>ปริมาณน้ำมัน: {{ remainingVolume }}/{{totalCapacity}}L</p>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '@/assets/colors.scss'

export default {
  name: "FuelTank",
  data() {
    return {
      remainingVolume: 13200, // ปริมาณน้ำมันคงเหลือ (Lt.)
      totalCapacity: 14000,  // ปริมาตรสุทธิ (Lt.)

      
    };
  },

  computed: {
    // MainTank
    oilPercentage() {
      return ((this.remainingVolume / this.totalCapacity) * 100).toFixed(2);
    },

    // Feed Tank

    // Total Tank
  }
}
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
  padding: 32px 0px;
}

.tank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tank {
  position: relative;
  width: 220px;
  height: 120px;
  border: 12px solid var(--white);
  border-radius: 64px;
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
  font-size: 32px;
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
    font-size: 16px;
    font-weight: 500;
  }
}

</style>
