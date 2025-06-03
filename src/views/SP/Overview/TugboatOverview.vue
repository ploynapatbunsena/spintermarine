<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <v-row v-if="!isLoading">
        <v-col cols="12" class="title">Tugboat</v-col>
        <v-row class="cover mt-3 pa-3">
          <v-img :src="require('@/assets/Images/river_going_cover.png')">
            <div class="text-cover">
              <p class="name-thai">เรือน้ำจืด</p>
              <p class="name-eng">River Going</p>
            </div>
          </v-img>
          <v-row class="my-16">
            <v-col 
              v-for="tugboat in tugboatRiverDevices" 
              :key="tugboat.TypeDevicename" 
              cols="12" sm="6" lg="4"
            >
              <v-card 
                class="h-100"
                @click="goToTugboatDetails(tugboat.Devices[0].DeviceId)" 
                hover
              >
                <v-row no-gutters>
                  <v-col cols="12" md="12" lg="4" style="padding: 1vh;">
                    <v-img
                      :src="tugboat.previewImage"
                      height="300"
                      cover 
                      class="rounded-lg image-cover h-100"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" lg="8">
                    <v-card-item>
                      <v-row class="pt-7">
                        <v-col cols="8" lg="8">
                          <v-row>
                            <v-col cols="12" class="pb-0">
                              <v-card-title class="header px-0">{{ deletePrefix(tugboat.TypeDevicename) }}</v-card-title>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" class="pt-0">
                              <v-card-subtitle class="header-thai">เรือ{{ tugboat.Devices[0]?.Note ?? 'N/A' }}</v-card-subtitle>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="4">
                          <AlertBadges
                            :warningCount="getAlertCount(tugboat.Devices[0], 'warning')"
                            :dangerCount="getAlertCount(tugboat.Devices[0], 'danger')"
                          />
                        </v-col>
                      </v-row>
                      <v-row class="mt-2 mt-sm-4">
                        <v-col cols="12">
                          <div class="status-panel d-flex align-items-center" :class="getStatusClass(tugboat.status)">
                            <span class="material-symbols-rounded status-icon" :class="getStatusClass(tugboat.status)">
                              {{ getStatusIcon(tugboat.status) }}
                            </span>
                            <div class="text-status ml-2" :class="getStatusClass(tugboat.status)">
                              {{ tugboat.status || 'Unknown' }}
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                          <div class="due-date d-flex justify-space-between" :class="getBottomLineClass(tugboat.status)">
                            <span class="thai-letters" v-if="tugboat.status === 'Maintenance'">กำหนดเสร็จ</span>
                            <span class="thai-letters" v-else-if="tugboat.status === 'Pending'">เข้าซ่อม</span>
                            <span class="thai-letters" v-else-if="tugboat.status === 'Running'"><br></span>
                            {{ tugboat.date || 'N/A' }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-item>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-row>
  
        <!-- Sea Going Section -->
        <v-row class="cover mt-3 pa-3">
          <v-img :src="require('@/assets/Images/sea_going_cover.png')">
            <div class="text-cover">
              <p class="name-thai">เรือน้ำทะเล</p>
              <p class="name-eng">Sea Going</p>
            </div>
          </v-img>
          <v-row class="my-16">
            <v-col 
              v-for="tugboat in tugboatSeaDevices" 
              :key="tugboat.TypeDevicename" 
              cols="12" sm="6" lg="4"
            >
              <v-card 
                class="h-100" 
                @click="goToTugboatDetails(tugboat.Devices[0].DeviceId)" 
                hover
              >
                <v-row no-gutters>
                  <v-col cols="12" md="12" lg="4" style="padding: 1vh;">
                    <v-img 
                      :src="tugboat.previewImage"
                      height="300"
                      cover 
                      class="rounded-lg image-cover h-100"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" lg="8">
                    <v-card-item>
                      <v-row class="pt-7">
                        <v-col cols="8" lg="8">
                          <v-row>
                            <v-col cols="12" class="pb-0">
                              <v-card-title class="header px-0">{{ deletePrefix(tugboat.TypeDevicename) }}</v-card-title>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" class="pt-0">
                              <v-card-subtitle class="header-thai">เรือ{{ tugboat.Devices[0]?.Note ?? 'N/A' }}</v-card-subtitle>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="4">
                          <AlertBadges
                            :warningCount="getAlertCount(tugboat.Devices[0], 'warning')"
                            :dangerCount="getAlertCount(tugboat.Devices[0], 'danger')"
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <div class="status-panel d-flex align-items-center" :class="getStatusClass(tugboat.status)">
                            <span class="material-symbols-rounded status-icon" :class="getStatusClass(tugboat.status)">
                              {{ getStatusIcon(tugboat.status) }}
                            </span>
                            <div class="text-status ml-2" :class="getStatusClass(tugboat.status)">
                              {{ tugboat.status || 'Unknown' }}
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                          <div class="due-date d-flex justify-space-between" :class="getBottomLineClass(tugboat.status)">
                            <span class="thai-letters" v-if="tugboat.status === 'Maintenance'">กำหนดเสร็จ</span>
                            <span class="thai-letters" v-else-if="tugboat.status === 'Pending'">เข้าซ่อม</span>
                            <span class="thai-letters" v-else-if="tugboat.status === 'Running'"><br></span>
                            {{ tugboat.date || 'N/A' }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-item>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-row>
      </v-row>
      <v-overlay
        :model-value="isLoading"
        class="align-center justify-center"
        persistent
      >
        <div class="pa-6 d-flex flex-column align-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="mt-4 text-h6" style="font-family: 'Inter', sans-serif;">Loading data...</div>
        </div>
      </v-overlay>
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import SpaceBar from '@/components/SpaceBar.vue';
import AlertBadges from "@/components/BargeDetails/AlertBadges.vue";
import { inject, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const $api = inject('$api');
const $api_cmms = inject('$api_cmms');
const open_api_company = inject('open_api_company');
const router = useRouter();
const tugboatRiverDevices = ref([]);
const tugboatSeaDevices = ref([]);
const isLoading = ref(true);
let intervalId = null;

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/login');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101010500');

  if (!permission || !permission.IsActive) {
    return router.push('/login');
  }
};

const fetchTugboatRiver = async () => {
  try {
    isLoading.value = true;

    const response = await $api.get('/MachineStatus/GetTugboatRiver');
    const cmmsData = await fetchCMMSStatus(response.data);
    const enrichedData = await enrichTugboatWithImage(processTugboatData(response.data, cmmsData));
    tugboatRiverDevices.value = enrichedData;
  } catch (error) {
    console.error('Failed to fetch tugboat river:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchTugboatSea = async () => {
  try {
    isLoading.value = true;

    const response = await $api.get('/MachineStatus/GetTugboatSea');
    const cmmsData = await fetchCMMSStatus(response.data);
    const enrichedData = await enrichTugboatWithImage(processTugboatData(response.data, cmmsData));
    tugboatSeaDevices.value = enrichedData;
  } catch (error) {
    console.error('Failed to fetch tugboat sea:', error);
  } finally {
    isLoading.value = false;
  }
};

// 👇 ส่วนที่ใช้ดึงภาพจริงจาก API
const enrichTugboatWithImage = async (tugboatData) => {
  const promises = tugboatData.map(async (tugboat) => {
    const imageId = tugboat.Devices?.[0]?.DeviceImage;
        const imageResponse = await $api.get(`/Device/Image/${imageId}`);
        tugboat.previewImage = imageResponse.data?.src;
    return tugboat;
  });

  return await Promise.all(promises);
};

const fetchCMMSStatus = async (tugboats) => {
  try {
    isLoading.value = true;
    const toolList = tugboats.map(tugboat => ({
      toolName: tugboat.Devices[0]?.Note || ''
    }));
    const response = await $api_cmms.post(`/v1/companies/${open_api_company}/tools/last-status`, { toolList });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch CMMS status:', error);
    return [];
  } finally {
    isLoading.value = false;
  }
};

const processTugboatData = ( tugboats, cmmsData ) => {
  return tugboats.map(tugboat => {
    const deviceNote = tugboat.Devices[0]?.Note || '';
    const cmmsStatus = cmmsData.find(item => item.toolName === deviceNote);

    let status = 'Unknown';
    let date = 'N/A';

    if (cmmsStatus) {
      status = mapCMMSStatus(cmmsStatus.status);

      if (status === 'Pending' || status === 'Maintenance') {
        date = cmmsStatus.nextPMPlan === '-' ? 'N/A' : cmmsStatus.nextPMPlan
      }
    }

    return {
      ...tugboat,
      status,
      date
    }
  })
};

const deletePrefix = (name) => {
  return name.replace(/Barge|Tugboat/gi, '').trim();
};

const getAlertCount = (device, type) => {
  if (!device || !device.MeasurementsAlertCount) return 0;
  const alert = device.MeasurementsAlertCount.find(
    (item) => type === 'warning' ? 'AlertWarningTotal' in item : 'AlertDangerTotal' in item
  );
  return alert ? (type === 'warning' ? alert.AlertWarningTotal : alert.AlertDangerTotal) : 0;
};

const mapCMMSStatus = (cmmsStatus) => {
  switch (cmmsStatus) {
    case "ถูกใช้งานอยู่" :
    case "พร้อมใช้งาน" :
      return "Running";
    case "อยู่ระหว่างการสอบเทียบ" :
      return "Pending";
    case "อยู่ระหว่างการซ่อม" :
      return "Maintenance";
    case "ยกเลิกใช้งาน" :
      return "Down";
    default:
      return 'Unknown';
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case "Running": return "signal_cellular_alt";
    case "Maintenance": return "construction";
    case "Pending": return "update";
    case "Down": return "block";
    default: return "help";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Running": return "status-running";
    case "Maintenance": return "status-maintenance";
    case "Pending": return "status-pending";
    case "Down": return "status-down";
    default: return "status-unknown";
  }
};

const getBottomLineClass = (status) => {
  switch (status) {
    case "Running": return "bottom-line-running";
    case "Maintenance": return "bottom-line-maintenance";
    case "Pending": return "bottom-line-pending";
    case "Down": return "bottom-line-down";
    default: return "bottom-line-unknown";
  }
};

const goToTugboatDetails = (deviceId) => {
  router.push({ name: 'TugboatDetail', params: { deviceId: deviceId } });
};

const fetchDataWithInterval = async () => {
  await fetchTugboatRiver();
  await fetchTugboatSea();
};

const startDataInterval = () => {intervalId = setInterval(fetchDataWithInterval, 2 * 60 * 1000);};

const stopDataInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(async() => {
  console.log('Component mounted');
  await initialize();
  await fetchDataWithInterval();
  startDataInterval();
});

onUnmounted(() => {
  stopDataInterval();
});
</script>

<style lang="scss" scoped>
.v-card {
  border-radius: 1vh;
}

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
  color: #FFFFFF;

  & .name-thai {
    font-family: 'Sarabun', serif;
    font-size: 3vh;
  }

  & .name-eng {
    font-size: 2vh;
    font-weight: 200;
  }
}

@media (min-width: 320px) and (max-width: 480px) {
  .text-cover {
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    text-align: center;
  }
}

.header {
  font-size: 2vh;
  font-weight: bold;
}

.material-symbols-rounded {
  font-size: 2vh;

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

.status-down {
  color: #000000;
}

.status-unknown {
  color: #C0C0C0;
}

.due-date {
  position: relative;
  padding-bottom: 8px;
  font-size: 1.5vh;
}

.bottom-line-running::after,
.bottom-line-maintenance::after,
.bottom-line-pending::after,
.bottom-line-down::after,
.bottom-line-unknown::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.2vh;
  border-radius: 10px;
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

.bottom-line-down::after {
  background-color: #000000;
}

.bottom-line-unknown::after {
  background-color: #C0C0C0;
}

.header-thai {
  font-family: 'Sarabun', serif;
  font-size: 1.5vh;
  font-weight: 400;
  color: #A0A0A0;
}

.text-status {
  font-size: 1.5vh;
}

@media (min-width: 2560px) {
  .image-cover {
    height: 12vh;
  }
}

@media (min-width: 1920px) and (max-width: 2560px) {
  .image-cover {
    max-height: 180px;
  }
}
</style>