<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="d-flex align-center justify-center fill-height"> 
      <v-row v-if="!isLoading">
        <v-col cols="12" class="position-relative d-flex align-center">
          <div style="width: 10vh;"></div>
          <div class="title flex-grow-1 text-center">{{ deletePrefix(typeDeviceName) }}</div>
          <div style="width: 10vh;">
            <AlertBadges
              :warningCount="totalAlerts.warning"
              :dangerCount="totalAlerts.danger"
            />
          </div>
        </v-col>
        <v-col cols="12">
          <v-card elevation="0" class="pa-4">
            <v-row>
              <!-- Generator Section for Desktop -->
              <v-col md="8" sm="12" cols="12" class="d-none d-md-block">
                <!-- Row ที่ 1 ของ Generator -->
                <v-row>
                  <v-col
                    v-for="device in filteredDevices.slice(0, 5)"
                    :key="device.DeviceId"
                    class="pa-0 mx-auto"
                    cols="auto"
                  >
                    <v-card
                      class="gen-card pa-0 d-flex flex-column align-center"
                      @click="goToGeneratorDetails(device.DeviceId)"
                    >
                      <div class="gen-status" :class="[getAlertColorClass(device), getStatusClass(device)]">
                        <v-icon v-if="getStatusIcon(device)" class="status-icon">
                          {{ getStatusIcon(device) }}
                        </v-icon>
                        <p class="text-truncate gen-name">{{ device.DeviceLabel }}</p>
                      </div>
                      <v-img
                        :src="require('@/assets/Images/generator.png')"
                        class="gen-img"
                      />
                      <div class="gen-details">
                        <v-row 
                          v-for="(item, index) in deviceMeasurements(device)"
                          :key="index"
                          no-gutters 
                          class="column-detail" 
                          :style="{ backgroundColor: index % 2 === 0 ? '#F9F9FA' : 'transparent' }"
                        >
                          <v-col cols="6" class="text-truncate">{{ item.name }}</v-col>
                          <v-col cols="4" style="font-weight: bold; text-align: end; padding-right: 2vh;">{{ item.value }}</v-col>
                          <v-col cols="2">{{ item.unit }}</v-col>
                        </v-row>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              
              <!-- Generator Section for Mobile/Tablet -->
              <v-col cols="12" class="d-block d-md-none">
                <!-- Row ที่ 1 ของ Generator สำหรับ Mobile/Tablet -->
                <v-row>
                  <v-col
                    v-for="device in filteredDevices.slice(0, 2)"
                    :key="device.DeviceId"
                    cols="6"
                  >
                    <v-card
                      class="gen-card pa-0 d-flex flex-column align-center"
                      @click="goToGeneratorDetails(device.DeviceId)"
                    >
                      <div class="gen-status" :class="[getAlertColorClass(device), getStatusClass(device)]">
                        <v-icon v-if="getStatusIcon(device)" class="status-icon">
                          {{ getStatusIcon(device) }}
                        </v-icon>
                        <p class="text-truncate gen-name">{{ device.DeviceLabel }}</p>
                      </div>
                      <v-img
                        :src="require('@/assets/Images/generator.png')"
                        class="gen-img"
                      />
                      <div class="gen-details">
                        <v-row 
                          v-for="(item, index) in deviceMeasurements(device)"
                          :key="index"
                          no-gutters 
                          class="column-detail" 
                          :style="{ backgroundColor: index % 2 === 0 ? '#F9F9FA' : 'transparent' }"
                        >
                          <v-col cols="6" class="text-truncate">{{ item.name }}</v-col>
                          <v-col cols="4" style="font-weight: bold; text-align: end; padding-right: 2vh;">{{ item.value }}</v-col>
                          <v-col cols="2">{{ item.unit }}</v-col>
                        </v-row>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                
                <!-- Row ที่ 2 ของ Generator สำหรับ Mobile/Tablet -->
                <v-row>
                  <v-col
                    v-for="device in filteredDevices.slice(2, 4)"
                    :key="device.DeviceId"
                    cols="6"
                  >
                    <v-card
                      class="gen-card pa-0 d-flex flex-column align-center"
                      @click="goToGeneratorDetails(device.DeviceId)"
                    >
                      <div class="gen-status" :class="[getAlertColorClass(device), getStatusClass(device)]">
                        <v-icon v-if="getStatusIcon(device)" class="status-icon">
                          {{ getStatusIcon(device) }}
                        </v-icon>
                        <p class="text-truncate gen-name">{{ device.DeviceLabel }}</p>
                      </div>
                      <v-img
                        :src="require('@/assets/Images/generator.png')"
                        class="gen-img"
                      />
                      <div class="gen-details">
                        <v-row 
                          v-for="(item, index) in deviceMeasurements(device)"
                          :key="index"
                          no-gutters 
                          class="column-detail" 
                          :style="{ backgroundColor: index % 2 === 0 ? '#F9F9FA' : 'transparent' }"
                        >
                          <v-col cols="6" class="text-truncate">{{ item.name }}</v-col>
                          <v-col cols="4" style="font-weight: bold; text-align: end; padding-right: 2vh;">{{ item.value }}</v-col>
                          <v-col cols="2">{{ item.unit }}</v-col>
                        </v-row>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                
                <!-- Row ที่ 3 ของ Generator สำหรับ Mobile/Tablet -->
                <v-row>
                  <v-col
                    v-for="device in filteredDevices.slice(4, 6)"
                    :key="device.DeviceId"
                    cols="6"
                  >
                    <v-card
                      class="gen-card pa-0 d-flex flex-column align-center"
                      @click="goToGeneratorDetails(device.DeviceId)"
                    >
                      <div class="gen-status" :class="[getAlertColorClass(device), getStatusClass(device)]">
                        <v-icon v-if="getStatusIcon(device)" class="status-icon">
                          {{ getStatusIcon(device) }}
                        </v-icon>
                        <p class="text-truncate gen-name">{{ device.DeviceLabel }}</p>
                      </div>
                      <v-img
                        :src="require('@/assets/Images/generator.png')"
                        class="gen-img"
                      />
                      <div class="gen-details">
                        <v-row 
                          v-for="(item, index) in deviceMeasurements(device)"
                          :key="index"
                          no-gutters 
                          class="column-detail" 
                          :style="{ backgroundColor: index % 2 === 0 ? '#F9F9FA' : 'transparent' }"
                        >
                          <v-col cols="6" class="text-truncate">{{ item.name }}</v-col>
                          <v-col cols="4" style="font-weight: bold; text-align: end; padding-right: 2vh;">{{ item.value }}</v-col>
                          <v-col cols="2">{{ item.unit }}</v-col>
                        </v-row>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                
                <!-- Row ที่ 4 ของ Generator สำหรับ Mobile/Tablet -->
                <v-row>
                  <v-col
                    v-for="device in filteredDevices.slice(6, 8)"
                    :key="device.DeviceId"
                    cols="6"
                  >
                    <v-card
                      class="gen-card pa-0 d-flex flex-column align-center"
                      @click="goToGeneratorDetails(device.DeviceId)"
                    >
                      <div class="gen-status" :class="[getAlertColorClass(device), getStatusClass(device)]">
                        <v-icon v-if="getStatusIcon(device)" class="status-icon">
                          {{ getStatusIcon(device) }}
                        </v-icon>
                        <p class="text-truncate gen-name">{{ device.DeviceLabel }}</p>
                      </div>
                      <v-img
                        :src="require('@/assets/Images/generator.png')"
                        class="gen-img"
                      />
                      <div class="gen-details">
                        <v-row 
                          v-for="(item, index) in deviceMeasurements(device)"
                          :key="index"
                          no-gutters 
                          class="column-detail" 
                          :style="{ backgroundColor: index % 2 === 0 ? '#F9F9FA' : 'transparent' }"
                        >
                          <v-col cols="6" class="text-truncate">{{ item.name }}</v-col>
                          <v-col cols="4" style="font-weight: bold; text-align: end; padding-right: 2vh;">{{ item.value }}</v-col>
                          <v-col cols="2">{{ item.unit }}</v-col>
                        </v-row>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                
                <!-- Row ที่ 5 ของ Generator สำหรับ Mobile/Tablet -->
                <v-row>
                  <v-col
                    v-for="device in filteredDevices.slice(8, 10)"
                    :key="device.DeviceId"
                    cols="6"
                  >
                    <v-card
                      class="gen-card pa-0 d-flex flex-column align-center"
                      @click="goToGeneratorDetails(device.DeviceId)"
                    >
                      <div class="gen-status" :class="[getAlertColorClass(device), getStatusClass(device)]">
                        <v-icon v-if="getStatusIcon(device)" class="status-icon">
                          {{ getStatusIcon(device) }}
                        </v-icon>
                        <p class="text-truncate gen-name">{{ device.DeviceLabel }}</p>
                      </div>
                      <v-img
                        :src="require('@/assets/Images/generator.png')"
                        class="gen-img"
                      />
                      <div class="gen-details">
                        <v-row 
                          v-for="(item, index) in deviceMeasurements(device)"
                          :key="index"
                          no-gutters 
                          class="column-detail" 
                          :style="{ backgroundColor: index % 2 === 0 ? '#F9F9FA' : 'transparent' }"
                        >
                          <v-col cols="6" class="text-truncate">{{ item.name }}</v-col>
                          <v-col cols="4" style="font-weight: bold; text-align: end; padding-right: 2vh;">{{ item.value }}</v-col>
                          <v-col cols="2">{{ item.unit }}</v-col>
                        </v-row>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              
              <!-- Crane Section for Desktop -->
              <v-col md="4" sm="12" cols="12" class="d-none d-md-block">
                <v-row>
                  <v-col class="d-flex justify-center" cols="auto">
                    <v-card class="crane-card" elevation="0">
                      <div class="d-flex justify-space-between align-center pb-2">
                        <h2 class="text-h6 text-lg-h6 text-xxl-h4" style="font-family: 'Inter', sans-serif;">Crane</h2>
                        <router-link :to="{ name: 'StatusUpdateForm', params: { typeDeviceName: typeDeviceName } }">
                          <v-icon icon="mdi-pencil" class="edit"></v-icon>
                        </router-link>
                      </div>
                      <v-row class="mx-2">
                        <v-col v-for="crane in craneDevices" :key="crane.DeviceId" cols="4">
                          <v-card class="d-flex flex-column align-center rounded-lg">
                            <div class="crane-title" :class="getStatusCrane(crane)">
                              {{ crane.DeviceLabel }}
                            </div>
                            <v-img
                              width="8vh"
                              height="10vh"
                              :src="require('@/assets/Images/crane.png')"
                              class="crane-img"
                              cover
                            ></v-img>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row class="mx-2">
                        <v-col cols="4">
                          <v-card>
                            <div class="d-flex justify-space-between align-center mx-4 my-2">
                              <p class="text-status">Standby</p>
                              <span class="text-blue">{{ craneStatusCounts[1] }}</span>
                            </div>
                            <div class="bottom-line-blue"></div>
                          </v-card>
                        </v-col>
                        <v-col cols="4">
                          <v-card>
                            <div class="d-flex justify-space-between align-center mx-4 my-2">
                              <p class="text-status">Running</p>
                              <span class="text-green">{{ craneStatusCounts[2] }}</span>
                            </div>
                            <div class="bottom-line-green"></div>
                          </v-card>
                        </v-col>
                        <v-col cols="4">
                          <v-card>
                            <div class="d-flex justify-space-between align-center mx-4 my-2">
                              <p class="text-status">Maintenance</p>
                              <span class="text-black">{{ craneStatusCounts[3] }}</span>
                            </div>
                            <div class="bottom-line-black"></div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            
            <!-- Crane Section for Mobile/Tablet -->
            <v-row class="d-block d-md-none">
              <v-col cols="12">
                <v-card class="crane-card" elevation="0">
                  <div class="d-flex justify-space-between align-center pb-2">
                    <h2 class="text-h6 text-lg-h6 text-xxl-h4" style="font-family: 'Inter', sans-serif;">Crane</h2>
                    <router-link :to="{ name: 'StatusUpdateForm', params: { typeDeviceName: typeDeviceName } }">
                      <v-icon icon="mdi-pencil" class="edit"></v-icon>
                    </router-link>
                  </div>
                  
                  <v-row class="mx-2">
                    <v-col 
                      v-for="crane in craneDevices" 
                      :key="crane.DeviceId" 
                      cols="4"
                    >
                      <v-card class="d-flex flex-column align-center rounded-lg">
                        <div class="crane-title" :class="getStatusCrane(crane)">
                          {{ crane.DeviceLabel }}
                        </div>
                        <v-img
                          width="8vh"
                          height="10vh"
                          :src="require('@/assets/Images/crane.png')"
                          class="crane-img"
                          cover
                        ></v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                  
                  <v-row class="mx-2">
                    <v-col cols="4">
                      <v-card>
                        <div class="d-flex justify-space-between align-center mx-4 my-2">
                          <p class="text-status">Standby</p>
                          <span class="text-blue">{{ craneStatusCounts[1] }}</span>
                        </div>
                        <div class="bottom-line-blue"></div>
                      </v-card>
                    </v-col>
                    <v-col cols="4">
                      <v-card>
                        <div class="d-flex justify-space-between align-center mx-4 my-2">
                          <p class="text-status">Running</p>
                          <span class="text-green">{{ craneStatusCounts[2] }}</span>
                        </div>
                        <div class="bottom-line-green"></div>
                      </v-card>
                    </v-col>
                    <v-col cols="4">
                      <v-card>
                        <div class="d-flex justify-space-between align-center mx-4 my-2">
                          <p class="text-status">Maintenance</p>
                          <span class="text-black">{{ craneStatusCounts[3] }}</span>
                        </div>
                        <div class="bottom-line-black"></div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <!-- Row ที่ 2 ของ Generator for Desktop -->
            <v-row>
              <v-col md="8" sm="12" cols="12" class="d-none d-md-block">
                <v-row>
                  <v-col
                    v-for="device in filteredDevices.slice(5, 10)"
                    :key="device.DeviceId"
                    class="pa-0 mx-auto"
                    cols="auto"
                  >
                    <v-card
                      class="gen-card pa-0 d-flex flex-column align-center"
                      @click="goToGeneratorDetails(device.DeviceId)"
                    >
                      <div class="gen-status" :class="[getAlertColorClass(device), getStatusClass(device)]">
                        <v-icon v-if="getStatusIcon(device)" class="status-icon">
                          {{ getStatusIcon(device) }}
                        </v-icon>
                        <p class="text-truncate gen-name">{{ device.DeviceLabel }}</p>
                      </div>
                      <v-img
                        :src="require('@/assets/Images/generator.png')"
                        class="gen-img"
                      />
                      <div class="gen-details">
                        <v-row 
                          v-for="(item, index) in deviceMeasurements(device)"
                          :key="index"
                          no-gutters 
                          class="column-detail" 
                          :style="{ backgroundColor: index % 2 === 0 ? '#F9F9FA' : 'transparent' }"
                        >
                          <v-col cols="6" class="text-truncate">{{ item.name }}</v-col>
                          <v-col cols="4" style="font-weight: bold; text-align: end; padding-right: 2vh;">{{ item.value }}</v-col>
                          <v-col cols="2">{{ item.unit }}</v-col>
                        </v-row>
                      </div>
                    </v-card>  
                  </v-col>
                  <!-- เพิ่มคอลัมน์เปล่าเมื่อมี devices น้อยกว่า 10 -->
                  <template v-if="filteredDevices.length < 10">
                    <v-col
                      v-for="i in 10 - filteredDevices.length"
                      :key="`empty-${i}`"
                      class="mx-2"
                      cols="auto"
                    >
                      <v-card class="gen-card pa-0 d-flex flex-column align-center" style="visibility: hidden;"></v-card>
                    </v-col>
                  </template>
                </v-row>
              </v-col>
              <!-- Gasoline Tank -->
              <v-col md="4" sm="12" cols="12">
                <v-card class="gasoline-card" elevation="0">
                  <GasolineTank
                    :remainingVolume="fuelLevel"
                    :totalCapacity="totalCapacity"
                  />
                </v-card>
              </v-col>    
            </v-row>
            
            <!-- Gasoline Tank for Mobile/Tablet -->
            <!-- <v-row class="d-block d-md-none">
              <v-col cols="12">
                <v-card class="gasoline-card" elevation="0">
                  <GasolineTank
                    :remainingVolume="fuelLevel"
                    :totalCapacity="totalCapacity"
                  />
                </v-card>
              </v-col>
            </v-row> -->
            
            <!-- deatil status GEN -->
            <v-row class="pt-4">
              <v-col class="status-detail-gen" cols="12" lg="8">
                <v-row>
                  <v-list-item class="detail-status">Generator status</v-list-item>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#00B8F2" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Standby</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#28A745" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Running</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#007BFF" class="me-1 detail-status"></v-icon>
                    <span class="text-truncate detail-status">Standby/Maintenance</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#8DEB51" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Running/Maintenance</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#000000" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Down</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#DC2B2B" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Danger</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#FAC12A" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Warning</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#979a9a" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Offline</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="status-detail-crane" cols="12" lg="4">
                <v-row>
                  <v-list-item class="detail-status">Crane status</v-list-item>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#00B8F2" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Standby</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#28A745" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Running</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#000000" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Maintenance</span>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-icon icon="mdi-square" color="#979a9a" class="me-1 detail-status"></v-icon>
                    <span class="detail-status">Offline</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- Row ที่สามของ Generator -->
            <v-row>
              <!-- Tilt Barge -->
              <v-col md="4" sm="12" cols="12">
                <v-card class="pa-4 rounded-xl h-100">
                  <h2 class="d-flex align-center justify-center pb-2 text-h6 text-lg-h6 text-xxl-h4" style="font-family: 'Sarabun', sans-serif;">ระดับความเอียงทุ่น</h2>
                  <!-- Barge Img -->
                  <v-row>
                    <v-col cols="6">
                      <div class="barge-container">
                        <v-img class="bg_barge" :src="require('@/assets/Images/bg_barge_tilt.png')"></v-img>
                        <v-img
                          class="barge-img"
                          :src="require('@/assets/Images/barge_front.png')"
                          :style="{ transform: `translate(-50%, -50%) rotate(${xRotation}deg) scale(1.2)` }"
                        ></v-img>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div class="barge-container">
                        <v-img class="bg_barge" :src="require('@/assets/Images/bg_barge_tilt.png')"></v-img>
                        <v-img
                          class="barge-img"
                          :src="require('@/assets/Images/barge_side.png')"
                          :style="{ transform: `translate(-50%, -50%) rotate(${yRotation}deg) scale(1.2)` }"
                        ></v-img>
                      </div>
                    </v-col>
                  </v-row>
                  <!-- Gauge Chart -->
                  <v-row>
                    <v-col cols="6" class="gauge-chart">
                      <GaugeTiltLevel 
                        v-if="tiltThresholdsX"
                        label="X" 
                        :value="xValue" 
                        :max-value="tiltThresholdsX?.valuemax"
                        :min-warning-threshold="tiltThresholdsX?.thresholdminwarning"
                        :max-warning-threshold="tiltThresholdsX?.thresholdmaxwarning"
                        :min-danger-threshold="tiltThresholdsX?.thresholdmindanger"
                        :max-danger-threshold="tiltThresholdsX?.thresholdmaxdanger"
                      />
                    </v-col>
                    <v-col cols="6" class="gauge-chart">
                      <GaugeTiltLevel
                        v-if="tiltThresholdsY"
                        label="Y" 
                        :value="yValue" 
                        :max-value="tiltThresholdsY?.valuemax"
                        :min-warning-threshold="tiltThresholdsY?.thresholdminwarning"
                        :max-warning-threshold="tiltThresholdsY?.thresholdmaxwarning"
                        :min-danger-threshold="tiltThresholdsY?.thresholdmindanger"
                        :max-danger-threshold="tiltThresholdsY?.thresholdmaxdanger"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <!-- Map -->
              <v-col sm="12" md="4" cols="12">
                <v-card class="rounded-xl h-100">
                  <MapOfBarge 
                    :position="bargePosition"
                    :wind-speed="coordinates.windSpeed"
                    :wind-direction="coordinates.windDirection"
                    :measurement-unit="windSpeedUnit"
                  />
                </v-card>
              </v-col>
              <!-- Notification Table-->
              <v-col sm="12" md="4" cols="12">
                <v-card class=" rounded-xl h-100">
                  <div class="notification-header">
                    <p class="header">Notification</p>
                    <router-link 
                      :to="{
                        name: 'NotificationReport',
                        query: {
                          vehicle: devices[0]?.TypeDevicename,
                        }
                      }"
                    >
                      <v-icon icon="mdi-pencil" class="edit"></v-icon>
                    </router-link>
                  </div>
                  <NotificationTable :notices="mappedNotices"/>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-overlay
        :model-value="isLoading"
        class="align-center justify-center"
        persistent
      >
        <div class="pa-6 d-flex flex-column align-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="mt-4 text-h6" style="font-family: 'Inter', sans-serif;">Loading data...</div>
        </div>
      </v-overlay>
    </v-container> 
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import GasolineTank from '@/components/BargeDetails/GasolineTank.vue';
import GaugeTiltLevel from '@/components/BargeDetails/GaugeTiltLevel.vue';
import MapOfBarge from '@/components/BargeDetails/MapOfBarge.vue';
import NotificationTable from '@/components/NotificationTable.vue';
import AlertBadges from '@/components/BargeDetails/AlertBadges.vue';
import { fuelCapacityConfig } from '@/config/fuel-capacity-config';
import '@/assets/colors.scss';
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $api = inject('$api');
const router = useRouter();
const route = useRoute();
const devices = ref([]);
const noti = ref([]);
const typeDeviceName = ref(route.params.typeDeviceName);
const isLoading = ref(true);
let intervalId  = null;
const tiltThresholdsX = ref(null);
const tiltThresholdsY = ref(null);

const xValue = computed(() => tiltValues.value.x);
const yValue = computed(() => tiltValues.value.y);
const xRotation = computed(() => (xValue.value / 6) * 10);
const yRotation = computed(() => (yValue.value / 6) * 10);

const audioPlayed = ref(false);
const prevDangerCount = ref(0);
const alertSound = ref(null);

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepage');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101010200');

  if (!permission || !permission.IsActive) {
    return router.push('/Homepage');
  }
};

const fetchDeviceBargesGrouped = async () => {
  try {
    isLoading.value = true;
    const response = await $api.get('/MachineStatus/GetDeviceByTypeDeviceName', {
      params: { typeDeviceName: typeDeviceName.value }
    });

    const processedDevices = response.data.map(device => {
      let warningTotal = 0;
      let dangerTotal = 0;
      
      device.MeasurementsAlertCount?.forEach(item => {
        if ('AlertWarningTotal' in item) {
          warningTotal += parseInt(item.AlertWarningTotal) || 0;
        }
        if ('AlertDangerTotal' in item) {
          dangerTotal += parseInt(item.AlertDangerTotal) || 0;
        }
      });

      return {
        ...device,
        AlertWarningTotalSum: warningTotal,
        AlertDangerTotalSum: dangerTotal
      };
    });
    devices.value = processedDevices;
    
    const bargeMaster = devices.value.find(d => d.DeviceName === 'Barge Master');
    if (bargeMaster) {
      await fetchTiltThresholds(bargeMaster.DeviceId);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    devices.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchTiltThresholds = async (deviceId) => {
  try {
    const response = await $api.get('/MachineStatus/GetDeviceByDeviceId', {
      params: { deviceid: deviceId }
    });
    
    if (response.data && response.data.length > 0) {
      const device = response.data[0];
      const axisX = device.Mesurement?.find(m => m.measurementname === 'Axis-X');
      tiltThresholdsX.value = {
        valuemax: axisX?.valuemax,
        thresholdminwarning: axisX?.thresholdminwarning,
        thresholdmaxwarning: axisX?.thresholdmaxwarning,
        thresholdmindanger: axisX?.thresholdmindanger,
        thresholdmaxdanger: axisX?.thresholdmaxdanger,
      };
      console.log('tiltThresholdsX:', tiltThresholdsX.value);

      const axisY = device.Mesurement?.find(m => m.measurementname === 'Axis-Y');
      tiltThresholdsY.value = {
        valuemax: axisY?.valuemax,
        thresholdminwarning: axisY?.thresholdminwarning,
        thresholdmaxwarning: axisY?.thresholdmaxwarning,
        thresholdmindanger: axisY?.thresholdmindanger,
        thresholdmaxdanger: axisY?.thresholdmaxdanger,
      };
      console.log('tiltThresholdsY:', tiltThresholdsY.value);
    }
  } catch (error) {
    console.error('Error fetching tilt thresholds:', error);
  }
};

const fetchNotification = async () => {
  
  isLoading.value = true;
  if (!devices.value.length) {
    await fetchDeviceBargesGrouped();
  }
  
  noti.value = [];
  try {
    for (const device of devices.value) {
      const requestBody = {
        DeviceId: device.DeviceId,
        IsAccept: false
      };

      try {
        const response = await $api.put('/device/notificationlistStatus', requestBody);
        const filteredData = response.data.filter(item =>  item.Title.includes("Danger"));
        noti.value = [...noti.value, ...filteredData];
      } catch (err) {
        console.error(`Failed to fetch notifications for DeviceId ${device.DeviceId}:`, err);
      }
    }
  } catch (error) {
    error.value = 'Failed to fetch notifications. Please try again later.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const mappedNotices = computed(() => {
  return noti.value.map(item => ({
    date: item.AlertTime,
    name: item.DeviceLabel,
    measuremnet: item.MeasurementName,
    details: item.Description,
    status: item.IsAccept ? 'ดำเนินการเสร็จสิ้น' : 'รอแจ้งซ่อม',
  }));
});

const deletePrefix = (name) => {
  return name.replace(/Barge|Tugboat/gi, '').trim();
};

const totalAlerts = computed(() => {
  return devices.value.reduce((total, device) => {
    return {
      warning: total.warning + (device.AlertWarningTotalSum || 0),
      danger: total.danger + (device.AlertDangerTotalSum || 0)
    };
  }, { warning: 0, danger: 0 });
});

const totalDangerCount = computed(() => {
  if (!devices.value.length) return 0;
  return devices.value.reduce((total, device) => {
    return total + (device?.AlertDangerTotalSum || 0);
  }, 0);
});

const playAlertSound = () => {
  if (!alertSound.value) {
    alertSound.value = new Audio('/alert-sound.mp3');
    alertSound.value.volume = 0.1;
  }
  
  alertSound.value.play().catch(e => console.error('Error playing sound:', e));
};

watch(totalDangerCount, (newCount, oldCount) => {
  if (!audioPlayed.value && newCount > 0) {
    playAlertSound();
    audioPlayed.value = true;
  }
  else if (newCount > oldCount) {
    playAlertSound();
  }
  
  prevDangerCount.value = newCount;
}, { immediate: true });

watch(devices, (newDevices) => {
  const hasDanger = newDevices.some(device => device?.AlertDangerTotalSum > 0);
  audioPlayed.value = hasDanger;
}, { deep: true });

const filteredDevices = computed(() => {
  return devices.value.filter(device => device.DeviceName.includes("GEN"));
});

const craneDevices = computed(() => {
  return devices.value.filter(device => device.DeviceName.includes("CRANE"));
});

const craneStatusCounts = computed(() => {
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };

  craneDevices.value.forEach(crane => {
    const statusMeasurement = crane.Mesurement.find(m => m.measurementname === "Status");

    const statusValue = statusMeasurement ? parseInt(statusMeasurement.lastvalue) : 0;
    if (!isNaN(statusValue) && statusValue in counts) {
      counts[statusValue]++;
    }
  });
  return counts;
});

const totalCapacity = computed(() => {
  return fuelCapacityConfig[typeDeviceName.value] || fuelCapacityConfig.default;
});

const fuelLevel = computed(() => {
  const bargeMaster = devices.value.find(device => device.DeviceName === 'Barge Master');
  if (!bargeMaster) return 0;
  const fuelMeasurement = bargeMaster.Mesurement?.find(m => m.measurementname === 'Fuel Level Main tank');
  
  return parseInt(fuelMeasurement?.lastvalue) || 0;
});

// Tilt
const tiltValues = computed(() => {
  const bargeMaster = devices.value.find(d => d.DeviceName === 'Barge Master');
  if (!bargeMaster) return { x: 0, y: 0 };
  
  const axisX = bargeMaster.Mesurement?.find(m => m.measurementname === 'Axis-X');
  const axisY = bargeMaster.Mesurement?.find(m => m.measurementname === 'Axis-Y');
  
  return {
    x: parseFloat(axisX?.lastvalue) || 0,
    y: parseFloat(axisY?.lastvalue) || 0
  };
});

const coordinates = computed(() => {
  const bargeMaster = devices.value.find(d => d.DeviceName === 'Barge Master');
  if (!bargeMaster) return { 
    latitude: 13.122581, 
    longitude: 100.816189,
    windSpeed: 0,
    windDirection: 0
  };
  
  const latitudeMeasurement = bargeMaster.Mesurement?.find(m => m.measurementname === 'Latitude');
  const longitudeMeasurement = bargeMaster.Mesurement?.find(m => m.measurementname === 'Longitude');
  const windSpeed = bargeMaster.Mesurement?.find(m => m.measurementname === 'Wind-Speed');
  const windDirection = bargeMaster.Mesurement?.find(m => m.measurementname === 'Wind-Direction');

  return {
    latitude: parseFloat(latitudeMeasurement?.lastvalue) || 13.122581,
    longitude: parseFloat(longitudeMeasurement?.lastvalue) || 100.816189,
    windSpeed: parseInt(windSpeed?.lastvalue) || 0,
    windDirection: parseInt(windDirection?.lastvalue) || 0
  };
});

const bargePosition = computed(() => ({
  lat: coordinates.value.latitude,
  lng: coordinates.value.longitude
}));

const windSpeedUnit = computed(() => {
  const bargeMaster = devices.value.find(d => d.DeviceName === 'Barge Master');
  if (!bargeMaster) return 'm/s';
  
  const windSpeedMeasurement = bargeMaster.Mesurement?.find(m => m.measurementname === 'Wind-Speed');
  return windSpeedMeasurement?.measurementunit || 'm/s';
});

const deviceMeasurements = (device) => {
  const names = ['Actual Power', 'RPM', 'Water Temp', 'Oil Pressure', 'Total Fuel Consumption'];
  return names.map(name => ({
    name,
    value: device.Mesurement?.find(m => m.measurementname === name)?.lastvalue || 'N/A',
    unit: device.Mesurement?.find(m => m.measurementname === name)?.measurementunit || ''
  }));
};

const getStatusClass = (device) => {
  const statusMeasurement = device.Mesurement.find(m => m.measurementname === "Status");
  if (!statusMeasurement) return 'status-unknown';

  const statusValue = parseInt(statusMeasurement.lastvalue);
  switch (statusValue) {
    case 0: default: return 'status-unknown';
    case 1: return 'status-standby';
    case 2: return 'status-running';
    case 3: return 'status-standby-maintenance';
    case 4: return 'status-running-maintenance';
    case 5: return 'status-down';
  }
};

const getAlertColorClass = (device) => {
  const dangerTotal = device.AlertDangerTotalSum || 0;
  const warningTotal = device.AlertWarningTotalSum || 0;
  
  if (dangerTotal > 0) {
    return 'alert-danger';
  } else if (warningTotal > 0) {
    return 'alert-warning';
  }
  return '';
};

// Icon of status of Gen
const getStatusIcon = (device) => {
  const statusMeasurement  = device.Mesurement.find(m => m.measurementname === "Status");
  if (!statusMeasurement) return 'status-unknown';

  const statusValue = parseInt(statusMeasurement.lastvalue);
  switch (statusValue) {
    case 3: return "mdi-hammer-wrench";
    case 4: return "mdi-hammer-wrench";
  }
};

const getStatusCrane = (crane) => {
  const statusMeasurement = crane.Mesurement.find(m => m.measurementname === "Status");
  if (!statusMeasurement) return 'status-unknown';

  const statusValue = parseInt(statusMeasurement.lastvalue);
  switch (statusValue) {
    case 0: default: return 'status-unknown';
    case 1: return 'status-standby';
    case 2: return 'status-running';
    case 3: return 'status-down'; //maintenance
  }
};

watch(() => route.params.typeDeviceName, (newName) => {
  if (newName) {
    typeDeviceName.value = newName;
    fetchDeviceBargesGrouped(newName);
  }
});

const goToGeneratorDetails = (deviceId) => {
  router.push({ name: 'GeneratorDetails', params: { deviceId: deviceId }});
};

const fetchDataWithInterval = async () => {
  await fetchDeviceBargesGrouped();
  await fetchNotification();
};

const startDataInterval = () => {intervalId = setInterval(fetchDataWithInterval, 5 * 60 * 1000);};

const stopDataInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(async () => {
  console.log('Component mounted');
  await initialize();
  await fetchDataWithInterval();
  startDataInterval();
});

onUnmounted(() => {
  console.log('Component unmounted');
  stopDataInterval();
});
</script>

<style lang="scss" scoped>
.status-icon {
  margin-right: 1vh;
  color: #FFFFFF;
  font-size: 2vh;
}

.detail-status {
  font-size: 1.5vh;
}

.status-detail-gen {
  background-color: #f8f9f9;
  // background-color: #40E0D0;
}

.status-detail-crane {
  background-color: #f8f9f9;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3vh;
  font-weight: 600;

  @media(min-width: 2560px) {
    margin: 2vh 0px;
  }
}

.background {
  width: 100%;
  height: 100vh;
  padding: 2vw;
}

.gen-card {
  width: 11.5vw;
  min-width: 20vh;
  height: 25vh;
  background: #FFFFFF;
}

@media(max-width: 1024px) {
  .gen-card {
    width: 100%;
  }
}

.gen-img {
  width: 20vh;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gen-status {
  width: 100%;
  height: 2.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gen-name {
  text-align: center;
  font-size: 1vh;
  color: #FFFFFF;
}

.gen-details {
  font-size: 1vh;
  width: 100%;
}

.column-detail {
  width: 100%;
  height: 2vh;
  padding-left: 1vw;
}

.header  {
  font-size: 2.5vh;
  font-weight: bold;
}

.crane-card {
  width: 100%;
  min-width: 32vw;
  height: 25vh;
}

.crane-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1vh;
  width: 100%;
  height: 2vh;
  color: #FFFFFF;
}

.crane-img {
  @media (min-width: 2560px) {
    width: 50%;
    height: 10vh;
    margin: 1vw 0;
  }
}

.crane-status {
  font-size: 1vh;
  font-weight: bold;
  text-transform: capitalize;
}

.status-summary {
  margin-top: 1vh;
  font-size: 1vh;
  font-weight: bold;
}

.gasoline-card {
  width: 100%;
  height: 100%;
  background: #F0F0F0;
  border-radius: 1vw; 
}

.status-standby {
  background-color: var(--sky);
}

.status-running {
  background-color: var(--dark-green);
}

.status-standby-maintenance {
  background-color: var(--primary);
}

.status-running-maintenance {
  background-color: #8DEB51;
}

.status-down {
  background-color: var(--black);
}

.status-warning {
  background-color: var(--yellow);
}

.status-danger {
  background-color: var(--red);
}

.status-unknown {
  background-color: #C0C0C0;
}

.alert-danger {
  background-color: #DC2B2B;
}

.alert-warning {
  background-color: #FAC12A;
}

.material-symbols-rounded {
  font-size: 3vh;

  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 2
}

.text-blue {
  font-family: 'Inter', serif;
  color: var(--sky);
  font-size: 2vh;
}

.text-green {
  font-family: 'Inter', serif;
  color: var(--dark-green);
  font-size: 2vh;
}

.text-black {
  font-family: 'Inter', serif;
  color: var(--black);
  font-size: 2vh;
}

.crane-value {
  font-family: 'Inter', serif;
  font-size: 2vh;
  font-weight: 600;
}

.bottom-line-blue {
  border: 6px solid var(--sky);
}

.bottom-line-green {
  border: 6px solid var(--dark-green);
}

.bottom-line-black {
  border: 6px solid var(--black);
}

.text-status {
  font-size: 1vh;
  font-weight: 400;
}

.edit {
  width: 2vw;
  height: 2vh;
  border-radius: 2vh;
  font-size: 2vh;
  color: var(--symbol-blue);
  background-color: var(--bg-light-tugboat);
}

.tilt-header {
  font-family: 'Sarabun', serif;
  font-size: 1vh;
  font-weight: 500;
  text-align: center;
}

.barge-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg_barge {
  width: 100%;
  height: auto;
}

.barge-img {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12vw;
  height: 10vh;
}

.gauge-chart {
  width: 14vw;
  height: 12vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notification-header {
  padding: 1vh 1vh 0 1vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>