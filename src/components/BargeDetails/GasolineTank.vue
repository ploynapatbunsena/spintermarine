<template>
  <div class="gasolineTank">
    <p class="gasoline-title mt-6">Gasoline Tank</p>
    <div class="tank-container">
      <div class="tank">
        <div class="oil" :style="{ height: oilPercentage + '%' }"></div>
        <div class="percentage">{{ oilPercentage }} %</div>
      </div>
      <div class="details">
        <p>ปริมาณน้ำมันคงเหลือ: {{ remainingVolume }} Lt.</p>
        <p>ปริมาณน้ำมันสุทธิ: {{ totalCapacity }} Lt.</p>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "GasolineTank",
  data() {
    return {
      remainingVolume: 12000, // ปริมาณน้ำมันคงเหลือ (Lt.)
      totalCapacity: 14000,  // ปริมาตรสุทธิ (Lt.)
    };
  },
  computed: {
    oilPercentage() {
      // คำนวณเปอร์เซ็นต์น้ำมันคงเหลือ
      return ((this.remainingVolume / this.totalCapacity) * 100).toFixed(2);
    },
  },
};
</script>
  
<style lang="scss">
.gasolineTank {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.gasoline-title {
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 32px;
}

.tank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.tank {
  position: relative;
  width: 800px;
  height: 320px;
  border: 24px solid #ffffff;
  border-radius: 200px;
  background-color: #ffffff;
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
  font-size: 96px;
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
  gap: 32px;

  p {
    font-family: 'Sarabun', serif;
    font-size: 32px;
    font-weight: 500;
    margin: 8px 0;
  }
}

</style>
