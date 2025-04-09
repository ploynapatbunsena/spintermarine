<template>
  <div class="gasolineTank">
    <p class="gasoline-title">Gasoline Tank</p>
    <div class="tank-container">
      <div class="tank">
        <div class="oil" :style="{ height: oilPercentage + '%' }"></div>
        <div class="percentage">{{ oilPercentage }}%</div>
      </div>
      <div class="details">
        <p>ปริมาณน้ำมันคงเหลือ: {{ remainingVolume }} L</p>
        <p>ปริมาณน้ำมันสุทธิ: {{ totalCapacity }} L</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

// const $api = inject('$api');
// const deviceData = ref(null);
// const fuelConsumed = ref(0);
const totalCapacity = ref(3000); // กำหนดค่าเอง เช่น 1500 L
const remainingVolume = ref(2300); // กำหนดค่าเอง เช่น 800 L

const oilPercentage = computed(() => {
  if (totalCapacity.value === 0) return 0;
  const percentage = (remainingVolume.value / totalCapacity.value) * 100;
  return Math.max(0, Math.min(100, percentage)).toFixed(1);
});

// ฟังก์ชันดึงข้อมูลจาก API (รองรับอนาคต)
const fetchDeviceData = async () => {
  try {
    // ตัวอย่างการเรียก API (ยังไม่ใช้งานจริง)
    // const response = await $api.get('/device/fuel-data');
    // deviceData.value = response.data;
    // totalCapacity.value = deviceData.value.totalCapacity || 1500; // ค่า default หาก API ไม่มีข้อมูล
    // remainingVolume.value = deviceData.value.remainingVolume || 800; // ค่า default หาก API ไม่มีข้อมูล
  } catch (error) {
    console.error('Failed to fetch fuel data:', error);
    // คงค่าเริ่มต้นที่กำหนดไว้ใน ref หาก API ล้มเหลว
  }
};

onMounted(() => {
  fetchDeviceData();
});
</script>
  
<style lang="scss" scoped>
.gasolineTank {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.gasoline-title {
  font-size: 2vh;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1vh;
}

.tank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tank {
  position: relative;
  width: 20vw;
  height: 14vh;
  border: 1vh solid #ffffff;
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
  font-size: 3vw;
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
  gap: 2vh;

  p {
    font-family: 'Sarabun', serif;
    font-size: 1.5vh;
    font-weight: 600;
    margin: 8px 0;
  }
}

</style>

