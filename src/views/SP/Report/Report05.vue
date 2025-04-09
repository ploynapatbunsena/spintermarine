<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">{{ report.name }}</div>
      <div class="title-thai">{{ report.nameThai }}</div>
      <v-card class="mt-4">
        <v-card-text class="mx-16 my-6">
          <v-row>
            <!-- Barge Dropdown -->
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedBarge"
                :items="bargeList"
                item-title="title"
                item-value="id"
                label="Barge"
                @update:model-value="onBargeChange"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
            <!-- GEN Dropdown -->
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedDevice"
                :items="deviceList"
                item-title="title"
                item-value="id"
                label="Device"
                variant="outlined"
                density="compact"
                :disabled="!selectedBarge"
                multiple
                clearable
                @update:modelValue="handleSelection"
              >
                <template v-slot:prepend-item>
                  <v-list-item title="Select All" @click="toggleSelectAll">
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :color="isPartialSelection ? 'indigo-darken-4' : undefined"
                        :indeterminate="isPartialSelection"
                        :model-value="isAllSelected"
                      ></v-checkbox-btn>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ index }">
                  <span v-if="index === 0">{{ selectedDevice.length }} selected</span>
                </template>
              </v-select>
            </v-col>
            <!-- Date Pickers -->
            <!-- Start Date -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <!-- End Date -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="endDate"
                label="End Date"
                type="date"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-row>
                <v-col cols="6" md="4">
                  <v-btn
                    prepend-icon="mdi-close"
                    class="cancel-btn"
                    @click="resetFilters"
                  >
                    Cancel
                  </v-btn>
                </v-col>
                <v-col cols="6" md="4">
                  <v-btn
                    prepend-icon="mdi-magnify"
                    class="search-btn"
                    @click="searchRecords"
                  >
                    Search
                  </v-btn>
                </v-col>
                <v-col cols="6" md="4" class="px-0">
                  <v-btn
                    prepend-icon="mdi-arrow-down"
                    class="download-btn"
                    @click="downloadReport"
                  >
                    Download
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- Results -->
        <v-card-text v-if="showResult">
          <apexchart
            type="bar"
            height="680"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </v-card-text>
      </v-card> 
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import { barges, reports } from '@/data/config';
import { computed, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const report = computed(() => reports.find(report => report.id === 'report05'));
const selectedBarge = ref([]);
const selectedDevice = ref([]);
const startDate = ref('');
const endDate = ref('');
const showResult = ref(false);
const apexchart = ref(VueApexCharts);

const bargeList = computed(() =>
  barges.map((barge) => ({ id: barge.id, title: barge.name })),
);

const deviceList = computed(() => {
  if (!selectedBarge.value) return [];

  const selectedBargeData = barges.find(b => b.id === selectedBarge.value);
  if (!selectedBargeData) return [];
  
  return selectedBargeData.items.map(item => ({
      id: item.id,
      title: item.title
    }))
});

const onBargeChange = () => {
  selectedDevice.value = null;
};

const isAllSelected = computed(() => {
  return selectedDevice.value?.length === deviceList.value?.length;
});

const isPartialSelection = computed(() => {
  return selectedDevice.value?.length > 0 && !isAllSelected.value;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedDevice.value = [];
  } else {
    selectedDevice.value = deviceList.value.map((item) => item.id);
  }
};

const handleSelection = () => {
  if (selectedDevice.value.length === deviceList.value.length) {
    selectedDevice.value = deviceList.value.map((item) => item.id);
  }
};

const resetFilters = () => {
  selectedBarge.value = null;
  selectedDevice.value = [];
  startDate.value = '';
  endDate.value = '';
  showResult.value = false;
};

// const searchRecords = () => {
//   const selectedGenNames = selectedDevice.value.map((id) => {
//     const found = deviceList.value.find((gen) => gen.id === id);
//     return found ? found.title : id;
//   });

//   chartOptions.value = {
//     ...chartOptions.value,
//     xaxis: {
//       categories: selectedGenNames,
//     },
//   };

//   showResult.value = true;
// };

// ปรับปรุงฟังก์ชัน searchRecords
const searchRecords = () => {
  // ถ้าไม่มีการเลือกอุปกรณ์ ไม่ต้องแสดงผล
  if (!selectedDevice.value || selectedDevice.value.length === 0) {
    showResult.value = false;
    return;
  }
  
  // รายชื่ออุปกรณ์ที่เลือก
  const selectedGenNames = selectedDevice.value.map((id) => {
    const found = deviceList.value.find((gen) => gen.id === id);
    return found ? found.title : id;
  });
  
  // สร้างข้อมูลจำลองตามจำนวนอุปกรณ์ที่เลือก
  // (ในการใช้งานจริง คุณจะดึงข้อมูลจริงจาก API หรือแหล่งข้อมูลอื่น)
  const generateRandomData = (count) => {
    return Array.from({ length: count }, () => +(Math.random() * 10).toFixed(1));
  };
  
  // อัปเดตชุดข้อมูลตามจำนวนอุปกรณ์ที่เลือก
  series.value = [
    {
      name: "RPM (RPM)",
      type: "bar",
      data: generateRandomData(selectedDevice.value.length),
    },
    {
      name: "Fuel Rate",
      type: "bar",
      data: generateRandomData(selectedDevice.value.length),
    },
  ];
  
  // อัปเดตหมวดหมู่ของแกน X เป็นชื่ออุปกรณ์ที่เลือก
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      categories: selectedGenNames,
    },
  };
  
  showResult.value = true;
};

const series = ref([
  {
    name: "RPM (RPM)",
    type: "bar",
    data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6, 3],
  },
  {
    name: "Fuel Rate",
    type: "bar",
    data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 1.1],
  },
]);

const chartOptions = ref({
  chart: {
    height: 680,
    type: "bar",
    toolbar: { show: true },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6,
      borderRadiusApplication: 'end'
    }
  },
  colors: ["#352B54", "#FAC12A"],
  fill: { opacity: 1 },
  dataLabels: { enabled: false },
  legend: {
    horizontalAlign: "center",
    offsetY: 16,
  },
});

</script>

<style scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.title-thai {
  font-family: 'Sarabun', sans-serif;
  font-size: 1.5vh;
  font-weight: 400;
}

.cancel-btn {
  background-color: #DC2B2B;
  color: #ffffff;
  border-radius: 10px;
}

.search-btn {
  background-color: #223368;
  color: #ffffff;
  border-radius: 10px;
}

.download-btn {
  background-color: #FAC12A;
  color: #ffffff;
  border-radius: 10px;  
}
</style>