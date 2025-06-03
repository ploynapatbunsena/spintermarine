<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <div class="top-space"></div>
    <div class="page-container">
      <div class="filter-container">
        <TugboatFilter 
          @boat-selected="updateSelectedBoats" 
          @tugboat-data-loaded="handleTugboatDataLoaded"
          ref="tugboatFilter"
        />
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
import { ref, onMounted, onUnmounted, inject, nextTick } from 'vue';
import NavigationBar from "@/components/NavigationBar.vue";
import TugboatFilter from "@/components/TugboatDetails/TugboatFilter.vue";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'vue-router';

const $api = inject('$api');
const $api_vessel = inject('$api_vessel');
const map = ref(null);
const router = useRouter();
const boatMarkers = ref([]);
const selectedBoats = ref([]);
const tugboatData = ref({});
const locationUpdateInterval = ref(null);
// let intervalId = null; 

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/login');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101010700');

  if (!permission || !permission.IsActive) {
    return router.push('/login');
  }
};

const initMap = () => {
  map.value = L.map('map').setView([13.7563, 100.5018], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);
};

const handleTugboatDataLoaded = (data) => {
  tugboatData.value = data.reduce((acc, boat) => {
    acc[boat.DeviceId] = boat;
    return acc;
  }, {});
};

const fetchBoatLocations = async (deviceNames) => {
  try {
    const response = await $api.post(
      '/MachineStatus/getLocationFormGPSTugboat',
      { devicename: deviceNames }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching boat locations:', error);
    return [];
  }
};

const fetchDeviceDetails = async (deviceId) => {
  try {
    const response = await $api.get(`/MachineStatus/GetDeviceByDeviceId?deviceid=${deviceId}`);
    const measurements = response.data[0]?.Mesurement || [];
    const desiredMeasurements = ['Speed', 'RPM', 'Wind-Speed', '%Throttle'];
    
    const measurementData = measurements.reduce((acc, item) => {
      if (desiredMeasurements.includes(item.measurementname)) {
        acc[item.measurementname] = {
          lastValue: item.lastValue || 'N/A',
          unit: item.measurementunit || ''
        };
      }
      return acc;
    }, {});

    return {
      ...response.data[0],
      measurements: measurementData
    };
  } catch (error) {
    console.error('Error fetching device details:', error);
    return {};
  }
};

const fetchTransportShip = async (shipName) => {
  try {
    const response = await $api_vessel.get(
      `/ship-transport-ships-product?ship_name=${shipName}`
    );
    const transportShipName = response.data?.data?.data?.[0]?.job_transport_ships?.transport_ship?.name || null;
    console.log(transportShipName);
    return transportShipName;
    
  } catch (error) {
    console.error('Error fetching transport ship:', error);
    return null;
  }
};

const fetchTransportShip_NoProduct = async (shipName) => {
  try {
    const response = await $api_vessel.get(
      `/ship-transport-ships-no-product??ship_name=${shipName}`
    );
    const transportShipName_NoProduct = response.data?.data?.data?.[0]?.job_transport_ships?.transport_ship?.name || null;
    console.log(transportShipName_NoProduct);
    return transportShipName_NoProduct;
    
  } catch (error) {
    console.error('Error fetching transport ship:', error);
    return null;
  }
};

const DEFAULT_POSITION = [13.7563, 100.5018]; 

const createBoatMarker = (boatInfo) => {
  const latObj = boatInfo.value?.find(v => v.Name === 'Latitude');
  const lngObj = boatInfo.value?.find(v => v.Name === 'Longitude');
  
  const lat = latObj ? parseFloat(latObj.Value) : DEFAULT_POSITION[0];
  const lng = lngObj ? parseFloat(lngObj.Value) : DEFAULT_POSITION[1];
  
  const status = boatInfo.status || 'Unknown';
  const deviceId = boatInfo.DeviceId;

  const boatIcon = L.divIcon({
    className: 'custom-boat-icon',
    html: `<div style="color: ${getStatusColor(status)}; ">
             <i class="mdi mdi-ferry" style="font-size: 30px;"></i>
           </div>`,
    iconSize: [30, 30]
  });

  const marker = L.marker([lat, lng], { icon: boatIcon })
    .bindPopup(`
      <div style="width: 500px; padding: 10px; font-family: 'Inter', sans-serif">
        <h3 style="font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #9F9F9F; padding-bottom: 5px; font-family: 'Sarabun', sans-serif">
          ${boatInfo.DeviceName}
        </h3>
        
        ${(!latObj || !lngObj) ? '<p style="color: red; margin: 5px 0;"><i class="mdi mdi-alert" style="margin-right: 5px;"></i>ตำแหน่งไม่พร้อมใช้งาน กำลังแสดงตำแหน่งเริ่มต้น</p>' : ''}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 16px">
          <div id="boat-measurements-left-${deviceId}" style="opacity: 0.5;">
            <p style="margin: 5px 0;">
              <i class="mdi mdi-speedometer" style="color: #9F9F9F; margin-right: 5px;"></i>
              <strong style="color: #9F9F9F;">Speed:</strong> กำลังโหลด...
            </p>
            <p style="margin: 5px 0;">
              <i class="mdi mdi-weather-windy" style="color: #9F9F9F; margin-right: 5px;"></i>
              <strong style="color: #9F9F9F;">Wind-Speed:</strong> กำลังโหลด...
            </p>
          </div>
          
          <div id="boat-measurements-right-${deviceId}" style="opacity: 0.5; font-size: 16px">
            <p style="margin: 5px 0;">
              <i class="mdi mdi-gauge" style="color: #9F9F9F; margin-right: 5px;"></i>
              <strong style="color: #9F9F9F;">RPM:</strong> กำลังโหลด...
            </p>
            <p style="margin: 5px 0;">
              <i class="mdi mdi-speedometer-medium" style="color: #9F9F9F; margin-right: 5px; font-size: 24px"></i>
              <strong style="color: #9F9F9F;">%Throttle:</strong> กำลังโหลด...
            </p>
          </div>
        </div>
        <div style="display: flex; justify-content: start; align-items: center; margin: 10px 0; font-family: 'Sarabun', sans-serif; font-size: 16px;">
          <p style="margin: 5px 0; display: inline-block;">
            <i class="mdi mdi-package-variant-closed" style="color: #9F9F9F; margin-right: 5px; font-size: 24px""></i>
            <strong style="color: #9F9F9F;">Barge:</strong> 
              <span style="color: #2563EB; border: 1px solid #E7F1FF; border-radius: 24px; background-color: #E7F1FF; padding: 6px" id="transport-ship-name-${deviceId}">
                กำลังโหลด...
              </span>
          </p>
        </div>
        <div style="display: flex; justify-content: start; align-items: center; margin: 10px 0; font-family: 'Sarabun', sans-serif; font-size: 16px;">
          <p style="margin: 5px 0; display: inline-block;">
            <i class="mdi mdi-package-variant" style="color: #9F9F9F; margin-right: 5px; font-size: 24px""></i>
            <strong style="color: #9F9F9F;">Barge (no product):</strong> 
              <span style="color: #FAAA2A; border: 1px solid #FFFAE6; border-radius: 24px; background-color: #FFFAE6; padding: 4px" id="transport-ship-no-product-name-${deviceId}">
                กำลังโหลด...
              </span>
          </p>
        </div>
      </div>
    `, {
      maxWidth: 600
    });

    marker.on('click', async () => {
      const shipName = tugboatData.value[deviceId]?.Note || tugboatData.value[deviceId]?.DeviceName;

      const [transportShip, transportShipNoProduct, deviceDetails] = await Promise.all([
        fetchTransportShip(shipName),
        fetchTransportShip_NoProduct(shipName),
        fetchDeviceDetails(deviceId)
      ]);

      if (marker.isPopupOpen()) {
        // อัปเดตข้อมูลเรือขนส่งที่มีสินค้า
        const transportShipNameDiv = document.getElementById(`transport-ship-name-${deviceId}`);
        if (transportShipNameDiv) {
          transportShipNameDiv.textContent = transportShip || 'N/A';
        }

        const transportShipNoProductDiv = document.getElementById(`transport-ship-no-product-name-${deviceId}`);
        if (transportShipNoProductDiv) {
          transportShipNoProductDiv.textContent = transportShipNoProduct || 'N/A';
        }

        const leftDiv = document.getElementById(`boat-measurements-left-${deviceId}`);
        const rightDiv = document.getElementById(`boat-measurements-right-${deviceId}`);
      
      if (leftDiv && rightDiv) {
        leftDiv.style.opacity = '1';
        rightDiv.style.opacity = '1';
        
        leftDiv.innerHTML = `
          <p style="margin: 5px 0; font-family: 'Inter', sans-serif">
            <i class="mdi mdi-speedometer" style="color: #9F9F9F; margin-right: 5px; font-size: 24px"></i>
            <strong style="color: #9F9F9F;">Speed:</strong> ${deviceDetails.measurements?.Speed?.lastValue || 'N/A'} ${deviceDetails.measurements?.Speed?.unit || ''}
          </p>
          <p style="margin: 5px 0; font-family: 'Inter', sans-serif">
            <i class="mdi mdi-weather-windy" style="color: #9F9F9F; margin-right: 5px; font-size: 24px"></i>
            <strong style="color: #9F9F9F;">Wind Speed:</strong> ${deviceDetails.measurements?.['Wind-Speed']?.lastValue || 'N/A'} ${deviceDetails.measurements?.['Wind-Speed']?.unit || ''}
          </p>
        `;
        
        rightDiv.innerHTML = `
          <p style="margin: 5px 0; font-family: 'Inter', sans-serif">
            <i class="mdi mdi-gauge" style="color: #9F9F9F; margin-right: 5px; font-size: 24px"></i>
            <strong style="color: #9F9F9F;">RPM:</strong> ${deviceDetails.measurements?.RPM?.lastValue || 'N/A'} ${deviceDetails.measurements?.RPM?.unit || ''}
          </p>
          <p style="margin: 5px 0; font-family: 'Inter', sans-serif">
            <i class="mdi mdi-speedometer-medium" style="color: #9F9F9F; margin-right: 5px; font-size: 24px"></i>
            <strong style="color: #9F9F9F;">%Throttle:</strong> ${deviceDetails.measurements?.['%Throttle']?.lastValue || 'N/A'} ${deviceDetails.measurements?.['%Throttle']?.unit || ''}
          </p>
        `;
      }
    }
  });
  return marker;
};

const updateMapMarkers = async () => {
  if (!map.value || !map.value._container) {
    console.warn('Map not initialized or container missing');
    return;
  }
  boatMarkers.value.forEach(marker => map.value.removeLayer(marker));
  boatMarkers.value = [];

  if (selectedBoats.value.length === 0) return;

  const selectedBoatNames = selectedBoats.value
    .map(id => tugboatData.value[id]?.DeviceName)
    .filter(Boolean);

  if (selectedBoatNames.length === 0) return;

  const locations = await fetchBoatLocations(selectedBoatNames);

  selectedBoats.value.forEach(boatId => {
    const boatInfo = tugboatData.value[boatId];
    if (boatInfo) {
      const locationData = locations.find(loc => loc.DeviceName === boatInfo.DeviceName);
      const marker = createBoatMarker({
        ...boatInfo,
        value: locationData?.value || [],
        status: locationData?.status || 'Unknown'
      });
      if (marker) {
        marker.addTo(map.value);
        boatMarkers.value.push(marker);
      }
    }
  });

  if (boatMarkers.value.length > 0) {
    const group = L.featureGroup(boatMarkers.value);
    map.value.fitBounds(group.getBounds(), { padding: [50, 50] });
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Running': return '#009688';
    case 'Maintenance': return '#DC2B2B';
    case 'Pending': return '#FAC12A';
    default: return '#9E9E9E';
  }
};

const updateSelectedBoats = (boats) => {
  selectedBoats.value = boats;
  updateMapMarkers();
};

// const fetchDataWithInterval = async () => {
//   await fetchTugboatRiver();
//   await fetchTugboatSea();
// };

// const startDataInterval = () => {intervalId = setInterval(fetchDataWithInterval, 2 * 60 * 1000);};

// const stopDataInterval = () => {
//   if (intervalId) {
//     clearInterval(intervalId);
//     intervalId = null;
//   }
// };

onMounted(async() => {
  await initialize();
  await nextTick();
  initMap();
  
  locationUpdateInterval.value = setInterval(() => {
    if (selectedBoats.value.length > 0) {
      updateMapMarkers();
    }
  }, 2 * 60 * 1000);
});

onUnmounted(() => {
  if (locationUpdateInterval.value) {
    clearInterval(locationUpdateInterval.value);
  }
  if (window.showFullDetails) {
    delete window.showFullDetails;
  }
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
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
  position: relative;
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