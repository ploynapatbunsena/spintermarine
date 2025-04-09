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

<script>
import VueGauge from "vue-gauge";

export default {
  name: "GaugeChart",
  components: { VueGauge },
  props: {
    title: {
      type: String,
      default: "",
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
      default: () => ["0", "100"],
    },
    centralLabel: {
      type: String,
      default: "",
    },
    needleColor: {
      type: String,
      default: "#355F2E",
    },
  },
  data() {
    return {
      chartWidthVw: 15, // ขนาดเริ่มต้นเป็น vw (viewport width)
    };
  },
  computed: {
    gaugeOptions() {
      const needlePercentage = (this.value / this.maxValue) * 100;
      const chartWidth = (this.chartWidthVw / 100) * window.innerWidth;

      return {
        needleValue: needlePercentage,
        needleColor: this.needleColor,
        arcDelimiters: this.delimiters,
        arcColors: this.colors,
        arcLabels: this.labels,
        rangeLabelFontSize: 16,
        arcLabelFontSize: 10,
        arcOverEffect: true,
        chartWidth: chartWidth, // ใช้ chartWidth ที่คำนวณจากขนาดหน้าจอ
        rangeLabel: this.rangeLabel,
        hasNeedle: true,
      };
    },
  },
  mounted() {
    window.addEventListener("resize", this.updateChartWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateChartWidth);
  },
  methods: {
    updateChartWidth() {
      this.$forceUpdate(); // บังคับให้ Vue อัปเดต UI เมื่อขนาดหน้าจอเปลี่ยน
    },
  },
};
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

