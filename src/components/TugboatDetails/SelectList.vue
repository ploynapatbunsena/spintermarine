<template>
  <v-navigation-drawer
    width="350"
    v-model="open"
  >
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
            <v-icon class="mx-3" :class="getStatusClass(tugboat.status)">mdi-ferry</v-icon>
            <span>{{ tugboat.name }}</span>
          </div>
        </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { tugboats } from "@/data/config";

export default {
  name: "SelectList",

  props: {
    // เพิ่ม prop เพื่อรับค่าเรือที่ควรเลือกเริ่มต้น
    initialSelectedBoat: {
      type: String,
      default: null
    }
  },

  data: () => ({
    open: true,
    tugboats,
    selectedBoats: null,
  }),

  watch: {
    initialSelectedBoat: {
      immediate: true, // ทำงานทันทีเมื่อค่า initialSelectedBoat เปลี่ยนแปลง
      handler(newVal) {
        if (newVal) {
          this.selectedBoats = newVal;
          this.emitSelectedBoats();
        }
      }
    }
  },

  methods: {
    getStatusClass(status) {
      switch (status) {
        case "Running":
          return "status-running";
        case "Maintenance":
          return "status-maintenance";
        case "Pending":
          return "status-pending";
        default:
          return "";
      }
    },

    selectSingleBoat(boatId) {
      // เปลี่ยนการเลือกเรือเมื่อมีการคลิก
      this.selectedBoats = this.selectedBoats === boatId ? null : boatId;
      this.emitSelectedBoats();
    },
    
    emitSelectedBoats() {
      this.$emit('boat-selected', this.selectedBoats);
    }
  }
};
</script>

<style scoped>
:deep(.v-list-item-title){
  font-size: 20px;
  font-weight: 500;
}

.status-maintenance {
  color: #DC2B2B;
}

.status-pending {
  color: #FAC12A;
}

.status-running {
  color: #009688;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}
</style>