
  <template>
    <v-app style="background-color: #F7F9FC;">
      <NavigationBar />
      <SpaceBar />
      <v-container fluid class="px-10">
        <div class="title">Tugboat</div>

        <!-- River Going Section -->
        <div class="cover mt-3 pa-3">
          <v-img :src="require('@/assets/Images/river_going_cover.png')" class="text-white">
            <div class="text-cover">
              <p class="name-thai">เรือน้ำจืด</p>
              <p class="name-eng">River Going</p>
            </div>
          </v-img>
          <v-row class="my-16">
            <v-col v-for="tugboat in tugboatRiverDevices" :key="tugboat.DeviceId" cols="12" sm="6" lg="4" xxl="3">
              <v-card class="h-100 rounded-lg" @click="goToTugboatDetails(tugboat.DeviceId)" hover>
                <v-row no-gutters>
                  <v-col cols="4">
                    <v-img :src="require('@/assets/Images/overview_barge.jpg')" height="150" cover class="ma-2 rounded-lg"></v-img>
                  </v-col>
                  <v-col cols="8">
                    <v-card-item>
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <v-card-title class="px-0">{{ tugboat.DeviceLabel }}</v-card-title>
                          <v-card-subtitle class="px-0 thai-letters">เรือ{{ tugboat.Note }}</v-card-subtitle>
                        </div>
                        <div class="alert-icon mr-4">
                          <AlertFunction :tugboat="tugboat" />
                        </div>
                      </div>
                      <div class="mt-6">
                        <div class="status-panel d-flex align-items-center" :class="getStatusClass(tugboat.status)">
                          <span class="material-symbols-rounded status-icon" :class="getStatusClass(tugboat.status)">
                            {{ getStatusIcon(tugboat.status) }}
                          </span>
                          <div class="text-status ml-2" :class="getStatusClass(tugboat.status)">
                            {{ tugboat.status || 'Unknown' }}
                          </div>
                        </div>
                        <div class="due-date d-flex justify-space-between mt-2" :class="getBottomLineClass(tugboat.status)">
                          <span class="thai-letters" v-if="tugboat.status === 'Maintenance'">กำหนดเสร็จ</span>
                          <span class="thai-letters" v-else-if="tugboat.status === 'Pending'">เข้าซ่อม</span>
                          <span class="thai-letters" v-else-if="tugboat.status === 'Running'"><br></span>
                          {{ tugboat.date || 'N/A' }}
                        </div>
                      </div>
                    </v-card-item>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Sea Going Section -->
        <div class="cover mt-3 pa-3">
          <v-img :src="require('@/assets/Images/sea_going_cover.png')" class="text-white">
            <div class="text-cover">
              <p class="name-thai">เรือน้ำทะเล</p>
              <p class="name-eng">Sea Going</p>
            </div>
          </v-img>
          <v-row class="my-16">
            <v-col v-for="tugboat in tugboatSeaDevices" :key="tugboat.DeviceId" cols="12" sm="6" lg="4">
              <v-card class="h-100 rounded-lg" @click="goToTugboatDetails(tugboat.DeviceId)" hover>
                <v-row no-gutters>
                  <v-col cols="4">
                    <v-img :src="require('@/assets/Images/overview_barge.jpg')" height="150" cover class="ma-2 rounded-lg"></v-img>
                  </v-col>
                  <v-col cols="8">
                    <v-card-item>
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <v-card-title class="px-0">{{ tugboat.DeviceLabel }}</v-card-title>
                          <v-card-subtitle class="px-0 thai-letters">เรือ{{ tugboat.Note }}</v-card-subtitle>
                        </div>
                        <div class="alert-icon mr-4">
                          <AlertFunction :tugboat="tugboat" />
                        </div>
                      </div>
                      <div class="mt-6">
                        <div class="status-panel d-flex align-items-center" :class="getStatusClass(tugboat.status)">
                          <span class="material-symbols-rounded status-icon" :class="getStatusClass(tugboat.status)">
                            {{ getStatusIcon(tugboat.status) }}
                          </span>
                          <div class="text-status ml-2" :class="getStatusClass(tugboat.status)">
                            {{ tugboat.status || 'Unknown' }}
                          </div>
                        </div>
                        <div class="due-date d-flex justify-space-between mt-2" :class="getBottomLineClass(tugboat.status)">
                          <span class="thai-letters" v-if="tugboat.status === 'Maintenance'">กำหนดเสร็จ</span>
                          <span class="thai-letters" v-else-if="tugboat.status === 'Pending'">เข้าซ่อม</span>
                          <span class="thai-letters" v-else-if="tugboat.status === 'Running'"><br></span>
                          {{ tugboat.date || 'N/A' }}
                        </div>
                      </div>
                    </v-card-item>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-app>
  </template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import SpaceBar from '@/components/SpaceBar.vue';
import AlertFunction from "@/components/TugboatDetails/AlertFunction.vue";
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const $api = inject('$api');
const router = useRouter();
const devices = ref([]);
const tugboatRiverDevices = ref([]);
const tugboatSeaDevices = ref([]);

// Mock status and date since they’re not in the API response
const addMockData = (device) => {
  return {
    ...device,
    status: ['Running', 'Maintenance', 'Pending'][Math.floor(Math.random() * 3)], // Random status for demo
    date: new Date().toLocaleDateString() // Mock date
  };
};

const fetchDeviceList = async () => {
  try {
    const response = await $api.put('device/GetDeviceListProfile', {
      DeviceId: ''
    });
    devices.value = response.data.map(addMockData); // Add mock status/date
    groupDevicesByType();
  } catch (error) {
    console.error('Failed to fetch device list:', error);
  }
};

const groupDevicesByType = () => {
  tugboatRiverDevices.value = devices.value.filter(device => device.TypeVehicle === 'Tugboat river going');
  tugboatSeaDevices.value = devices.value.filter(device => device.TypeVehicle === 'Tugboat sea going');
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Running": return "signal_cellular_alt";
    case "Maintenance": return "construction";
    case "Pending": return "update";
    default: return "help";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Running": return "status-running";
    case "Maintenance": return "status-maintenance";
    case "Pending": return "status-pending";
    default: return "status-unknown";
  }
};

const getBottomLineClass = (status) => {
  switch (status) {
    case "Running": return "bottom-line-running";
    case "Maintenance": return "bottom-line-maintenance";
    case "Pending": return "bottom-line-pending";
    default: return "bottom-line-unknown";
  }
};

const goToTugboatDetails = (deviceId) => {
  router.push({ name: 'TugboatDetail', params: { deviceId } });
};

onMounted(() => {
  fetchDeviceList();
});
</script>

<style lang="scss" scoped>

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3vh;
  font-weight: 600;
}

.text-cover {
  position: absolute;
  top: 50%;
  left: 100px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & .name-thai {
    font-family: 'Sarabun', serif;
    font-size: 32px;
  }

  & .name-eng {
    font-size: 14px;
    font-weight: 200;
  }
}

.material-symbols-rounded {
  font-size: 24px;

  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

.status-maintenance {
  color: #DC2B2B;
}

.status-pending {
  color: #FAC12A;
}

.status-running {
  color: #1CC042;
}

.due-date {
  position: relative;
  padding-bottom: 8px;
}

.bottom-line-running::after,
.bottom-line-maintenance::after,
.bottom-line-pending::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
}

.bottom-line-running::after {
  background-color: #1CC042;
}

.bottom-line-maintenance::after {
  background-color: #DC2B2B;
}

.bottom-line-pending::after {
  background-color: #FAC12A;
}

.thai-letters {
  font-family: 'Sarabun', serif;
}

</style>