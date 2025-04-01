<template>
  <nav>
    <v-app-bar
      color="#080F25"
      absolute
    >
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-img
          :src="require('@/assets/Images/logo_navbar.png')"
          class="pa-0 ma-0"
          width="16rem"
          height="auto"
        >
        </v-img> 
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="$vuetify.display.mdAndUp">
        <v-btn icon variant="text">
          <i class="bi bi-person-circle icon"></i>
        </v-btn>
        <p class="pr-6" style="font-size: 14px;">Username</p>
        <v-btn icon variant="text" @click="logout">
          <span class="material-symbols-rounded icon">logout</span>
        </v-btn>
        <p class="pr-6" style="font-size: 14px;">Logout</p>
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
          <v-list-group 
            v-for="category in groupedTugboats" 
            :key="category.name" 
            :value="category.name"
          >
            <template v-slot:activator="{ props }">
              <v-list-item 
                v-bind="props" 
                prepend-icon="mdi-ferry" 
                :title="category.name"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="tugboat in category.tugboats"
              :key="tugboat.id"
              :title="tugboat.name"
              :value="tugboat.id"
              :to="{ name: 'TugboatDetail', params: { id: tugboat.id } }"
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
import { ref, watch, computed } from 'vue';
import { barges, tugboats } from '@/data/config';

const drawer = ref(false);
const group = ref(null);
const open = ref(['Users']);


const groupedTugboats = computed(() => {
  const grouped = { 'River Going': [], 'Sea Going': [] };
  
  tugboats.forEach(tugboat => {
    if (tugboat.category === 'River') {
      grouped['River Going'].push(tugboat);
    } else if (tugboat.category === 'Sea') {
      grouped['Sea Going'].push(tugboat);
    }
  });
  
  return [
    { name: 'River Going', tugboats: grouped['River Going'] },
    { name: 'Sea Going', tugboats: grouped['Sea Going'] }
  ];
});

const logout = () => {
  console.log("Logging out...");
};

watch(group, () => {
  drawer.value = false;
});

</script>

<style lang="scss" scoped>
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