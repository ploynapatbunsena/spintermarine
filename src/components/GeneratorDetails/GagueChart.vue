<template>
  <v-container>
    <div class="container">
      <p class="gauge-title">{{ title }}</p>
      <vue-gauge
        :refid="'_' + Math.random().toString(36).substr(2, 9)"
        :class="'meticsGauge'"
        :options="gaugeOptions"
        :key="chartWidthVw"
      />
      <div class="central-label">{{ centralLabel }}</div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import VueGauge from 'vue-gauge';
defineProps({
  title: {
    type: String,
    default: '',
  },
  value: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    default: 100,
  },
  delimiters: {
    type: Array,
    default: () => [],
  },
  colors: {
    type: Array,
    default: () => [],
  },
  labels: {
    type: Array,
    default: () => [],
  },
  rangeLabel: {
    type: Array,
    default: () => ['0', '100'],
  },
  centralLabel: {
    type: String,
    default: '',
  },
  needleColor: {
    type: String,
    default: '#355F2E',
  },
});

const chartWidthVw = ref(15);

const gaugeOptions = computed(() => {
  const needlePercentage = (value / maxValue) * 100;
  const chartWidth = (chartWidthVw.value / 100) * window.innerWidth;

  return {
    needleValue: needlePercentage,
    needleColor: needleColor,
    arcDelimiters: delimiters,
    arcColors: colors,
    arcLabels: labels,
    rangeLabelFontSize: 16,
    arcLabelFontSize: 10,
    arcOverEffect: true,
    chartWidth,
    rangeLabel,
    hasNeedle: true,
  };
});

const updateChartWidth = () => {
  chartWidthVw.value = chartWidthVw.value; // บังคับให้ Vue อัปเดต
};

onMounted(() => {
  window.addEventListener('resize', updateChartWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateChartWidth);
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.gauge-title {
  font-size: 1.5vh;
  font-weight: 500;
  color: var(--dark-gray)
}

.gauge-wrapper {
  position: relative;
}

.central-label {
  font-family: 'Inter', sans-serif;
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3vh;
  font-weight: bold;
}

:deep(text) {
  font-size: 1vh;
}
</style>

