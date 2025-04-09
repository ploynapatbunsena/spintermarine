<template>
  <PermissionCheck 
    menu-id="0101010100"
      :required-permissions="{
      IsRead: true,
    }"
  >
  <template #default="{ permissions }">
    <v-app style="background-color: #F7F9FC;" v-if="permissions.IsRead">
      <NavigationBar />
      <SpaceBar />
      <v-container fluid>
        <v-col cols="12" class="title">Barge</v-col>
        <v-row class="mt-3">
          <v-col
            v-for="device in bargeDevices"
            :key="device.TypeDevicename"
            cols="12" sm="6" lg="4"
          >
            <v-card
              class="h-100"
              @click="goToBargeDetails(device.TypeDevicename)"
              hover
            >
              <v-row no-gutters>
                <!-- Barge Image -->
                <v-col cols="12" lg="4" style="padding: 1vh;">
                  <v-img
                    :src="require('@/assets/Images/overview_barge.jpg')"
                    cover
                    class="rounded-lg"
                  ></v-img>
                </v-col>
                <!-- Barge Details -->
                <v-col cols="12" lg="8">
                  <v-card-item>
                    <v-row class="pt-6">
                      <!-- Barge Name -->
                      <v-col cols="8" lg="8">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="header px-0">{{ device.TypeDevicename }}</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pt-0">
                            <p class="header-thai px-0">ทุ่น{{ device.Note }}</p>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- Alert Icon -->
                      <v-col cols="4" lg="4" class="text-center">
                        <v-icon color="#DC2B2B" style="margin-right: 3vh;"><span class="material-symbols-rounded">notifications_active</span></v-icon>
                        <v-icon color="#FAC12A"><span class="material-symbols-rounded">warning</span></v-icon>
                      </v-col>
                    </v-row>
                    <!-- Status Numbers -->
                    <v-row>
                      <!-- Standby -->
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="text-blue">Standby</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="barge-value">9</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <p class="bottom-line-blue"></p>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- Running -->
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="text-green">Running</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="barge-value">4</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <p class="bottom-line-green"></p>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- Offline -->
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="text-grey">Offline</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="barge-value">1</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <p class="bottom-line-grey"></p>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- Maintenance -->
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="text-black">Maintenance</p>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <p class="barge-value">3</p>
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
      </v-container>
    </v-app>
  </template>
  </PermissionCheck>
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import SpaceBar from '@/components/SpaceBar.vue';
import PermissionCheck from "@/components/PermissionCheck.vue";
import { inject, onMounted, ref } from "vue";
import { useRouter } from 'vue-router';

const $api = inject('$api');
const router = useRouter();
const bargeDevices = ref([]);

// ดึงข้อมูลจาก API และกรองเฉพาะ Barge
const fetchDeviceList = async () => {
  try {
    const response = await $api.put('/device/GetDeviceListProfile', {
      DeviceId: ''
    });
    
    // กรองข้อมูลเฉพาะ TypeVehicle: "Barge" และจัดกลุ่มตาม TypeDevicename
    const bargeData = response.data.filter(device => device.TypeVehicle === 'Barge');
    const groupedByType = {};
    bargeData.forEach(device => {
      const typeDeviceName = device.TypeDevicename || 'Unknown';
      if (!groupedByType[typeDeviceName]) {
        groupedByType[typeDeviceName] = {
          TypeDevicename: typeDeviceName,
          Note: device.Note
        };
      }
    });
    bargeDevices.value = Object.values(groupedByType);
  } catch (error) {
    console.error('Failed to fetch device list:', error);
  }
};

const goToBargeDetails = (typeDeviceName) => {
  router.push({ name: 'BargeDetail', params: { typeDeviceName } });
};

onMounted(() => {
  fetchDeviceList();
});
</script>

<style lang="scss">
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