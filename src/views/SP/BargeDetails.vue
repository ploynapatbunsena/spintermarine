<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="d-flex align-center justify-center fill-height"> 
      <v-row>
        <v-col cols="12" class="position-relative d-flex align-center">
          <div style="width: 10vh;"></div>
          <div class="title flex-grow-1 text-center">{{ typeDeviceName }}</div>
          <div style="width: 10vh;">
            <AlertFunction />
          </div>
        </v-col>

        <v-col cols="12">
          <v-card elevation="0" class="pa-4">
            <v-row>
              <v-col md="8" sm="8" cols="12">
                <!-- Row ที่ 1 ของ Generator -->
                <v-row>
                  <v-col
                    v-for="device in filteredDevices.slice(0, 5)"
                    :key="device.deviceid"
                    class="mx-auto"
                    cols="auto"
                  >
                    <v-card
                      class="gen-card pa-0 d-flex flex-column align-center"
                      @click="goToGeneratorDetails(device.deviceid)"
                    >
                      <div class="gen-status" :class="getStatusClass(device)">
                        <span 
                          class="material-symbols-rounded status-icon" 
                          :class="getStatusClass(device)"
                        >
                          {{ getStatusIcon(device) }}
                        </span>
                        <p class="gen-name">{{ device.devicelabel }}</p>
                      </div>
                      <v-img
                        :src="require('@/assets/Images/generator.png')"
                        class="gen-img"
                      />
                      <div class="gen-details">
                        <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                          <v-col cols="8">Act Power</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'Actual Power') || 'N/A' }} kW</v-col>
                        </v-row>
                        <v-row no-gutters class="column-detail">
                          <v-col cols="8">RPM</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'RPM') || 'N/A' }}</v-col>
                        </v-row>
                        <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                          <v-col cols="8">Coolant temp</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'Water Temp') || 'N/A' }}°C</v-col>
                        </v-row>
                        <v-row no-gutters class="column-detail">
                          <v-col cols="8">Oil Pressure</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'Oil Pressure') || 'N/A' }} bar</v-col>
                        </v-row>
                        <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                          <v-col cols="8">Fuel Consumption/hr</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'Fuel Rate') || 'N/A' }} Lt.</v-col>
                        </v-row>
                      </div>
                    </v-card>  
                  </v-col>
                </v-row>
              </v-col>
              <!-- <v-col md="4" sm="4" cols="12">
                <v-row>
                  <v-col class="d-flex justify-center" cols="auto">
                    <v-card class="crane-card" elevation="0">
                      <div class="d-flex justify-space-between align-center pb-2">
                        <h2 class="text-h6 text-lg-h6 text-xxl-h4" style="font-family: 'Inter', sans-serif;">Crane</h2>
                        <router-link :to="{ name: 'StatusEditForm', params: { typeDeviceName: typeDeviceName } }">
                          <v-icon icon="mdi-pencil-outline" class="edit"></v-icon>
                        </router-link>
                      </div>
                      <v-row class="mx-2">
                        <v-col
                          v-for="crane in craneDevices" 
                          :key="crane.DeviceId" 
                          cols="4"
                        >
                          <v-card class="d-flex flex-column align-center rounded-lg ">
                            <div class="crane-title" :class="getStatusClass(crane)">
                              {{ crane.DeviceLabel }}
                            </div>
                            <v-img
                              width="8vh"
                              height="10vh"
                              :src="require('@/assets/Images/crane.png')"
                              class="crane-img"
                              cover
                            ></v-img>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row class="mx-2">
                        <v-col cols="4">
                          <v-card>
                            <div class="d-flex justify-space-between align-center mx-4 my-2">
                              <p class="text-status">Standby</p>
                              <span class="text-blue">{{ craneStatusCounts.standby }}</span>
                            </div>
                            <div class="bottom-line-blue"></div>
                          </v-card>
                        </v-col>
                        <v-col cols="4">
                          <v-card>
                            <div class="d-flex justify-space-between align-center mx-4 my-2">
                              <p class="text-status">Running</p>
                              <span class="text-green">{{ craneStatusCounts.running }}</span>
                            </div>
                            <div class="bottom-line-green"></div>
                          </v-card>
                        </v-col>
                        <v-col cols="4">
                          <v-card>
                            <div class="d-flex justify-space-between align-center mx-4 my-2">
                              <p class="text-status">Maintenance</p>
                              <span class="text-black">{{ craneStatusCounts.maintenance }}</span>
                            </div>
                            <div class="bottom-line-black"></div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col> -->
              <v-col md="4" sm="4" cols="12">
                <v-row>
                  <v-col class="d-flex justify-center" cols="auto">
                    <v-card class="crane-card" elevation="0">
                      <div class="d-flex justify-space-between align-center pb-2">
                        <h2 class="text-h6 text-lg-h6 text-xxl-h4" style="font-family: 'Inter', sans-serif;">Crane</h2>
                        <router-link :to="{ name: 'StatusEditForm', params: { typeDeviceName: 'Barge Bunga' } }">
                          <v-icon icon="mdi-pencil-outline" class="edit"></v-icon>
                        </router-link>
                      </div>
                      <v-row class="mx-2">
                        <v-col v-for="crane in craneDevices" :key="crane.deviceid" cols="4">
                          <v-card class="d-flex flex-column align-center rounded-lg">
                            <div class="crane-title" :class="getStatusClassCrane(crane)">
                              {{ crane.devicelabel }}
                            </div>
                            <v-img
                              width="8vh"
                              height="10vh"
                              :src="require('@/assets/Images/crane.png')"
                              class="crane-img"
                              cover
                            ></v-img>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row class="mx-2">
                        <v-col cols="4">
                          <v-card>
                            <div class="d-flex justify-space-between align-center mx-4 my-2">
                              <p class="text-status">Standby</p>
                              <span class="text-blue">{{ craneStatusCounts.standby }}</span>
                            </div>
                            <div class="bottom-line-blue"></div>
                          </v-card>
                        </v-col>
                        <v-col cols="4">
                          <v-card>
                            <div class="d-flex justify-space-between align-center mx-4 my-2">
                              <p class="text-status">Running</p>
                              <span class="text-green">{{ craneStatusCounts.running }}</span>
                            </div>
                            <div class="bottom-line-green"></div>
                          </v-card>
                        </v-col>
                        <v-col cols="4">
                          <v-card>
                            <div class="d-flex justify-space-between align-center mx-4 my-2">
                              <p class="text-status">Maintenance</p>
                              <span class="text-black">{{ craneStatusCounts.maintenance }}</span>
                            </div>
                            <div class="bottom-line-black"></div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- Row ที่ 2 ของ Generator -->
            <v-row>
              <v-col md="8" sm="8" cols="12">
                <v-row>
                  <!-- รายการ Generator ที่ 6-10 -->
                  <v-col
                    v-for="device in filteredDevices.slice(5, 10)"
                    :key="device.deviceid"
                    class="mx-auto"
                    cols="auto"
                  >
                    <v-card
                      class="gen-card pa-0 d-flex flex-column align-center"
                      @click="goToGeneratorDetails(device.deviceid)"
                    >
                      <div class="gen-status" :class="getStatusClass(device)">
                        <span 
                          class="material-symbols-rounded status-icon" 
                          :class="getStatusClass(device)"
                        >
                          {{ getStatusIcon(device) }}
                        </span>
                        <p class="gen-name">{{ device.devicelabel }}</p>
                      </div>
                      <v-img
                        :src="require('@/assets/Images/generator.png')"
                        class="gen-img"
                      />
                      <div class="gen-details">
                        <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                          <v-col cols="8">Act Power</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'Actual Power') || 'N/A' }} kW</v-col>
                        </v-row>
                        <v-row no-gutters class="column-detail">
                          <v-col cols="8">RPM</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'RPM') || 'N/A' }}</v-col>
                        </v-row>
                        <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                          <v-col cols="8">Coolant temp</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'Water Temp') || 'N/A' }}°C</v-col>
                        </v-row>
                        <v-row no-gutters class="column-detail">
                          <v-col cols="8">Oil Pressure</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'Oil Pressure') || 'N/A' }} bar</v-col>
                        </v-row>
                        <v-row no-gutters class="column-detail" style="background-color: #F9F9FA;">
                          <v-col cols="8">Fuel Consumption/hr</v-col>
                          <v-col cols="4">{{ getMeasurementValue(device, 'Fuel Rate') || 'N/A' }} Lt.</v-col>
                        </v-row>
                      </div>
                    </v-card>  
                  </v-col>
                  
                  <!-- เพิ่มคอลัมน์เปล่าเมื่อมี devices น้อยกว่า 10 -->
                  <template v-if="filteredDevices.length < 10">
                    <v-col
                      v-for="i in 10 - filteredDevices.length"
                      :key="`empty-${i}`"
                      class="mx-auto"
                      cols="auto"
                    >
                      <v-card 
                        class="gen-card pa-0 d-flex flex-column align-center" 
                        style="visibility: hidden;"
                      >
                        <!-- คอลัมน์เปล่า -->
                      </v-card>
                    </v-col>
                  </template>
                </v-row>
              </v-col>
              
              <!-- Gasoline Tank -->
              <v-col md="4" sm="4" cols="12" class="">
                <v-card class="gasoline-card" elevation="0">
                  <GasolineTank />
                </v-card>
              </v-col>    
            </v-row> 
            <!-- Row ที่สามของ Generator -->
            <v-row>
              <!-- Tilt Barge -->
              <v-col md="4" sm="4" cols="12">
                <v-card class="pa-4 rounded-xl">
                  <h2 class="d-flex align-center justify-center fill-height pb-2 text-h6 text-lg-h6 text-xxl-h4" style="font-family: 'Sarabun', sans-serif;">ระดับความเอียงทุ่น</h2>
                  <!-- Barge Img -->
                  <v-row>
                    <v-col cols="12" lg="6" >
                      <div class="barge-container">
                        <v-img class="bg_barge" :src="require('@/assets/Images/bg_barge_tilt.png')"></v-img>
                        <v-img
                          class="barge-img"
                          :src="require('@/assets/Images/barge_front.png')"
                          :style="{ transform: `translate(-50%, -50%) rotate(${xRotation}deg) scale(1.2)` }"
                        ></v-img>
                      </div>
                    </v-col>
                    <v-col cols="12" lg="6">
                      <div class="barge-container">
                        <v-img class="bg_barge" :src="require('@/assets/Images/bg_barge_tilt.png')"></v-img>
                        <v-img
                          class="barge-img"
                          :src="require('@/assets/Images/barge_side.png')"
                          :style="{ transform: `translate(-50%, -50%) rotate(${yRotation}deg) scale(1.2)` }"
                        ></v-img>
                      </div>
                    </v-col>
                  </v-row>
                  <!-- Gauge Chart -->
                  <v-row>
                    <v-col class="gauge-chart" >
                      <GaugeTiltLevel label="X" :value="xValue" />
                    </v-col>
                    <v-col class="gauge-chart">
                      <GaugeTiltLevel label="Y" :value="yValue" />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              
              <!-- Map -->
              <v-col md="4" sm="4" cols="12">
                <v-card class="pa-2 rounded-xl h-100">
                  <MapOfBarge />
                </v-card>
              </v-col>
              
              <!-- Notification Table-->
              <v-col md="4" sm="4" cols="12">
                <v-card class=" rounded-xl h-100">
                  <div class="notification-header">
                    <p class="text-h6 text-lg-h6 text-xxl-h4" style="font-family: 'Inter', sans-serif;">Notification</p>
                    <router-link :to="{ name: 'NotificationReport'}">
                      <v-icon icon="mdi-pencil-outline" class="edit"></v-icon>
                    </router-link>
                  </div>
                  <NoticeTable />
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <router-view />
     </v-container> 
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import GasolineTank from '@/components/BargeDetails/GasolineTank.vue';
import GaugeTiltLevel from '@/components/BargeDetails/GaugeTiltLevel.vue';
import MapOfBarge from '@/components/BargeDetails/MapOfBarge.vue';
import NoticeTable from '@/components/NoticeTable.vue';
import '@/assets/colors.scss';
import { computed, inject, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { watch } from 'vue';
import { mockStatus } from '@/data/mockValue';

const $api = inject('$api');
const router = useRouter();
const route = useRoute();
const devices = ref([]);
const typeDeviceName = ref(route.params.typeDeviceName);
const devicesStatus = ref(mockStatus);

const xValue = ref(0); 
const yValue = ref(0);

const getRandomValue = () => {
  return Math.floor(Math.random() * 11) - 5; // สุ่มจาก 0-10 แล้วลบ 5 ได้ -5 ถึง 5
};

onMounted(() => {
  xValue.value = getRandomValue();
  yValue.value = getRandomValue();
  
  setInterval(() => {
    xValue.value = getRandomValue();
    yValue.value = getRandomValue();
  }, 10000);
});

const xRotation = computed(() => (xValue.value / 6) * 10);
const yRotation = computed(() => (yValue.value / 6) * 10);

/* const excludedDeviceNames = [
  'Barge CRANE 1',
  'Barge CRANE 2',
  'Barge CRANE 3',
  'Barge Master'
]; */

/* const filteredDevices = computed(() => {
  return devices.value
    .filter(device => 
      device.TypeVehicle === 'Barge' && 
      device.TypeDevicename === typeDeviceName.value && 
      !excludedDeviceNames.includes(device.DeviceName)
    );
}); */

const filteredDevices = computed(() => {
  return devicesStatus.value.filter(device => 
    device.typevehicle === 'Barge' && 
    device.typedevicename === 'Barge Bunga' && 
    device.devicename.includes('GEN')
  );
});

const getStatusClass = (crane) => {
  const status = crane.data[0]?.Data[0]?.data;
  switch (status) {
    case 1: return 'status-standby';
    case 2: return 'status-running';
    case 3: return 'status-standby-maintenance';
    case 4: return 'status-running-maintenance';
    case 5: return 'status-down';
    case 0: default: return 'status-unknown';
  }
};

const craneDevices = computed(() => {
  return devicesStatus.value.filter(device => 
    device.typevehicle === 'Barge' && 
    device.typedevicename === 'Barge Bunga' && 
    device.devicename.includes('CRANE')
  );
});

const getStatusClassCrane = (crane) => {
  const status = crane.data[0]?.Data[0]?.data;
  switch (status) {
    case 1: return 'status-standby';
    case 2: return 'status-running';
    case 3: return 'status-down';
    case 0: default: return 'status-unknown';
  }
};

const craneStatusCounts = computed(() => {
  const counts = { standby: 0, running: 0, maintenance: 0 };
  craneDevices.value.forEach(crane => {
    const status = crane.data[0]?.Data[0]?.data;
    if (status === 1) counts.standby++;
    else if (status === 2) counts.running++;
    else if (status === 3) counts.maintenance++;
  });
  return counts;
});

/* const craneStatusCounts = computed(() => {
  const counts = { standby: 0, running: 0, maintenance: 0 };
  craneDevices.value.forEach(device => {
    const status = device.Measurement?.find(m => m.MeasurementLabel === 'Status')?.MeasurementUnit || 'standby';
    if (status === 'standby') counts.standby++;
    else if (status === 'running') counts.running++;
    else if (status === 'maintenance') counts.maintenance++;
  });
  return counts;
});

const craneDevices = computed(() => {
  return devices.value.filter(device => 
    device.TypeVehicle === 'Barge' && 
    device.TypeDevicename === typeDeviceName.value && 
    excludedDeviceNames.includes(device.DeviceName) &&
    device.DeviceName.startsWith('Barge CRANE')
  );
}); */

/* const getStatusClass = (device) => {
  const status = device.Measurement?.find(m => m.MeasurementLabel === 'Status')?.MeasurementUnit || 'standby';
  switch (status) {
    case 'standby': return 'status-standby';
    case 'running': return 'status-running';
    case 'standby-maintenance': return 'status-standby-maintenance'
    case 'running-maintenance': return 'status-running-maintenance'
    case 'down': case 'maintenance': return 'status-down';
    case 'warning': return 'status-warning';
    case 'danger': return 'status-danger';
    default: return 'status-standby';
  }
}; */

const getStatusIcon = (status) => {
  switch (status) {
    case "running-maintenance": return "construction";
    case "standby-maintenance": return "construction";
    default: return "";
  }
};

const getMeasurementValue = (device, label) => {
  const measurement = device.Measurement?.find(m => m.MeasurementLabel === label);
  return measurement ? measurement.Value || 'N/A' : 'N/A';
};

// Fetch devices
const fetchDevices = async () => {
  try {
    const response = await $api.put('/device/GetDeviceListProfile', {
      DeviceId: ''
    });
    devices.value = response.data;
  } catch (error) {
    console.error('Failed to fetch devices:', error);
  }
};

// Navigate to GeneratorDetails
const goToGeneratorDetails = (deviceId) => {
  if (deviceId) {
    router.push({ 
      name: 'GeneratorDetails', 
      params: { 
        typeDeviceName: typeDeviceName.value, 
        deviceId: deviceId 
      }
    });
  } else {
    console.error('Device ID is undefined');
  }
};

onMounted(() => {
  fetchDevices();
});

watch(() => route.params.typeDeviceName, (newVal) => {
  if (newVal !== typeDeviceName.value) {
    typeDeviceName.value = newVal;
    fetchDevices(newVal);
  }
});
</script>

<style lang="scss" scoped>
.status-icon {
  color: #FFFFFF;
}
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3vh;
  font-weight: 600;

  @media(min-width: 2560px) {
    margin: 2vh 0px;
  }
}

.background {
  width: 100%;
  height: 100vh;
  padding: 2vw;
}

.gen-card {
  width: 11.5vw;
  height: 25vh;
  background: #FFFFFF;
}

.gen-img {
  width: 10vw;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gen-status {
  width: 100%;
  height: 2.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gen-name {
  text-align: center;
  font-size: 1vh;
  color: #FFFFFF;
}

.gen-details {
  font-size: 1vh;
  width: 100%;
}

.column-detail {
  width: 100%;
  height: 2vh;
  padding-left: 1vw;
}

.header  {
  font-size: 2.5vh;
  font-weight: 500;
  margin-bottom: 1vh;
}

.crane-card {
  width: 35vw;
  height: 25vh;
}

.crane-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1vh;
  width: 100%;
  height: 2vh;
  color: #FFFFFF;
}

.crane-img {
  @media (min-width: 2560px) {
    width: 50%;
    height: 10vh;
    margin: 1vw 0;
  }
}

.crane-status {
  font-size: 1vh;
  font-weight: bold;
  text-transform: capitalize;
}

.status-summary {
  margin-top: 1vh;
  font-size: 1vh;
  font-weight: bold;
}

.gasoline-card {
  width: 100%;
  height: 100%;
  background: #F0F0F0;
  border-radius: 1vw; 
}

.status-standby {
  background-color: var(--sky);
}

.status-running {
  background-color: var(--dark-green);
}

.status-standby-maintenance {
  background-color: var(--primary);
}

.status-running-maintenance {
  background-color: #8DEB51;
}

.status-down {
  background-color: var(--black);
}

.status-warning {
  background-color: var(--yellow);
}

.status-danger {
  background-color: var(--red);
}

.status-unknown {
  background-color: #d8d8d8;
}

.material-symbols-rounded {
  font-size: 3vh;

  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 2
}

.text-blue {
  font-family: 'Inter', serif;
  color: var(--sky);
  font-size: 2vh;
}

.text-green {
  font-family: 'Inter', serif;
  color: var(--dark-green);
  font-size: 2vh;
}

.text-black {
  font-family: 'Inter', serif;
  color: var(--black);
  font-size: 2vh;
}

.crane-value {
  font-family: 'Inter', serif;
  font-size: 2vh;
  font-weight: 600;
}

.bottom-line-blue {
  border: 6px solid var(--sky);
}

.bottom-line-green {
  border: 6px solid var(--dark-green);
}

.bottom-line-black {
  border: 6px solid var(--black);
}

.text-status {
  font-size: 1vh;
  font-weight: 400;
}

.edit {
  width: 2vw;
  height: 2vh;
  border-radius: 2vh;
  font-size: 2vh;
  color: var(--symbol-blue);
  background-color: var(--bg-light-tugboat);
}

.tilt-header {
  font-family: 'Sarabun', serif;
  font-size: 1vh;
  font-weight: 500;
  text-align: center;
}

.barge-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg_barge {
  width: 100%;
  height: auto;
}

.barge-img {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12vw;
  height: 10vh;
}

.gauge-chart {
  width: 14vw;
  height: 12vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notification-header {
  padding: 1vh 1vh 0 1vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>