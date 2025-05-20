<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="notices"
          item-value="name"
          items-per-page="4"
          hide-default-footer
          class="elevation-0 striped-table custom-table custom-scroll"
          style="font-size: 1.5vh;"
        >
          <template v-slot:item="{ item }">
            <tr class="custom-row">
              <td>{{ formatTimeShow(item.date) }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.measuremnet }}</td>
              <td>{{ item.details }}</td>
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
];

const formatTimeShow = (datetime) => {
  if (datetime==null) {
    return null
  } else {
    var dateTime = new Date(datetime);
    var month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
    var day = ("0" + dateTime.getDate()).slice(-2);
    var year = dateTime.getFullYear();
    var hour = ("0" + dateTime.getHours()).slice(-2);
    var minute = ("0" + dateTime.getMinutes()).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" + minute;
  }
};
</script>

<style scoped>

.custom-row :deep(tbody tr){
  height: 10px !important; /* ปรับค่าตามต้องการ */
}

/* ลด padding ของ cell */
.custom-table >>> td {
  padding: 4px 16px !important; /* ปรับค่าตามต้องการ */
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: var(--bg-row); /* สีสำหรับแถวคี่ */
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff; /* สีสำหรับแถวคู่ */
}

.custom-scroll :deep(.v-table__wrapper) {
  overflow-y: auto;
}

.custom-table :deep(tbody tr:hover) {
  background-color: #f0f0f0; /* สีเทาอ่อน */
}

.v-card-text {
  padding: 0;
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