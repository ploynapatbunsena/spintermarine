<template>
  <v-container>
    <v-row>
      <!-- Column 1: Map -->
      <v-col cols="auto">
        <v-card style="width: 714px; height: 616px;" class="d-flex align-center justify-center rounded-xl" elevation="0">
          <div id="map"></div>
        </v-card>
      </v-col>
      <!-- Column 2: Wind Speed and Wind Direction -->
      <v-col cols="auto">
        <v-row>
          <v-col>
            <v-card class="wind-speed-card rounded-xl" elevation="0">
              <p class="wind-title">Wind Speed</p>
              <div class="wind-content d-flex align-center">
                <v-img 
                  :src="require('@/assets/Icons/wind_speed.svg')"
                  class="wind-speed-icon"
                ></v-img>
                <div class="wind-speed-value">
                  <span class="value">9</span>
                  <span class="unit">m/hr</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="wind-direction-card rounded-xl" elevation="0">
              <p class="wind-direction-title">Wind Direction</p>
              <v-row>
                <v-col class="compass-container">
                  <v-img 
                    :src="require('@/assets/Icons/compass_scale.svg')" 
                    class="compass-scale"
                  ></v-img>
                  <v-img 
                    :src="require('@/assets/Icons/compass_black.svg')"
                    class="compass-icon"
                    :style="{ transform: `translate(-50%, -50%) rotate(${currentBearing}deg)` }"
                    style="transition: transform 1s ease-out;"
                  ></v-img>
                </v-col>
                <v-row class="wind-direction-value">
                  <span class="value">{{ currentDirection }}{{ Math.round(currentBearing) }}</span>
                  <span class="unit">°</span>
                </v-row>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
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
        { position: [13.122581, 100.816189], name: 'Ketsarin 01' },
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
      }, 7000);

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
* {
  font-family: "Poppins", sans-serif;
}

#map {
  border-radius: 16px;
  width: 100%;
  height: 100%;
}

.wind-speed-card {
  width: 480px;
  height: 296px;
  background-color: #EAF4FF;
  padding: 24px;
  box-sizing: border-box;
}

.wind-direction-card {
  width: 480px;
  height: 296px;
  background-color: #F4F4F4;
  padding: 24px;
  box-sizing: border-box;
}

.wind-title {
  font-size: 24px;
  color: #4B4B4B;
  font-weight: 400;
  text-align: center;
  margin-bottom: 24px;
  margin-top: 32px;
}

.wind-direction-title {
  font-size: 24px;
  color: #4B4B4B;
  font-weight: 400;
  text-align: center;
  margin: 12px 0px;
}

.wind-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wind-speed-icon {
  width: 154px;
  height: 124px;
  margin-right: 24px;
}

.wind-speed-value {
  display: flex;
  justify-content: center;
  align-items: center;

  .value {
    font-family: 'Inter', serif;
    font-size: 96px;
    font-weight: 500;
    line-height: 1;
  }

  .unit {
    font-size: 74px;
    margin-left: 6px;
  }
}

.wind-direction-value {
  display: flex;
  justify-content: end;
  align-items: center;
  padding-top: 50px;
  padding-right: 12px;

  .value {
    font-family: 'Inter', serif;
    font-size: 64px;
    font-weight: 500;
    line-height: 1;
  }

  .unit {
    font-size: 74px;
    margin-left: 6px;
  }
}

.compass-icon {
  position: absolute;
  top: 60%;
  left: 25%;
  transform-origin: center;
  width: 200px;
  height: 200px;
}

.compass-scale {
  position: absolute;
  top: 60%;
  left: 25%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  padding-right: 24px;
  z-index: 999;
}

:deep(.leaflet-compass .compass-icon) {
  transition: transform 1s ease-out;
  background-image: url(/src/assets/Icons/compass_on_map.svg);
  background-size: cover;
  width: 100px; 
  height: 100px;
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
  margin: 20px;
}

:deep(.leaflet-compass .compass-button) {
  width: 100px;
  height: 100px;
}

/* Digit under compass */
:deep(.leaflet-compass .compass-digit) {
  position: absolute;
  margin-top:32px;
  left: 55%;
  transform: translateX(-50%);
  font-weight: 700;
  font-size: 20px;
  color: var(--light-blue);
}

:deep(.leaflet-compass .compass-alert) {
  background-color: var(--white);
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
}
</style>