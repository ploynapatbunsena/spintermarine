<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-data-table
          :header="headers"
          :items="notices"
          item-value="name"
          class="elevation-0 striped-table custom-table"
          hide-default-footer
          style="width: 1040px; height: 100%;"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.date }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.measuremnet }}</td>
              <td class="details">{{ item.details }}</td>
              <td>
                <v-chip class="notice-status">
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

<script>
export default {
  data() {
    return {
      headers: [
        { title: 'Date', key: 'date' },
        { title: 'Device Name', key: 'name' },
        { title: 'Measurement', key: 'measuremnet' },
        { title: 'Details', key: 'details' },
        { title: 'Status', key: 'status' },
      ],
      notices: [
        { date: '2023-10-01', name: 'Gen No.116 WEICHAI 37KVA', measuremnet: 'Oil Pressure',details: 'Value is in the dangerous zone', status: 'รอแจ้งซ่อม' },
        { date: '2023-10-02', name: 'Gen No.116 WEICHAI 37KVA', measuremnet: 'Oil Pressure',details: 'Value is in the dangerous zone', status: 'รอแจ้งซ่อม' },
        { date: '2023-10-03', name: 'Gen No.116 WEICHAI 37KVA', measuremnet: 'Oil Pressure',details: 'Value is in the dangerous zone', status: 'รอแจ้งซ่อม' },
        { date: '2023-10-04', name: 'Gen No.116 WEICHAI 37KVA', measuremnet: 'Oil Pressure',details: 'Value is in the dangerous zone', status: 'รอแจ้งซ่อม' },
      ],
    };
  },
};
</script>

<style scoped>
.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: var(--bg-row); /* สีสำหรับแถวคี่ */
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff; /* สีสำหรับแถวคู่ */
}

/* เปลี่ยนสีตัวหนังสือของ header */
.custom-table :deep(thead th) {
  color: var(--black);
  font-weight: bold;
  font-size: 20px;
}

/* เปลี่ยนสีตัวหนังสือของ item */
.custom-table :deep(tbody td) {
  color: var(--dark-gray);
  font-size: 20px;
}

/* เปลี่ยนสีตัวหนังสือของแถวเมื่อ hover */
.custom-table :deep(tbody tr:hover td) {
  color: var(--black);
}

/* เปลี่ยนสีพื้นหลังของแถวเมื่อ hover */
.custom-table :deep(tbody tr:hover) {
  background-color: #f0f0f0; /* สีเทาอ่อน */
}

.v-card-text {
  padding: 0;
}

.details {
  font-family: 'Sarabun', serif;
}

.notice-status {
  font-family: 'Sarabun', serif;
  background-color: var(--light-red);
  color: var(--red);
  font-size: 20px;
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