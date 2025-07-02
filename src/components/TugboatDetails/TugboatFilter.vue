<template>
  <v-btn
    v-if="$vuetify.display.smAndDown"
    icon="mdi-menu"
    class="menu-button"
    @click="open = !open"
    color="white"
    variant="elevated"
  ></v-btn>
  <div
    class="filter-container"
    :class="{ hidden: $vuetify.display.smAndDown && !open }"
  >
    <v-navigation-drawer
      v-model="open"
      :temporary="$vuetify.display.smAndDown"
      :width="$vuetify.display.width > 2560 ? 800 : 350"
      :permanent="!$vuetify.display.smAndDown"
    >
      <v-row class="dropdown-list">
        <v-col cols="6">
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="All Type"
            variant="plain"
            class="mr-2 dropdown-custom"
            clearable
            hide-details
            density="compact"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="selectedStatus"
            :items="statuses"
            label="All Status"
            variant="plain"
            class="dropdown-custom"
            clearable
            hide-details
            density="compact"
          ></v-select>
        </v-col>
      </v-row>

      <v-list>
        <v-list-item class="d-flex align-center py-3 ml-6">
          <template v-slot:prepend>
            <v-checkbox
              v-model="selectAll"
              :indeterminate="selectSome && !selectAll"
              density="compact"
              hide-details
              @click="toggleSelectAll"
            ></v-checkbox>
          </template>
          <div class="ml-2">Select All</div>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="tugboat in filteredTugboats"
          :key="tugboat.DeviceId"
          class="d-flex align-center py-3 ml-6"
        >
          <template v-slot:prepend>
            <v-checkbox
              v-model="selectedBoats"
              :value="tugboat.DeviceId"
              density="compact"
              hide-details
              @change="emitSelectedBoats"
            ></v-checkbox>
          </template>
          <div class="d-flex align-center">
            <v-icon class="mx-3 icon" :class="getStatusClass(tugboat)"
              >mdi-ferry</v-icon
            >
            <span style="font-family: 'Sarabun', sans-serif">{{
              deletePrefix(tugboat.DeviceLabel)
            }}</span>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue"

const emit = defineEmits(["boat-selected", "tugboat-data-loaded"])
const $api = inject("$api")
const $api_fac = inject("$api_fac")
// const $api_cmms = inject('$api_cmms');
// const open_api_company = inject('open_api_company');
const open = ref([""])
const selectedBoats = ref([])
const selectedCategory = ref(null)
const selectedStatus = ref(null)
const tugboats = ref([])
const isLoading = ref(false)

const categories = ["River Going", "Sea Going"]
const statuses = ["Running", "Maintenance", "Pending"]

const deletePrefix = (name) => {
  return name.replace(/Barge|Tugboat/gi, "").trim()
}

const fetchTugboats = async () => {
  try {
    isLoading.value = true

    const [riverResponse, seaResponse] = await Promise.all([
      $api.get("/MachineStatus/GetTugboatRiver"),
      $api.get("/MachineStatus/GetTugboatSea"),
    ])

    const allTugboats = [
      ...riverResponse.data.flatMap((group) => group.Devices),
      ...seaResponse.data.flatMap((group) => group.Devices),
    ]
    const cmmsData = await fetchCMMSStatus(allTugboats)
    const processedData = processTugboatData(allTugboats, cmmsData)
    // console.log('Processed Tugboats:', processedData);

    tugboats.value = processedData
    emit("tugboat-data-loaded", processedData)
  } catch (error) {
    console.error("Error fetching tugboats:", error)
  } finally {
    isLoading.value = false
  }
}

const fetchCMMSStatus = async (tugboats) => {
  try {
    const statusPromises = tugboats.map(async (tugboat) => {
      const deviceNote = tugboat?.Note
      if (!deviceNote) return null

      try {
        const response = await $api_fac.get("/ship-status", {
          params: { name: deviceNote },
        })
        const statusData = response.data.data
        const mappedStatus = mapFctoriumStatus(statusData)
        // console.log(`Fetched status for ${deviceNote}:`, mappedStatus);

        return {
          name: deviceNote,
          status: mappedStatus,
        }
      } catch (error) {
        console.error(`Error fetching status for ${deviceNote}:`, error)
        return null
      }
    })

    const statusResults = await Promise.all(statusPromises)
    return statusResults.filter((result) => result !== null)
  } catch (error) {
    console.error("❌ Factorium [Vessel] Test Failed:", error)
    return []
  }
}

const processTugboatData = (tugboats, factoriumStatus) => {
  return tugboats.map((tugboat) => {
    const deviceNote = tugboat?.Note

    const facStatus = factoriumStatus.find((item) => item.name === deviceNote)

    let status = "Unknown"

    if (facStatus) {
      status = facStatus.status
    }

    return {
      ...tugboat,
      status,
    }
  })
}

const normalizeCategory = (typeVehicle) => {
  if (typeVehicle.includes("river")) return "River Going"
  if (typeVehicle.includes("sea")) return "Sea Going"
  return typeVehicle
}

const filteredTugboats = computed(() => {
  return tugboats.value.filter((tugboat) => {
    const categoryMatch =
      !selectedCategory.value ||
      normalizeCategory(tugboat.TypeVehicle) === selectedCategory.value
    const statusMatch =
      !selectedStatus.value || tugboat.status === selectedStatus.value
    // console.log('Filtering tugboat:', {
    //   DeviceId: tugboat.DeviceId,
    //   Category: normalizeCategory(tugboat.TypeVehicle),
    //   Status: tugboat.status,
    //   CategoryMatch: categoryMatch,
    //   StatusMatch: statusMatch
    // });

    return categoryMatch && statusMatch
  })
})

const selectAll = computed({
  get: () => selectedBoats.value.length === filteredTugboats.value.length,
  set: (value) => {
    selectedBoats.value = value
      ? filteredTugboats.value.map((tugboat) => tugboat.DeviceId)
      : []
    emitSelectedBoats()
  },
})

const selectSome = computed(() => {
  return (
    selectedBoats.value.length > 0 &&
    selectedBoats.value.length < filteredTugboats.value.length
  )
})

const mapFctoriumStatus = (factoriumStatus) => {
  switch (factoriumStatus) {
    case "ใช้งานได้":
    case "ใช้งานอยู่":
      return "Running"
    case "รอเข้าซ่อมวิ่งได้":
    case "รอเข้าซ่อมวิ่งไม่ได้":
    case "จอง":
      return "Pending"
    case "ซ่อม":
    case "ใช้งานไม่ได้":
    case "เติมน้ำมัน":
    case "หมดอายุ":
    case "หมดอายุแล้ว":
      return "Maintenance"
    default:
      return "Unknown"
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case "Running":
      return "status-running"
    case "Maintenance":
      return "status-maintenance"
    case "Pending":
      return "status-pending"
    // case 'Down': return 'status-down';
    default:
      return "status-unknown"
  }
}

function toggleSelectAll() {
  selectAll.value = !selectAll.value
}

function emitSelectedBoats() {
  emit("boat-selected", selectedBoats.value)
}

onMounted(() => {
  fetchTugboats()
})
</script>

<style lang="scss" scoped>
:deep(.dropdown-custom .v-field__input) {
  font-size: 1.5vh;
}

:deep(.dropdown-custom .v-label) {
  font-size: 1.2vh;
}

:deep(.dropdown-custom .v-select__selection) {
  margin-top: 1.5vh;
  font-size: 1.5vh;
}

:deep(.v-select__content .v-list-item) {
  font-size: 1.5vh;
}

.status-maintenance {
  color: #dc2b2b;
}
.status-pending {
  color: #fac12a;
}
.status-running {
  color: #009688;
}

.status-down {
  color: #000000;
}

.status-unknown {
  color: #c0c0c0;
}

.dropdown-list {
  background-color: #ffc107;
  padding: 1vh;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}

.icon {
  border: #000000;
}

@media (min-width: 2560px) {
  :deep(.v-list-item) {
    font-size: 1.5vh !important;
    padding: 1vh;
  }

  :deep(.v-checkbox .v-selection-control) {
    font-size: 1.5vh !important;
    padding: 1vh;
  }
}

.menu-button {
  position: fixed;
  top: 72px;
  left: 16px;
  z-index: 600;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
