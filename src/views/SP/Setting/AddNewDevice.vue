<!-- <template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Add New Device</div>
      <v-alert
        v-model="showAlert"
        :type="alertType"
        class="mb-4"
        transition="fade-transition"
      >
        {{ alertMessage }}
      </v-alert>
      <v-card class="mt-4">
        <v-card-text class="card-text">
          <v-row>
            <v-col cols="12" sm="12" lg="4">
              <div class="header">
                <span class="material-symbols-rounded">border_color</span>
                <p>Device Details</p>
              </div>
              <div class="device-detail">
                <p class="label">Device ID</p>
                <v-text-field
                  v-model="device.DeviceId"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  required
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p class="label">Device Name</p>
                <v-text-field
                  v-model="device.DeviceName"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  required
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p class="label">Device Label</p>
                <v-text-field
                  v-model="device.DeviceLabel"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p>Description</p>
                <v-textarea
                  v-model="device.Note"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-textarea>
              </div>
              <div class="device-detail">
                <p class="label">Device Serial</p>
                <v-text-field
                  v-model="device.DeviceSerial"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p class="label">MAC Address</p>
                <v-text-field
                  v-model="device.DeviceMacAddress"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" sm="12" lg="4">
              <div class="header">
                <span class="material-symbols-rounded">manufacturing</span>
                <p>Configuration</p>
              </div>
              <div class="device-detail">
                <p class="label">Token ID</p>
                <v-text-field
                  v-model="device.TokenId"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p class="label">Vendor ID</p>
                <v-text-field
                  v-model="device.VendorId"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p class="label">Vendor Name (English)</p>
                <v-text-field
                  v-model="device.VendorNameEng"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p class="label">Customer ID</p>
                <v-text-field
                  v-model="device.CustomerId"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-text-field>
              </div>
              <div class="device-detail">
                <p class="label">Customer Name (English)</p>
                <v-text-field
                  v-model="device.CustomerNameEng"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" sm="12" lg="4">
              <div class="header">
                <span class="material-symbols-rounded">add_photo_alternate</span>
                <p>Device Profile</p>
              </div>
              <div>
                <DropZone @file-selected="handleFileSelected" />
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="header">
                <span class="material-symbols-rounded">tune</span>
                <p>Measurements</p>
              </div>
              <v-btn @click="addMeasurement" class="mb-4">Add Measurement</v-btn>
              <div v-for="(measurement, index) in device.Measurement" :key="index" class="mb-4">
                <v-row>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      v-model="measurement.MeasurementId"
                      label="Measurement ID"
                      variant="outlined"
                      density="compact"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      v-model="measurement.MeasurementName"
                      label="Measurement Name"
                      variant="outlined"
                      density="compact"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      v-model="measurement.MeasurementUnit"
                      label="Measurement Unit"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-btn color="red" @click="removeMeasurement(index)">Remove</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      v-model.number="measurement.ValueMin"
                      label="Value Min"
                      type="number"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      v-model.number="measurement.ValueMax"
                      label="Value Max"
                      type="number"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      v-model.number="measurement.ThresholdMinWarning"
                      label="Threshold Min Warning"
                      type="number"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      v-model.number="measurement.ThresholdMaxWarning"
                      label="Threshold Max Warning"
                      type="number"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      v-model.number="measurement.ThresholdMinDanger"
                      label="Threshold Min Danger"
                      type="number"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      v-model.number="measurement.ThresholdMaxDanger"
                      label="Threshold Max Danger"
                      type="number"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="button-section">
              <v-btn class="cancel-btn" @click="cancel" elevation="0">Cancel</v-btn>
              <v-btn class="save-btn" @click="saveDevice" elevation="0">Save</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import SpaceBar from '@/components/SpaceBar.vue'
import DropZone from '../DropZone.vue'

// const $api = inject('$api')
const router = useRouter()

const device = ref({
  DeviceId: '',
  DeviceName: '',
  DeviceLabel: '',
  DeviceSerial: '',
  DeviceMacAddress: '',
  DeviceImage: '',
  TokenId: '',
  VendorId: '',
  VendorNameEng: '',
  VendorCode: '',
  CustomerId: '',
  CustomerNameEng: '',
  CustomerCode: '',
  CustomerRefId: '',
  Note: null,
  IsActive: true,
  CreatedBy: '00000001', // ควรดึงจากข้อมูลผู้ใช้ที่ล็อกอิน
  CreatedDatetime: new Date().toISOString(),
  ModifiedBy: null,
  ModifiedDatetime: '0001-01-01T00:00:00',
  CancelBy: null,
  CancelDatetime: '0001-01-01T00:00:00',
  CancelReason: null,
  TypeDevicename: 'box',
  DbInflux: 'mfecmiiotdb',
  TypeVehicle: 'box1',
  ZoneDevice: '1st',
  Building: 'SOA',
  FloorZone: '1ST',
  Measurement: []
})

const showAlert = ref(false)
const alertType = ref('success')
const alertMessage = ref('')
const dropzoneFile = ref(null)

const addMeasurement = () => {
  device.value.Measurement.push({
    DeviceId: device.value.DeviceId,
    MeasurementId: '',
    MeasurementName: '',
    MearurementLabel: '',
    MeasurementCode: '',
    MeasurementRefId: '',
    MeasurementUnit: '',
    ChartTypeId: '0001',
    ChartTypeGroupNo: 2,
    ChartTypeName: 'line',
    ThresholdMinWarning: 10.0,
    ThresholdMaxWarning: 10000.0,
    ThresholdMinDanger: 90000.0,
    ThresholdMaxDanger: 100000.0,
    ValueMin: 0.0,
    ValueMax: 0.0,
    IsSingleValue: false,
    IsActive: true,
    CreatedBy: '00000001',
    CreatedDatetime: new Date().toISOString(),
    ModifiedBy: null,
    ModifiedDatetime: '0001-01-01T00:00:00',
    CancelBy: null,
    CancelDatetime: '0001-01-01T00:00:00',
    CancelReason: null,
    FormulaSQL: 'mean',
    FormulaCalculator: '',
    NotificationSound: true,
    NotificationLine: false,
    NotificationMail: false,
    TypeConditional: 'forward'
  })
}

const removeMeasurement = (index) => {
  device.value.Measurement.splice(index, 1)
}

// const saveDevice = async () => {
//   try {
//     const response = await $api.put('/Device/AddNew', device.value)

//     showAlert.value = true
//     alertType.value = 'success'
//     alertMessage.value = 'Device added successfully!'
//     setTimeout(() => {
//       showAlert.value = false
//       router.push({ name: 'DeviceManagementList' })
//     }, 1000)
//   } catch (error) {
//     console.error('Error adding device:', error)
//     showAlert.value = true
//     alertType.value = 'error'
//     alertMessage.value = 'Failed to add device: ' + (error.response?.data?.message || error.message)
//     setTimeout(() => {
//       showAlert.value = false
//     }, 1000)
//   }
// }

const cancel = () => {
  router.push({ name: 'DeviceManagementList' })
}

const handleFileSelected = (file) => {
  dropzoneFile.value = file
}
</script>

<style scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.header p {
  margin-left: 8px;
  font-weight: bold;
}
.device-detail {
  margin-bottom: 16px;
}
.device-detail p {
  margin-bottom: 8px;
}
.button-section {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style> -->