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
import { computed } from "vue"
import { defineProps } from "vue"

const props = defineProps({
  remainingVolume: {
    type: Number,
    required: true,
  },
  totalCapacity: {
    type: Number,
    required: true,
  },
})

const oilPercentage = computed(() => {
  if (props.totalCapacity <= 0) return 0
  const percentage = (props.remainingVolume / props.totalCapacity) * 100
  return Math.max(0, Math.min(100, percentage)).toFixed(2)
})
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
  width: 40vh;
  height: 12vh;
  border: 1vh solid #ffffff;
  border-radius: 6vh;
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
  background: linear-gradient(to bottom, #fff6de 0%, #fee114 100%);
  transition: height 0.5s ease;
  z-index: 1;
}

.percentage {
  font-family: "Inter", serif;
  position: absolute;
  z-index: 2;
  bottom: 50%;
  left: 50%;
  transform: translateX(-50%);
  transform: translate(-50%, 50%);
  font-size: 6vh;
  font-weight: bold;
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
    font-family: "Sarabun", serif;
    font-size: 1.5vh;
    font-weight: 600;
    margin: 8px 0;
  }
}
</style>
