<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container>
      <div class="title">แบบฟอร์มการแก้ไขสถานะทุ่น</div>
      <div class="card-table">
        <p class="header-table">Generator Status</p>
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="formattedItems"
              item-value="deviceName"
              class="elevation-0 striped-table custom-table"
              hide-default-footer
              style="width: 100%; height: 100%;"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.date || '-' }}</td>
                  <td>{{ item.deviceName }}</td>
                  <td>
                    <v-chip :class="getStatusColor(item.status)">
                      {{ item.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-icon class="edit" @click="openEditDialog(item)">
                      mdi-pencil-outline
                    </v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
      <!-- Crane -->
      <div class="card-table">
        <p class="header-table">Crane Status</p>
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="formattedCranes"
              item-value="deviceName"
              class="elevation-0 striped-table custom-table"
              hide-default-footer
              style="width: 100%; height: 100%;"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.date || '-' }}</td>
                  <td>{{ item.deviceName }}</td>
                  <td>
                    <v-chip :class="getStatusColor(item.status)">
                      {{ item.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-icon class="edit" @click="openEditDialog(item)">
                      mdi-pencil-outline
                    </v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
    
    <!-- Dialog for editing status -->
    <v-dialog v-model="editDialog" max-width="906">
      <v-card class="rounded-lg pa-6">
        <v-card-title class="card-dialog">แก้ไขรายการ</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div>
                <p class="title-field">Date</p>
                <div class="default-field">
                  <p>{{ selectedItem?.date || '-' }}</p>
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div>
                <p class="title-field">Device Name</p>
                <div class="default-field">
                  <p>{{ selectedItem?.deviceName || '-' }}</p>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p class="title-field">Status</p>
              <div class="status-buttons">
                <v-btn
                  class="status-btn"
                  v-for="status in (isCrane ? craneStatusOptions : generatorStatusOptions)"
                  :key="status.value"
                  :style="{
                    backgroundColor: selectedStatus === status.value ? status.color : '#FFFFFF',
                    color: selectedStatus === status.value ? '#FFFFFF' : '#D9D9D9',
                    border: `2px solid ${selectedStatus === status.value ? 'transparent' : '#D9D9D9'}`,
                  }"
                  elevation="0"
                  @click="selectStatus(status.value)"
                >
                  {{ status.text }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex align-center justify-center mb-8 ga-8">
          <v-btn class="cancel-btn" @click="editDialog = false">Cancel</v-btn>
          <v-btn class="save-btn" @click="saveStatus">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { barges } from '@/data/config';
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import '@/assets/colors.scss';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  name: 'StatusEditForm',
  components: {
    NavigationBar,
    SpaceBar,
  },
  data() {
    return {
      headers: [
        { title: 'Date', key: 'date', width: '243px' },
        { title: 'Device Name', key: 'deviceName', width: '872px' },
        { title: 'Status', key: 'status', width: '326px' },
        { title: 'Action', key: 'action', width: '186px' },
      ],
      editDialog: false,
      selectedItem: null,
      selectedStatus: '',
      lastUpdatedDates: {},
      generatorStatusOptions: [
        { value: 'standby', text: 'Standby', color: '#00B8F2' },
        { value: 'running', text: 'Running', color: '#28A745' },
        { value: 'running-maintenance', text: 'Running/Maintenance', color: '#64DD17' },
        { value: 'standby-maintenance', text: 'Standby/Maintenance', color: '#1158BB' },
        { value: 'down', text: 'Down', color: '#000000' },
      ],
      craneStatusOptions: [
        { value: 'standby', text: 'Standby', color: '#00B8F2' },
        { value: 'running', text: 'Running', color: '#28A745' },
        { value: 'maintenance', text: 'Maintenance', color: '#000000' },
      ]
    };
  },
  computed: {
    barge() {
      return barges.find(barge => barge.id === this.id) || { items: [], cranes: [] };
    },
    formattedItems() {
      return this.barge?.items?.map((item) => ({
        id: item.id,
        deviceName: item.title,
        status: item.status,
        date: this.lastUpdatedDates[item.id] || '-',
      })) || [];
    },
    formattedCranes() {
      return this.barge?.cranes?.map((crane) => ({
        id: crane.id,
        deviceName: crane.title,
        status: crane.status,
        date: this.lastUpdatedDates[crane.id] || '-',
      })) || [];
    },
    isCrane() {
      return this.selectedItem && this.barge?.cranes?.some(crane => crane.id === this.selectedItem.id);
    }
  },
  methods: {
    openEditDialog(item) {
      this.selectedItem = { ...item };
      this.selectedStatus = item.status;
      this.editDialog = true;
    },
    selectStatus(status) {
      const validStatuses = this.isCrane ? 
        this.craneStatusOptions.map(option => option.value) :
        this.generatorStatusOptions.map(option => option.value);
      
      if (validStatuses.includes(status)) {
        this.selectedStatus = status;
      }
    },
    saveStatus() {
      if (!this.selectedItem || !this.barge) return;

      const bargeIndex = barges.findIndex((b) => b.id === this.id);
      if (bargeIndex === -1) return;

      const updateItem = (array) => {
        const index = array.findIndex((i) => i.id === this.selectedItem.id);
        if (index !== -1) {
          array[index].status = this.selectedStatus;
          this.lastUpdatedDates[this.selectedItem.id] = new Date().toLocaleString();
          return true;
        }
        return false;
      };

      if (!updateItem(barges[bargeIndex].items)) {
        updateItem(barges[bargeIndex].cranes);
      }

      this.editDialog = false;
      this.$forceUpdate();
    },
    getStatusColor(status) {
      const statusColors = {
        'standby': 'status-standby',
        'running': 'status-running',
        'standby-maintenance': 'status-standby-maintenance',
        'running-maintenance': 'status-running-maintenance',
        'down': 'status-down',
        'maintenance': 'status-down',
        'warning': 'status-warning',
        'danger': 'status-danger'
      };
      return statusColors[status] || '';
    }
  }
};
</script>

<style scoped>
.status-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  border-radius: 10px;
  padding: 0px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  text-transform: none;
  font-weight: 300;
}


.edit {
  cursor: pointer;
  width: 34px;
  height: 24px;
  border-radius: 24px;
  font-size: 20px;
  color: #1570EF;
  background-color: #E3F2FD;
}

.title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  font-family: 'Sarabun', sans-serif;
  padding: 12px;
}

.card-dialog {
  font-family: 'Sarabun', sans-serif;
  font-size: 20px;
}

.title-field {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: var(--gray);
  margin-bottom: 6px;
}

.default-field{
  width: 362px;
  height: 50px;
  background-color: var(--bg-row);
  padding: 12px;
  border-radius: 10px;

  p {
    color: var(--grey-02);
    font-family: 'Poppins', sans-serif;
  }
}

.cancel-btn {
  background-color: var(--red);
  color: var(--white);
  border-radius: 14px;
  padding: 0px 20px;
}

.save-btn {
  background-color: var(--primary);
  color: var(--white);
  border-radius: 14px;
  padding: 0px 20px;
}

.card-table {
  background-color: var(--light-blue);
  width: 100%;
  margin-top: 12px;
  padding: 12px;
}

.header-table {
  font-size: 18px;
  color: var(--white);
  margin-bottom: 10px;
}

.v-card-text {
  padding: 0;
}

.status-standby {
  color: var(--text-standby);
  background-color: var(--bg-standby);
}

.status-running {
  color: var(--text-running);
  background-color: var(--bg-running);
}

.status-standby-maintenance {
  color: var(--text-s-m);
  background-color: var(--bg-s-m);
}

.status-running-maintenance {
  color: var(--text-gen);
  background-color: var(--bg-r-m);
}

.status-down {
  color: var(--black);
  background-color: var(--gray);
}

.status-warning {
  color: var(--text-warning);
  background-color: var(--bg-warning);
}

.status-danger {
  color: var(--red);
  background-color: var(--bg-danger);
}

</style>