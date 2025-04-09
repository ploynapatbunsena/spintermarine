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
            <!-- Device Dropdown -->
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedBarge"
                :items="bargeList"
                item-title="title"
                item-value="id"
                label="Barge"
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
                  <span v-if="index === 0">{{ selectedBarge.length }} selected</span>
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
import { computed, ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const report = computed(() => reports.find(report => report.id === 'report04'))
const selectedBarge = ref([]);
const sortedSeries = ref([]);
const startDate = ref('');
const endDate = ref('');
const showResult = ref(false);
const apexchart = ref(VueApexCharts);

const bargeList = computed (() => {
  return barges.map((barge) => ({ id: barge.id, title: barge.name }))
});

const isAllSelected = computed(() => {
  return selectedBarge.value?.length === bargeList.value?.length;
});

const isPartialSelection = computed(() => {
  return selectedBarge.value?.length > 0 && !isAllSelected.value;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedBarge.value = [];
  } else {
    selectedBarge.value = bargeList.value.map((item) => item.id);
  }
};

const handleSelection = () => {
  if (selectedBarge.value.length === bargeList.value.length) {
    selectedBarge.value = bargeList.value.map((item) => item.id);
  }
};

const resetFilters = () => {
  selectedBarge.value = [];
  startDate.value = '';
  endDate.value = '';
  showResult.value = false;
};

const searchRecords = () => {
  const selectedBargeNames = selectedBarge.value.map((id) => {
    const found = bargeList.value.find((barge) => barge.id === id);
    return found ? found.title : id;
  });

  let data = series.value[0].data.slice(0, selectedBargeNames.length);

  let combined = selectedBargeNames.map((name, index) => ({
    name: name,
    value: data[index] || 0,
  }));

  combined.sort((a, b) => b.value - a.value);

  const sortedCategories = combined.map(item => item.name);
  const sortedData = combined.map(item => item.value);

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      categories: sortedCategories,
    },
  };
  series.value = [{
    name: "Count Of Alert (Barge Tilt)",
    type: "bar",
    data: sortedData,
  }];

  showResult.value = true;
};

const series = ref([
  {
    name: "Count Of Alert (Barge Tilt)",
    type: "bar",
    data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6, 3, 3.1],
  }
]);

watch(sortedSeries, (newValue) => {
  series.value = [newValue];
});

const chartOptions = ref({
  chart: {
    height: 680,
    type: "bar",
    toolbar: { show: true },
  },
  colors: ["#352B54"],
  fill: { opacity: 1 },
  dataLabels: { enabled: false },
  xaxis: { categories: [] },
  yaxis: [
    {
      seriesName: "Count Of Alert (Barge Tilt)",
      axisTicks: { show: true },
      labels: { style: { colors: "#352B54" } },
      title: { text: "Count Of Alert (Barge Tilt)", style: { color: "#352B54" } },
    }
  ],
  legend: {
    show: true,
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