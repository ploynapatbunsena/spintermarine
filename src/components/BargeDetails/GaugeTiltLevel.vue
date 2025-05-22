<template>
  <div class="gauge-container">
    <vue-gauge
      :refid="'_' + Math.random().toString(36).substr(2, 9)"
      :class="'metricsGauge'"
      :options="gaugeOptions"
      :key="value"
    />
    <div class="central-label">{{ label }}: {{ value }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, defineProps } from 'vue';
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
});

const chartWidthVw = ref(10);

const gaugeOptions = computed(() => {
  const needlePercentage = ((props.value + 6) / 12) * 100;

  const delimiters = [
    (1 / 12) * 100, // -5
    (3 / 12) * 100, // -3
    (9 / 12) * 100, // 3
    (11 / 12) * 100, // 5
  ];

  const colors = ["#DC2B2B", "#FFC107", "#28A745", "#FFC107", "#DC2B2B"];
  const labels = ["-5", "-3", "3", "5"];

  const chartWidth = (chartWidthVw.value / 100) * window.innerWidth;

  return {
    needleValue: needlePercentage,
    needleColor: "#355F2E",
    arcDelimiters: delimiters,
    arcColors: colors,
    arcLabels: labels,
    rangeLabelFontSize: 16,
    arcLabelFontSize: 14,
    arcOverEffect: true,
    chartWidth: chartWidth,
    rangeLabel: ["-6", "6"],
    hasNeedle: true,
  };
});

const updateChartWidth = () => {
  chartWidthVw.value = (10 / 100) * window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateChartWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateChartWidth);
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