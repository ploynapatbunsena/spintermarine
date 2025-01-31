<template>
  <v-app style="background-color: #EFEBE9;">
    <NavigationBar />
    <SpaceBar />
    <v-container>
      <div class="title">
        Smart Environment Dashboard
      </div>
      <v-card class="d-flex align-center mt-6" width="1744" height="796" elevation="0" rounded="lg  ">
        <v-img
          :src="require(`@/assets/Images/${currentImage}`)"
          class="floor-plan position-relative"
        >
          <!-- Button Zone01 -->
          <div class="position-absolute button-container-zone01">
            <v-btn
              width="370px"
              height="224px"
              color="#FFF59D"
              variant="plain"
              size="x-large"
              @click="handleButtonClick"
            >
            </v-btn>
          </div>

          <!-- Dialog -->
          <v-fade-transition hide-on-leave>
            <div v-if="dialog_01" class="dialog-container-zone01">
              <v-card
                v-if="dialog_01"
                append-icon="$close"
                class="dialog-card"
                elevation="0"
                rounded="xl"
                max-width="500"
                title="Zone 1"
                style="background-color: #FFF; border: 4px solid #F9F9FA;"
              >
                <template v-slot:append>
                  <v-btn icon="$close" variant="text" @click="dialog_01 = false"></v-btn>
                </template>
                <!-- <v-divider></v-divider> -->
                <div>
                  <v-row no-gutters>
                    <v-col cols="6" class="d-flex align-center">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#FAC12A"
                        size="24"
                      ><span class="material-symbols-outlined">offline_bolt</span></v-icon>
                      <p class="ml-2 detail">200 kWh</p>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#00B8F2"
                        size="24"
                      ><span class="material-symbols-outlined">water_drop</span></v-icon>
                      <p class="ml-2 detail">42%</p>
                    </v-col>
                  </v-row>

                  <v-row no-gutters >
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#1570EF"
                        size="24"
                      ><span class="material-symbols-outlined">device_thermostat</span></v-icon>
                      <p class="ml-2 detail">200 kWh</p>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#313131"
                        size="24"
                      ><span class="material-symbols-outlined">heat</span></v-icon>
                      <p class="ml-2 detail">12 ppb</p>
                    </v-col>
                  </v-row>

                  <v-row no-gutters >
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#00000"
                        size="24"
                      ><span class="material-symbols-outlined">face</span></v-icon>
                      <p class="ml-2 detail">200</p>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#979797"
                        size="24"
                      ><span class="material-symbols-outlined">filter_drama</span></v-icon>
                      <p class="ml-2 detail">201 ppm</p>
                    </v-col>
                  </v-row>

                  <v-row no-gutters >
                    <v-col class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#D9D9D9"
                        size="24"
                      ><span class="material-symbols-outlined">grain</span></v-icon>
                      <p class="ml-2 detail">23.0 µg/m³</p>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </div>
          </v-fade-transition>

          <!-- Button Zone02 -->
          <div class="position-absolute button-container">
            <v-btn
              width="376px"
              height="290px"
              color="#C8E6C9"
              variant="plain"
              size="x-large"
              @click="dialog = !dialog"
            >
            </v-btn>
          </div>

          <!-- Dialog -->
          <v-fade-transition hide-on-leave>
            <div v-if="dialog" class="dialog-container-zone02">
              <v-card
                v-if="dialog"
                append-icon="$close"
                class="dialog-card"
                elevation="0"
                rounded="xl"
                max-width="500"
                title="Zone 2"
                style="background-color: #FFF; border: 4px solid #F9F9FA;"
              >
                <template v-slot:append>
                  <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
                </template>
                <!-- <v-divider></v-divider> -->
                <div>
                  <v-row no-gutters>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#FAC12A"
                        size="24"
                      ><span class="material-symbols-outlined">offline_bolt</span></v-icon>
                      <p class="ml-2 detail">200 kWh</p>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#00B8F2"
                        size="24"
                      ><span class="material-symbols-outlined">water_drop</span></v-icon>
                      <p class="ml-2 detail">42%</p>
                    </v-col>
                  </v-row>

                  <v-row no-gutters >
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#1570EF"
                        size="24"
                      ><span class="material-symbols-outlined">device_thermostat</span></v-icon>
                      <p class="ml-2 detail">200 kWh</p>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#313131"
                        size="24"
                      ><span class="material-symbols-outlined">heat</span></v-icon>
                      <p class="ml-2 detail">12 ppb</p>
                    </v-col>
                  </v-row>

                  <v-row no-gutters >
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#00000"
                        size="24"
                      ><span class="material-symbols-outlined">face</span></v-icon>
                      <p class="ml-2 detail">200</p>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#979797"
                        size="24"
                      ><span class="material-symbols-outlined">filter_drama</span></v-icon>
                      <p class="ml-2 detail">201 ppm</p>
                    </v-col>
                  </v-row>

                  <v-row no-gutters >
                    <v-col class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#D9D9D9"
                        size="24"
                      ><span class="material-symbols-outlined">grain</span></v-icon>
                      <p class="ml-2 detail">23.0 µg/m³</p>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </div>
          </v-fade-transition>

          <!-- Button Zone03 -->
          <div class="position-absolute button-container-zone03">
            <v-btn
              width="280px"
              height="220px"
              color="#C8E6"
              variant="plain"
              size="x-large"
              @click="dialog_02 = !dialog_02"
            >
            </v-btn>
          </div>

          <!-- Dialog -->
          <v-fade-transition hide-on-leave>
            <div v-if="dialog_02" class="dialog-container-zone03">
              <v-card
                v-if="dialog_02"
                append-icon="$close"
                class="dialog-card"
                elevation="0"
                rounded="xl"
                max-width="500"
                title="Zone 3"
                style="background-color: #FFF; border: 4px solid #F9F9FA;"
              >
                <template v-slot:append>
                  <v-btn icon="$close" variant="text" @click="dialog_02 = false"></v-btn>
                </template>
                <!-- <v-divider></v-divider> -->
                <div>
                  <v-row no-gutters>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#FAC12A"
                        size="24"
                      ><span class="material-symbols-outlined">offline_bolt</span></v-icon>
                      <p class="ml-2 detail">200 kWh</p>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#00B8F2"
                        size="24"
                      ><span class="material-symbols-outlined">water_drop</span></v-icon>
                      <p class="ml-2 detail">42%</p>
                    </v-col>
                  </v-row>

                  <v-row no-gutters >
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#1570EF"
                        size="24"
                      ><span class="material-symbols-outlined">device_thermostat</span></v-icon>
                      <p class="ml-2 detail">200 kWh</p>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#313131"
                        size="24"
                      ><span class="material-symbols-outlined">heat</span></v-icon>
                      <p class="ml-2 detail">12 ppb</p>
                    </v-col>
                  </v-row>

                  <v-row no-gutters >
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#00000"
                        size="24"
                      ><span class="material-symbols-outlined">face</span></v-icon>
                      <p class="ml-2 detail">200</p>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#979797"
                        size="24"
                      ><span class="material-symbols-outlined">filter_drama</span></v-icon>
                      <p class="ml-2 detail">201 ppm</p>
                    </v-col>
                  </v-row>

                  <v-row no-gutters >
                    <v-col class="d-flex">
                      <v-icon
                        class="mb-6 ml-4"
                        color="#D9D9D9"
                        size="24"
                      ><span class="material-symbols-outlined">grain</span></v-icon>
                      <p class="ml-2 detail">23.0 µg/m³</p>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </div>
          </v-fade-transition>

        </v-img>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue";
import SpaceBar from "@/components/SpaceBar.vue";
import { ref } from "vue";

export default {
  components: {
    NavigationBar,
    SpaceBar,
  },
  data() {
    return {
      currentImage: "FloorPlane1.jpg", // รูปเริ่มต้น
      dialog_01: false, // ค่าเริ่มต้นของ dialog
    };
  },
  methods: {
    handleButtonClick() {
      // สลับค่า dialog_01
      this.dialog_01 = !this.dialog_01;

      // สลับภาพระหว่าง FloorPlane1.jpg และ FloorPlane2.jpg
      this.currentImage =
        this.currentImage === "FloorPlane1.jpg"
          ? "profile_tugboat.jpg"
          : "FloorPlane1.jpg";
    },
  },
  setup() {
    const dialog = ref(false);
    // const dialog_01 = ref(false);
    const dialog_02 = ref(false);

    return {
      dialog,
      // dialog_01,
      dialog_02,
    };
  },
};
</script>

<style>

.detail {
  font-size: 20px;
  font-weight: 500;
}

.dialog-container-zone01 {
  position: absolute;
  top: 65%;
  right: 5%;
  transform: translate(0, -50%);
  z-index: 20;
}

.dialog-container-zone02 {
  position: absolute;
  top: 25%;
  left: 100px;
  transform: translate(0, -50%);
  z-index: 20;
}

.dialog-container-zone03 {
  position: absolute;
  top: 75%;
  left: 100px;
  transform: translate(0, -50%);
  z-index: 20;
}

.dialog-card {
  width: 300px;
}

.material-symbols-outlined {
  font-size: 32px;

  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

.title {
  display: flex;
  align-items: center;
  justify-content: start;
  font-size: 24px;
  font-weight: 500;
}

.floor-plan {
  display: flex;
  align-items: start;
  justify-content: center;
  width: 865px;
  height: 578px;
}

.button-container {
  top: 27%;
  left: 36.5%;
  transform: translate(-50%, -50%);
  z-index: 10;
  position: absolute;
}

.button-container-zone03 {
  top: 71%;
  left: 34%;
  transform: translate(-50%, -50%);
  z-index: 10;
  position: absolute;
}

.button-container-zone01 {
  top: 65%;
  left: 58%;
  transform: translate(-50%, -50%);
  z-index: 10;
  position: absolute;
}

</style>
