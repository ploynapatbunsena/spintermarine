<template>
  <v-app style="background-color: #f7f9fc">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Report on Tugboats Encountering Storms</div>
      <div class="title-thai">รายงานเรือยนต์ที่เจอพายุ</div>
      <v-card class="mt-4">
        <v-card-text class="mx-4 my-6">
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedTugboats"
                :items="tugboatOptions"
                item-title="deviceName"
                item-value="deviceId"
                label="Device"
                variant="outlined"
                density="compact"
                multiple
                clearable
                :error-messages="deviceError"
                :error="!!deviceError"
              >
                <template v-slot:prepend-item>
                  <v-list-item title="Select All" @click="toggleSelectAll">
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :color="
                          isPartialSelection ? 'indigo-darken-4' : undefined
                        "
                        :indeterminate="isPartialSelection"
                        :model-value="isAllSelected"
                      ></v-checkbox-btn>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ index }">
                  <span v-if="index === 0"
                    >{{ selectedTugboats.length }} selected</span
                  >
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :model-value="
                          selectedTugboats.includes(item.raw.deviceId)
                        "
                      ></v-checkbox-btn>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="3">
              <datePicker
                v-model="startDate"
                label="Start Date"
                :max="endDate || null"
                enable-seconds
                teleport
                :max-date="new Date()"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="Select Start Date"
                :class="{ 'error-border': startDateError }"
              ></datePicker>
              <div v-if="startDateError" class="error-message">
                {{ startDateError }}
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <datePicker
                v-model="endDate"
                label="End Date"
                :min="startDate || null"
                enable-seconds
                teleport
                :max-date="new Date()"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="Select End Date"
                :class="{ 'error-border': endDateError }"
              ></datePicker>
              <div v-if="endDateError" class="error-message">
                {{ endDateError }}
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="3">
              <v-row>
                <v-col cols="4" md="3" sm="4">
                  <v-btn
                    class="cancel-btn elevation-0 text-none"
                    @click="resetFilters"
                  >
                    Cancel
                  </v-btn>
                </v-col>
                <v-col cols="4" md="3" sm="4">
                  <v-btn
                    class="search-btn elevation-0 text-none"
                    @click="validateAndSearch"
                    :loading="searchLoading"
                  >
                    Search
                  </v-btn>
                </v-col>
                <v-col cols="4" md="4" sm="4">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        :disabled="
                          !permissionExport('0101020400') || !showResult
                        "
                        class="download-btn elevation-0 text-none"
                        v-bind="props"
                      >
                        Download
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="format in ['CSV', 'JPG']"
                        :key="format"
                        :value="format"
                        @click="downloadReport(format)"
                      >
                        <v-list-item-title>{{ format }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text v-if="searchLoading" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
          <div>Loading data...</div>
        </v-card-text>

        <v-card-text v-if="error" class="text-center error--text">
          Error loading data: {{ error }}
        </v-card-text>

        <v-card-text v-if="showResult && !searchLoading">
          <apexchart
            ref="chart"
            type="line"
            height="680"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue"
import SpaceBar from "@/components/SpaceBar.vue"
import { computed, inject, onMounted, ref } from "vue"
import VueApexCharts from "vue3-apexcharts"
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"
import "@/assets/colors.scss"
import { useRouter } from "vue-router"

const datePicker = VueDatePicker
const apexchart = VueApexCharts
const $api = inject("$api")
const router = useRouter()
const showResult = ref(false)
const searchLoading = ref(false)
const error = ref(null)
const series = ref([])
const tugboatDevices = ref([])
const selectedTugboats = ref([])
const endDate = ref(new Date())
const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 7)))
const chart = ref(null)
const deviceError = ref("")
const startDateError = ref("")
const endDateError = ref("")
const permission = ref(null)

const validateForm = () => {
  let isValid = true
  deviceError.value = ""
  startDateError.value = ""
  endDateError.value = ""

  if (selectedTugboats.value.length === 0) {
    deviceError.value = "Device is required"
    isValid = false
  }

  if (!startDate.value) {
    startDateError.value = "Start date is required"
    isValid = false
  }

  if (!endDate.value) {
    endDateError.value = "End date is required"
    isValid = false
  }

  return isValid
}

const validateAndSearch = () => {
  if (validateForm()) {
    searchRecords()
  }
}

const initialize = async () => {
  const menuPermission = localStorage.getItem("menuPermission")
  if (!menuPermission) {
    return router.push("/Homepage")
  }

  const permissionList = JSON.parse(menuPermission)
  const foundPermission = permissionList.find(
    (item) => item.MenuId === "0101020400",
  )
  permission.value = foundPermission

  if (!foundPermission || !foundPermission.IsActive) {
    return router.push("/Homepage")
  }
}

const permissionExport = (menuId) => {
  if (!permission.value || permission.value.MenuId !== menuId) {
    return false
  }
  return permission.value?.IsExport
}

const fetchTugboatData = async () => {
  try {
    error.value = null

    const [riverResponse, seaResponse] = await Promise.all([
      $api.get("/MachineStatus/GetTugboatRiver"),
      $api.get("/MachineStatus/GetTugboatSea"),
    ])

    tugboatDevices.value = [...riverResponse.data, ...seaResponse.data]
  } catch (err) {
    console.error("Failed to fetch tugboat data:", err)
    error.value = "Failed to load device list. Please try again."
  }
}

const tugboatOptions = computed(() => {
  return tugboatDevices.value.flatMap((group) =>
    group.Devices.map((device) => ({
      deviceId: device.DeviceId,
      deviceName: device.DeviceName,
      type: group.TypeDevicename,
    })),
  )
})

const isAllSelected = computed(() => {
  return selectedTugboats.value.length === tugboatOptions.value.length
})

const isPartialSelection = computed(() => {
  return selectedTugboats.value.length > 0 && !isAllSelected.value
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTugboats.value = []
  } else {
    selectedTugboats.value = tugboatOptions.value.map(
      (option) => option.deviceId,
    )
  }
}

const resetFilters = () => {
  selectedTugboats.value = []
  startDate.value = null
  endDate.value = null
  showResult.value = false
  error.value = null
  deviceError.value = ""
  startDateError.value = ""
  endDateError.value = ""
}

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
    var sec = ("0" + dateTime.getSeconds()).slice(-2)
    return (
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec
    )
  }
}

const formatDateForFilename = (date) => {
  if (!date) return ""
  const dateTime = new Date(date)
  const year = dateTime.getFullYear()
  const month = ("0" + (dateTime.getMonth() + 1)).slice(-2)
  const day = ("0" + dateTime.getDate()).slice(-2)
  const hour = ("0" + dateTime.getHours()).slice(-2)
  const minute = ("0" + dateTime.getMinutes()).slice(-2)
  const second = ("0" + dateTime.getSeconds()).slice(-2)
  return `${year}${month}${day}_${hour}${minute}${second}`
}

const processChartData = (devices) => {
  const deviceData = devices.map((device) => ({
    name: device.DeviceName,
    stormTotal: device.MeasurementAlertCount?.[0]?.StormTotal ?? 0,
  }))

  deviceData.sort((a, b) => b.stormTotal - a.stormTotal)

  const categories = deviceData.map((device) => device.name)
  const seriesData = [
    {
      name: "Count Of Alert (Wind Speed)",
      type: "bar",
      data: deviceData.map((device) => device.stormTotal),
    },
  ]

  return { series: seriesData, categories }
}

const searchRecords = async () => {
  try {
    searchLoading.value = true
    showResult.value = false
    error.value = null

    const deviceIds = [...selectedTugboats.value]

    const request = {
      DeviceId: deviceIds,
      StartDateTime: formatTimeShow(startDate.value),
      EndDatetime: formatTimeShow(endDate.value),
    }

    const response = await $api.put(
      "MachineStatus/RealtimeChartDataReport04/multiple",
      request,
    )

    if (!response.data || response.data.length === 0) {
      error.value = "No data found for the selected criteria"
      return
    }

    const processedData = processChartData(response.data)

    series.value = processedData.series
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: processedData.categories,
      },
      yaxis: [
        {
          seriesName: "Count Of Storm",
          axisTicks: { show: true },
          axisBorder: { show: true, color: "#352B54" },
          labels: { style: { colors: "#352B54" } },
          title: { text: "Count Of Storm", style: { color: "#352B54" } },
        },
      ],
    }

    showResult.value = true
  } catch (err) {
    console.error("Error searching records:", err)
    error.value = "Failed to load chart data. Please try again."
  } finally {
    searchLoading.value = false
  }
}

const downloadReport = (format) => {
  if (!showResult.value || !series.value.length) {
    error.value = "No data available to download"
    return
  }

  const start = startDate.value
    ? formatDateForFilename(startDate.value)
    : "nodate"
  const end = endDate.value ? formatDateForFilename(endDate.value) : "nodate"
  const filename = `รายงานเรือยนต์ที่เจอพายุ_${start}_${end}`

  if (format === "CSV") {
    // CSV Download
    const categories = chartOptions.value.xaxis.categories
    const data = series.value[0].data
    const csvRows = ["Barge,Alert Count"]

    categories.forEach((category, index) => {
      csvRows.push(`"${category}",${data[index]}`)
    })

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } else if (format === "JPG") {
    // JPG Download
    if (chart.value) {
      chart.value.chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement("a")
        link.href = imgURI
        link.download = `${filename}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  }
}

const chartOptions = ref({
  chart: {
    height: 680,
    type: "bar",
    toolbar: { show: true },
  },
  colors: ["#352B54"],
  fill: { opacity: 1 },
  dataLabels: { enabled: false },
  xaxis: { categories: [] },
  yaxis: [
    {
      seriesName: "Count Of Storm",
      axisTicks: { show: true },
      labels: { style: { colors: "#352B54" } },
      title: { text: "Count Of Storm", style: { color: "#352B54" } },
    },
  ],
  legend: {
    show: true,
    horizontalAlign: "center",
    offsetY: 16,
  },
})

onMounted(async () => {
  await initialize()
  await fetchTugboatData()
})
</script>

<style scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.title-thai {
  font-family: "Sarabun", sans-serif;
  font-size: 1.5vh;
  font-weight: 400;
}

.download-btn {
  background-color: var(--yellow);
  color: var(--white);
  border-radius: 24px;
  font-size: 1.3vh;
}

.cancel-btn {
  color: #000000;
  border: 1px solid #e3e3e3;
  border-radius: 24px;
  font-size: 1.5vh;
}

.search-btn {
  background-color: #223368;
  color: #ffffff;
  border-radius: 24px;
  font-size: 1.5vh;
}

.error--text {
  color: #dc2b2b;
  font-weight: bold;
}

.error-border {
  border: 1px solid #dc2b2b;
  border-radius: 4px;
}

.error-message {
  font-family: "Inter", sans-serif;
  color: #dc2b2b;
  font-size: 12px;
  margin-top: 4px;
}
</style>
