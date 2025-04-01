<template>
  <div>
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
          <v-icon size="24">mdi-bell-ring</v-icon>
        </v-badge>
      </template>

      <v-card min-width="300" class="pa-2 rounded-lg">
        <v-card-title class="alert-title">
          Alert
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
            <v-list-item-title class="alert-detail">{{ item.title }}: {{ item.value }} {{ item.unit }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="dangerMeasurements.length === 0">
            <v-list-item-title class="alert-detail">ไม่พบค่าวัดที่อยู่ในสถานะอันตราย</v-list-item-title>
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
          <v-icon size="24">mdi-alert</v-icon>
        </v-badge>
      </template>

      <v-card min-width="300" class="pa-2 rounded-lg">
        <v-card-title class="alert-title">
          Warning
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
            <v-list-item-title class="alert-detail">{{ item.title }}: {{ item.value }} {{ item.unit }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="warningMeasurements.length === 0">
            <v-list-item-title class="alert-detail">ไม่พบค่าวัดที่อยู่ในสถานะเตือน</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { measurementLimits_B } from '@/data/config.js';
import '@/assets/colors.scss';

export default {
  name: "AlertFunction",
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      showDangerMenu: false,
      showWarningMenu: false,
      measurementTitles: {
        axisX: 'แกน x',
        axisY: 'แกน y',
        oilPressure: 'แรงดันน้ำมัน',
        waterTemperature: 'อุณหภูมิน้ำ',
        rpm: 'ความเร็วรอบ',
        windSpeed: 'ความเร็วลม',
        battery: 'แบตเตอรี่'
      },
      measurementUnits: {
        axisX: 'degree',
        axisY: 'degree',
        oilPressure: 'Bar',
        waterTemperature: '°C',
        rpm: 'RPM',
        windSpeed: 'km/h',
        battery: 'V'
      }
    };
  },

  computed: {
    // ปรับปรุงส่วนของ dangerMeasurements computed property
    dangerMeasurements() {
      const result = [];
      
      if (this.item && this.item.measurements) {
        const measurements = this.item.measurements;
        
        // ตรวจสอบแต่ละค่าการวัด
        for (const key in measurements) {
          if (Object.prototype.hasOwnProperty.call(measurements, key) && 
              Object.prototype.hasOwnProperty.call(measurementLimits_B, key)) {
            const value = measurements[key];
            
            // ตรวจสอบว่า measurementLimits[key] และ measurementLimits[key].danger มีอยู่จริง
            if (measurementLimits_B[key] && measurementLimits_B[key].danger) {
              const limits = measurementLimits_B[key].danger;
              
              // ตรวจสอบว่า limits.min และ limits.max มีค่าหรือไม่
              if (limits.min !== undefined && limits.max !== undefined) {
                if (value <= limits.min || value >= limits.max) {
                  // ตรวจสอบว่า normal limits มีอยู่จริง
                  const normalMin = measurementLimits_B[key].normal?.min;
                  const normalMax = measurementLimits_B[key].normal?.max;
                  
                  result.push({
                    title: this.measurementTitles[key] || key,
                    value,
                    unit: this.measurementUnits[key] || '',
                    limits: {
                      min: normalMin !== undefined ? normalMin : 'N/A',
                      max: normalMax !== undefined ? normalMax : 'N/A'
                    }
                  });
                }
              }
            }
          }
        }
      }
      return result;
    },
    
    warningMeasurements() {
      const result = [];
      
      if (this.item && this.item.measurements) {
        const measurements = this.item.measurements;
        
        // ตรวจสอบแต่ละค่าการวัด
        for (const key in measurements) {
          if (Object.prototype.hasOwnProperty.call(measurements, key) && 
              Object.prototype.hasOwnProperty.call(measurementLimits_B, key)) {
            const value = measurements[key];
            
            // ตรวจสอบว่า properties ที่ต้องการมีอยู่จริง
            if (measurementLimits_B[key] && 
                measurementLimits_B[key].warning && 
                measurementLimits_B[key].danger) {
              
              const warningLimits = measurementLimits_B[key].warning;
              const dangerLimits = measurementLimits_B[key].danger;
              
              // ตรวจสอบว่าค่า min และ max มีอยู่จริง
              if (warningLimits.min !== undefined && warningLimits.max !== undefined &&
                  dangerLimits.min !== undefined && dangerLimits.max !== undefined) {
                
                // อยู่ในช่วง warning แต่ไม่อยู่ในช่วง danger
                if ((value <= warningLimits.max && value >= warningLimits.min) && 
                    !(value <= dangerLimits.min || value >= dangerLimits.max)) {
                  
                  // ตรวจสอบว่า normal limits มีอยู่จริง
                  const normalMin = measurementLimits_B[key].normal?.min;
                  const normalMax = measurementLimits_B[key].normal?.max;
                  
                  result.push({
                    title: this.measurementTitles[key] || key,
                    value,
                    unit: this.measurementUnits[key] || '',
                    normalLimits: {
                      min: normalMin !== undefined ? normalMin : 'N/A',
                      max: normalMax !== undefined ? normalMax : 'N/A'
                    }
                  });
                }
              }
            }
          }
        }
      }
      
      return result;
    },

    dangerCount() {
      return this.dangerMeasurements.length;
    },
    
    warningCount() {
      return this.warningMeasurements.length;
    }
  },

  methods: {
    closeDangerMenu() {
      this.showDangerMenu = false;
    },
    
    closeWarningMenu() {
      this.showWarningMenu = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-badge {
  color: var(--red);
  margin-right: 16px;
  cursor: pointer;

  :deep(.v-badge__badge) {
    background-color: var(--red);
    border: 2px solid var(--red);
    color: var(--white);
    font-weight: 700;
    font-family: 'Inter', sans-serif;
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
    font-family: 'Inter', sans-serif;
  }
}

.alert-title {
  font-size: 18px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}

.alert-detail {
  font-family: 'Sarabun', sans-serif;
}
</style>