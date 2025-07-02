<template>
  <v-card class="gasolineTank" elevation="0">
    <p class="gasoline-title">{{ title }}</p>
    <div class="tank-container">
      <div class="tank">
        <div class="oil" :style="{ height: oilPercentage + '%' }"></div>
        <div class="percentage">{{ oilPercentage }}%</div>
      </div>
      <div class="details">
        <p>
          ปริมาณน้ำมัน: {{ formattedRemainingVolume }} /
          {{ formattedTotalCapacity }} L
        </p>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  remainingVolume: {
    type: [Number, String],
    default: 0,
  },
  totalCapacity: {
    type: [Number, String],
    default: 0,
  },
})

const numericRemainingVolume = computed(() => {
  if (props.remainingVolume == null) return 0
  const value = parseFloat(props.remainingVolume)
  return isNaN(value) ? 0 : Math.max(0, value)
})

const numericTotalCapacity = computed(() => {
  if (props.totalCapacity == null) return 0
  const value = parseFloat(props.totalCapacity)
  return isNaN(value) ? 0 : Math.max(0, value)
})

const oilPercentage = computed(() => {
  if (numericTotalCapacity.value <= 0) return 0
  const percentage =
    (numericRemainingVolume.value / numericTotalCapacity.value) * 100
  return Math.max(0, Math.min(100, percentage)).toFixed(1)
})

const formattedRemainingVolume = computed(() => {
  return numericRemainingVolume.value.toLocaleString()
})

const formattedTotalCapacity = computed(() => {
  return numericTotalCapacity.value.toLocaleString()
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
  background-color: var(--bg-soline);
  border-radius: 16px;
}

.gasoline-title {
  font-weight: bold;
  text-align: center;
  padding: 2.5vh 0px;
  font-size: 2vh;
}

.tank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tank {
  position: relative;
  width: 25vh;
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
  font-size: 3vh;
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
  padding: 32px 0px;

  p {
    font-family: "Sarabun", serif;
    font-size: 1.5vh;
    font-weight: bold;
  }
}
</style>
