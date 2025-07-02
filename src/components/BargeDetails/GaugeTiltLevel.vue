<template>
  <div class="gauge-container">
    <vue-gauge
      :refid="'_' + Math.random().toString(36).substr(2, 9)"
      class="metricsGauge"
      :options="gaugeOptions"
      :key="componentKey"
    />
    <v-card-text class="central-label text-center pa-0">
      {{ label }}: {{ formattedValue }} {{ unit }}
    </v-card-text>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue"
import VueGauge from "vue-gauge"

const props = defineProps({
  label: {
    type: String,
    default: "X",
  },
  value: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    default: 5,
  },
  minWarningThreshold: {
    type: Number,
    default: 1,
  },
  maxWarningThreshold: {
    type: Number,
    default: 3,
  },
  minDangerThreshold: {
    type: Number,
    default: 4,
  },
  maxDangerThreshold: {
    type: Number,
    default: 5,
  },
})

const unit = "°"
const chartWidth = ref(300)
const componentKey = ref(0)

const formattedValue = computed(() => {
  return props.value.toFixed(1) // แสดงทศนิยม 1 ตำแหน่ง
})

const gaugeOptions = computed(() => {
  const rangeMax = props.maxValue
  const totalRange = rangeMax * 2
  const needlePercentage = ((props.value + rangeMax) / totalRange) * 100

  const negativeWarningStartPos =
    ((-props.maxWarningThreshold + rangeMax) / totalRange) * 100 // -3 => 20%
  const negativeWarningEndPos =
    ((-props.minWarningThreshold + rangeMax) / totalRange) * 100 // -1 => 40%
  const positiveWarningStartPos =
    ((props.minWarningThreshold + rangeMax) / totalRange) * 100 // +1 => 60%
  const positiveWarningEndPos =
    ((props.maxWarningThreshold + rangeMax) / totalRange) * 100 // +3 => 80%

  return {
    needleValue: needlePercentage,
    needleColor: "#2c3e50",
    arcDelimiters: [
      negativeWarningStartPos, // -3 (20%)
      negativeWarningEndPos, // -1 (40%)
      positiveWarningStartPos, // +1 (60%)
      positiveWarningEndPos, // +3 (80%)
    ],
    arcColors: [
      "#F44336", // -5 ถึง -3 (แดง)
      "#FFD54F", // -3 ถึง -1 (เหลือง)
      "#3DCC5B", // -1 ถึง +1 (เขียว)
      "#FFD54F", // +1 ถึง +3 (เหลือง)
      "#F44336", // +3 ถึง +5 (แดง)
    ],
    arcLabels: [
      `-${props.maxWarningThreshold}`, // -3
      `-${props.minWarningThreshold}`, // -1
      `+${props.minWarningThreshold}`, // +1
      `+${props.maxWarningThreshold}`, // +3
    ],
    rangeLabel: [`-${rangeMax}`, `${rangeMax}`],
    rangeLabelFontSize: window.innerWidth < 600 ? 8 : 10,
    arcLabelFontSize: window.innerWidth < 600 ? 6 : 8,
    arcOverEffect: true,
    chartWidth: chartWidth.value,
    hasNeedle: true,
  }
})

const updateChartSize = () => {
  const width = window.innerWidth
  if (width < 600) {
    chartWidth.value = width * 0.35
  } else if (width < 960) {
    chartWidth.value = width * 0.25
  } else if (width < 1264) {
    chartWidth.value = width * 0.2
  } else {
    chartWidth.value = width * 0.09
  }
  componentKey.value++
}

watch(
  () => [
    props.value,
    props.maxValue,
    props.minWarningThreshold,
    props.maxWarningThreshold,
    props.minDangerThreshold,
    props.maxDangerThreshold,
  ],
  () => {
    componentKey.value++
  },
)

onMounted(() => {
  updateChartSize()
  window.addEventListener("resize", updateChartSize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateChartSize)
})
</script>

<style lang="scss" scoped>
.gauge-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.central-label {
  position: absolute;
  top: 9vh;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2vh;
  font-weight: bold;
  color: #333;
}

:deep(text) {
  font-size: 1vh;
}
</style>
