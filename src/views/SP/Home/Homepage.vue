<template>
  <v-app style="background-color: #f7f9fc">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <v-row>
        <v-col cols="6" sm="4" lg="2">
          <v-card class="rounded-xl">
            <v-img
              class="text-white"
              :src="require('@/assets/Images/profile_barge.jpg')"
              cover
            >
              <div class="pa-4 align-start">
                <v-img
                  :src="require('@/assets/Icons/sp_logo.svg')"
                  style="width: 5vw; position: relative"
                ></v-img>
              </div>
              <div class="text-bottom">
                <v-card-title class="card-title">Barge</v-card-title>
                <v-card-text class="align-end card-text">
                  <router-link
                    :to="{ name: 'Barge' }"
                    class="text-white text-decoration-none"
                    >Explore Now
                  </router-link>
                  <span class="material-symbols-rounded icon-size"
                    >arrow_outward</span
                  >
                </v-card-text>
              </div>
            </v-img>
          </v-card>
        </v-col>
        <v-col cols="6" sm="4" lg="2">
          <v-card class="rounded-xl">
            <v-img
              class="text-white"
              :src="require('@/assets/Images/profile_tugboat.jpg')"
              cover
            >
              <div class="pa-4 align-start">
                <v-img
                  :src="require('@/assets/Icons/sp_logo.svg')"
                  style="width: 5vw; position: relative"
                ></v-img>
              </div>
              <div class="text-bottom">
                <v-card-title class="card-title">Tugboat</v-card-title>
                <v-card-text class="align-end card-text">
                  <router-link
                    :to="{ name: 'Tugboat' }"
                    class="text-white text-decoration-none"
                    >Explore Now
                  </router-link>
                  <span class="material-symbols-rounded icon-size"
                    >arrow_outward</span
                  >
                </v-card-text>
              </div>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue"
import SpaceBar from "@/components/SpaceBar.vue"
import { inject, onMounted } from "vue"
import { useRouter } from "vue-router"

const $api = inject("$api")
const router = useRouter()

const initialize = async () => {
  const menuPermission = localStorage.getItem("menuPermission")
  if (!menuPermission) {
    return router.push("/Homepage")
  }

  const permissionList = JSON.parse(menuPermission)
  const permission = permissionList.find((item) => item.MenuId === "0101010000")

  if (!permission || !permission.IsActive) {
    return router.push("/Homepage")
  }
}

const getAllTugboatDevices = async () => {
  try {
    const [riverResponse, seaResponse] = await Promise.all([
      $api.get("/MachineStatus/GetTugboatRiver"),
      $api.get("/MachineStatus/GetTugboatSea"),
    ])

    const tugboatData = [...riverResponse.data, ...seaResponse.data]
    const allDevices = tugboatData.flatMap((item) => item.Devices)

    return allDevices
  } catch (err) {
    console.error("Failed to fetch tugboat data:", err)
    throw err
  }
}

const checkPermission = async () => {
  const memberPermission = localStorage.getItem("member")
  const memberPermissionList = JSON.parse(memberPermission)

  const position = memberPermissionList.Position
  const noteVisitor = memberPermissionList.Note

  // Supervisor
  if (position === "Barge Supervisor") {
    return router.push({ name: "Barge" })
  } else if (position === "Tugboat Supervisor") {
    return router.push({ name: "Tugboat" })

    // Barge Sections
  } else if (position.startsWith("Barge ")) {
    return router.push({
      name: "BargeDetail",
      params: { typeDeviceName: position },
    })
  }

  // Visitor Section
  else if (position === "Visitor") {
    if (!noteVisitor) {
      console.error("No Note found for Visitor")
      return router.push("/Homepage")
    }

    try {
      const allDevices = await getAllTugboatDevices()
      const noteDevices = noteVisitor.split(",").map((item) => item.trim())

      const matchedDevices = allDevices.filter((device) =>
        noteDevices.includes(device.TypeDevicename),
      )

      if (matchedDevices.length > 0) {
        const deviceIds = matchedDevices.map((device) => device.DeviceId)

        return router.push({
          name: "JobTracking",
          params: { deviceId: deviceIds.join(",") },
        })
      } else {
        console.error("No matching devices found for Visitor Note")
        return router.push("/Homepage")
      }
    } catch (error) {
      console.error("Error processing Visitor devices:", error)
      return router.push("/Homepage")
    }
  }

  // Tugboat Sections (for non-Visitor positions)
  try {
    const allDevices = await getAllTugboatDevices()
    const matchedDevice = allDevices.find(
      (device) => device.DeviceName === position,
    )

    if (matchedDevice) {
      return router.push({
        name: "TugboatDetail",
        params: { deviceId: matchedDevice.DeviceId },
      })
    } else {
      return router.push("/Homepage")
    }
  } catch (error) {
    return router.push("/Homepage")
  }
}

onMounted(async () => {
  initialize()
  await getAllTugboatDevices()
  checkPermission()
})
</script>

<style scoped lang="scss">
.icon-size {
  font-size: 1vh;
}

.text-bottom {
  position: absolute;
  bottom: 0;
}

.card-title {
  font-size: 3vh;
  font-weight: 500;
  padding-bottom: 0;
}

.card-text {
  font-size: 1vh;
}

.text-decoration-none {
  text-decoration: none;
}
</style>
