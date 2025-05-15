<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Report on Daily Fuel Consumption for the Barge</div>
      <div class="title-thai">รายงานการบริโภคน้ำมันรายวันของทุ่น</div>
      <!-- <v-card class="mt-4">
        <v-card-text class="mx-16 mt-6">
          <v-row>
            <v-col cols="12" md="3">
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
            <v-col cols="12" md="3">
              <v-text-field
                v-model="startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
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
        <v-card-text v-if="showResult" class="mx-16">
          <v-data-table
            :headers="headers"
            :items="resultsWithTotal"
            item-value="id"
            hide-default-footer
            class="elevation-0 mb-12 striped-table custom-table"
            :footer-props="{ 'items-per-page-options': [results.length] }"
          ></v-data-table>
        </v-card-text>
      </v-card> -->
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
// import { computed, ref } from 'vue';

// const selectedBarge = ref([]);
// const startDate = ref('');
// const endDate = ref('');
// const showResult = ref(false);

// const bargeList = computed(() => 
//   barges.map((barge) => ({ id: barge.id, title: barge.name }))
// );

// const resetFilters = () => {
//   selectedBarge.value = [];
//   startDate.value = '';
//   endDate.value = '';
//   showResult.value = false;
// };

// const searchRecords = () => {
//   showResult.value = true;
// };

// const resultsWithTotal = computed(() => {
//   const total = results.value.reduce((acc, item) => {
//     return {
//       meterInBefore: (acc.meterInBefore || 0) + item.meterInBefore,
//       meterInafter: (acc.meterInafter || 0) + item.meterInafter,
//       consume: (acc.consume || 0) + item.consume,
//       meterHourBefore: (acc.meterHourBefore || 0) + item.meterHourBefore,
//       meterHourAfter: (acc.meterHourAfter || 0) + item.meterHourAfter,
//       workingHour: (acc.workingHour || 0) + item.workingHour,
//       litrPerHour: (acc.litrPerHour || 0) + item.litrPerHour,
//       rateSTD: (acc.rateSTD || 0) + item.rateSTD,
//       perDay: (acc.perDay || 0) + item.perDay,
//       diff: (acc.diff || 0) + item.diff,
//       remaining: (acc.remaining || 0) + item.remaining,
//     };
//   }, {});

//   const totalRow = {
//     id: 'total',
//     date: 'Total',
//     deviceNO: 'Total',
//     ...total
//   };

//   return [...results.value, totalRow];
// });

// const headers = ref([
//   { title: 'Date', value: 'date', align: 'center' },
//   { title: 'Device No.', value: 'deviceNO', align: 'center' },
//   { title: 'มิเตอร์เข้าเครื่อง', value: 'meterIn', align: 'center',
//     children: [
//       { title: 'ก่อน', value: 'meterInBefore', align: 'center' },
//       { title: 'หลัง', value: 'meterInafter', align: 'center' },
//     ]
//   },
//   { title: 'นำไปใช้', value: 'consume', align: 'center' },
//   { title: 'มิเตอร์ชั่วโมง', value: 'meterHour', align: 'center',
//     children: [
//       { title: 'ก่อน', value: 'meterHourBefore', align: 'center' },
//       { title: 'หลัง', value: 'meterHourAfter', align: 'center' },
//     ]
//   },
//   { title: 'น้ำมันที่ใช้จริง', value: 'actualOilUse', align: 'center',
//     children: [
//       { title: 'ชั่วโมงการทำงาน', value: 'workingHour', align: 'center' },
//       { title: 'ลิตร / ชม.', value: 'litrPerHour', align: 'center' },
//     ]
//   },
//   { title: 'เรท STD', value: 'rateSTD', align: 'center',
//     children: [
//       { title: 'ลิตร / ชม.', value: 'litrPerHour', align: 'center' },
//       { title: 'ต่อวัน', value: 'perDay', align: 'center' },
//     ]
//   },
//   { title: 'ผลต่าง (ลิตร)', value: 'diff', align: 'center' },
//   { title: 'เหลือ (+เกิน)%', value: 'remaining', align: 'center' },
// ]);

// const results = ref([
//   {
//     id: 1,
//     date: "2024-08-01",
//     deviceNO: "D-001",
//     meterInBefore: 1500,
//     meterInafter: 1600,
//     consume: 100,
//     meterHourBefore: 20,
//     meterHourAfter: 25,
//     workingHour: 5,
//     litrPerHour: 20,
//     rateSTD: 18,
//     perDay: 360,
//     diff: -10,
//     remaining: 5,
//   },
//   {
//     id: 2,
//     date: "2024-08-01",
//     deviceNO: "D-001",
//     meterInBefore: 1500,
//     meterInafter: 1600,
//     consume: 100,
//     meterHourBefore: 20,
//     meterHourAfter: 25,
//     workingHour: 5,
//     litrPerHour: 20,
//     rateSTD: 18,
//     perDay: 360,
//     diff: -10,
//     remaining: 5,
//   },
//   {
//     id: 3,
//     date: "2024-08-01",
//     deviceNO: "D-001",
//     meterInBefore: 1500,
//     meterInafter: 1600,
//     consume: 100,
//     meterHourBefore: 20,
//     meterHourAfter: 25,
//     workingHour: 5,
//     litrPerHour: 20,
//     rateSTD: 18,
//     perDay: 360,
//     diff: -10,
//     remaining: 5,
//   },
// ]);

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

:deep(.v-data-table__td),
:deep(.v-data-table__th) {
  border: 1px solid #F4F4F5;
}

.custom-table :deep(thead th) {
  color: #000000;
  font-weight: bold;
  font-size: 16px;
  font-family: 'Sarabun', sans-serif;
}

/* .custom-table :deep(tbody tr:hover td) {
  background-color: #ededed;
} */

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: #F9F9FA;
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

</style>