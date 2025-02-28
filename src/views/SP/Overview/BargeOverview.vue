<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container >
      <div class="title">Barge</div>
      <v-row class="mt-3">
        <v-col
          v-for="barge in barges"
          :key="barge.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card class="h-100" :to="{ name: 'BargeDetail', params: { id: barge.id } }">
            <v-row no-gutters>
              <!-- Barge Image -->
              <v-col cols="4">
                <v-img
                  :src="barge.image"
                  height="160"
                  cover
                  class="ma-2 rounded-lg"
                ></v-img>
              </v-col>
              <!-- Barge Details -->
              <v-col cols="8">
                <v-card-item>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <v-card-title class="px-0">{{ barge.name }}</v-card-title>
                      <v-card-subtitle class="px-0">{{ barge.nameThai }}</v-card-subtitle>
                    </div>
                    <div class="alert-icon">
                      <v-icon color="#DC2B2B" class="mr-1"><span class="material-symbols-rounded">notifications_active</span></v-icon>
                      <v-icon color="#FAC12A"><span class="material-symbols-rounded">warning</span></v-icon>
                    </div>
                  </div>
                  <!-- Status Numbers -->
                  <div class="d-flex mt-6 mb-0">
                    <div class="status-panel">
                      <div class="text-blue">Standby</div>
                      <div class="barge-value">{{ barge.standby }}</div>
                      <div class="bottom-line-blue"></div>
                    </div>
                    <div class="status-panel">
                      <div class="text-green">Running</div>
                      <div class="barge-value">{{ barge.running }}</div>
                      <div class="bottom-line-green"></div>
                    </div>
                    <div class="status-panel">
                      <div class="text-grey">Offline</div>
                      <div class="barge-value">{{ barge.offline }}</div>
                      <div class="bottom-line-grey"></div>
                    </div>
                    <div class="status-panel">
                      <div class="text-black">Maintenance</div>
                      <div class="barge-value">{{ barge.maintenance }}</div>
                      <div class="bottom-line-black"></div>
                    </div>
                  </div>
                </v-card-item>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue"
import SpaceBar from '@/components/SpaceBar.vue';
import { barges } from "@/data/config";

export default {
  name: "BargeOverview",
  components: {
    NavigationBar,
    SpaceBar,
  },
  data: () => ({
    barges
  })
}

</script>

<style lang="scss">

.v-card-title  {
  font-size: 24px;
  font-weight: 500;
}

.v-card-subtitle {
  font-family: 'Sarabun', serif;
}

.v-card {
  border-radius: 12px;
}

.v-card-item {
  padding: 16px;
}

.text-blue {
  color: #2196F3;
  font-size: 10px;
}

.text-green {
  color: #4CAF50;
  font-size: 10px;
}

.text-grey {
  color: #9E9E9E;
  font-size: 10px;
}

.text-black {
  font-size: 10px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
}

.bottom-line-blue {
  border: 1px solid #2196F3;
}

.bottom-line-green {
  border: 1px solid #4CAF50;
}

.bottom-line-grey {
  border: 1px solid #9E9E9E;
}

.bottom-line-black {
  border: 1px solid #000000;
}

.material-symbols-rounded {
  font-size: 24px;

  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

.alert-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-panel {
  width: 75px;
  margin: 4px;
}

.barge-value {
  font-family: 'Inter', serif;
  font-size: 21px;
  font-weight: 600;
}

</style>