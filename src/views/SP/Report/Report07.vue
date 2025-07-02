<template>
  <v-app style="background-color: #f7f9fc">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Report on Daily Fuel Consumption for the Barge</div>
      <div class="title-thai">รายงานการบริโภคน้ำมันรายวันของทุ่น</div>
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue"
import SpaceBar from "@/components/SpaceBar.vue"
</script>

<style scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.title-thai {
  font-family: "Sarabun", sans-serif;
  font-size: 1.5vh;
  font-weight: 400;
}

.cancel-btn {
  background-color: #dc2b2b;
  color: #ffffff;
  border-radius: 10px;
}

.search-btn {
  background-color: #223368;
  color: #ffffff;
  border-radius: 10px;
}

.download-btn {
  background-color: #fac12a;
  color: #ffffff;
  border-radius: 10px;
}

:deep(.v-data-table__td),
:deep(.v-data-table__th) {
  border: 1px solid #f4f4f5;
}

.custom-table :deep(thead th) {
  color: #000000;
  font-weight: bold;
  font-size: 16px;
  font-family: "Sarabun", sans-serif;
}

/* .custom-table :deep(tbody tr:hover td) {
  background-color: #ededed;
} */

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: #f9f9fa;
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}
</style>
