<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">{{ report.name }}</div>
      <div class="title-thai">{{ report.nameThai }}</div>

      <!-- Filter Form -->
      <v-card class="mt-4">
        <v-card-text class="mx-16 my-6">
          <v-row>
            <!-- Device Dropdown -->
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedTugboat"
                :items="tugboatList"
                item-title="title"
                item-value="id"
                label="Device"
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
                        :color="isPartialSelection ? 'indigo-darken-4' : undefined"
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
        <!-- Results -->
        <v-card-text v-if="showResult">
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

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import { reports, tugboats } from '@/data/config';
import { computed, ref } from 'vue';
import '@/assets/colors.scss';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'WindSpeedImpactReport',
  components: {
    NavigationBar,
    SpaceBar,
    apexchart: VueApexCharts,
  },

  setup() {
    const report = computed(() => reports.find(report => report.id === 'report03'));
    const selectedTugboat = ref([]); // เก็บรายการที่เลือก
    const startDate = ref('');
    const endDate = ref('');
    const showResult = ref(false);

    const tugboatList = computed(() => {
      return Array.isArray(tugboats) ? tugboats.map((tugboat) => ({
        id: tugboat.id,
        title: tugboat.name,
      })) : [];
    });

    // เช็กว่าเลือกทั้งหมดหรือไม่
    const isAllSelected = computed(() => {
      return selectedTugboat.value?.length === tugboatList.value?.length;
    });

    // เช็กว่าเลือกบางส่วนหรือไม่
    const isPartialSelection = computed(() => {
      return selectedTugboat.value?.length > 0 && !isAllSelected.value;
    });

    // เลือกทั้งหมด/ยกเลิกทั้งหมด
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedTugboat.value = [];
      } else {
        selectedTugboat.value = tugboatList.value.map((item) => item.id);
      }
    };

    // อัปเดตการเลือก
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

    const searchRecords = () => {
      // ดึงชื่อ tugboat ตาม id ที่เลือก
      const selectedTugboatNames = selectedTugboat.value.map((id) => {
        const found = tugboatList.value.find((tugboat) => tugboat.id === id);
        return found ? found.title : id;
        
      });

      // อัปเดต categories ใน xaxis
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
        type: "column",
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6, 3, 3.1],
      },
      {
        name: "Speed (km/h)",
        type: "column",
        data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 10],
      },
      {
        name: "%Throttle (%)",
        type: "column",
        data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 4.6, 3, 3.1],
      },
      {
        name: "Wind Speed (m/s)",
        type: "line",
        data: [20, 29, 37, 36, 44, 45, 50, 58, 32, 43, 12, 11, 8, 34, 66, 42, 11, 19, 7, 3, 5, 23, 30, 50, 12],
      },
    ]);

    const chartOptions = ref({
      chart: {
        height: 680,
        type: "line",
        stacked: false,
      },
      colors: ["#352B54", "#FAC12A", "#DC2B2B", "#4D97FF"],
      fill: { opacity: 1 },
      dataLabels: { enabled: false },
      xaxis: { categories: [] },
      yaxis: [
        {
          seriesName: "RPM",
          axisTicks: { show: true },
          axisBorder: { show: true, color: "#352B54" },
          labels: { style: { colors: "#352B54" } },
          title: { text: "RPM (RPM)", style: { color: "#352B54" } },
        },
        {
          seriesName: "Speed",
          opposite: true,
          axisTicks: { show: true },
          axisBorder: { show: true, color: "#FAC12A" },
          labels: { style: { colors: "#FAC12A" } },
          title: { text: "Speed (km/h)", style: { color: "#FAC12A" } },
        },
        {
          seriesName: "%Throttle",
          axisTicks: { show: true },
          axisBorder: { show: true, color: "#DC2B2B" },
          labels: { style: { colors: "#DC2B2B" } },
          title: { text: "%Throttle", style: { color: "#DC2B2B" } },
        },
        {
          seriesName: "Wind Speed",
          opposite: true,
          axisTicks: { show: true },
          axisBorder: { show: true, color: "#4D97FF" },
          labels: { style: { colors: "#4D97FF" } },
          title: { text: "Wind Speed (m/s)", style: { color: "#4D97FF" } },
        },
      ],
      // tooltip: {
      //   fixed: {
      //     enabled: true,
      //     position: "topLeft",
      //     offsetY: 30,
      //     offsetX: 60,
      //   },
      // },
      legend: {
        horizontalAlign: "center",
        offsetY: 16,
      },
    });

    return {
      report,
      selectedTugboat,
      tugboatList,
      isAllSelected,
      isPartialSelection,
      toggleSelectAll,
      handleSelection,
      startDate,
      endDate,
      searchRecords,
      resetFilters,
      showResult,
      series,
      chartOptions,
    };
  },
}
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
  background-color: var(--red);
  color: var(--white);
  border-radius: 10px;
}

.search-btn {
  background-color: var(--light-blue);
  color: var(--white);
  border-radius: 10px;  
}

.download-btn {
  background-color: var(--yellow);
  color: var(--white);
  border-radius: 10px;  
}
</style>