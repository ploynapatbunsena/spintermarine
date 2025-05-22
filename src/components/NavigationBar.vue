<template>
  <nav>
    <v-app-bar color="#080F25" :height="$vuetify.display.width > 2560 ? 120 : 64">
      <v-app-bar-nav-icon class="nav-icon" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-row>
        <v-col cols="8" sm="8" lg="2">
          <router-link :to="{ name: 'Homepage'}">
            <v-img
              :src="require('@/assets/Images/logo_navbar.png')"
              class="navbar-logo"
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
        <v-list-item 
          prepend-icon="mdi-home" 
          title="Home" 
          :to="{ name: 'Homepage' }"
          class="nav-icon"
          style="padding: 0vw 1vw;"
        ></v-list-item>
        <v-list-group value="Barge">
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
          <v-list-item
            prepend-icon="mdi-format-list-bulleted"
            title="Overview"
            :to="{ name: 'Barge' }"
            class="nav-icon"
            style="padding: 0vw 1vw;"
          ></v-list-item>
          <v-list-group
            v-for="(deviceGroup, typeDeviceName) in bargeDevices"
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
        <v-list-group value="Tugboat">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-ferry"
              title="Tugboat"
              class="nav-icon"
              style="padding: 0vw 1vw;"
            ></v-list-item>
          </template>
          <v-list-item
            prepend-icon="mdi-format-list-bulleted"
            title="Overview"
            :to="{ name: 'Tugboat' }"
            class="nav-icon"
            style="padding: 0vw 1vw;"
          ></v-list-item>
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
              v-for="device in tugboatRiverDevices"
              :key="device.DeviceId"
              :title="device.DeviceLabel"
              :to="{ name: 'TugboatDetail', params: { deviceId: device.DeviceId } }"
            ></v-list-item>
          </v-list-group>
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
              v-for="device in tugboatSeaDevices"
              :key="device.DeviceId"
              :title="device.DeviceLabel"
              :to="{ name: 'TugboatDetail', params: { deviceId: device.DeviceId } }"
            ></v-list-item>
          </v-list-group>
        </v-list-group>
        <v-list-item prepend-icon="mdi-map-marker-radius" title="Route Tracking" class="nav-icon" style="padding: 0vw 1vw;" :to="{ name: 'RouteTracking' }"></v-list-item>
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
          <v-list-item title="Notification Report" :to="{ name: 'NotificationReport' }"></v-list-item>
          <v-list-item title="ChartHistorical Report" :to="{ name: 'HistoricalChart' }"></v-list-item>
          <v-list-item title="Report on RPM and Speed and %Throttle Affected by Wind Speed of Tugboat" :to="{ name: 'WindSpeedImpactReport' }"></v-list-item>
          <v-list-item title="Report on Tugboats Encountering Storms" :to="{ name: 'EncounteringStormsReport' }"></v-list-item>
          <v-list-item title="Report on Fuel Rate per RPM for Evaluating Engine Efficiency of Motor Barge" :to="{ name: 'FuelRatePerRPMReport' }"></v-list-item>
          <v-list-item title="Report on %Throttle vs. RPM vs. Fuel Rate" :to="{ name: 'ThrottleRPMFuelRateReport' }"></v-list-item>
          <v-list-item title="Report on Daily Fuel Consumption for the Barge" :to="{ name: 'DailyFuelConsumtionReport' }"></v-list-item>
          <v-list-item title="Report on Barge Tilt" :to="{ name: 'BargeTiltReport' }"></v-list-item>
        </v-list-group>
        <v-list-group>
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

onMounted(() => {
  accountName();
  fetchDeviceList();
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

  @media(min-width: 2560px) {
    margin-right: 1vw;
  }

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

:deep(.v-list-item-title) {
  @media(min-width: 2560px) {
    font-size: 1.5vh !important;
    padding: 1vh;
  }
}

.nav-icon {
  @media(min-width: 2560px) {
    font-size: 1.5vh;
    padding: 0vw 1.5vw;
  }
}
</style>