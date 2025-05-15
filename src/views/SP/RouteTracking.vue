<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <div class="top-space"></div>
    <div class="page-container">
      <div class="filter-container">
        <TugboatFilter @boat-selected="updateSelectedBoats" ref="tugboatFilter"/>
      </div>
      <div class="map-container">
        <div id="map" class="map">
          <v-img :src="require('@/assets/Icons/compass_map.svg')" class="compass"></v-img>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavigationBar from "@/components/NavigationBar.vue";
import TugboatFilter from "@/components/TugboatDetails/TugboatFilter.vue";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tugboats } from '@/config/config';
import { useRouter } from 'vue-router';

// Reactive state variables
const map = ref(null);
const router = useRouter();
const boatMarkers = ref([]);
const selectedBoats = ref([]);
const boatLocations = ref({
  'Ketsarin01': { lat: 13.7563, lng: 100.5018 },
  'Ketsarin02': { lat: 13.7500, lng: 100.4900 },
  'Ketsarin04': { lat: 13.7400, lng: 100.5100 },
  'Ketsarin05': { lat: 13.7600, lng: 100.4800 },
  'Ketsarin06': { lat: 13.7450, lng: 100.5050 }
});

// Methods
const initMap = () => {
  map.value = L.map('map').setView([13.7563, 100.5018], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);
};

const updateSelectedBoats = (boats) => {
  selectedBoats.value = boats;
  updateMapMarkers();
};

const updateMapMarkers = () => {
  // Remove old markers
  boatMarkers.value.forEach(marker => map.value.removeLayer(marker));
  boatMarkers.value = [];

  // Add new markers
  selectedBoats.value.forEach(boatId => {
    const boat = tugboats.find(b => b.id === boatId);
    if (boat && boatLocations.value[boat.name]) {
      const location = boatLocations.value[boat.name];

      // Create custom icon
      const boatIcon = L.divIcon({
        className: 'custom-boat-icon',
        html: `<div style="color: ${getStatusColor(boat.status)};">
                 <i class="mdi mdi-ferry" style="font-size: 30px;"></i>
               </div>`,
        iconSize: [30, 30]
      });

      const marker = L.marker([location.lat, location.lng], { icon: boatIcon })
        .bindPopup(`<b>${boat.name}</b><br>Status: ${boat.status}`)
        .addTo(map.value);

      boatMarkers.value.push(marker);
    }
  });

  // Adjust zoom to fit markers
  if (boatMarkers.value.length > 0) {
    const group = new L.featureGroup(boatMarkers.value);
    map.value.fitBounds(group.getBounds(), { padding: [50, 50] });
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Running': return '#009688';   // Green
    case 'Maintenance': return '#DC2B2B'; // Red
    case 'Pending': return '#FAC12A';   // Yellow
    default: return '#000000';          // Black
  }
};

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepage');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101010700');

  if (!permission || !permission.IsActive) {
    return router.push('/Homepage');
  }
}

onMounted(() => {
  initMap();
  initialize();
});

</script>


<style scoped>
.top-space {
  height: 64px;
}

.custom-boat-icon {
  background: none;
  border: none;
}

.page-container {
  display: flex;
  height: calc(100vh - 64px);
}

.filter-container {
  width: 350px;
  height: 100%;
}

.map-container {
  flex-grow: 1;
  position: relative;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
}

.compass {
  position: absolute;
  z-index: 999; 
  width: 202px; 
  top: 32px;
  right: 32px;
}

.custom-boat-icon {
  background: none;
  border: none;
}

:deep(.leaflet-left .leaflet-control) {
  display: none;
}
</style>