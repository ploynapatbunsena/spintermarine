<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <v-row v-if="!loading">
        <v-col cols="12" class="title">Barge</v-col>
        <v-row class="mt-3">
          <v-col
            v-for="device in devices"
            :key="device.TypeDevicename"
            cols="12" sm="6" lg="4"
          >
            <v-card
              class="h-100"
              @click="goToBargeDetails(device.TypeDevicename)"
              hover
            >
              <v-row no-gutters>
                <v-col cols="12" lg="4" style="padding: 1vh;">
                  <v-img
                    :src="getCurrentDeviceImage(device)"
                    cover
                    class="rounded-lg"
                  ></v-img>
                </v-col>
                <v-col cols="12" lg="8">
                  <v-card-item>
                    <v-row class="pt-6">
                      <v-col cols="8" lg="8">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="header px-0">{{ device.TypeDevicename }}</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pt-0">
                            <p class="header-thai px-0">ทุ่น{{ device.Devices[0]?.Note ?? 'N/A' }}</p>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="4" lg="4">
                        <AlertBadges
                          :warningCount="device.AlertWarningTotalSum ?? 0"
                          :dangerCount="device.AlertDangerTotalSum ?? 0"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="text-blue">Standby</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="barge-value">{{ device.TotalStatusSummary?.["Standby (ON)"] ?? 0 }}</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <p class="bottom-line-blue"></p>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="text-green">Running</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="barge-value">{{ device.TotalStatusSummary?.["Running (ON)"] ?? 0 }}</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <p class="bottom-line-green"></p>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="text-grey">Offline</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="barge-value">{{ calculateStatus(device.TotalStatusSummary, 'Offline') }}</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <p class="bottom-line-grey"></p>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="text-black">Maintenance</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="barge-value">{{ calculateStatus(device.TotalStatusSummary, 'Maintenance') }}</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <p class="bottom-line-black"></p>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-item>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-row>
      <v-overlay
        :model-value="loading"
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
import { computed, inject, onMounted, ref } from "vue";
import { useRouter } from 'vue-router';

const $api = inject('$api');
const router = useRouter();
const devices = ref([]);
const loading = ref(true);

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepage');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101010100');

  if (!permission || !permission.IsActive) {
    return router.push('/Homepage');
  }
};

const fetchDeviceBargesGrouped = async () => {
  try {
    loading.value = true;

    const response = await $api.get('/MachineStatus/GetDeviceBargesGrouped');
    const rawData = response.data;
    const processedData = rawData.map(processGroupData);
    devices.value = processedData;

  } catch (error) {
    error.value = 'Failed to fetch DeviceBargesGrouped. Please try again later.';
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getCurrentDeviceImage = computed(() => {
  return (device) => {
    const masterDevice = device.Devices?.find(d => d.DeviceName === 'Barge Master');
    
    return masterDevice?.DeviceImage 
      ? require(`@/assets/ImageForm/${masterDevice.DeviceImage}`)
      : require('@/assets/Images/profile_barge.jpg');
  };
});

const calculateAlerts = (devices) => {
  let totalWarning = 0;
  let totalDanger = 0;

  devices.forEach(device => {
    device.MeasurementsAlertCount?.forEach(alert => {
      totalWarning += alert.AlertWarningTotal || 0;
      totalDanger += alert.AlertDangerTotal || 0;
    });
  });
  return { totalWarning, totalDanger };
};

const processGroupData = (group) => {
  const { totalWarning, totalDanger } = calculateAlerts(group.Devices);
  return {
    ...group,
    AlertWarningTotalSum: totalWarning,
    AlertDangerTotalSum: totalDanger,
  };
};

const calculateStatus = (summary, type) => {
  if (!summary) return 0;

  if (type === 'Offline') {
    return (summary.Down || 0) + (summary.Unknown || 0);
  }

  if (type === 'Maintenance') {
    return (summary['Standby/Maintenance'] || 0) + (summary['Running/Maintenance'] || 0);
  }

  return 0;
};

const goToBargeDetails = (typeDeviceName) => {
  router.push({ name: 'BargeDetail', params: { typeDeviceName: typeDeviceName } });
};

onMounted(async () => {
  await initialize();
  await fetchDeviceBargesGrouped();
});
</script>

<style lang="scss" scoped>
.v-card {
  border-radius: 1vh;
}

.text-blue {
  color: #2196F3;
  font-size: 1vh;
}

.text-green {
  color: #4CAF50;
  font-size: 1vh;
}

.text-grey {
  color: #9E9E9E;
  font-size: 1vh;
}

.text-black {
  font-size: 1vh;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3vh;
  font-weight: 600;
}

.bottom-line-blue {
  border: 0.2vh solid #2196F3;
}

.bottom-line-green {
  border: 0.2vh solid #4CAF50;
}

.bottom-line-grey {
  border: 0.2vh solid #9E9E9E;
}

.bottom-line-black {
  border: 0.2vh solid #000000;
}

.material-symbols-rounded {
  font-size: 2.5vh;

  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

.barge-value {
  font-size: 2vh;
  font-weight: 600;
}

.header {
  font-size: 2vh;
  font-weight: 600;
}

.header-thai {
  font-family: 'Sarabun', serif;
  font-size: 1.5vh;
  font-weight: 400;
  color: #A0A0A0;
}
</style>