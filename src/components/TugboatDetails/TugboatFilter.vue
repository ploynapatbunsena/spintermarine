<template>
  <v-navigation-drawer
    width="350"
    v-model="open"
  >
    <!-- Dropdown List -->
    <div class="pa-4 dropdown-list">
      <div class="d-flex justify-space-between align-center">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="All Type"
          variant="plain"
          class="mr-2 dropdown-custom"
          clearable
          hide-details
          density="compact"
          style="width: 48%"
        ></v-select>
        
        <v-select
          v-model="selectedStatus"
          :items="statuses"
          label="All Status"
          variant="plain"
          class="dropdown-custom"
          clearable
          hide-details
          density="compact"
          style="width: 48%"
        ></v-select>
      </div>
    </div>

    <v-divider></v-divider>

    <v-list>
      <!-- Select All -->
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
        <div class="ml-2 font">Select All</div>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Tugboat List -->
      <v-list-item
        v-for="tugboat in filteredTugboats"
        :key="tugboat.id"
        class="d-flex align-center py-3 ml-6"
      >
        <template v-slot:prepend>
          <v-checkbox 
            v-model="selectedBoats" 
            :value="tugboat.id" 
            density="compact" 
            hide-details
            @change="emitSelectedBoats"
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
import { tugboats } from '@/data/config';

export default {
  name: "TugboatFilter",
  data: () => ({
    open: [''],
    tugboats,
    selectedBoats: [],
    selectedCategory: null,
    selectedStatus: null,
    categories: ['River', 'Sea'],
    statuses: ['Running', 'Maintenance', 'Pending'],
  }),
  computed: {
    filteredTugboats() {
      return this.tugboats.filter(tugboat => {
        const categoryMatch = !this.selectedCategory || tugboat.category === this.selectedCategory;
        const statusMatch = !this.selectedStatus || tugboat.status === this.selectedStatus;
        return categoryMatch && statusMatch;
      });
    },
    selectAll: {
      get() {
        return this.selectedBoats.length === this.filteredTugboats.length;
      },
      set(value) {
        if (value) {
          this.selectedBoats = this.filteredTugboats.map(tugboat => tugboat.id);
        } else {
          this.selectedBoats = [];
        }
        this.emitSelectedBoats();
      }
    },
    selectSome() {
      return this.selectedBoats.length > 0 && this.selectedBoats.length < this.filteredTugboats.length;
    },
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
    toggleSelectAll() {
      this.selectAll = !this.selectAll;
    },
    emitSelectedBoats() {
      this.$emit('boat-selected', this.selectedBoats);
    }
  }
}
</script>

<style lang="scss" scoped>


.dropdown-custom .v-field {
  background-color: #FFC107 !important;
}

.dropdown-custom .v-field__input {
  color: black !important;
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

.dropdown-list {
  background-color: #FFC107;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}
</style>