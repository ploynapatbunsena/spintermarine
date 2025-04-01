<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <div class="top-space"></div>
    <div class="page-container">
      <div class="filter-container">
        <SelectList 
          @boat-selected="updateSelectedBoats" 
          ref="tugboatFilter"
          :initialSelectedBoat="initialSelectedBoat"
        />  
      </div>
      <div class="map-container">
        <div id="map" class="map">
          <v-img :src="require('@/assets/Icons/compass_map.svg')" class="compass"></v-img>
        </div>
        <TransportTable :selectedBoat="selectedBoatData" />
      </div>
    </div>
  </v-app>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue"
import SelectList from "@/components/TugboatDetails/SelectList.vue";
import TransportTable from "@/components/TugboatDetails/TransportTable.vue";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tugboats } from '@/data/config';

export default {
  components: {
    NavigationBar,
    SelectList,
    TransportTable,
  },

  data() {
    return {
      map: null,
      boatMarkers: [],
      selectedBoats: null,
      selectedBoatData: null,
      initialSelectedBoat: null,
      tugboats,
      boatLocations: {
        'Ketsarin01': { lat: 13.7563, lng: 100.5018 },
        'Ketsarin02': { lat: 13.7500, lng: 100.4900 },
        'Ketsarin04': { lat: 13.7400, lng: 100.5100 },
        'Ketsarin05': { lat: 13.7600, lng: 100.4800 },
        'Ketsarin06': { lat: 13.7450, lng: 100.5050 }
      }
    }
  },

  created() {
    // ตรวจสอบว่า query parameter 'id' มีค่าอะไร
    const selectedBoatId = this.$route.query.id;
    if (selectedBoatId) {
      this.initialSelectedBoat = selectedBoatId;  // ตั้งค่า selectedBoat ให้เป็น id ของเรือที่ได้รับ
      this.updateSelectedBoats(selectedBoatId);
    }
  },
  
  mounted() {
    this.initMap();

    if (this.selectedBoats) {
      this.updateMapMarkers();
    }
  },

  watch: {
    selectedBoats(newVal) {
      this.selectedBoatData = this.tugboats.find(b => b.id === newVal) || null;
    }
  },

  methods: {
    initMap() {
      // สร้าง map กลางประเทศไทย
      this.map = L.map('map').setView([13.7563, 100.5018], 10);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    },

    updateSelectedBoats(boatId) {
      this.selectedBoats = boatId;
      const boat = this.tugboats.find(b => b.id === boatId);
      this.selectedBoatData = boat || null;
      this.updateMapMarkers();
    },
        
    updateMapMarkers() {
      if (!this.map) {
        console.warn("Map is not initialized yet.");
        return;
      }

      // ลบ markers เก่า
      this.boatMarkers.forEach(marker => this.map.removeLayer(marker));
      this.boatMarkers = [];

      // เพิ่ม marker ใหม่
      if (this.selectedBoats) {
        const boat = this.tugboats.find(b => b.id === this.selectedBoats);
        if (boat && this.boatLocations[boat.name]) {
          const location = this.boatLocations[boat.name];
          
          const boatIcon = L.divIcon({
            className: 'custom-boat-icon',
            html: `<div style="color: ${this.getStatusColor(boat.status)};">
                    <i class="mdi mdi-ferry" style="font-size: 30px;"></i>
                  </div>`,
            iconSize: [30, 30]
          });

          const marker = L.marker([location.lat, location.lng], { icon: boatIcon })
            .bindPopup(`<b>${boat.name}</b><br>Status: ${boat.status}`)
            .addTo(this.map);
          
          this.boatMarkers.push(marker);

          // Center the map on the selected boat
          this.map.setView([location.lat, location.lng], 12);
        }
      }
    },

    getStatusColor(status) {
      switch (status) {
        case 'Running': return '#009688';   // เขียว
        case 'Maintenance': return '#DC2B2B'; // แดง
        case 'Pending': return '#FAC12A';   // เหลือง
        default: return '#000000';          // ดำ
      }
    }
  }
}
</script>

<style scoped>
.top-space {
  height: 64px;
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
  display: flex;
  flex-direction: column;
}

.map {
  flex-grow: 1;
  position: relative;
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