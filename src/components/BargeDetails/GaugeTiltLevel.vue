<template>
  <div class="gauge-container">
    <vue-gauge
      :refid="'_' + Math.random().toString(36).substr(2, 9)"
      :class="'metricsGauge'"
      :options="gaugeOptions"
    />
    <div class="central-label">{{ label }}: {{ value }}</div>
  </div>
</template>

<script>
import VueGauge from "vue-gauge";

export default {
  name: "GaugeTiltLevel",
  components: { VueGauge },
  props: {
    label: {
      type: String,
      default: "X",
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    gaugeOptions() {
      const needlePercentage = (this.value / 8) * 100;

      const delimiters = [
        (1 / 8) * 100,
        (2 / 8) * 100,
        (6 / 8) * 100,
        (7 / 8) * 100,
      ];

      const colors = [
        "#DC2B2B",
        "#FFC107",
        "#28A745",
        "#FFC107",
        "#DC2B2B",
      ];

      const labels = ["-3", "-2", "2", "3"];

      return {
        needleValue: needlePercentage,
        needleColor: "#355F2E", // สีของเข็ม
        arcDelimiters: delimiters,
        arcColors: colors, // กำหนดสีของแต่ละช่วง
        arcLabels: labels,
        rangeLabelFontSize: 16,
        arcLabelFontSize: 14, // ขนาดตัวอักษร
        arcOverEffect: true,
        chartWidth: 400, // ปรับความกว้างของ Gauge
        rangeLabel: ["-4", "4"], // ช่วงค่าของเกจ
        hasNeedle: true,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.gauge-container {
  position: relative;
  width: 350px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.central-label {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px; // ปรับขนาดตัวอักษรให้เล็กลง
  font-weight: bold;
  color: #333;
}

:deep(text) {
  font-size: 16px; // ปรับขนาดตัวอักษรของ label
}
</style>