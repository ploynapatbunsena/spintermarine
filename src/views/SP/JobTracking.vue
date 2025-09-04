<template>
  <v-app style="background-color: #f7f9fc">
    <NavigationBar />
    <!-- Hamburger Button for Mobile/Tablet -->
    <v-btn
      v-if="$vuetify.display.smAndDown"
      icon="mdi-menu"
      class="menu-button"
      @click="open = !open"
      color="white"
      variant="elevated"
    ></v-btn>
    <!-- <div class="page-container"> -->
    <div
      class="filter-container"
      :class="{ hidden: $vuetify.display.smAndDown && !open }"
    >
      <v-navigation-drawer
        v-model="open"
        :temporary="$vuetify.display.smAndDown"
        :width="$vuetify.display.width > 2560 ? 800 : 350"
        :permanent="!$vuetify.display.smAndDown"
      >
        <v-list>
          <v-card-text class="py-2 title text-center">Tugboat</v-card-text>
          <v-divider></v-divider>
          <v-list-item>
            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <v-tooltip text="กำลังทำงาน">
                  <template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      icon="mdi-square"
                      color="#009688"
                      class="me-1 icon-detail"
                    ></v-icon>
                  </template>
                </v-tooltip>
                <span style="font-size: 1.5vh" class="text-truncate"
                  >Running</span
                >
              </v-col>
              <v-col cols="4" class="d-flex align-center">
                <v-tooltip text="รอเข้าซ่อม">
                  <template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      icon="mdi-square"
                      color="#FAC12A"
                      class="me-1 icon-detail"
                    ></v-icon>
                  </template>
                </v-tooltip>
                <span style="font-size: 1.5vh" class="text-truncate"
                  >Pending</span
                >
              </v-col>
              <v-col cols="4" class="d-flex align-center">
                <v-tooltip text="ดำเนินการซ่อม">
                  <template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      icon="mdi-square"
                      color="#DC2B2B"
                      class="me-1 icon-detail"
                    ></v-icon>
                  </template>
                </v-tooltip>
                <span class="text-truncate" style="font-size: 1.5vh"
                  >Maintenance</span
                >
              </v-col>
              <!-- <v-col cols="3" class="d-flex align-center">
                  <v-tooltip text="ปิดการใช้งาน">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-square" color="#000000" class="me-1 icon-detail"></v-icon>
                    </template>
                  </v-tooltip>
                  <span class="text-truncate" style="font-size: 1.5vh;">Down</span>
                </v-col> -->
            </v-row>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            v-for="tugboat in devices"
            :key="tugboat.DeviceId"
            class="d-flex align-center py-3 ml-6"
            @click="handleBoatClick(tugboat.DeviceId)"
            :class="{
              'selected-boat': selectedBoats === tugboat.DeviceId,
              'disabled-item':
                (isVisitor && !allowedDeviceIds?.includes(tugboat.DeviceId)) ||
                (!isVisitor && deviceId && tugboat.DeviceId !== deviceId),
            }"
            :disabled="
              (isVisitor && !allowedDeviceIds.includes(tugboat.DeviceId)) ||
              (!isVisitor && deviceId && tugboat.DeviceId !== deviceId)
            "
          >
            <template v-slot:prepend>
              <v-checkbox
                :value="tugboat.DeviceId"
                v-model="selectedBoats"
                @change="emitSelectedBoats"
                density="compact"
                hide-details
                :disabled="
                  (isVisitor && !allowedDeviceIds.includes(tugboat.DeviceId)) ||
                  (!isVisitor && deviceId && tugboat.DeviceId !== deviceId)
                "
              ></v-checkbox>
            </template>
            <div class="d-flex align-center">
              <v-icon class="mx-3" :class="getStatusClass(tugboat)"
                >mdi-ferry</v-icon
              >
              <span style="font-family: 'Sarabun', sans-serif">{{
                deletePrefix(tugboat.DeviceLabel)
              }}</span>
            </div>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </div>
    <div class="map-container">
      <div id="map" class="map">
        <v-img
          :src="require('@/assets/Icons/compass_map.svg')"
          class="compass"
        ></v-img>
      </div>
      <div>
        <TransportTable
          :selectedBoat="selectedBoatData"
          :updateMapMarkers="updateMapMarkers"
          :devices="devices"
          :allVessels="allVessels"
          :vesselShips="vesselShips"
          :allJobs="allJobs"
        />
      </div>
    </div>
    <!-- <v-snackbar v-model="showError" color="error">
      {{ errorMessage }}
    </v-snackbar> -->
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch, inject, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import NavigationBar from "@/components/NavigationBar.vue"
import TransportTable from "@/components/TugboatDetails/TransportTable.vue"

const router = useRouter()
const $api = inject("$api")
const $api_vessel = inject("$api_vessel")
const $api_fac = inject("$api_fac")
// const $api_cmms = inject('$api_cmms');
// const open_api_company = inject('open_api_company');
const route = useRoute()
const deviceId = ref(route.params.deviceId)
const allowedDeviceIds = ref([])
const isVisitor = ref(false)
const map = ref(null)
const boatMarkers = ref([])
const selectedBoats = ref(null)
const selectedBoatData = ref(null)
const open = ref(true)
const devices = ref([])
const loading = ref(false)
const error = ref(null)
const position = [13.166172, 100.814708]
const shipMarkers = ref([])
const allVessels = ref([])
const vesselShips = ref({})
const allJobs = ref([])
let intervalId = null
const permission = ref(null)

// const showError = ref(false);
// const errorMessage = ref('');

const initialize = async () => {
  const menuPermission = localStorage.getItem("menuPermission")
  if (!menuPermission) {
    return router.push("/Homepage")
  }

  const permissionList = JSON.parse(menuPermission)
  const foundPermission = permissionList.find(
    (item) => item.MenuId === "0101010900",
  )
  permission.value = foundPermission

  if (!foundPermission || !foundPermission.IsActive) {
    return router.push("/Homepage")
  }
  // Visitor Permission
  const memberPermission = localStorage.getItem("member")
  if (memberPermission) {
    const memberData = JSON.parse(memberPermission)
    isVisitor.value = memberData.Position === "Visitor"

    if (isVisitor.value && deviceId.value) {
      allowedDeviceIds.value = deviceId.value.split(",")
    }
  }
}

const handleBoatClick = (tugboatId) => {
  if (isVisitor.value && !allowedDeviceIds.value.includes(tugboatId)) {
    return
  }
  selectSingleBoat(tugboatId)
}

const fetchAllTugboats = async () => {
  try {
    loading.value = true
    error.value = null

    const [riverResponse, seaResponse] = await Promise.all([
      $api.get("/MachineStatus/GetTugboatRiver"),
      $api.get("/MachineStatus/GetTugboatSea"),
    ])

    const riverTugboats = riverResponse.data.flatMap((item) => item.Devices)
    const seaTugboats = seaResponse.data.flatMap((item) => item.Devices)
    const allTugboats = [...riverTugboats, ...seaTugboats]

    const factoriumStatusData = await fetchCMMSStatus(allTugboats)

    devices.value = processTugboatData(allTugboats, factoriumStatusData)

    if (deviceId.value) {
      await fetchDeviceData(deviceId.value)
    }
  } catch (err) {
    console.error("Error fetching tugboats:", err)
    error.value = new Error("Failed to fetch tugboat list. Please try again.")
    devices.value = []
  } finally {
    loading.value = false
  }
}

// const fetchAllVessels = async () => {
//   try {
//     // Reset data before fetching
//     allJobs.value = [];
//     allVessels.value = [];
//     vesselShips.value = {};

//     const saleOrdersResponse = await $api_vessel.get('/all-sale-orders');
//     const saleOrderIds = saleOrdersResponse.data.data.data.map(order => order.id);

//     const uniqueVessels = new Set();

//     for (const id of saleOrderIds) {
//       const jobResponse = await $api_vessel.get('/sale-orders-by-id', {
//         params: { keyword: id }
//       });
//       const job = jobResponse.data.data.data;

//       allJobs.value.push(job);

//       if (job.vessel_name) {
//         uniqueVessels.add(job.vessel_name);

//         if (job.jobs_miiot?.job_ship?.ship) {
//           vesselShips.value[job.vessel_name] = job.jobs_miiot.job_ship.ship;
//         }
//       }
//     }

//     // Convert Set back to array
//     allVessels.value = [...uniqueVessels];
//   } catch (error) {
//     console.error('Error fetching vessels:', error);
//   }
// };

const fetchAllVessels = async () => {
  try {
    allJobs.value = []
    allVessels.value = []
    vesselShips.value = {}

    const saleOrdersResponse = await $api_vessel.get("/all-sale-orders")
    const saleOrderIds = saleOrdersResponse.data.data.data.map(
      (order) => order.id,
    )

    const uniqueVessels = new Set()

    for (const id of saleOrderIds) {
      const jobResponse = await $api_vessel.get("/sale-orders-by-id", {
        params: { keyword: id },
      })
      const job = jobResponse.data.data.data

      allJobs.value.push(job)

      if (job.vessel_name) {
        uniqueVessels.add(job.vessel_name)
        if (job.jobs_miiot?.job_ship?.ship) {
          vesselShips.value[job.vessel_name] =
            vesselShips.value[job.vessel_name] || []
          vesselShips.value[job.vessel_name].push(job.jobs_miiot.job_ship.ship)
        }
      }
    }

    allVessels.value = [...uniqueVessels]
  } catch (error) {
    console.error("Error fetching vessels:", error)
  }
}

const fetchDeviceData = async (specificDeviceId) => {
  try {
    loading.value = true
    error.value = null

    // ดึงข้อมูลอุปกรณ์จาก API
    const deviceResponse = await $api.get(
      "/MachineStatus/GetDeviceByDeviceId",
      {
        params: { deviceid: specificDeviceId },
      },
    )
    const updatedDevice =
      Array.isArray(deviceResponse.data) && deviceResponse.data.length > 0
        ? deviceResponse.data[0]
        : null

    if (!updatedDevice) {
      throw new Error("No device data found for DeviceId: " + specificDeviceId)
    }

    // ดึงสถานะล่าสุดจาก CMMS API
    const factoriumStatusData = await fetchCMMSStatus([updatedDevice])
    const processedDevice = processTugboatData(
      [updatedDevice],
      factoriumStatusData,
    )[0]

    // ดึงข้อมูลงานและ vessel
    let jobData = []
    let allVessels = new Set()
    let vesselShips = {} // เก็บข้อมูล ship ของแต่ละ vessel

    try {
      const saleOrdersResponse = await $api_vessel.get("/all-sale-orders")
      const saleOrderIds = saleOrdersResponse.data.data.data.map(
        (order) => order.id,
      )

      for (const id of saleOrderIds) {
        const jobResponse = await $api_vessel.get("/sale-orders-by-id", {
          params: { keyword: id },
        })
        const job = jobResponse.data.data.data

        if (job.vessel_name) {
          allVessels.add(job.vessel_name)

          // เก็บข้อมูล ship ของ vessel นี้
          if (job.jobs_miiot?.job_ship?.ship) {
            vesselShips[job.vessel_name] = job.jobs_miiot.job_ship.ship
          }
        }

        if (
          job.jobs_miiot?.job_ship?.ship?.name &&
          processedDevice.Note &&
          job.jobs_miiot.job_ship.ship.name.trim().toLowerCase() ===
            processedDevice.Note.trim().toLowerCase()
        ) {
          jobData.push(job)
        }
      }
    } catch (apiError) {
      console.error("Error fetching job data:", apiError)
      // error.value = new Error('Server is unavailable.');
      // error.value = new Error('Failed to fetch job data. Token may be invalid or server is unavailable.');
    }

    selectedBoatData.value = {
      ...processedDevice,
      jobs: jobData,
      allVessels: [...allVessels],
      vesselShips, // เพิ่มข้อมูล ships ของแต่ละ vessel
    }

    // อัปเดตข้อมูลใน devices array
    const index = devices.value.findIndex(
      (d) => d.DeviceId === specificDeviceId,
    )
    if (index !== -1) {
      devices.value[index] = { ...devices.value[index], ...processedDevice }
    } else {
      devices.value.push(processedDevice)
    }

    selectedBoats.value = specificDeviceId
    updateMapMarkers()
  } catch (err) {
    console.error("Error fetching device data:", err)
    error.value = new Error(err.message || "Failed to fetch tugboat data.")
    selectedBoatData.value = null
  } finally {
    loading.value = false
  }
}

const fetchCMMSStatus = async (tugboats) => {
  try {
    const statusPromises = tugboats.map(async (tugboat) => {
      const deviceNote = tugboat?.Note
      if (!deviceNote) return null

      try {
        const response = await $api_fac.get("/ship-status", {
          params: { name: deviceNote },
        })
        const statusData = response.data.data
        const mappedStatus = mapFctoriumStatus(statusData.status)

        return {
          name: deviceNote,
          status: mappedStatus,
        }
      } catch (error) {
        console.error(`Error fetching status for ${deviceNote}:`, error)
        return null
      }
    })

    const statusResults = await Promise.all(statusPromises)
    return statusResults.filter((result) => result !== null)
  } catch (error) {
    console.error("❌ Factorium [Vessel] Test Failed:", error)
    return []
  }
}

const processTugboatData = (tugboats, factoriumStatus) => {
  return tugboats.map((tugboat) => {
    const deviceNote = tugboat?.Note

    const facStatus = factoriumStatus.find((item) => item.name === deviceNote)

    let status = "Unknown"

    if (facStatus) {
      status = facStatus.status
    }

    return {
      ...tugboat,
      status,
    }
  })
}

const findVesselStatus = (vesselName) => {
  if (!vesselShips.value[vesselName]) return "Unknown"

  const shipName = vesselShips.value[vesselName].name
  const matchingDevice = devices.value.find(
    (device) => device.Note?.trim() === shipName.trim(),
  )

  return matchingDevice?.status || "Unknown"
}

const initMap = () => {
  map.value = L.map("map").setView(position, 10)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 12,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map.value)
}

const updateMapMarkers = (options = {}) => {
  // ลบมาร์กเกอร์เดิมทั้งหมด
  boatMarkers.value.forEach((marker) => map.value?.removeLayer(marker))
  shipMarkers.value.forEach((marker) => map.value?.removeLayer(marker))
  boatMarkers.value = []
  shipMarkers.value = []

  // กรณีล้างมาร์กเกอร์
  if (options.type === "clear") {
    map.value.setView(position, 10)
    return
  }

  // กรณีอัปเดตเรือขนส่ง
  if (
    options.type === "vessel" &&
    options.tugboats &&
    options.tugboats.length > 0
  ) {
    const bounds = L.latLngBounds()

    options.tugboats.forEach((tugboat) => {
      const lat = parseFloat(tugboat.latitude) || position[0]
      const lng = parseFloat(tugboat.longitude) || position[1]
      const vesselName = tugboat.vesselName
      const shipName = tugboat.shipName
      const status = tugboat.status || findVesselStatus(vesselName)
      const isDefaultPosition = tugboat.isDefaultPosition || false // ตรวจสอบว่าใช้พิกัดเริ่มต้น

      const shipIcon = L.divIcon({
        className: "custom-ship-icon",
        html: `<div style="color: ${getStatusColor(status.status)};
                text-shadow: 
                  -1px -1px 0 #fff,  
                  1px -1px 0 #fff,
                  -1px 1px 0 #fff,
                  1px 1px 0 #fff;">
                <i class="mdi mdi-ferry" style="font-size: 3vh;"></i>
              </div>`,
      })

      const popupContent =
        `<b>${deletePrefix(shipName) || "Unknown"}</b><br>Vessel: ${vesselName}<br>Status: ${getStatusText({ status })}` +
        (isDefaultPosition
          ? '<br><p style="color: red; margin: 5px 0;"><i>(Position is not valid)</i></p>'
          : "")

      const marker = L.marker([lat, lng], { icon: shipIcon })
        .bindPopup(popupContent)
        .addTo(map.value)

      shipMarkers.value.push(marker)
      bounds.extend([lat, lng])
    })

    if (shipMarkers.value.length > 0) {
      map.value.fitBounds(bounds)
    } else {
      map.value.setView(position, 10)
    }
    return
  }

  // กรณีอัปเดตเรือลากจูงที่เลือก
  if (selectedBoats.value && selectedBoatData.value && map.value) {
    const tugboat = selectedBoatData.value
    const latitude = tugboat.Mesurement?.find(
      (m) => m.measurementname === "Latitude",
    )?.lastValue
    const longitude = tugboat.Mesurement?.find(
      (m) => m.measurementname === "Longitude",
    )?.lastValue
    const lat = latitude ? parseFloat(latitude) : position[0]
    const lng = longitude ? parseFloat(longitude) : position[1]
    const isDefaultPosition = !latitude || !longitude // ตรวจสอบว่าใช้พิกัดเริ่มต้น

    const boatIcon = L.divIcon({
      className: "custom-boat-icon",
      html: `<div style="color: ${getStatusColor(tugboat.status)};
              text-shadow: 
                -1px -1px 0 #fff,  
                1px -1px 0 #fff,
                -1px 1px 0 #fff,
                1px 1px 0 #fff;">
              <i class="mdi mdi-ferry" style="font-size: 30px;"></i>
            </div>`,
      iconSize: [30, 30],
    })

    const popupContent =
      `<b>${deletePrefix(tugboat.DeviceLabel) || "Unknown"}</b><br>Status: ${getStatusText(tugboat)}` +
      (isDefaultPosition
        ? '<br><p style="color: red; margin: 5px 0;"><i>(Position is not valid)</i></p>'
        : "")

    const marker = L.marker([lat, lng], { icon: boatIcon })
      .bindPopup(popupContent)
      .addTo(map.value)

    marker.on("dblclick", (e) => {
      setTimeout(() => {
        if (map.value && map.value._map) {
          map.value.setView(e.latlng, map.value.getZoom() + 1)
        }
      }, 10)
    })

    boatMarkers.value.push(marker)
    map.value.setView([lat, lng], 12)
  }
}

const getStatusText = (tugboat) => {
  return tugboat.status || "Unknown"
}

const deletePrefix = (name) => {
  return name.replace(/Barge|Tugboat/gi, "").trim()
}

const mapFctoriumStatus = (factoriumStatus) => {
  switch (factoriumStatus) {
    case "ใช้งานได้":
    case "ใช้งานอยู่":
      return "Running"
    case "รอเข้าซ่อมวิ่งได้":
    case "รอเข้าซ่อมวิ่งไม่ได้":
    case "จอง":
      return "Pending"
    case "ซ่อม":
    case "ใช้งานไม่ได้":
    case "เติมน้ำมัน":
    case "หมดอายุ":
    case "หมดอายุแล้ว":
      return "Maintenance"
    default:
      return "Unknown"
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "Running":
      return "#009688"
    case "Maintenance":
      return "#DC2B2B"
    case "Pending":
      return "#FAC12A"
    // case 'Down': return '#000000';
    default:
      return "#979a9a"
  }
}

const getStatusClass = (tugboat) => {
  switch (tugboat.status) {
    case "Running":
      return "status-running"
    case "Maintenance":
      return "status-maintenance"
    case "Pending":
      return "status-pending"
    // case 'Down': return 'status-down';
    default:
      return "status-unknown"
  }
}

const selectSingleBoat = (tugboatId) => {
  if (selectedBoats.value !== tugboatId) {
    selectedBoats.value = tugboatId
    fetchDeviceData(tugboatId)
  } else {
    selectedBoats.value = null
    selectedBoatData.value = null
    updateMapMarkers()
  }
}

const emitSelectedBoats = () => {
  if (selectedBoats.value) {
    fetchDeviceData(selectedBoats.value)
  } else {
    selectedBoatData.value = null
    updateMapMarkers()
  }
}

const fetchDataWithInterval = async () => {
  await fetchAllTugboats()
  await fetchAllVessels()
}

const startDataInterval = () => {
  intervalId = setInterval(fetchDataWithInterval, 2 * 60 * 1000)
}

const stopDataInterval = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(async () => {
  // console.log('Component mounted');
  await initialize()
  initMap()
  await fetchDataWithInterval()

  // ไม่ทำ auto-select ถ้าเป็น Visitor
  if (!isVisitor.value && deviceId.value) {
    await fetchDeviceData(deviceId.value)
  }

  startDataInterval()
})

onUnmounted(() => {
  stopDataInterval()
})

watch(
  () => route.params.deviceId,
  async (newDeviceId) => {
    if (newDeviceId) {
      deviceId.value = newDeviceId
      if (devices.value.length === 0) {
        await fetchAllTugboats()
      } else {
        await fetchDeviceData(newDeviceId)
      }
      if (map.value && map.value._map) {
        updateMapMarkers()
      }
    }
  },
)
</script>

<style scoped>
.title {
  font-size: 3vh;
  font-weight: bold;
}

.top-space {
  height: 64px;
}

.page-container {
  display: flex;
  height: 100vh;
}

.map-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.map {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  position: relative;
}

@media (min-width: 1280px) {
  .map-container {
    margin-left: 350px;
    width: calc(100% - 350px);
  }
}

/* @media (min-width: 2560px) {
  .map-container {
    margin-left: 800px;
    width: calc(100% - 800px);
  }
} */

.compass {
  position: absolute;
  z-index: 500;
  width: 15vh;
  top: 52px;
  right: 32px;
}

.custom-boat-icon {
  background: none;
  border: none;
}

:deep(.leaflet-left .leaflet-control) {
  display: none;
}

:deep(.v-list-item-title) {
  font-size: 2vh;
  font-weight: 600;
}

.status-maintenance {
  color: #dc2b2b;
}

.status-pending {
  color: #fac12a;
}

.status-running {
  color: #009688;
}

.status-unknown {
  color: #979a9a;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}

.icon-detail {
  font-size: 1.5vh;
}

.menu-button {
  position: fixed; /* ทำให้ปุ่มลอยอิสระ */
  top: 72px; /* 64px (NavigationBar) + 8px margin */
  left: 16px;
  z-index: 600; /* อยู่เหนือ map และ drawer */
  background-color: white; /* พื้นหลังทึบเพื่อซ่อนสีเทา */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* เพิ่มเงาให้ดูเด่น */
}

@media (min-width: 2560px) {
  :deep(.v-list-item) {
    font-size: 1.5vh !important;
    padding: 1vh;
  }

  :deep(.v-checkbox .v-selection-control) {
    font-size: 1.5vh !important;
    padding: 1vh;
  }
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}

.disabled-item {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
