<template>
  <v-app style="background-color: #f7f9fc">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div v-if="!loading">
        <div class="title">Notification Report</div>
        <v-card class="mt-4">
          <v-card-text class="mx-4 my-6">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedType"
                  :items="typeOptions"
                  item-title="typeDeviceName"
                  item-value="typeDeviceName"
                  label="Vehicle"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:modelValue="handleTypeChange"
                  :error-messages="vehicleError ? [vehicleError] : []"
                  :error="!!vehicleError"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedDevices"
                  :items="deviceOptions"
                  item-title="deviceName"
                  item-value="deviceId"
                  label="Device"
                  variant="outlined"
                  density="compact"
                  clearable
                  :error-messages="deviceError ? [deviceError] : []"
                  :error="!!deviceError"
                ></v-select>
              </v-col>

              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedMeasurement"
                  :items="[
                    { measurementId: 'all', measurementName: 'Select All' },
                    ...measurementList,
                  ]"
                  item-title="measurementName"
                  item-value="measurementId"
                  label="Measurement"
                  variant="outlined"
                  density="compact"
                  :disabled="!selectedDevices"
                  clearable
                  single-select
                >
                  <template v-slot:selection="{ item }">
                    <span>{{
                      item.title === "Select All" ? "Select All" : item.title
                    }}</span>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedStatuses"
                  :items="statusOptions"
                  item-title="text"
                  item-value="value"
                  label="Status"
                  variant="outlined"
                  density="compact"
                  multiple
                  clearable
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                      title="Select All"
                      @click="toggleSelectAllStatus"
                    >
                      <template v-slot:prepend>
                        <v-checkbox-btn
                          :color="
                            isPartialStatusSelection
                              ? 'indigo-darken-4'
                              : undefined
                          "
                          :indeterminate="isPartialStatusSelection"
                          :model-value="isAllStatusSelected"
                        ></v-checkbox-btn>
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ index }">
                    <span v-if="index === 0"
                      >{{ selectedStatuses.length }} selected</span
                    >
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
                ></datePicker>
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
                ></datePicker>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" lg="3" xxl="2">
                <v-row>
                  <v-col cols="4" sm="4">
                    <v-btn
                      class="cancel-btn elevation-0 text-none mr-4"
                      @click="resetFilters"
                    >
                      Cancel
                    </v-btn>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <v-btn
                      class="search-btn mr-4 elevation-0 text-none"
                      @click="validateAndSearch"
                      :loading="searchLoading"
                    >
                      Search
                    </v-btn>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          :disabled="
                            !permissionExport('0101020200') || !showResult
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

          <v-card-text v-if="showResult && !searchLoading" class="mx-4">
            <v-data-table
              :mobile-breakpoint="0"
              :headers="headers"
              :items="tableData"
              :items-per-page="-1"
              class="elevation-1"
            >
              <template v-slot:[`item.date`]="{ item }">
                {{ formatTimeShow(item.date) }}
              </template>
              <template v-slot:[`item.value`]="{ item }">
                <strong>{{ item.value }}</strong>
              </template>
              <template v-slot:[`item.details`]="{ item }">
                <v-chip
                  :color="
                    item.details.isDanger
                      ? 'red'
                      : item.details.isWarning
                        ? 'amber'
                        : 'grey'
                  "
                  dark
                >
                  {{ item.details.text }}
                </v-chip>
              </template>
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :class="getStatusColor(item.status)">
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon
                  :disabled="!permissionWrite('0101020200')"
                  class="edit mr-2"
                  small
                  @click="editItem(item.originalData)"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <!-- Edit Dialog -->
        <v-dialog v-model="dialog" max-width="906">
          <v-card class="rounded-lg pa-6">
            <v-card-title class="card-dialog">แก้ไขรายการ</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div>
                    <p class="title-field">Date</p>
                    <v-text-field
                      density="compact"
                      style="
                        font-size: 16px;
                        font-family: 'Inter', sans-serif;
                      "
                      variant="outlined"
                      disabled
                      rounded="lg"
                    >
                      {{ formatTimeShow(editedItem.date) }}
                    </v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div>
                    <p class="title-field">Device Name</p>
                    <v-text-field
                      density="compact"
                      style="
                        font-size: 16px;
                        font-family: 'Inter', sans-serif;
                      "
                      variant="outlined"
                      disabled
                      rounded="lg"
                    >
                      {{ editedItem.deviceName }}
                    </v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div>
                    <p class="title-field">Measuremnet</p>
                    <v-text-field
                      density="compact"
                      style="
                        font-size: 16px;
                        font-family: 'Inter', sans-serif;
                      "
                      variant="outlined"
                      disabled
                      rounded="lg"
                    >
                      {{ editedItem.measurement }}
                    </v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div>
                    <p class="title-field-thai">เลขใบแจ้งซ่อม</p>
                    <v-text-field
                      v-model="editedItem.solution"
                      variant="outlined"
                      require
                      rounded="lg"
                      density="compact"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions
              class="d-flex align-center justify-center mb-8 ga-8"
            >
              <v-btn class="cancel-btn text-none" @click="closeEditDialog"
                >Cancel</v-btn
              >
              <v-btn class="save-btn text-none" @click="saveEditDialog"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-overlay
        :model-value="loading"
        class="align-center justify-center"
        persistent
      >
        <div class="pa-6 d-flex flex-column align-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <div
            class="mt-4 text-h6"
            style="font-family: 'Inter', sans-serif"
          >
            Loading data...
          </div>
        </div>
      </v-overlay>
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue"
import SpaceBar from "@/components/SpaceBar.vue"
import { ref, computed, inject, onMounted, watch, nextTick } from "vue"
import VueDatePicker from "@vuepic/vue-datepicker"
import "@/assets/colors.scss"
import "@vuepic/vue-datepicker/dist/main.css"
import { useRoute, useRouter } from "vue-router"

const $api = inject("$api")
const router = useRouter()
const route = useRoute()

const loading = ref(true)
const memberData = ref(JSON.parse(localStorage.getItem("member"))) || {}
const datePicker = VueDatePicker
const bargeGruop = ref([])
const tugboatRiverGroup = ref([])
const tugboatSeaGroup = ref([])
const selectedType = ref(null)
const selectedDevices = ref(null)
const measurementList = ref([])
const selectedMeasurement = ref([])
const selectedStatuses = ref([])
const searchLoading = ref(false)
const tableData = ref([])
const showResult = ref(false)
const dialog = ref(false)
const vehicleError = ref("")
const deviceError = ref("")
const error = ref(null)
const permission = ref(null)
const endDate = ref(new Date())
const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 7)))

const statusOptions = ref([
  { text: "รอแจ้งซ่อม", value: false },
  { text: "ดำเนินการเสร็จสิ้น", value: true },
])

const editedItem = ref({
  date: "",
  deviceName: "",
  measurement: "",
  solution: "",
  originalData: null,
})

const initialize = async () => {
  const menuPermission = localStorage.getItem("menuPermission")
  if (!menuPermission) {
    return router.push("/Homepage")
  }

  const permissionList = JSON.parse(menuPermission)
  const foundPermission = permissionList.find(
    (item) => item.MenuId === "0101020200",
  )
  permission.value = foundPermission

  if (!foundPermission || !foundPermission.IsActive) {
    return router.push("/Homepage")
  }
}

const permissionWrite = (menuId) => {
  if (!permission.value || permission.value.MenuId !== menuId) {
    return false
  }
  // console.log(permission.value, permission.value?.IsWrite);
  return permission.value?.IsWrite
}

const permissionExport = (menuId) => {
  if (!permission.value || permission.value.MenuId !== menuId) {
    return false
  }
  // console.log(permission.value, permission.value?.IsExport);
  return permission.value?.IsExport
}

const fetchDeviceData = async () => {
  try {
    loading.value = true

    const [bargeResponse, riverResponse, seaResponse] = await Promise.all([
      $api.get("/MachineStatus/GetDeviceBargesGrouped"),
      $api.get("/MachineStatus/GetTugboatRiver"),
      $api.get("/MachineStatus/GetTugboatSea"),
    ])

    bargeGruop.value = bargeResponse.data
    tugboatRiverGroup.value = riverResponse.data
    tugboatSeaGroup.value = seaResponse.data

    bargeGruop.value.forEach((group) => (group.typeVehicle = "Barge"))
    tugboatRiverGroup.value.forEach(
      (group) => (group.typeVehicle = "Tugboat River Going"),
    )
    tugboatSeaGroup.value.forEach(
      (group) => (group.typeVehicle = "Tugboat Sea Going"),
    )
  } catch (error) {
    console.error("Failed to fetch device data:", error)
    error.value = "Failed to load device list. Please try again."
  } finally {
    loading.value = false
  }
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
    return year + "-" + month + "-" + day + " " + hour + ":" + minute
  }
}

const formatTimeShow_T = (datetime) => {
  if (datetime == null) {
    return null
  } else {
    var dateTime = new Date(datetime)
    var month = ("0" + (dateTime.getMonth() + 1)).slice(-2)
    var day = ("0" + dateTime.getDate()).slice(-2)
    var year = dateTime.getFullYear()
    var hour = ("0" + dateTime.getHours()).slice(-2)
    var minute = ("0" + dateTime.getMinutes()).slice(-2)
    return year + "-" + month + "-" + day + "T" + hour + ":" + minute
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

const fetchMeasurementList = async () => {
  try {
    // console.log('Fetching measurements for device:', selectedDevices.value);
    if (!selectedDevices.value) {
      measurementList.value = []
      selectedMeasurement.value = null
      return
    }

    const response = await $api.put("/Device/GetDeviceMeasurementList", {
      DeviceId: selectedDevices.value,
    })

    measurementList.value = response.data
      .filter((item) => item.MeasurementLabel !== "Status")
      .map((item) => ({
        measurementId: item.MeasurementId.toString(),
        measurementName: item.MeasurementName,
      }))

    if (route.query.measurements === "all") {
      selectedMeasurement.value = "all"
    } else {
      selectedMeasurement.value = null
    }
  } catch (error) {
    console.error("Failed to fetch measurement list:", error)
    measurementList.value = []
    selectedMeasurement.value = null
  }
}

const typeOptions = computed(() => {
  const options = []

  bargeGruop.value.forEach((item) => {
    options.push({
      typeDeviceName: item.TypeDevicename,
      typeVehicle: item.TypeDevicename,
      source: "barge",
    })
  })

  if (tugboatRiverGroup.value.length > 0) {
    options.push({
      typeDeviceName: "Tugboat River Going",
      typeVehicle: "Tugboat River Going",
      source: "river",
    })
  }

  if (tugboatSeaGroup.value.length > 0) {
    options.push({
      typeDeviceName: "Tugboat Sea Going",
      typeVehicle: "Tugboat Sea Going",
      source: "sea",
    })
  }

  return options
})

const deviceOptions = computed(() => {
  if (!selectedType.value) return []

  const selectedOption = typeOptions.value.find(
    (option) => option.typeDeviceName === selectedType.value,
  )
  if (!selectedOption) return []

  let devices = []

  if (selectedOption.source === "barge") {
    const group = bargeGruop.value.find(
      (item) => item.TypeDevicename === selectedType.value,
    )
    if (group) devices = group.Devices
  } else if (selectedOption.source === "river") {
    tugboatRiverGroup.value.forEach((group) => {
      devices = devices.concat(group.Devices)
    })
  } else if (selectedOption.source === "sea") {
    tugboatSeaGroup.value.forEach((group) => {
      devices = devices.concat(group.Devices)
    })
  }
  return devices
    .filter((device) => !device.DeviceLabel.toLowerCase().includes("crane"))
    .map((device) => ({
      deviceId: device.DeviceId,
      deviceName: device.DeviceLabel,
    }))
})

const isAllStatusSelected = computed(() => {
  return selectedStatuses.value.length === statusOptions.value.length
})

const isPartialStatusSelection = computed(() => {
  return selectedStatuses.value.length > 0 && !isAllStatusSelected.value
})

const toggleSelectAllStatus = () => {
  if (isAllStatusSelected.value) {
    selectedStatuses.value = []
  } else {
    selectedStatuses.value = statusOptions.value.map((option) => option.value)
  }
}

const handleTypeChange = () => {
  selectedDevices.value = null
  measurementList.value = []
  selectedMeasurement.value = null
}

const resetFilters = () => {
  selectedType.value = null
  selectedDevices.value = null
  selectedMeasurement.value = []
  selectedStatuses.value = []
  startDate.value = null
  endDate.value = null
  showResult.value = false
  vehicleError.value = ""
  deviceError.value = ""
}

const searchRecords = async () => {
  try {
    searchLoading.value = true
    showResult.value = false

    const requestBody = {
      DeviceId: selectedDevices.value,
      MeasurementId:
        selectedMeasurement.value === "all" ? "" : selectedMeasurement.value,
      IsAccept:
        selectedStatuses.value.length > 0
          ? selectedStatuses.value.join(",")
          : "",
    }

    if (selectedStatuses.value?.length > 0) {
      if (
        isAllStatusSelected.value ||
        selectedStatuses.value.length === statusOptions.value.length
      ) {
        requestBody.IsAccept = ""
      } else if (selectedStatuses.value.length === 1) {
        requestBody.IsAccept = selectedStatuses.value[0]
      } else {
        requestBody.IsAccept = selectedStatuses.value.join(",")
      }
    } else {
      requestBody.IsAccept = ""
    }

    const params = {}
    if (startDate.value) params.start = formatTimeShow_T(startDate.value)
    if (endDate.value) params.end = formatTimeShow_T(endDate.value)

    const config = Object.keys(params).length > 0 ? { params } : {}

    const response = await $api.put(
      "/device/notificationlistStatus",
      requestBody,
      config,
    )

    tableData.value = response.data.map((item) => ({
      date: item.AlertTime,
      deviceName: item.DeviceLabel,
      measurement: `${item.MeasurementLabel} (${item.MeasurementUnit})`,
      solution: item.Solution,
      value: item.Value,
      // details: item.Description,
      details: {
        text: item.Description,
        isDanger: item.Description === "Danger",
        isWarning: item.Description === "Warning",
      },
      status: item.IsAccept ? "ดำเนินการเสร็จสิ้น" : "รอแจ้งซ่อม",
      originalData: item,
    }))

    showResult.value = true
  } catch (error) {
    console.error("Failed to fetch notification list:", error)
    error.value = "เกิดข้อผิดพลาดในการโหลดข้อมูล"
    tableData.value = []
  } finally {
    searchLoading.value = false
  }
}

const headers = [
  { title: "Date", key: "date" },
  { title: "Device Name", key: "deviceName" },
  { title: "Measurement", key: "measurement" },
  { title: "Value", key: "value" },
  { title: "เลขใบแจ้งซ่อม", key: "solution" },
  { title: "Details", key: "details", sortable: false },
  { title: "Status", key: "status" },
  { title: "Action", key: "action", sortable: false },
]

const getStatusColor = (status) => {
  switch (status) {
    case "รอแจ้งซ่อม":
      return "status-pending"
    case "ดำเนินการเสร็จสิ้น":
      return "status-finish"
    default:
      return ""
  }
}

const saveEditDialog = async () => {
  try {
    if (!editedItem.value.solution) {
      alert("กรุณากรอกเลขใบแจ้งซ่อม")
      return
    }

    const requestBody = {
      Id: editedItem.value.originalData.Id,
      CustomerId: memberData.value.CustomerId,
      DeviceId: editedItem.value.originalData.DeviceId,
      MeasurementId: editedItem.value.originalData.MeasurementId,
      Solution: editedItem.value.solution,
      ModifiedBy: memberData.value.MemberId,
    }
    await $api.put("/device/notification/accept/single", requestBody)

    const index = tableData.value.findIndex(
      (item) => item.originalData.Id === editedItem.value.originalData.Id,
    )

    if (index !== -1) {
      tableData.value[index].originalData.Solution = editedItem.value.solution
      tableData.value[index].originalData.IsAccept = true
      tableData.value[index].status = "ดำเนินการเสร็จสิ้น"
      tableData.value[index].solution = editedItem.value.solution
    }

    dialog.value = false
  } catch (error) {
    console.error("Failed to save ticket:", error)
  }
}

const downloadReport = async (format) => {
  if (!showResult.value || !tableData.value.length) {
    error.value = "ไม่มีข้อมูลสำหรับดาวน์โหลด"
    alert("ไม่มีข้อมูลสำหรับดาวน์โหลด")
    return
  }

  const start = startDate.value
    ? formatDateForFilename(startDate.value)
    : "nodate"
  const end = endDate.value ? formatDateForFilename(endDate.value) : "nodate"
  const filename = `Notification_Report_${start}_${end}`

  if (format === "CSV") {
    const csvRows = [
      "Date,Device Name,Measurement,เลขใบแจ้งซ่อม,Details,Status",
    ]

    tableData.value.forEach((item) => {
      const row = [
        `"${formatTimeShow(item.date) || ""}"`,
        `"${item.deviceName || ""}"`,
        `"${item.measurement || ""}"`,
        `"${item.solution || ""}"`,
        `"${item.details.text || ""}"`,
        `"${item.status || ""}"`,
      ]
      csvRows.push(row.join(","))
    })

    const csvContent = csvRows.join("\n")
    const bom = "\uFEFF"
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

const editItem = (item) => {
  editedItem.value = {
    date: item.AlertTime,
    deviceName: item.DeviceLabel,
    measurement: `${item.MeasurementLabel} (${item.MeasurementUnit})`,
    solution: item.Solution || "",
    originalData: item,
  }
  dialog.value = true
}

const closeEditDialog = () => {
  dialog.value = false
}

const validateAndSearch = (fromRoute = false) => {
  let isValid = true

  vehicleError.value = ""
  deviceError.value = ""

  if (!selectedType.value) {
    vehicleError.value = "Vehicle is required"
    isValid = false
  }

  if (!selectedDevices.value) {
    deviceError.value = "Device is required"
    isValid = false
  }

  if (isValid) {
    if (!fromRoute) {
      const query = {
        vehicle: selectedType.value,
        device: selectedDevices.value,
        measurements: selectedMeasurement.value.join(","),
        statuses: selectedStatuses.value.join(","),
      }

      if (startDate.value) query.startDate = startDate.value.formatTimeShow_T()
      if (endDate.value) query.endDate = endDate.value.formatTimeShow_T()

      router.push({ query })
    }

    searchRecords()
  }

  return isValid
}

const handleRouteParams = async () => {
  if (!route.query.vehicle) return

  const vehicleQuery = route.query.vehicle.toLowerCase().trim()

  const matchedOption = typeOptions.value.find(
    (option) =>
      option.typeVehicle.toLowerCase().trim() === vehicleQuery ||
      option.typeDeviceName?.toLowerCase().trim() === vehicleQuery,
  )

  if (!matchedOption) {
    console.error("No matching vehicle type found for:", route.query.vehicle)
    return
  }

  selectedType.value = matchedOption.typeVehicle || matchedOption.typeDeviceName
  await nextTick()

  if (route.query.device) {
    selectedDevices.value = route.query.device

    await nextTick()

    if (route.query.measurements === "all") {
      selectedMeasurement.value = "all"
    } else if (route.query.measurements) {
      selectedMeasurement.value = route.query.measurements.split(",")[0]
    }

    if (route.query.statuses) {
      selectedStatuses.value = route.query.statuses
        .split(",")
        .map((s) => s === "true")
    }

    validateAndSearch(true)
  }
}

onMounted(async () => {
  await initialize()
  await fetchDeviceData()
  await fetchMeasurementList()
  handleRouteParams()
})

watch(selectedDevices, (newVal) => {
  if (newVal) {
    fetchMeasurementList()
  } else {
    measurementList.value = []
    selectedMeasurement.value = null
  }
})

watch(
  () => route.query,
  () => {
    handleRouteParams()
  },
)
</script>

<style scoped>
/* .status-pending {
  font-family: 'Sarabun', serif;
  color: var(--red);
  background-color: var(--light-red);
}

.status-finish {
  font-family: 'Sarabun', serif;
  color: var(--text-running);
  background-color: var(--bg-running);
} */

.status-pending {
  font-family: "Sarabun", serif;
  color: #ffffff;
  background-color: #e73232;
}

.status-finish {
  font-family: "Sarabun", serif;
  color: #ffffff;
  background-color: #52be80;
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: var(--bg-row);
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

.custom-table :deep(thead th) {
  color: var(--black);
  font-weight: bold;
  font-size: 16px;
}

.custom-table :deep(tbody td) {
  color: var(--dark-gray);
  font-size: 16px;
}

.custom-table :deep(tbody tr:hover td) {
  color: var(--black);
}

.custom-table :deep(tbody tr:hover) {
  background-color: #f0f0f0;
}

.edit {
  cursor: pointer;
  width: 34px;
  height: 24px;
  border-radius: 24px;
  font-size: 20px;
  color: #1570ef;
  background-color: #e3f2fd;
}

.title {
  font-size: 2vh;
  font-weight: 600;
}

.download-btn {
  background-color: var(--yellow);
  color: var(--white);
  border-radius: 24px;
  font-size: 1.3vh;
}

.card-dialog {
  font-family: "Sarabun", sans-serif;
  font-size: 20px;
}

.title-field {
  font-size: 16px;
  color: var(--gray);
  margin-bottom: 6px;
}

.title-field-thai {
  font-family: "Sarabun", sans-serif;
  font-size: 16px;
  color: var(--gray);
  margin-bottom: 6px;
}

.default-field {
  width: 362px;
  height: 50px;
  background-color: var(--bg-row);
  padding: 12px;
  border-radius: 10px;

  p {
    color: var(--grey-02);
    font-family: "Poppins", sans-serif;
  }
}

.cancel-button {
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

.cancel-btn {
  color: #000000;
  border-radius: 24px;
  border: 1px solid #e3e3e3;
  font-family: "Inter", sans-serif;
  width: 5vw;
}

.save-btn {
  background-color: #1476ff;
  color: #ffffff;
  border-radius: 24px;
  font-family: "Inter", sans-serif;
  width: 5vw;
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
  color: #dc2b2b;
  font-size: 12px;
  margin-top: 4px;
}

/* 2560px */

/* :deep(.v-field__input) {
  font-size: 1.5vh;
}

:deep(.v-label) {
  font-size: 1.5vh;
}

:deep(.dp__input) {
  font-size: 1.5vh;
  padding-left: 3vh;
}

:deep(.dp__input_icons){
  width: 1.5vh;
  height: 1.5vh;
}

:deep(.v-field) {
  height: 2vh;
}

:deep(.v-messages){
  font-size: 1.5vh;
}

:deep(.dp__menu) {
  font-size: 1.5vh;
} */
</style>
