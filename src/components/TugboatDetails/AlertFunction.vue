<template>
  <v-menu
    v-model="showDangerMenu"
    :close-on-content-click="false"
    location="bottom"
    offset-y
  >
    <template v-slot:activator="{ props }">
      <v-badge
        class="alert-badge"
        :content="dangerCount.toString()"
        v-show="dangerCount >= 0"
        v-bind="props"
      >
        <v-icon style="font-size: 2.5vh">mdi-bell-ring</v-icon>
      </v-badge>
    </template>

    <v-card min-width="300" class="pa-2">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        {{ tugboat.name }} - ค่าวัดที่อยู่ในสถานะอันตราย
      </v-card-title>
      <v-divider></v-divider>
      <v-list density="compact">
        <v-list-item
          v-for="(item, index) in dangerMeasurements"
          :key="index"
          class="py-1"
        >
          <template v-slot:prepend>
            <v-icon color="red">mdi-alert-circle</v-icon>
          </template>
          <v-list-item-title
            >{{ item.title }}: {{ item.value }}
            {{ item.unit }}</v-list-item-title
          >
          <v-list-item-subtitle>
            เกณฑ์ปกติ: {{ item.limits.min }} - {{ item.limits.max }}
            {{ item.unit }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="dangerMeasurements.length === 0">
          <v-list-item-title
            >ไม่พบค่าวัดที่อยู่ในสถานะอันตราย</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>

  <v-menu
    v-model="showWarningMenu"
    :close-on-content-click="false"
    location="bottom"
    offset-y
  >
    <template v-slot:activator="{ props }">
      <v-badge
        class="warning-badge"
        :content="warningCount.toString()"
        v-show="warningCount >= 0"
        v-bind="props"
      >
        <v-icon style="font-size: 2.5vh">mdi-alert</v-icon>
      </v-badge>
    </template>

    <v-card min-width="300" class="pa-2">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        {{ tugboat.name }} - ค่าวัดที่อยู่ในสถานะเตือน
      </v-card-title>
      <v-divider></v-divider>
      <v-list density="compact">
        <v-list-item
          v-for="(item, index) in warningMeasurements"
          :key="index"
          class="py-1"
        >
          <template v-slot:prepend>
            <v-icon color="amber-darken-2">mdi-alert</v-icon>
          </template>
          <v-list-item-title
            >{{ item.title }}: {{ item.value }}
            {{ item.unit }}</v-list-item-title
          >
          <v-list-item-subtitle>
            เกณฑ์ปกติ: {{ item.normalLimits.min }} -
            {{ item.normalLimits.max }} {{ item.unit }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="warningMeasurements.length === 0">
          <v-list-item-title>ไม่พบค่าวัดที่อยู่ในสถานะเตือน</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { measurementLimits_T } from "@/config/config.js"
import "@/assets/colors.scss"

export default {
  name: "AlertFunction",
  props: {
    tugboat: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      showDangerMenu: false,
      showWarningMenu: false,
      measurementTitles: {
        oilPressure: "แรงดันน้ำมัน",
        waterTemperature: "อุณหภูมิน้ำ",
        rpm: "ความเร็วรอบ",
        windSpeed: "ความเร็วลม",
        battery: "แบตเตอรี่",
      },
      measurementUnits: {
        oilPressure: "Bar",
        waterTemperature: "°C",
        rpm: "RPM",
        windSpeed: "km/h",
        battery: "V",
      },
    }
  },

  computed: {
    // ปรับปรุงส่วนของ dangerMeasurements computed property
    dangerMeasurements() {
      const result = []

      if (this.tugboat && this.tugboat.measurements) {
        const measurements = this.tugboat.measurements

        // ตรวจสอบแต่ละค่าการวัด
        for (const key in measurements) {
          if (
            Object.prototype.hasOwnProperty.call(measurements, key) &&
            Object.prototype.hasOwnProperty.call(measurementLimits_T, key)
          ) {
            const value = measurements[key]

            // ตรวจสอบว่า measurementLimits[key] และ measurementLimits[key].danger มีอยู่จริง
            if (measurementLimits_T[key] && measurementLimits_T[key].danger) {
              const limits = measurementLimits_T[key].danger

              // ตรวจสอบว่า limits.min และ limits.max มีค่าหรือไม่
              if (limits.min !== undefined && limits.max !== undefined) {
                if (value <= limits.min || value >= limits.max) {
                  // ตรวจสอบว่า normal limits มีอยู่จริง
                  const normalMin = measurementLimits_T[key].normal?.min
                  const normalMax = measurementLimits_T[key].normal?.max

                  result.push({
                    title: this.measurementTitles[key] || key,
                    value,
                    unit: this.measurementUnits[key] || "",
                    limits: {
                      min: normalMin !== undefined ? normalMin : "N/A",
                      max: normalMax !== undefined ? normalMax : "N/A",
                    },
                  })
                }
              }
            }
          }
        }
      }
      return result
    },

    warningMeasurements() {
      const result = []

      if (this.tugboat && this.tugboat.measurements) {
        const measurements = this.tugboat.measurements

        // ตรวจสอบแต่ละค่าการวัด
        for (const key in measurements) {
          if (
            Object.prototype.hasOwnProperty.call(measurements, key) &&
            Object.prototype.hasOwnProperty.call(measurementLimits_T, key)
          ) {
            const value = measurements[key]

            // ตรวจสอบว่า properties ที่ต้องการมีอยู่จริง
            if (
              measurementLimits_T[key] &&
              measurementLimits_T[key].warning &&
              measurementLimits_T[key].danger
            ) {
              const warningLimits = measurementLimits_T[key].warning
              const dangerLimits = measurementLimits_T[key].danger

              // ตรวจสอบว่าค่า min และ max มีอยู่จริง
              if (
                warningLimits.min !== undefined &&
                warningLimits.max !== undefined &&
                dangerLimits.min !== undefined &&
                dangerLimits.max !== undefined
              ) {
                // อยู่ในช่วง warning แต่ไม่อยู่ในช่วง danger
                if (
                  value <= warningLimits.max &&
                  value >= warningLimits.min &&
                  !(value <= dangerLimits.min || value >= dangerLimits.max)
                ) {
                  // ตรวจสอบว่า normal limits มีอยู่จริง
                  const normalMin = measurementLimits_T[key].normal?.min
                  const normalMax = measurementLimits_T[key].normal?.max

                  result.push({
                    title: this.measurementTitles[key] || key,
                    value,
                    unit: this.measurementUnits[key] || "",
                    normalLimits: {
                      min: normalMin !== undefined ? normalMin : "N/A",
                      max: normalMax !== undefined ? normalMax : "N/A",
                    },
                  })
                }
              }
            }
          }
        }
      }

      return result
    },

    dangerCount() {
      return this.dangerMeasurements.length
    },

    warningCount() {
      return this.warningMeasurements.length
    },
  },

  methods: {
    closeDangerMenu() {
      this.showDangerMenu = false
    },

    closeWarningMenu() {
      this.showWarningMenu = false
    },
  },
}
</script>

<style lang="scss" scoped>
.alert-badge {
  color: var(--red);
  margin-right: 1vh;
  cursor: pointer;

  :deep(.v-badge__badge) {
    background-color: var(--red);
    border: 2px solid var(--red);
    color: var(--white);
    font-weight: 700;
    font-family: "Inter", sans-serif;
  }
}

.warning-badge {
  color: var(--yellow);
  cursor: pointer;

  :deep(.v-badge__badge) {
    background-color: var(--yellow);
    border: 2px solid var(--yellow);
    color: var(--black);
    font-weight: 700;
    font-family: "Inter", sans-serif;
  }
}
</style>
