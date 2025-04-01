<template>
  <nav>
    <v-app-bar color="#080F25" absolute>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-row>
          <v-col cols="8" sm="8" lg="2">
            <v-img
              :src="require('@/assets/Images/logo_navbar.png')"
              class="navbar-logo"
              max-width="256"
            >
            </v-img>
          </v-col>
          <v-col>

          </v-col>
        </v-row>
      <template v-if="$vuetify.display.mdAndUp">
        <v-btn icon variant="text">
          <i class="bi bi-person-circle icon"></i>
        </v-btn>
        <p class="pr-6" style="font-size: 14px;">{{ memberName }}</p>
        <v-btn icon variant="text" @click="logout" :to="{ name: 'Login'}">
          <span class="material-symbols-rounded icon">logout</span>
        </v-btn>
        <p class="pr-6" style="font-size: 14px;">Logout</p>
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
                <v-icon start>mdi-account</v-icon>
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

    <!-- drawer sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      location="left"
      temporary
      color="#080F25"
      width="400"
    >
      <v-list v-model:opened="open">
        <v-list-item prepend-icon="mdi-home" title="Home" :to="{ name: 'Homepage' }"></v-list-item>
        <!-- Barge Group -->
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-anchor"
              title="Barge"
            ></v-list-item>
          </template>
          <v-list-item 
            prepend-icon="mdi-format-list-bulleted" 
            title="Overview"
            :to="{ name: 'Barge'}"  
          ></v-list-item>
          <v-list-group
            v-for="barge in barges"
            :key="barge.id"
            :value="barge.id"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-ship-wheel"
                :title="barge.name"
              ></v-list-item>
            </template>
            
            <!-- ลิงก์ไปยัง Barge Detail -->
            <v-list-item
              :title="barge.name + ' Detail'"
              :to="{ name: 'BargeDetail', params: { id: barge.id } }"
            ></v-list-item>
            
            <!-- รายการอุปกรณ์ในเรือ Barge -->
            <v-list-item
              v-for="item in barge.items"
              :key="item.id"
              :title="item.title"
              :value="item.id"
              :to="{ name: 'GeneratorDetails', params: { id: barge.id, itemId: item.id }}"
            ></v-list-item>
          </v-list-group>
        </v-list-group>

        <!-- Tugboat Group -->
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-ferry"
              title="Tugboat"
            ></v-list-item>
          </template>
          <v-list-item 
            prepend-icon="mdi-format-list-bulleted" 
            title="Overview"
            :to="{ name: 'Tugboat'}"  
          ></v-list-item>
          <!-- TypeVehicle -->
          <v-list-group>
            <v-list-item
              prepend-icon="mdi-ferry"
            ></v-list-item>
          </v-list-group>
        </v-list-group>
        
        <v-list-item prepend-icon="mdi-map-marker-radius" title="GPS Tracker" :to="{ name: 'GPS_Tracker' }"></v-list-item>

        <!-- Report Group -->
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-chart-timeline-variant-shimmer"
              title="Report"
            ></v-list-item>
          </template>
          <v-list-item title="Notification Report" :to="{ name: 'NotificationReport' }"></v-list-item>
          <v-list-item title="ChartHistorical Report" :to="{ name: 'ChartHistorical' }"></v-list-item>
          <v-list-item title="Report on RPM and Speed and %Throttle Affected by Wind Speed of Tugboat" :to="{ name: 'WindSpeedImpactReport' }"></v-list-item>
          <v-list-item title="Report on Tugboats Encountering Storms" :to="{ name: 'EncounteringStormsReport' }"></v-list-item>
          <v-list-item title="Report on Fuel Rate per RPM for Evaluating Engine Efficiency of Motor Barge" :to="{ name: 'FuelRatePerRPMReport' }"></v-list-item>
          <v-list-item title="Report on %Throttle vs. RPM vs. Fuel Rate" :to="{ name: 'ThrottleRPMFuelRateReport' }"></v-list-item>
          <v-list-item title="Report on Daily Fuel Consumption for the Barge" :to="{ name: 'DailyFuelConsumtionReport' }"></v-list-item>
          <v-list-item title="Report on Barge Tilt" :to="{ name: 'BargeTiltReport' }"></v-list-item>
        </v-list-group>
        <v-list-item 
          prepend-icon="mdi-account-cog" 
          title="Management"
          :to="{ name: 'Management' }"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { barges } from '@/data/config';
import router from '@/router';

const drawer = ref(false);
const group = ref(null);
const open = ref(['Tugboats']);
const memberName = ref('Username')

watch(group, () => {
  drawer.value = false;
});

const accountName = async () => {
  const memberData = localStorage.getItem('member');
  if (memberData) {
    const member = JSON.parse(memberData);
    memberName.value = `${member.MemberFirstnameEng} ${member.MemberLastnameEng}`;
  }
}

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('member');
  router.push({ name: 'Login' })
    .then(() => {
      console.log('Logged out successfully');
    })
    .catch(err => {
      console.error('Logout redirect error:', err);
    });
};

onMounted(() => {
  accountName()
})
</script>

<style lang="scss" scoped>
.navbar-logo {
  margin: 0 auto;
}

.icon {
  font-size: 24px;
  color: #FFFFFF;
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

</style>