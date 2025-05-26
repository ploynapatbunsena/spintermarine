<template>
  <nav>
    <v-app-bar color="#080F25" :height="$vuetify.display.width > 2560 ? 120 : 64">
      <v-app-bar-nav-icon class="nav-icon" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-row class="logo-container">
        <v-col cols="8" sm="8" lg="2">
          <router-link :to="{ name: 'Homepage'}">
            <v-img
              class="navbar-logo"
              :src="require('@/assets/Images/logo_navbar.png')"
              ></v-img>
          </router-link>
        </v-col>
      </v-row>
      <template v-if="$vuetify.display.mdAndUp">
        <v-btn icon variant="text">
          <span class="material-symbols-rounded icon">account_circle</span>
        </v-btn>
        <p class="text-bar">{{ memberName }}</p>
        <v-btn icon variant="text" @click="logout" :to="{ name: 'Login' }">
          <span class="material-symbols-rounded icon">logout</span>
        </v-btn>
        <p class="text-bar">Logout</p>
      </template>
      <template v-else>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-icon>mdi-account-circle</v-icon>
                {{ memberName }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>
                <v-icon start>mdi-logout</v-icon>
                Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      location="left"
      temporary
      color="#080F25"
      :width="$vuetify.display.width > 2560 ? 800 : 400"
    >
      <v-list v-model:opened="open">
        <!-- Home - เปิดให้ทุกคนเห็น -->
        <v-list-item v-if="isAdmin"
          prepend-icon="mdi-home" 
          title="Home" 
          :to="{ name: 'Homepage' }"
          class="nav-icon"
          style="padding: 0vw 1vw;"
        ></v-list-item>

        <!-- Barge Section -->
        <v-list-group value="Barge" v-if="isBargeUser">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-anchor"
              title="Barge"
              title-class="custom-title"
              class="nav-icon"
              style="padding: 0vw 1vw;"
            ></v-list-item>
          </template>

          <!-- Barge Overview - สำหรับ Supervisor และ Admin -->
          <v-list-item
            v-if="isBargeSupervisor"
            prepend-icon="mdi-format-list-bulleted"
            title="Overview"
            :to="{ name: 'Barge' }"
            class="nav-icon"
            style="padding: 0vw 1vw;"
          ></v-list-item>

          <!-- Barge Groups - แสดงเฉพาะกลุ่มที่เกี่ยวข้องกับผู้ใช้ -->
          <v-list-group
            v-for="(deviceGroup, typeDeviceName) in filteredBargeDevices"
            :key="typeDeviceName"
            :value="typeDeviceName"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-ship-wheel"
                :title="typeDeviceName"
                class="nav-icon"
                style="padding: 0vw 1vw;"
              ></v-list-item>
            </template>
            <v-list-item
              :title="`${typeDeviceName} Detail`"
              :to="{ name: 'BargeDetail', params: { typeDeviceName: typeDeviceName } }"
            ></v-list-item>
            <v-list-item
              v-for="device in deviceGroup"
              :key="device.DeviceId"
              :title="device.DeviceLabel"
              :to="{ name: 'GeneratorDetails', params: { deviceId: device.DeviceId } }"
            ></v-list-item>
          </v-list-group>
        </v-list-group>

        <!-- Tugboat Section -->
        <v-list-group value="Tugboat" v-if="isTugboatUser">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-ferry"
              title="Tugboat"
              class="nav-icon"
              style="padding: 0vw 1vw;"
            ></v-list-item>
          </template>

          <!-- Tugboat Overview - สำหรับ Supervisor และ Admin -->
          <v-list-item
            v-if="isTugboatSupervisor || isAdmin"
            prepend-icon="mdi-format-list-bulleted"
            title="Overview"
            :to="{ name: 'Tugboat' }"
            class="nav-icon"
            style="padding: 0vw 1vw;"
          ></v-list-item>

          <!-- Tugboat river going -->
          <v-list-group value="Tugboat river going">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-ferry"
                title="Tugboat river going"
                class="nav-icon"
                style="padding: 0vw 1vw;"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="device in filteredTugboatRiverDevices"
              :key="device.DeviceId"
              :title="device.DeviceLabel"
              :to="{ name: 'TugboatDetail', params: { deviceId: device.DeviceId } }"
            ></v-list-item>
          </v-list-group>

          <!-- Tugboat sea going -->
          <v-list-group value="Tugboat sea going">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-ferry"
                title="Tugboat sea going"
                class="nav-icon"
                style="padding: 0vw 1vw;"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="device in filteredTugboatSeaDevices"
              :key="device.DeviceId"
              :title="device.DeviceLabel"
              :to="{ name: 'TugboatDetail', params: { deviceId: device.DeviceId } }"
            ></v-list-item>
          </v-list-group>
        </v-list-group>

        <!-- Route Tracking - ไม่แสดงสำหรับผู้ใช้ Barge -->
        <v-list-item 
          v-if="!isBargeUser || isAdmin"
          prepend-icon="mdi-map-marker-radius" 
          title="Route Tracking" 
          class="nav-icon" 
          style="padding: 0vw 1vw;" 
          :to="{ name: 'RouteTracking' }"
        ></v-list-item>

        <!-- Report Section -->
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-chart-timeline-variant-shimmer"
              title="Report"
              class="nav-icon"
              style="padding: 0vw 1vw;"
            ></v-list-item>
          </template>

          <!-- Reports ที่ทุกคนเห็น -->
          <v-list-item title="Notification Report" :to="{ name: 'NotificationReport' }"></v-list-item>
          <v-list-item title="ChartHistorical Report" :to="{ name: 'HistoricalChart' }"></v-list-item>

          <!-- Reports เฉพาะ Tugboat -->
          <v-list-item 
            v-if="isTugboatUser || isAdmin"
            title="Report on RPM and Speed and %Throttle Affected by Wind Speed of Tugboat" 
            :to="{ name: 'WindSpeedImpactReport' }"
          ></v-list-item>
          <v-list-item 
            v-if="isTugboatUser || isAdmin"
            title="Report on Tugboats Encountering Storms" 
            :to="{ name: 'EncounteringStormsReport' }"
          ></v-list-item>
          <v-list-item 
            v-if="isTugboatUser || isAdmin"
            title="Report on %Throttle vs. RPM vs. Fuel Rate" 
            :to="{ name: 'ThrottleRPMFuelRateReport' }"
          ></v-list-item>

          <!-- Reports เฉพาะ Barge -->
          <v-list-item 
            v-if="isBargeUser || isAdmin"
            title="Report on Fuel Rate per RPM for Evaluating Engine Efficiency of Motor Barge" 
            :to="{ name: 'FuelRatePerRPMReport' }"
          ></v-list-item>
          <v-list-item 
            v-if="isBargeUser || isAdmin"
            title="Report on Daily Fuel Consumption for the Barge" 
            :to="{ name: 'DailyFuelConsumtionReport' }"
          ></v-list-item>
          <v-list-item 
            v-if="isBargeUser || isAdmin"
            title="Report on Barge Tilt" 
            :to="{ name: 'BargeTiltReport' }"
          ></v-list-item>
        </v-list-group>

        <!-- Setting Section - เฉพาะ Admin -->
        <v-list-group v-if="isAdmin">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-cog"
              title="Setting"
              class="nav-icon"
              style="padding: 0vw 1vw;"
            ></v-list-item>
          </template>
          <v-list-item title="Device Management" :to="{ name: 'DeviceManagementList' }"></v-list-item>
          <v-list-item title="Member Management" :to="{ name: 'MemberManagementList' }"></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { inject, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const $api = inject('$api');
const router = useRouter();
const drawer = ref(false);
const open = ref(['Barge', 'Tugboat']);
const memberName = ref('Username');
const devices = ref([]);
const bargeDevices = ref({});
const tugboatRiverDevices = ref([]);
const tugboatSeaDevices = ref([]);

const userPosition = computed(() => {
  const memberData = localStorage.getItem('member');
  return memberData ? JSON.parse(memberData).Position : null;
});

const isAdmin = computed(() => {
  const position = userPosition.value;
  return position === 'Admin' || position === 'User' || position === 'Integration' || false;
});

const isBargeSupervisor = computed(() => {
  return userPosition.value === 'Barge Supervisor' || isAdmin.value;
});

const isTugboatSupervisor = computed(() => {
  return userPosition.value === 'Tugboat Supervisor' || isAdmin.value;
});

const isBargeUser = computed(() => {
  // return userPosition.value?.startsWith('Barge') || isAdmin.value;
  const position = userPosition.value;
  return position?.includes('Barge') || isAdmin.value;
  // return position?.startsWith('Barge') || isBargeSupervisor.value || isAdmin.value;
});

const isTugboatUser = computed(() => {
  const position = userPosition.value;
  return position?.includes('Tugboat') || isAdmin.value;
  // return position?.startsWith('Tugboat') || isTugboatSupervisor.value || isAdmin.value;
});

const filteredBargeDevices = computed(() => {
  if (userPosition.value === 'Barge Supervisor') {
    return bargeDevices.value
  }
  // user ทั่วไป
  if (!userPosition.value && !isAdmin.value) return {};

  return Object.fromEntries(
    Object.entries(bargeDevices.value).filter(([typeDeviceName]) => 
      isAdmin.value || userPosition.value.includes(typeDeviceName)
    )
  )  
});


const filteredTugboatRiverDevices = computed(() => {
  if (userPosition.value === 'Tugboat Supervisor') {
    return tugboatRiverDevices.value
  }

  if (!userPosition.value && !isAdmin.value) return [];

  return tugboatRiverDevices.value.filter(device => 
    userPosition.value?.includes(device.DeviceLabel) || isAdmin.value
  );
});

const filteredTugboatSeaDevices = computed(() => {
  if (userPosition.value === 'Tugboat Supervisor') {
    return tugboatSeaDevices.value
  }

  if (!userPosition.value && !isAdmin.value) return [];

  return tugboatSeaDevices.value.filter(device => 
    userPosition.value?.includes(device.DeviceLabel) || isAdmin.value
  );
});

const fetchDeviceList = async () => {
  try {
    const response = await $api.put('/device/GetDeviceListProfile', {
      DeviceId: ''
    });
    devices.value = response.data;
    groupDevicesByType();
  } catch (error) {
    console.error('Failed to fetch device list:', error);
  }
};

const excludedDeviceNames = [
  'Barge CRANE 1',
  'Barge CRANE 2',
  'Barge CRANE 3',
  'Barge Master'
];

const groupDevicesByType = () => {
  const bargeGrouped = {};
  const tugboatRiver = [];
  const tugboatSea = [];

  devices.value.forEach(device => {
    if (!excludedDeviceNames.includes(device.DeviceName)) {
      if (device.TypeVehicle === 'Barge') {
        const typeDeviceName = device.TypeDevicename || 'Unknown';
        if (!bargeGrouped[typeDeviceName]) {
          bargeGrouped[typeDeviceName] = [];
        }
        bargeGrouped[typeDeviceName].push(device);
      } else if (device.TypeVehicle === 'Tugboat river going') {
        tugboatRiver.push(device);
      } else if (device.TypeVehicle === 'Tugboat sea going') {
        tugboatSea.push(device);
      }
    }
  });

  bargeDevices.value = bargeGrouped;
  tugboatRiverDevices.value = tugboatRiver;
  tugboatSeaDevices.value = tugboatSea;
};

const accountName = async () => {
  const memberData = localStorage.getItem('member');
  if (memberData) {
    const member = JSON.parse(memberData);
    memberName.value = `${member.MemberFirstnameEng} ${member.MemberLastnameEng}`;
  }
};

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('member');
  localStorage.removeItem('menuPermission');
  router.push('/login')
    .then(() => {
      console.log('Logged out successfully');
    })
    .catch(err => {
      console.error('Logout redirect error:', err);
    });
};

watch(devices, () => {
  drawer.value = false;
});

onMounted(async() => {
  accountName();
  await fetchDeviceList();
});
</script>

<style lang="scss" scoped>
.material-symbols-rounded {
  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

.icon {
  font-size: 3vh;
  color: #FFFFFF;
}

.text-bar {
  font-size: 1.5vh;
  padding-right: 2vw;
}

p {
  font-size: 16px;
}

.v-navigation-drawer {
  overflow: auto !important;
}

.v-list {
  overflow-y: scroll !important;
  max-height: 100%;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.v-list::-webkit-scrollbar {
  display: none !important;
}

@media(min-width: 2560px) {
  :deep(.v-list-item-title) {
    font-size: 1.5vh !important;
    padding: 1vh;
  }

  .nav-icon {
    font-size: 1.5vh;
    padding: 0vw 1.5vw;
  }

  .icon {
    margin-right: 1vw;
    font-size: 2vh;
  }

  .navbar-logo {
    max-width: 10vw;
  }
}

@media(max-width: 1280px) {
  .navbar-logo {
    max-width: 20vh;
    height: auto;
  }

  .icon {
    font-size: 2vh;
  }

  .text-bar {
  font-size: 1vh;
  }
}

@media (max-width: 767px) {
  .navbar-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 30vh;
  }

  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>