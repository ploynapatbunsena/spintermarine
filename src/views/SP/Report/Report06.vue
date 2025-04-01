<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container>
      <div class="title">{{ report.name }}</div>
      <div class="title-thai">{{ report.nameThai }}</div>
      <v-card class="mt-4">
        <v-card-text class="mx-16 my-6">
          <v-row>
            <!-- Tugboat Dropdown -->
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedTugboat"
                :items="tugboatList"
                item-title="title"
                item-value="id"
                label="Tugboat"
                variant="outlined"
                density="compact"
                multiple
                clearable
                :menu-props="{ closeOnContentClick: false }"
                @update:modelValue="handleSelection"
              >
                <template v-slot:prepend-item>
                  <v-list-item title="Select All" @click="toggleSelectAll">
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :color="isPartialSelection ? '#FAC12A' : undefined"
                        :indeterminate="isPartialSelection"
                        :model-value="isAllSelected"
                      ></v-checkbox-btn>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ index }">
                  <span v-if="index === 0">{{ selectedTugboat.length }} selected</span>
                </template>
              </v-select>
            </v-col>

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

            <v-col cols="6" md="3">
              <v-row>
                <v-col cols="6" md="4" class="px-0">
                  <v-btn
                    prepend-icon="mdi-close"
                    class="cancel-btn"
                    @click="resetFilters"
                  >
                    Cancel
                  </v-btn>
                </v-col>
                <v-col cols="6" md="4" class="px-0">
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

        <!-- Result -->
        <v-card-text width="100%" v-if="showResult">
          <apexchart
            type="line"
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
import { reports, tugboats } from '@/data/config';
import { computed, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const report = computed(() => reports.find(report => report.id === 'report06'));
const selectedTugboat = ref([]);
const startDate = ref('');
const endDate = ref('');
const showResult = ref(false);
const apexchart = ref(VueApexCharts);

const tugboatList = computed(() => {
  return tugboats.map((tugboat) => ({
    id: tugboat.id,
    title: tugboat.name
  }))
});

const isAllSelected = computed(() => {
  return selectedTugboat.value?.length === tugboatList.value?.length;
});

const isPartialSelection = computed(() => {
  return selectedTugboat.value?.length > 0 && !isAllSelected.value
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTugboat.value = [];
  } else {
    selectedTugboat.value = tugboatList.value.map((item) => item.id);
  }
};

const handleSelection = () => {
  if (selectedTugboat.value.length === tugboatList.value.length) {
    selectedTugboat.value = tugboatList.value.map((item) => item.id);
  }
};

const resetFilters = () => {
  selectedTugboat.value = [];
  startDate.value = '';
  endDate.value = '';
  showResult.value = false;
};

// const searchRecords = () => {
//   const selectedTugboatNames = selectedTugboat.value.map((id) => {
//     const found = tugboatList.value.find((tugboat) => tugboat.id === id);
//     return found ? found.title : id;
//   });

//   chartOptions.value = {
//     ...chartOptions.value,
//     xaxis: {
//       categories: selectedTugboatNames,
//     },
//   };
  
//   showResult.value = true;
// };

const searchRecords = () => {
  // ถ้าไม่มีการเลือกอุปกรณ์ ไม่ต้องแสดงผล
  if (!selectedTugboat.value || selectedTugboat.value.length === 0) {
    showResult.value = false;
    return;
  }
  
  // รายชื่ออุปกรณ์ที่เลือก
  const selectedTugboatNames = selectedTugboat.value.map((id) => {
    const found = tugboatList.value.find((tugboat) => tugboat.id === id);
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
      type: "line",
      data: generateRandomData(selectedTugboat.value.length),
    },
    {
      name: "Fuel Rate (m³/h)",
      type: "line",
      data: generateRandomData(selectedTugboat.value.length),
    },
    {
      name: "%Throttle (%)",
      type: "line",
      data: generateRandomData(selectedTugboat.value.length),
    },
  ];
  
  // อัปเดตหมวดหมู่ของแกน X เป็นชื่ออุปกรณ์ที่เลือก
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      categories: selectedTugboatNames,
    },
  };
  
  showResult.value = true;
};

const series = ref([
  {
    name: "RPM (RPM)",
    type: "line",
    data: [6.8, 2.4, 9.1, 4.5, 7.3, 1.9, 5.0, 8.6, 3.2, 0.7, 6.1, 2.9, 9.4, 4.0, 7.7, 1.3, 5.8, 8.2, 3.6, 0.5, 6.4, 2.0, 9.8, 4.3, 7.5],
  },
  {
    name: "Fuel Rate (m³/h)",
    type: "line",
    data: [31.6, 8.4, 3.9, 5.2, 0.1, 7.8, 4.6, 9.3, 2.5, 6.7, 1.0, 8.9, 3.1, 5.4, 0.8, 7.2, 4.9, 9.6, 2.3, 6.0, 1.7, 8.5, 3.8, 5.1, 0.4],
  },
  {
    name: "%Throttle (%)",
    type: "line",
    data: [3.4, 7.2, 0.9, 5.6, 8.1, 2.3, 9.0, 4.7, 6.5, 1.8, 3.9, 7.0, 5.3, 2.1, 8.8, 0.4, 6.2, 9.7, 4.1, 1.5, 3.6, 7.9, 5.0, 2.7, 8.3],
  },
]);

const chartOptions = ref({
  chart: {
    height: 680,
    type: "line",
    stacked: true,
  },
  colors: ["#352B54", "#FAC12A", "#DC2B2B"],
  stroke: { curve: 'smooth' },
  fill: { opacity: 1 },
  dataLabels: { enabled: false },
  yaxis: [
    {
      seriesName: "RPM (RPM)",
      axisTicks: { show: true },
      labels: { style: { colors: "#352B54" } },
      title: { text: "RPM (RPM)", style: { color: "#352B54" } },
    },
    {
      seriesName: "Fuel Rate (m³/h)",
      opposite: true,
      axisTicks: { show: true },
      labels: { style: { colors: "#FAC12A" } },
      title: { text: "Fuel Rate (m³/h)", style: { color: "#FAC12A" } },
    },
    {
      seriesName: "%Throttle (%)",
      axisTicks: { show: true },
      labels: { style: { colors: "#DC2B2B" } },
      title: { text: "%Throttle (%)", style: { color: "#DC2B2B" } },
    },
  ],
  legend: {
    horizontalAlign: "center",
  },
});
</script>

<style scoped>
.title {
  font-size: 20px;
  font-weight: 600;
}

.title-thai {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
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