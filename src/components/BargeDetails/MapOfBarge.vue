<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <!-- Column 1: Map (ด้านซ้าย) -->
      <v-col cols="6">
        <v-card class="rounded-xl h-100" elevation="0">
          <div id="map"></div>
        </v-card>
      </v-col>

      <!-- Column 2: Wind Speed and Wind Direction (ด้านขวา) -->
      <v-col cols="6" class="d-flex flex-column">
        <v-card class="wind-speed-card rounded-xl mb-4 h-100" elevation="0">
          <v-row>
            <v-col cols="12">
              <p class="wind-title">Wind Speed</p>
            </v-col>
            <v-col cols="6">
              <v-img 
                :src="require('@/assets/Icons/wind_speed.svg')"
                class="wind-speed-icon"
              ></v-img>
            </v-col>
            <v-col cols="6">
              <p class="detail">0 m/hr</p>
            </v-col>
          </v-row>
        </v-card>
        <v-card class="wind-direction-card rounded-xl h-100" elevation="0">
          <v-row>
            <v-col cols="12">
              <p class="wind-title">Wind Direction</p>
            </v-col>
            <v-col cols="6" class="compass-container">
              <v-img 
                :src="require('@/assets/Icons/compass_scale02.svg')" 
                class="compass-scale"
              ></v-img>
              <v-img
                :src="require('@/assets/Icons/compass_black.svg')"
                class="compass-icon"
                :style="{ transform: `translate(-50%, -50%) rotate(${currentBearing}deg)` }"
                style="transition: transform 1s ease-out;"
              ></v-img>
            </v-col>
            <v-col cols="6">
              <p class="detail">{{ currentDirection }}{{ Math.round(currentBearing) }}°</p>
            </v-col>  
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-compass';
import markerIconUrl from '@/assets/Images/ship_location.png';
import "@/assets/colors.scss";

export default {
  setup() {
    const currentBearing = ref(0);
    const map = ref(null);
    const compassControl = ref(null);

    const currentDirection = computed(() => {
      const angle = currentBearing.value;
      if (angle >= 337.5 || angle < 22.5) return 'N';
      else if (angle >= 22.5 && angle < 67.5) return 'NE';
      else if (angle >= 67.5 && angle < 112.5) return 'E';
      else if (angle >= 112.5 && angle < 157.5) return 'SE';
      else if (angle >= 157.5 && angle < 202.5) return 'S';
      else if (angle >= 202.5 && angle < 247.5) return 'SW';
      else if (angle >= 247.5 && angle < 292.5) return 'W';
      else if (angle >= 292.5 && angle < 337.5) return 'NW';
      return 'N/A';
    });

    onMounted(() => {
      const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
      const osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>';

      // Initialize map
      map.value = L.map('map').setView([13.142583, 100.806189], 13);

      // Add tile layer
      L.tileLayer(osmUrl, {
        maxZoom: 20,
        attribution: osmAttrib,
      }).addTo(map.value);

      // Add Leaflet compass
      compassControl.value = L.control.compass({
        autoActive: true,
        showDigit: true,
        position: 'topright',
        textErr: "ไม่สามารถตรวจจับทิศทางได้",
        onChange: (angle) => {
          updateCompassDirection(angle);
        }
      }).addTo(map.value);

      // Custom icon marker setup
      const customIcon = L.icon({
        iconUrl: markerIconUrl,
        iconSize: [64, 64],
      });

      // Add from sensor
      const markers = [
        { position: [13.122581, 100.816189] },
      ];

      markers.forEach(marker => {
        L.marker(marker.position, { icon: customIcon })
          .addTo(map.value)
          .bindPopup(marker.name);
      });

      // Function to update both compasses
      function updateCompassDirection(angle) {
        currentBearing.value = angle;

        // Update Leaflet compass
        const compassElem = document.querySelector('.leaflet-compass .compass-icon');
        if (compassElem) {
          compassElem.style.transform = `rotate(${angle}deg)`;
        }

        // Update digit display in Leaflet compass with direction
        const digitElem = document.querySelector('.leaflet-compass .compass-digit');
        if (digitElem) {
          digitElem.textContent = `${currentDirection.value}${Math.round(angle)}°`;
        }
      }

      const testInterval = setInterval(() => {
        const randomBearing = Math.floor(Math.random() * 360);
        updateCompassDirection(randomBearing);
      }, 10000);

      // Cleanup on component unmount
      return () => {
        if (testInterval) {
          clearInterval(testInterval);
        }
        if (map.value) {
          map.value.remove();
        }
      };
    }); 
    return {
      currentBearing,
      currentDirection,
    };
  },
};
</script>

<style scoped>
#map {
  border-radius: 0.5vh;
  width: 100%;
  height: 100%;
}

.detail {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3vh;
  font-weight: 700;
}

.wind-speed-card {
  background-color: #EAF4FF;
  padding: 1vh;
}

.wind-direction-card {
  background-color: #F4F4F4;
  padding: 1vh;
}

.wind-title {
  font-size: 1.5vh;
  color: #4B4B4B;
  font-weight: 400;
  text-align: center;
  margin-bottom: 1vh;
}

.wind-speed-icon {
  width: 4vw;
  left: 20%;
}

.compass-icon {
  position: absolute;
  top: 60%;
  left: 25%;
  transform: translate(-50%, -50%);
  width: 8vw;
  height: 8vh;
}

.compass-scale {
  position: absolute;
  top: 60%;
  left: 25%;
  transform: translate(-50%, -50%);
  width: 9vw;
  height: 9vh;
  z-index: 999;
}

:deep(.leaflet-compass .compass-icon) {
  transition: transform 1s ease-out;
  background-image: url(/src/assets/Icons/compass_on_map.svg);
  background-size: cover;
  width: 100px; 
  height: 100px;
  
  @media screen and (max-width: 1920px) {
    width: 50px; /* Adjust size for smaller screens */
    height: 50px;
  }
}

:deep(.leaflet-control.leaflet-compass) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  background-image: url(/src/assets/Icons/scale.svg);
  width: 150px;
  height: 150px;
  box-shadow: none;

  @media screen and (max-width: 1920px) {
    width: 50px; /* Adjust size for smaller screens */
    height: 50px;
  }
}

:deep(.leaflet-compass .compass-button) {
  width: 100px;
  height: 100px;

  @media screen and (max-width: 1920px) {
    width: 50px; /* Adjust size for smaller screens */
    height: 50px;
  }
}

/* Digit under compass */
:deep(.leaflet-compass .compass-digit) {
  position: absolute;
  margin-top: 2vh;
  left: 55%;
  transform: translateX(-50%);
  font-weight: 700;
  font-size: 1.5vh;
  color: var(--light-blue);
}

:deep(.leaflet-compass .compass-alert) {
  background-color: var(--white);
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1vh;
}
</style>