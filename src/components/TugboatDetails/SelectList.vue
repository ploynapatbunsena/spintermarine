<template>
  <v-navigation-drawer width="350" v-model="open">
    <v-list>
      <v-list-item class="py-4 ml-6 title" title="Tugboat"></v-list-item>
      <v-divider></v-divider>
      <v-list-item
        v-for="tugboat in tugboats"
        :key="tugboat.id"
        class="d-flex align-center py-3 ml-6"
        @click="selectSingleBoat(tugboat.id)"
        :class="{ 'selected-boat': selectedBoats === tugboat.id }"
      >
        <template v-slot:prepend>
          <v-checkbox
            :value="tugboat.id"
            v-model="selectedBoats"
            @change="emitSelectedBoats"
            density="compact"
            hide-details
          ></v-checkbox>
        </template>
        <div class="d-flex align-center">
          <v-icon class="mx-3" :class="getStatusClass(tugboat.status)"
            >mdi-ferry</v-icon
          >
          <span>{{ tugboat.name }}</span>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from "vue"
import { tugboats } from "@/config/config"

const props = defineProps({
  initialSelectedBoat: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(["boat-selected"])

const open = ref(true)
const selectedBoats = ref(null)

const getStatusClass = (status) => {
  switch (status) {
    case "Running":
      return "status-running"
    case "Maintenance":
      return "status-maintenance"
    case "Pending":
      return "status-pending"
    default:
      return ""
  }
}

const selectSingleBoat = (boatId) => {
  // เปลี่ยนการเลือกเรือเมื่อมีการคลิก
  selectedBoats.value = selectedBoats.value === boatId ? null : boatId
  emitSelectedBoats()
}

const emitSelectedBoats = () => {
  emit("boat-selected", selectedBoats.value)
}

watch(
  () => props.initialSelectedBoat,
  (newVal) => {
    if (newVal) {
      selectedBoats.value = newVal
      emitSelectedBoats()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
:deep(.v-list-item-title) {
  font-size: 20px;
  font-weight: 500;
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

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}
</style>
