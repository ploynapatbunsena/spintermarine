<template>
  <v-app style="background-color: #f7f9fc">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Device Management</div>
      <v-card class="mt-4">
        <v-card-text class="card-text">
          <v-row>
            <v-col cols="12" sm="12" lg="4">
              <div class="header">
                <span class="material-symbols-rounded">border_color</span>
                <p>Device Details</p>
              </div>
              <div class="device-detail">
                <p class="label">Device Name</p>
                <v-text-field
                  v-model="deviceData.DeviceName"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  disabled
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p class="label">Device Label</p>
                <v-text-field
                  :disabled="!permissionWrite('0101030400')"
                  v-model="deviceData.DeviceLabel"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p>Description</p>
                <v-text-field
                  v-model="deviceData.Note"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  style="font-family: 'Sarabun', sans-serif"
                  disabled
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" sm="12" lg="4"></v-col>
            <v-col
              cols="12"
              sm="12"
              lg="4"
              class="h-100"
              v-if="!isBargeMaster(deviceResponse)"
            >
              <div class="header">
                <span class="material-symbols-rounded"
                  >add_photo_alternate</span
                >
                <p>Device Profile</p>
              </div>
              <v-img
                :src="preview"
                :height="340"
                class="image-preview"
                style="cursor: pointer"
                @click="
                  permissionImport('0101030400') && (showUploadDialog = true)
                "
              ></v-img>
              <v-dialog v-model="showUploadDialog" max-width="600">
                <template v-slot:default>
                  <v-card rounded="xl">
                    <v-card-title
                      class="d-flex justify-space-between align-center"
                    >
                      <div
                        class="text-medium-emphasis pa-5"
                        style="font-family: 'Inter', sans-serif"
                      >
                        Upload New Device Profile
                      </div>
                      <v-btn
                        icon="mdi-close"
                        variant="text"
                        @click="cancelUpload"
                      ></v-btn>
                    </v-card-title>
                    <v-card-text>
                      <DropZone @file-selected="handleFileSelected" />
                    </v-card-text>
                    <v-card-actions class="pa-5">
                      <v-btn class="cancel-btn text-none" @click="cancelUpload"
                        >Cancel</v-btn
                      >
                      <v-btn class="save-btn text-none" @click="confirmUpload"
                        >Save</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" lg="4">
              <div class="header">
                <span class="material-symbols-rounded">manufacturing</span>
                <p>Configuration</p>
              </div>
              <div class="device-detail">
                <p>Measurement</p>
                <v-select
                  :disabled="!permissionWrite('0101030400')"
                  variant="outlined"
                  density="compact"
                  label="Measurement"
                  :items="measurementAll"
                  item-title="MeasurementName"
                  item-value="MeasurementId"
                  v-model="selectedMeasurementId"
                  @update:modelValue="loadMeasurementData"
                ></v-select>
              </div>
              <div class="device-detail">
                <p>Min</p>
                <v-text-field
                  type="number"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  v-model.number="selectedMeasurement.ValueMin"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p>Min Warning</p>
                <v-text-field
                  type="number"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  v-model.number="selectedMeasurement.ThresholdMinWarning"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p>Min Danger</p>
                <v-text-field
                  type="number"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  v-model.number="selectedMeasurement.ThresholdMinDanger"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" sm="12" lg="4" class="configuration-col">
              <div class="device-detail-noti">
                <p>Online</p>
                <v-switch
                  v-model="selectedMeasurement.NotificationLine"
                  color="#52be80"
                  :disabled="!permissionWrite('0101030400')"
                  class="input-field"
                ></v-switch>
                <p>Email</p>
                <v-switch
                  v-model="selectedMeasurement.NotificationMail"
                  color="#52be80"
                  :disabled="!permissionWrite('0101030400')"
                ></v-switch>
              </div>
              <div class="device-detail">
                <p>Max</p>
                <v-text-field
                  type="number"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  v-model.number="selectedMeasurement.ValueMax"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p>Max Warning</p>
                <v-text-field
                  type="number"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  v-model.number="selectedMeasurement.ThresholdMaxWarning"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p>Max Danger</p>
                <v-text-field
                  type="number"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  v-model.number="selectedMeasurement.ThresholdMaxDanger"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12" class="button-section">
              <v-btn
                class="cancel-btn text-none"
                @click="resetForm"
                elevation="0"
              >
                Cancel
              </v-btn>
              <v-btn
                class="save-btn text-none"
                :disabled="!permissionAccept('0101030400')"
                @click="saveRecord"
                elevation="0"
              >
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mt-6">
        <v-data-table
          :headers="headers"
          :items="measurementAll"
          items-per-page="-1"
          hide-default-footer
          class="striped-table custom-table"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-start">{{ item.MeasurementName }}</td>
              <td class="text-end">{{ item.ValueMin }}</td>
              <td class="text-end">{{ item.ValueMax }}</td>
              <td class="text-end">{{ item.ThresholdMinWarning }}</td>
              <td class="text-end">{{ item.ThresholdMaxWarning }}</td>
              <td class="text-end">{{ item.ThresholdMinDanger }}</td>
              <td class="text-end">{{ item.ThresholdMaxDanger }}</td>
              <td class="action">
                {{ item.IsActive ? "Active" : "Inactive" }}
              </td>
              <td class="text-center px-0" style="min-width: 80px">
                <div class="d-flex justify-center align-center h-100">
                  <v-switch
                    v-model="item.NotificationLine"
                    color="#52be80"
                    :disabled="!permissionWrite('0101030400')"
                    class="ma-0"
                  ></v-switch>
                </div>
              </td>
              <td class="text-center px-0" style="min-width: 80px">
                <div class="d-flex justify-center align-center h-100">
                  <v-switch
                    v-model="item.NotificationMail"
                    color="#52be80"
                    :disabled="!permissionWrite('0101030400')"
                    class="ma-0"
                  ></v-switch>
                </div>
              </td>
              <td>
                <v-icon
                  :disabled="!permissionWrite('0101030400')"
                  icon="mdi-pencil"
                  class="edit"
                  @click="editMeasurement(item)"
                ></v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <v-snackbar
      v-model="showAlert"
      :color="alertType"
      :timeout="3000"
      location="top right"
      class="alert-banner"
      rounded="lg"
    >
      <div
        class="pa-5"
        style="font-family: 'Inter', sans-serif; font-size: 1.5vh"
      >
        <v-icon class="ma-2">
          {{ alertIcon }}
        </v-icon>
        {{ alertMessage }}
      </div>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue"
import SpaceBar from "@/components/SpaceBar.vue"
import DropZone from "../DropZone.vue"
import { inject, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const $api = inject("$api")
const route = useRoute()
const router = useRouter()
const deviceData = ref({})
const deviceId = ref(route.params.deviceId)
const measurementAll = ref([])
const selectedMeasurementId = ref(null)
const selectedMeasurement = ref({
  ValueMin: 0,
  ValueMax: 0,
  ThresholdMinWarning: 0,
  ThresholdMaxWarning: 0,
  ThresholdMinDanger: 0,
  ThresholdMaxDanger: 0,
  NotificationLine: false,
  NotificationMail: false,
})
const dropzoneFile = ref(null)
const originalDeviceData = ref({})
const initialDeviceData = ref({})
const showAlert = ref(false)
const alertType = ref("success")
const alertIcon = ref("mdi-check-circle")
const alertMessage = ref("")
const deviceResponse = ref({})
const showUploadDialog = ref(false)
const deviceImage = ref(null)
const preview = ref("https://picsum.photos/id/11/10/6")
const originalPreview = ref("https://picsum.photos/id/11/10/6")
const loading = ref(true)
const permission = ref(null)

const headers = ref([
  { title: "Measurement", value: "MeasurementName", align: "start" },
  { title: "Threshold Min", value: "ValueMin", align: "end" },
  { title: "Threshold Max", value: "ValueMax", align: "end" },
  {
    title: "Threshold Min Warning",
    value: "ThresholdMinWarning",
    align: "end",
  },
  {
    title: "Threshold Max Warning",
    value: "ThresholdMaxWarning",
    align: "end",
  },
  { title: "Threshold Min Danger", value: "ThresholdMinDanger", align: "end" },
  { title: "Threshold Max Danger", value: "ThresholdMaxDanger", align: "end" },
  { title: "Action", value: "IsActive", align: "center", sortable: false },
  { title: "Notification Online", value: "NotificationLine", sortable: false },
  { title: "Notification Email", value: "NotificationMail", sortable: false },
  { title: "Edit", value: "edit", align: "center", sortable: false },
])

const showSuccessAlert = (message) => {
  showAlert.value = true
  alertType.value = "success"
  alertMessage.value = message
  alertIcon.value = "mdi-check-circle"
}

const showErrorAlert = (message) => {
  showAlert.value = true
  alertType.value = "error"
  alertMessage.value = message
  alertIcon.value = "mdi-alert-circle"
}

const initialize = async () => {
  const menuPermission = localStorage.getItem("menuPermission")
  if (!menuPermission) {
    return router.push("/Homepage")
  }

  const permissionList = JSON.parse(menuPermission)
  const foundPermission = permissionList.find(
    (item) => item.MenuId === "0101030400",
  )
  permission.value = foundPermission

  if (!foundPermission || !foundPermission.IsActive) {
    return router.push("/Homepage")
  }
}

const permissionImport = (menuId) => {
  if (!permission.value || permission.value.MenuId !== menuId) {
    return false
  }
  return permission.value?.IsImport
}

const permissionAccept = (menuId) => {
  if (!permission.value || permission.value.MenuId !== menuId) {
    return false
  }
  return permission.value?.IsAccept
}

const permissionWrite = (menuId) => {
  if (!permission.value || permission.value.MenuId !== menuId) {
    return false
  }
  return permission.value?.IsWrite
}

const isBargeMaster = (device) => {
  return device?.DeviceName?.toUpperCase().includes("GEN") || false
}

const fetchDeviceData = async () => {
  try {
    loading.value = true

    const response = await $api.put("/Device/GetDevice", {
      DeviceId: deviceId.value,
    })

    deviceResponse.value = { ...response.data }
    // console.log('Device Response', deviceResponse.value);
    // console.log('Is Barge Master:', isBargeMaster(deviceResponse.value));

    originalDeviceData.value = { ...response.data }
    initialDeviceData.value = {
      DeviceId: response.data.DeviceId,
      DeviceName: response.data.DeviceName,
      DeviceLabel: response.data.DeviceLabel,
      Note: response.data.Note,
    }
    deviceData.value = {
      DeviceId: response.data.DeviceId,
      DeviceName: response.data.DeviceName,
      DeviceLabel: response.data.DeviceLabel,
      Note: response.data.Note,
      DeviceImage: response.data.DeviceImage,
    }

    measurementAll.value =
      response.data.Measurement.map((m) => ({
        ...m,
        NotificationLine: m.NotificationLine,
        NotificationMail: m.NotificationMail,
      })) || []
  } catch (error) {
    console.error("Failed to fetch device data:", error)
    measurementAll.value = []
  } finally {
    loading.value = false
  }
}

const fetchDeviceProfile = async () => {
  try {
    loading.value = true

    const filename = await deviceData.value?.DeviceImage
    const response = await $api.get("/Device/Image/" + filename)

    if (response.data && response.data.src) {
      preview.value = response.data.src
      originalPreview.value = response.data.src
    } else {
      preview.value = "https:/https://picsum./picsum.photos/id/11/10/6"
      originalPreview.value = "photos/id/11/10/6"
    }
  } catch (error) {
    console.error("Failed to fetch image:", error)
    preview.value = "https://picsum.photos/id/11/10/6"
    originalPreview.value = "https://picsum.photos/id/11/10/6"
  } finally {
    loading.value = false
  }
}

const editMeasurement = (item) => {
  selectedMeasurementId.value = item.MeasurementId
  selectedMeasurement.value = {
    MeasurementId: item.MeasurementId,
    MeasurementName: item.MeasurementName,
    ValueMin: item.ValueMin,
    ValueMax: item.ValueMax,
    ThresholdMinWarning: item.ThresholdMinWarning,
    ThresholdMaxWarning: item.ThresholdMaxWarning,
    ThresholdMinDanger: item.ThresholdMinDanger,
    ThresholdMaxDanger: item.ThresholdMaxDanger,
    NotificationLine: item.NotificationLine,
    NotificationMail: item.NotificationMail,
    IsActive: item.IsActive,
  }
}

const loadMeasurementData = (measurementId) => {
  const measurement = measurementAll.value.find(
    (m) => m.MeasurementId === measurementId,
  )
  if (measurement) {
    selectedMeasurement.value = { ...measurement }
  }
}

const resetForm = () => {
  deviceData.value = { ...initialDeviceData.value }
  selectedMeasurementId.value = null
  selectedMeasurement.value = {
    ValueMin: 0,
    ValueMax: 0,
    ThresholdMinWarning: 0,
    ThresholdMaxWarning: 0,
    ThresholdMinDanger: 0,
    ThresholdMaxDanger: 0,
    NotificationLine: false,
    NotificationMail: false,
  }
  dropzoneFile.value = null
  preview.value = originalPreview.value
  deviceImage.value = null
}

const handleFileSelected = (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.value = e.target.result
    }
    reader.readAsDataURL(file)
    dropzoneFile.value = file
    deviceImage.value = null
  } else {
    dropzoneFile.value = null
    preview.value = originalPreview.value
    deviceImage.value = null
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
    var sec = ("0" + dateTime.getSeconds()).slice(-2)
    return (
      year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + sec
    )
  }
}

const confirmUpload = () => {
  if (!dropzoneFile.value) {
    showErrorAlert("Please select an image")
    return
  }
  showUploadDialog.value = false
}

const cancelUpload = () => {
  dropzoneFile.value = null
  preview.value = originalPreview.value
  deviceImage.value = null
  showUploadDialog.value = false
}

const saveRecord = async () => {
  try {
    const memberData = JSON.parse(localStorage.getItem("member"))
    const memberId = memberData.MemberId
    const modifiedDatetime = new Date()
    const formattedDatetime = formatTimeShow_T(modifiedDatetime)
    let newImageName = null

    if (dropzoneFile.value) {
      const formData = new FormData()
      formData.append("image", dropzoneFile.value)
      formData.append("deviceId", deviceId.value)
      const uploadResponse = await $api.post("/Device/Upload/Image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (uploadResponse.data) {
        newImageName = uploadResponse.data
        deviceImage.value = newImageName
        deviceData.value.DeviceImage = newImageName
      }
    }

    // Update measurement data
    const index = measurementAll.value.findIndex(
      (m) => m.MeasurementId === selectedMeasurement.value.MeasurementId,
    )
    if (index !== -1) {
      measurementAll.value[index] = {
        ...measurementAll.value[index],
        ValueMin: selectedMeasurement.value.ValueMin,
        ValueMax: selectedMeasurement.value.ValueMax,
        ThresholdMinWarning: selectedMeasurement.value.ThresholdMinWarning,
        ThresholdMaxWarning: selectedMeasurement.value.ThresholdMaxWarning,
        ThresholdMinDanger: selectedMeasurement.value.ThresholdMinDanger,
        ThresholdMaxDanger: selectedMeasurement.value.ThresholdMaxDanger,
        NotificationLine: selectedMeasurement.value.NotificationLine,
        NotificationMail: selectedMeasurement.value.NotificationMail,
        ModifiedBy: memberId,
        ModifiedDatetime: formattedDatetime,
      }
    }

    // Prepare payload
    const payload = {
      ...originalDeviceData.value,
      DeviceLabel: deviceData.value.DeviceLabel,
      Note: deviceData.value.Note,
      DeviceImage: newImageName || originalDeviceData.value.DeviceImage,
      ModifiedBy: memberId,
      ModifiedDatetime: formattedDatetime,
      Measurement: measurementAll.value.map((m) => ({
        ...m,
        ValueMin: m.ValueMin,
        ValueMax: m.ValueMax,
        ThresholdMinWarning: m.ThresholdMinWarning,
        ThresholdMaxWarning: m.ThresholdMaxWarning,
        ThresholdMinDanger: m.ThresholdMinDanger,
        ThresholdMaxDanger: m.ThresholdMaxDanger,
        ModifiedBy: memberId,
        ModifiedDatetime: formattedDatetime,
        NotificationLine: m.NotificationLine,
        NotificationMail: m.NotificationMail,
      })),
    }
    console.log("Payload to save:", payload)

    await $api.put("/Device/Update", payload)
    showSuccessAlert("Device updated successfully!")

    await fetchDeviceData()
    if (deviceData.value.DeviceImage) {
      await fetchDeviceProfile()
    }
    resetForm()
  } catch (error) {
    console.error("Failed to save device data:", error)
    showErrorAlert(
      "Failed to update device information: " +
        (error.message || "Unknown error"),
    )
  }
}

onMounted(async () => {
  await initialize()
  await fetchDeviceData()
  await fetchDeviceProfile()
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.header {
  display: flex;
  justify-content: starrt;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  p {
    font-size: 16px;
    font-weight: 700;
  }
}

.device-detail {
  @media (min-width: 1024px) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 64px;
  }
}

.device-detail p {
  min-width: 120px;
  margin: 0;
}

.device-detail-noti {
  @media (min-width: 1024px) {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 64px;
  }
}

// .device-detail-noti p {
//   min-width: 120px;
//   margin: 0;
// }

.device-detail .label {
  min-width: 120px;
  margin: 0;
  position: relative;
}

.device-detail .label::after {
  content: "*";
  color: #e62020;
  margin-left: 4px;
}

.input-field :deep(.v-field__outline) {
  border-radius: 6px;
  color: #70707b;
}

:deep(.v-text-field input) {
  color: #4b4b4b;
}

.button-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}

// .cancel-btn {
//   background-color: #DC2B2B;
//   color: #ffffff;
//   border-radius: 10px;
//   font-family: 'Inter', sans-serif;
// }

.cancel-btn {
  color: #000000;
  border-radius: 24px;
  border: 1px solid #e3e3e3;
  font-family: "Inter", sans-serif;
  width: 5vw;
}

.cancel-btn:hover {
  // background-color: #FF1744;
  background-color: #fafafa;
  // color: #ffffff;
  color: #000000;
}

.save-btn {
  background-color: #1476ff;
  color: #ffffff;
  border-radius: 24px;
  font-family: "Inter", sans-serif;
  width: 5vw;
}

.save-btn:hover {
  background-color: #249dff;
  color: #ffffff;
}

.custom-table :deep(thead th) {
  color: #000000;
  font-weight: bold;
  font-size: 16px;
}

.custom-table :deep(tbody td) {
  color: #4b4b4b;
  font-size: 16px;
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: #f9f9fa;
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

.upload-img {
  background-color: #9f9f9f;
  width: 100%;
  height: 100%;
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

td.action {
  color: #14ca74 !important;
  text-align: center;
}

.card-text {
  @media (min-width: 1024px) {
    margin: 24px 64px;
  }
}

.configuration-col {
  @media (min-width: 1024px) {
    margin-top: 30px;
  }
}

.image-preview {
  border-radius: 8px;
  cursor: pointer;
  background-color: #f7f9fc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  object-fit: contain;
}
</style>
