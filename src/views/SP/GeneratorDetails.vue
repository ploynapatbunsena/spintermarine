<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <template v-if="loading">
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
        </v-row>
      </template>
      
      <template v-else-if="deviceData">
        <v-row>
          <!-- Title Section -->
          <v-col cols="12" class="position-relative d-flex align-center">
            <div style="width: 10vh;"></div>
            <div class="title flex-grow-1 text-center">{{ deviceData.DeviceLabel }}</div>
            <div style="width: 10vh;">
              <AlertFunction :item="deviceData" />
            </div>
          </v-col>
        </v-row>
    
        <!-- Gauge Section -->
        <v-row>
          <v-col cols="12" lg="6">
            <v-row>
              <v-col cols="6">
                <v-card class="gauge-card">
                  <GagueChart
                    title="Act Power"
                    :value="getMeasurementValue('Actual Power')"
                    :maxValue="300"
                    :delimiters="[
                      (200 / 300) * 100,
                      (250 / 300) * 100
                    ]"
                    :colors="[
                      '#3DCC5B',
                      '#FFD54F', 
                      '#F44336'
                    ]"
                    :labels="['200', '250']"
                    :rangeLabel="['0', '300']"
                    :centralLabel="`${getMeasurementValue('Actual Power')} kW`"
                  />
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="gauge-card">
                  <GagueChart
                    title="Oil Pressure"
                    :value="getMeasurementValue('Oil Pressure')"
                    :maxValue="10"
                    :delimiters="[
                      (1 / 10) * 100,
                      (2 / 10) * 100,
                    ]"
                    :colors="[
                      '#F44336',
                      '#FFD54F', 
                      '#3DCC5B'
                    ]"
                    :labels="['1', '2']"
                    :rangeLabel="['0', '10']"
                    :centralLabel="`${getMeasurementValue('Oil Pressure')} bar`"
                  />
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-card class="gauge-card">
                  <GagueChart
                    title="Water Temperature"
                    :value="getMeasurementValue('Water Temp')" 
                    :maxValue="100"
                    :delimiters="[
                      (92 / 100) * 100,
                      (95 / 100) * 100,
                    ]"
                    :colors="[
                      '#3DCC5B',
                      '#FFD54F', 
                      '#F44336'
                    ]"
                    :labels="['92°', '95°']"
                    :rangeLabel="['0', '100']"
                    :centralLabel="`${getMeasurementValue('Water Temp')}°`"
                  />
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="gauge-card">
                  <GagueChart
                    title="RPM"
                    :value="getMeasurementValue('RPM')"
                    :maxValue="2000"
                    :delimiters="[
                      (1850 / 2000) * 100,
                      (1900 / 2000) * 100,
                    ]"
                    :colors="[
                      '#3DCC5B',
                      '#FFD54F',
                      '#F44336',
                    ]"
                    :labels="['1850', '1900']"
                    :rangeLabel="['0', '2000']"
                    :centralLabel="`${getMeasurementValue('RPM')} RPM`"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <!-- General Info Section -->
          <v-col cols="12" lg="6">
            <v-card class="rounded-xl h-100">
              <v-card-title class="d-flex justify-center header">General Information</v-card-title>
              <v-card-text class="px-10">
                <GeneralInfo />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Generator Image -->
        <v-row>
          <v-col cols="12" lg="6">
            <v-card class="rounded-xl gen-img">
              <GeneratorImage />
            </v-card>
          </v-col>
          <!-- Notice Table -->
          <v-col cols="12" lg="6">
            <v-card class="pa-2 rounded-xl h-100">
              <NoticeTable :deviceId="deviceId" :measurements="deviceData.Measurement" />
            </v-card> 
          </v-col>
        </v-row>
      </template>
      
      <template v-else-if="error">
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <v-alert type="error">{{ error }}</v-alert>
          </v-col>
        </v-row>
      </template>
      
      <template v-else>
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <v-alert type="warning">No device data available</v-alert>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import SpaceBar from '@/components/SpaceBar.vue'
import GagueChart from '@/components/GeneratorDetails/GagueChart.vue'
import GeneralInfo from '@/components/GeneratorDetails/GeneralInfo.vue'
import GeneratorImage from '@/components/GeneratorDetails/GeneratorImage.vue'
import NoticeTable from '@/components/GeneratorDetails/NoticeTable.vue'
import AlertFunction from '@/components/BargeDetails/AlertFunction.vue'

const $api = inject('$api');
const route = useRoute();
const loading = ref(true);
const deviceData = ref(null);
const error = ref(null);
const typeDeviceName = route.params.typeDeviceName
const deviceId = route.params.deviceId

// Fetch device data
const fetchDeviceData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $api.put('/Device/GetDevice', {
      DeviceId: deviceId
    })
    
    // ตรวจสอบว่า TypeDevicename ตรงกับที่มาจาก route
    if (response.data.TypeDevicename !== typeDeviceName) {
      throw new Error('Device type does not match')
    }
    
    deviceData.value = response.data
  } catch (err) {
    console.error('Error fetching device data:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load device data'
  } finally {
    loading.value = false
  }
}

// Get measurement value by name
const getMeasurementValue = (measurementName) => {
  if (!deviceData.value?.Measurement) return 0;
  const measurement = deviceData.value.Measurement.find(m => 
    m.MeasurementName === measurementName || 
    m.MeasurementLabel === measurementName
  )
  return Number(measurement?.Value) || 0
}
// Fetch data when component mounts
onMounted(() => {
  fetchDeviceData()
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
  text-align: center;
}

.gauge-card {
  border-radius: 24px;
}

.gen-img {
  background-color: var(--bg-gen);
  padding: 20px;
}

.header {
  font-size: 2.5vh;
  font-weight: 600;
}
</style>
