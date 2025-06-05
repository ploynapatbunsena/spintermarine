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
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import VueGauge from 'vue-gauge';

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
  warningThreshold: {
    type: Number,
    default: 3,
  },
  dangerThreshold: {
    type: Number,
    default: 4,
  },
});

const unit = "°";
const chartWidth = ref(300);
const componentKey = ref(0);

const formattedValue = computed(() => {
  return props.value;
});

const gaugeOptions = computed(() => {
  const rangeMax = props.maxValue;
  const totalRange = rangeMax * 2; // จาก -max ถึง +max
  
  // คำนวณตำแหน่งเข็ม (0 ถึง 100%)
  const needlePercentage = ((props.value + rangeMax) / totalRange) * 100;
  
  // คำนวณจุดแบ่งสำหรับทั้งสองด้าน (บวกและลบ)
  const positiveWarning = ((rangeMax + props.warningThreshold) / totalRange) * 100;
  const positiveDanger = ((rangeMax + props.dangerThreshold) / totalRange) * 100;
  const negativeWarning = ((rangeMax - props.warningThreshold) / totalRange) * 100;
  const negativeDanger = ((rangeMax - props.dangerThreshold) / totalRange) * 100;

  return {
    needleValue: needlePercentage,
    needleColor: '#2c3e50',
    arcDelimiters: [negativeDanger, negativeWarning, positiveWarning, positiveDanger],
    arcColors: ['#F44336', '#FFD54F', '#3DCC5B', '#FFD54F', '#F44336'],
    arcLabels: [
      `-${props.dangerThreshold}`,
      `-${props.warningThreshold}`,
      `${props.warningThreshold}`,
      `${props.dangerThreshold}`
    ],
    rangeLabel: [`-${rangeMax}`, `${rangeMax}`],
    rangeLabelFontSize: window.innerWidth < 600 ? 8 : 10,
    arcLabelFontSize: window.innerWidth < 600 ? 6 : 8,
    arcOverEffect: true,
    chartWidth: chartWidth.value,
    hasNeedle: true,
  };
});

const updateChartSize = () => {
  const width = window.innerWidth;
  if (width < 600) {
    chartWidth.value = width * 0.35;
  } else if (width < 960) {
    chartWidth.value = width * 0.25;
  } else if (width < 1264) {
    chartWidth.value = width * 0.2;
  } else {
    chartWidth.value = width * 0.09;
  }
  componentKey.value++; // Force re-render
};

// Watch for props changes
watch(() => [props.value, props.maxValue, props.warningThreshold, props.dangerThreshold], () => {
  componentKey.value++;
});

onMounted(() => {
  updateChartSize();
  window.addEventListener("resize", updateChartSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateChartSize);
});
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
  font-size: 16px;
}
</style>