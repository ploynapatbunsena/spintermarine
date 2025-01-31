import { barges } from '@/data/config';
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
              :to="{ name: 'Barge' }"
            ></v-list-item>
          </template>
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
                :to="{ name: 'BargeDetail', params: { id: barge.id } }"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="item in barge.items"
              :key="item.id"
              :title="item.title"
              :value="item.id"
              :to="{ name: ''}"
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
            title="Overview">
          </v-list-item>
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
            ></v-list-item>
          </v-list-group>
        </v-list-group>
        
        <v-list-item prepend-icon="mdi-map-marker-radius" title="GPS Tracker"></v-list-item>

        <!-- Report Group -->
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-chart-timeline-variant-shimmer"
              title="Report"
            ></v-list-item>
          </template>
            <v-list-item
              v-for="report in reports"
              :key="report.id"
              :title="report.name"
              :value="report.id"
          ></v-list-item>
        </v-list-group>

        <v-list-item prepend-icon="mdi-account-cog" title="Management"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { barges, tugboats, reports } from '@/data/config';

export default {
  name: 'MenuBar',
  data: () => ({
    drawer: false,
    group: null,
    open: ['Users'],
    barges,
    tugboats,
    reports,
  }),

  watch: {
    group() {
      this.drawer = false;
    },
  },

  computed: {
    // จัดกลุ่ม tugboats ตาม category
    groupedTugboats() {
      const grouped = { 'River Going': [], 'Sea Going': [] };
      
      this.tugboats.forEach(tugboat => {
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
    }
  },

  methods: {
    logout() {
      console.log("Logging out...");
    },
  },
};
</script>

<style lang="scss">
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