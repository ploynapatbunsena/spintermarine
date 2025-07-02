<template>
  <v-container
    class="table-container"
    style="background-color: #f9fafb; flex-grow: 1"
    :style="{
      height: $vuetify.display.smAndDown
        ? '50vh'
        : $vuetify.display.width > 2560
          ? '540px'
          : '350px',
    }"
  >
    <v-row>
      <v-col cols="12" lg="3">
        <v-card
          class="card rounded-lg elevation-0"
          style="overflow-y: auto; height: 100%"
        >
          <v-card-title class="d-flex align-center vessel-header">
            <span class="vessel-title">VESSEL</span>
            <v-chip class="ml-2 vessel-status" prepend-icon="mdi-circle-medium"
              >Running</v-chip
            >
          </v-card-title>
          <v-card style="overflow-y: auto; height: 100%">
            <v-data-table
              :headers="[{ title: 'Vessel Name', value: 'name' }]"
              :items="vesselListWithIcons"
              item-value="name"
              hide-default-header
              hide-default-footer
              class="elevation-0 vessel-table"
              @click:row="handleVesselClick"
              style="font-size: 1.5vh"
            >
              <template v-slot:[`item.name`]="{ item }">
                <div class="d-flex align-center vessel-row">
                  <v-icon
                    icon="mdi-anchor"
                    color="#194185"
                    class="mr-2"
                  ></v-icon>
                  <span>{{ item.name }}</span>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-card>
      </v-col>

      <v-col cols="12" lg="9">
        <v-card
          v-if="localSelectedBoat && !selectedVessel"
          class="card rounded-lg elevation-0"
        >
          <div>
            <v-card-title
              class="table-header"
              style="font-family: 'Sarabun', sans-serif"
              >{{
                deletePrefix(localSelectedBoat?.DeviceLabel) ||
                "Unknown Tugboat"
              }}</v-card-title
            >
          </div>
          <v-card-text
            v-if="localSelectedBoat?.jobs?.length"
            style="height: 100%; overflow-y: auto"
          >
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="tugboatHeaders"
                  :items="tugboatTableData"
                  item-value="jobOrder"
                  class="elevation-0 striped-table custom-table"
                  :items-per-page-options="[3, 5, 10, -1]"
                  :items-per-page="2"
                  style="font-size: 1.5vh"
                  :footer-props="{
                    'show-first-last-page': true,
                    'show-current-page': true,
                  }"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td style="font-size: 1.5vh">{{ item.bargeName }}</td>
                      <td style="font-size: 1.5vh">{{ item.origin }}</td>
                      <td style="font-size: 1.5vh">{{ item.destination }}</td>
                      <td style="font-size: 1.5vh">{{ item.vessel }}</td>
                      <td style="font-size: 1.5vh">{{ item.jobOrder }}</td>
                      <td style="font-size: 1.5vh">
                        {{ item.cargo || "N/A" }}
                      </td>
                      <td style="font-size: 1.5vh">
                        {{ formatTimeShow(item.eta) }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else style="font-size: 1.5vh">
            No job data available for this tugboat.
          </v-card-text>
          <v-card-text v-if="localSelectedBoat" class="height-table">
            <v-row>
              <v-col cols="6" lg="3" class="py-0">
                <v-card
                  class="d-flex align-center measurement-card elevation-0"
                >
                  <div class="icon rpm">
                    <span class="material-symbols-rounded">avg_pace</span>
                  </div>
                  <div class="text-side">
                    <p class="text-grey">RPM</p>
                    <p class="text-value">{{ rpm.value }} {{ rpm.unit }}</p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6" lg="3" class="py-0">
                <v-card
                  class="d-flex align-center measurement-card elevation-0"
                >
                  <div class="icon speed">
                    <span
                      style="font-size: 4vh"
                      class="material-symbols-rounded"
                      >swap_driving_apps_wheel</span
                    >
                  </div>
                  <div class="text-side">
                    <p class="text-grey">Speed</p>
                    <p class="text-value">
                      {{ parseFloat(speed.value).toFixed(2) }} {{ speed.unit }}
                    </p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6" lg="3" class="py-0">
                <v-card
                  class="d-flex align-center measurement-card elevation-0"
                >
                  <div class="icon throttle">
                    <span class="material-symbols-rounded">speed</span>
                  </div>
                  <div class="text-side">
                    <p class="text-grey">%Throttle</p>
                    <p class="text-value">
                      {{ throttle.value }} {{ throttle.unit }}
                    </p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6" lg="3" class="py-0">
                <v-card
                  class="d-flex align-center measurement-card elevation-0"
                >
                  <div class="icon wind-speed">
                    <span class="material-symbols-rounded">air</span>
                  </div>
                  <div class="text-side">
                    <p class="text-grey">Wind Speed</p>
                    <p class="text-value">
                      {{ parseFloat(windSpeed.value).toFixed(2) }}
                      {{ windSpeed.unit }}
                    </p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card v-else-if="selectedVessel" class="card rounded-lg elevation-0">
          <div>
            <v-card-title class="table-header">{{
              selectedVessel
            }}</v-card-title>
          </div>
          <v-card-text style="height: 100%; overflow-y: auto">
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="vesselHeaders"
                  :items="vesselTableData"
                  item-value="doc_no"
                  class="elevation-0 striped-table custom-table"
                  :items-per-page-options="[3, 5, 10, -1]"
                  :items-per-page="3"
                  style="font-size: 1.5vh"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <template v-if="item.name != 'N/A'">
                        <td>{{ item.name }}</td>
                        <td>{{ item.vessel_name }}</td>
                        <td>{{ item.doc_no }}</td>
                        <td>{{ item.product_name || "N/A" }}</td>
                      </template>
                      <template v-else>
                        <td colspan="4" class="text-center">
                          No Data Available
                        </td>
                      </template>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card v-else class="card rounded-lg elevation-0">
          <v-card-text style="font-size: 1.5vh; overflow-y: auto">
            No Data Available.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, defineProps, inject, ref, watch } from "vue"
import "@/assets/colors.scss"

const $api = inject("$api")
const localSelectedBoat = ref(null)
const selectedVessel = ref(null)
const props = defineProps({
  selectedBoat: Object,
  updateMapMarkers: Function,
  devices: Array,
  allVessels: Array,
  vesselShips: Object,
  allJobs: Array,
})

const tugboatHeaders = [
  { title: "Barge Name", value: "bargeName" },
  { title: "Origin", value: "origin" },
  { title: "Destination", value: "destination" },
  { title: "Vessel", value: "vessel_name" },
  { title: "Job Order", value: "jobOrder" },
  { title: "Cargo", value: "cargo" },
  { title: "ETA", value: "eta" },
]

const vesselHeaders = [
  { title: "Tugboat Name", value: "name" },
  { title: "Vessel", value: "vessel_name" },
  { title: "Job Order", value: "doc_no" },
  { title: "Cargo", value: "product_name" },
]

const vesselList = computed(() => props.allVessels || [])

const tugboatTableData = computed(() => {
  if (!props.selectedBoat?.jobs?.length) return []
  return props.selectedBoat.jobs.flatMap(
    (job) =>
      job.jobs_miiot?.job_ship?.job_ship_transport_ships?.map((transport) => ({
        bargeName: transport.job_transport_ships?.transport_ship?.name || "N/A",
        origin: transport.pier_origin?.name || "N/A",
        destination: transport.pier_destination?.name || "N/A",
        vessel: job.vessel_name || "N/A",
        jobOrder: job.doc_no || "N/A",
        cargo: transport.job_transport_ships?.product?.name || "N/A",
        eta: formatTimeShow(transport.end_date) || "N/A",
      })) || [],
  )
})

const vesselTableData = computed(() => {
  if (!selectedVessel.value || !props.allJobs) return []

  // console.log('props.allJobs', props.allJobs);
  // console.log('selectedVessel', selectedVessel.value);

  return props.allJobs
    .filter((job) => job?.vessel_name === selectedVessel.value)
    .flatMap((job) => {
      // ดึงข้อมูล ship และ transports
      const ship = job.jobs_miiot?.job_ship?.ship
      const transports =
        job.jobs_miiot?.job_ship?.job_ship_transport_ships || []

      // console.log('Ship:', ship?.name);
      // console.log('Transports:', transports);

      // กรณีมีข้อมูล transports
      if (transports.length > 0) {
        return transports.map((transport) => ({
          name: ship?.name || "N/A",
          vessel_name: job.vessel_name || "N/A",
          doc_no: job.doc_no || "N/A",
          product_name: transport?.job_transport_ships?.product?.name || "N/A",
        }))
      }

      // กรณีไม่มีข้อมูลใดๆ
      return [
        {
          name: "N/A",
          vessel_name: job.vessel_name || "N/A",
          doc_no: job.doc_no || "N/A",
          product_name: "N/A",
        },
      ]
    })
})

const toggleVessel = async (vessel) => {
  if (selectedVessel.value === vessel) {
    selectedVessel.value = null
    props.updateMapMarkers({ type: "clear" })
  } else {
    selectedVessel.value = vessel
    const relatedJobs = props.allJobs.filter(
      (job) => job?.vessel_name === vessel,
    )
    const tugboats = []
    const defaultPosition = { latitude: "13.166172", longitude: "100.814708" } // พิกัดเริ่มต้น

    for (const job of relatedJobs) {
      const ship = job.jobs_miiot?.job_ship?.ship
      if (ship?.name) {
        const matchingDevice = props.devices.find(
          (device) => device.Note?.trim() === ship.name.trim(),
        )
        if (matchingDevice) {
          try {
            const deviceResponse = await $api.get(
              "/MachineStatus/GetDeviceByDeviceId",
              {
                params: { deviceid: matchingDevice.DeviceId },
              },
            )
            if (deviceResponse.data && deviceResponse.data.length > 0) {
              const shipDevice = deviceResponse.data[0]
              const latitude = shipDevice.Mesurement?.find(
                (m) => m.measurementname === "Latitude",
              )?.lastValue
              const longitude = shipDevice.Mesurement?.find(
                (m) => m.measurementname === "Longitude",
              )?.lastValue
              tugboats.push({
                latitude: latitude || defaultPosition.latitude, // ใช้พิกัดเริ่มต้น Aubrey
                longitude: longitude || defaultPosition.longitude,
                vesselName: vessel,
                shipName: ship.name,
                deviceId: matchingDevice.DeviceId,
                status: matchingDevice.status,
                isDefaultPosition: !latitude || !longitude, // ระบุว่าใช้พิกัดเริ่มต้น
              })
            }
          } catch (error) {
            console.error(`Error fetching device for ${ship.name}:`, error)
          }
        }
      }
    }

    if (tugboats.length > 0) {
      props.updateMapMarkers({
        type: "vessel",
        tugboats,
      })
    } else {
      console.warn(`No tugboats found for vessel: ${vessel}`)
      props.updateMapMarkers({ type: "clear" })
    }
  }
}

const vesselListWithIcons = computed(() => {
  // console.log('vesselList.value', vesselList.value);

  return vesselList.value.map((vessel) => ({
    name: vessel,
    isSelected: selectedVessel.value === vessel,
  }))
})

const handleVesselClick = (event, { item }) => {
  toggleVessel(item.name)
}

const deletePrefix = (name) => {
  return name.replace(/Barge|Tugboat/gi, "").trim()
}

watch(
  () => props.selectedBoat,
  (newVal) => {
    if (newVal) {
      localSelectedBoat.value = newVal
      selectedVessel.value = null
    }
  },
  { immediate: true },
)

const formatTimeShow = (datetime) => {
  if (datetime == null) {
    return null
  } else {
    var dateTime = new Date(datetime)
    var month = ("0" + (dateTime.getMonth() + 1)).slice(-2)
    var day = ("0" + dateTime.getDate()).slice(-2)
    var year = dateTime.getFullYear()
    var hour = ("0" + dateTime.getHours()).slice(-2)
    var minute = ("0" + dateTime.getMinutes()).slice(-2)
    return year + "-" + month + "-" + day + " " + hour + ":" + minute
  }
}

const parseMeasurementValue = (value, defaultValue = 0, fixed = 0) => {
  if (value === null || value === undefined || isNaN(value)) {
    return defaultValue.toFixed(fixed)
  }
  return parseFloat(value).toFixed(fixed)
}

const rpm = computed(() => {
  if (!localSelectedBoat.value) return { value: "0", unit: "RPM" }
  const measurement = localSelectedBoat.value?.Mesurement?.find(
    (m) => m.measurementname === "RPM",
  )
  return {
    value: parseMeasurementValue(measurement?.lastValue, 0, 0),
    unit: measurement?.measurementunit || "RPM",
  }
})

const speed = computed(() => {
  if (!localSelectedBoat.value) return { value: "0", unit: "km/h" }
  const measurement = localSelectedBoat.value?.Mesurement?.find(
    (m) => m.measurementname === "Speed",
  )
  const adjustedValue = measurement?.lastValue
    ? parseFloat(measurement.lastValue) / 10
    : 0

  return {
    value: parseMeasurementValue(adjustedValue, 0, 1),
    unit: measurement?.measurementunit || "km/h",
  }
})

const throttle = computed(() => {
  if (!localSelectedBoat.value) return { value: "0", unit: "%" }
  const measurement = localSelectedBoat.value?.Mesurement?.find(
    (m) => m.measurementname === "%Throttle",
  )
  return {
    value: parseMeasurementValue(measurement?.lastValue, 0, 0),
    unit: measurement?.measurementunit || "%",
  }
})

const windSpeed = computed(() => {
  if (!localSelectedBoat.value) return { value: "0", unit: "m/s" }
  const measurement = localSelectedBoat.value?.Mesurement?.find(
    (m) => m.measurementname === "Wind-Speed",
  )
  return {
    value: parseMeasurementValue(measurement?.lastValue, 0, 1),
    unit: measurement?.measurementunit || "m/s",
  }
})
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid var(--bg-soline);
  border-radius: 16px;
}

.vessel-header {
  display: flex;
  align-items: center;
  background-color: #0b0e2c;
}

.vessel-title {
  color: var(--yellow);
  font-size: 2.5vh;
}

.vessel-status {
  height: 2vh;
  border: 1px solid #28a745;
  color: #28a745;
  background-color: rgba(100, 221, 23, 0.16);
  font-size: 1.5vh;
}

.vessel-list {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  font-family: "Inter", sans-serif;
  margin-bottom: 12px;
  font-size: 16px;
}

.table-header {
  display: flex;
  align-items: center;
  background-color: #fac12a;
  text-transform: uppercase;
  font-size: 2.5vh;
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: var(--bg-row);
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

.custom-table :deep(thead th) {
  color: var(--black);
}

.custom-table :deep(tbody td) {
  color: var(--dark-gray);
}

.custom-table :deep(tbody tr:hover td) {
  color: var(--black);
}

.custom-table :deep(tbody tr:hover) {
  background-color: #f0f0f0;
}

.custom-table {
  border: 1px solid #e5e7eb;
}

:deep(.v-data-table th) {
  height: 40px !important;
}

:deep(.v-data-table td) {
  height: 30px !important;
}

.selected-vessel {
  background-color: #e3f2fd;
  font-weight: bold;
}

:deep(.v-data-table-footer__items-per-page) {
  display: none;
}

:deep(.v-data-table-footer) {
  padding: 0;
}

.material-symbols-rounded {
  font-size: 42px;
}

.measurement-card {
  border: 1px solid var(--bg-soline);
  border-radius: 6px;
  padding: 10px;
}

.text-side {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}

.text-grey {
  color: var(--gray);
  font-size: 1vh;
}

.text-value {
  color: var(--black);
  font-size: 2vh;
  font-weight: bold;
  font-family: "Inter", sans-serif;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5vh;
  height: 5vh;
  border-radius: 1.5vh;
}

.rpm {
  background-color: #dfffe7;
  color: #00c7be;
}

.speed {
  background-color: #e6e5ff;
  color: #af52de;
}

.throttle {
  background-color: #ffebeb;
  color: #ff4d4d;
}

.wind-speed {
  background-color: #96d2ff;
  color: #ffffff;
}

.table-container {
  padding: 16px;
  overflow-y: auto;
}

@media (min-width: 1280px) {
  .height-table {
    height: calc(100% - 64px);
  }
}

.vessel-row {
  padding: 1vh;
}

:deep(.v-data-table-header__content) {
  font-size: 1.5vh;
}

.material-symbols-rounded {
  font-size: 4vh;
}

@media (max-width: 960px) {
  .table-container {
    height: 50vh;
    overflow-y: auto;
    padding: 8px;
  }

  .card {
    height: 100%;
  }

  .vessel-header,
  .table-header {
    font-size: 1.8vh;
  }

  .custom-table :deep(th),
  .custom-table :deep(td) {
    font-size: 1.4vh !important;
  }

  .measurement-card {
    padding: 6px;
  }
}
</style>
