<template>
  <v-container >
    <div class="d-flex justify-space-between align-center mb-4">
      <p class="text-h6 text-lg-h6 text-xxl-h4" style="font-family: 'Inter', sans-serif;">Notification</p>
      <router-link :to="{ name: 'NotificationReport' }">
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
          :items-per-page="5" 
          style="font-size: 1.2vh;"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td style="font-size: 1.2vh;">{{ item.date }}</td>
              <td style="font-size: 1.2vh;">{{ item.name }}</td>
              <td style="font-size: 1.2vh;">{{ item.measuremnet }}</td>
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
    };
  },
};
</script>

<style lang="scss" scoped>
.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: var(--bg-row);
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
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
  width: 2vw;
  height: 2vh;
  border-radius: 2vh;
  font-size: 2vh;
  color: var(--symbol-blue);
  background-color: var(--bg-light-tugboat);
}

.header {
  font-size: 1.5vh;
  font-weight: 600;
  color: var(--dark-gray);
}
</style>
