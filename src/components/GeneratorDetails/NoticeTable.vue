<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <p class="header">Notification</p>
      <router-link :to="{ name: '', params: { id: 'someId' } }">
        <v-icon icon="mdi-pencil-outline" class="edit"></v-icon>
      </router-link>
    </div>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="notices"
          item-value="name"
          class="elevation-0 striped-table custom-table custom-scroll"
          hide-default-footer
          fixed-header
          height="250px"
          style="width: 1040px;"
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
        { date: '2023-10-01', name: 'Gen No.116 WEICHAI 37KVA', measuremnet: 'Oil Pressure', details: 'Value is in the dangerous zone', status: 'รอแจ้งซ่อม' },
        { date: '2023-10-02', name: 'Gen No.116 WEICHAI 37KVA', measuremnet: 'Oil Pressure', details: 'Value is in the dangerous zone', status: 'รอแจ้งซ่อม' },
        { date: '2023-10-03', name: 'Gen No.116 WEICHAI 37KVA', measuremnet: 'Oil Pressure', details: 'Value is in the dangerous zone', status: 'รอแจ้งซ่อม' },
        { date: '2023-10-04', name: 'Gen No.116 WEICHAI 37KVA', measuremnet: 'Oil Pressure', details: 'Value is in the dangerous zone', status: 'รอแจ้งซ่อม' },
        { date: '2023-10-06', name: 'Gen No.118 PERKINS 75KVA', measuremnet: 'Oil Pressure', details: 'Value is in the dangerous zone', status: 'รอแจ้งซ่อม' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
/* เพิ่ม Scrollbar Styling */
.custom-scroll :deep(.v-table__wrapper) {
  overflow-y: auto;
}

/* Scrollbar สำหรับ Chrome, Edge, Safari */
.custom-scroll :deep(.v-table__wrapper)::-webkit-scrollbar {
  width: 8px; /* ความกว้างของ scrollbar */
}

.custom-scroll :deep(.v-table__wrapper)::-webkit-scrollbar-track {
  background: #f0f0f0; /* สีพื้นหลังของ track */
  border-radius: 10px;
}

.custom-scroll :deep(.v-table__wrapper)::-webkit-scrollbar-thumb {
  background: #888; /* สีของ scrollbar */
  border-radius: 10px;
}

.custom-scroll :deep(.v-table__wrapper)::-webkit-scrollbar-thumb:hover {
  background: #555; /* สี scrollbar เมื่อ hover */
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: var(--bg-row);
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

.custom-table :deep(thead th) {
  color: var(--black);
  font-weight: bold;
  font-size: 16px;
}

.custom-table :deep(tbody td) {
  color: var(--dark-gray);
  font-size: 16px;
}

.custom-table :deep(tbody tr:hover td) {
  color: var(--black);
}

.custom-table :deep(tbody tr:hover) {
  background-color: #f0f0f0;
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
  font-size: 16px;
}

.edit {
  width: 34px;
  height: 24px;
  border-radius: 24px;
  font-size: 20px;
  color: #1570EF;
  background-color: #E3F2FD;
}

.header {
  font-size: 20px;
  font-weight: 600;
  color: var(--dark-gray);
}
</style>
