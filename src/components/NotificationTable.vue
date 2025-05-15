<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="notices"
          item-value="name"
          items-per-page="5"
          hide-default-footer
          class="elevation-0 striped-table custom-table custom-scroll"
          style="font-size: 1.2vh;"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td style="font-size: 1.2vh;">{{ item.date }}</td>
              <td style="font-size: 1.2vh;">{{ item.name }}</td>
              <td style="font-size: 1.2vh;">{{ item.measuremnet }}</td>
              <td style="font-size: 1.2vh;" class="details">{{ item.details }}</td>
              <td>
                <v-chip style="font-size: 1.2vh;" class="notice-status">
                  {{ item.status }}
                </v-chip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
const props = defineProps({
  notices: {
    type: Array,
    default: () => []
  },
});

const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Device Name', key: 'name' },
  { title: 'Measurement', key: 'measuremnet' },
  { title: 'Details', key: 'details' },
  { title: 'Status', key: 'status' },
]
</script>

<style scoped>
.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: var(--bg-row); /* สีสำหรับแถวคี่ */
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff; /* สีสำหรับแถวคู่ */
}

/* .custom-table :deep(thead th) {
  color: var(--black);
  font-weight: bold;
  font-size: 1.5vh;
}

.custom-table :deep(tbody td) {
  color: var(--dark-gray);
  font-size: 1vh;
}

.custom-table :deep(tbody tr:hover td) {
  color: var(--black);
} */

.custom-scroll :deep(.v-table__wrapper) {
  overflow-y: auto;
}

.custom-table :deep(tbody tr:hover) {
  background-color: #f0f0f0; /* สีเทาอ่อน */
}

.v-card-text {
  padding: 0;
}

.details {
  font-family: 'Sarabun', serif;
  font-size: 1vh;
}

.notice-status {
  font-family: 'Sarabun', serif;
  background-color: var(--light-red);
  color: var(--red);
}

.edit {
  width: 46px;
  height: 36px;
  border-radius: 24px;
  font-size: 32px;
  color: #1570EF;
  background-color: #E3F2FD;
}
</style>