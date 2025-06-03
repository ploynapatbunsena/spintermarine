<template>
  <v-navigation-drawer
    width="350"
    v-model="open"
    permanent
  >
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
          <v-icon class="mx-3 icon" :class="getStatusClass(tugboat)">mdi-ferry</v-icon>
          <span>{{ deletePrefix(tugboat.DeviceName) }}</span>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';

const emit = defineEmits(['boat-selected', 'tugboat-data-loaded']);
const $api = inject('$api');
const $api_cmms = inject('$api_cmms');
const open_api_company = inject('open_api_company');
const open = ref(['']);
const selectedBoats = ref([]);
const selectedCategory = ref(null);
const selectedStatus = ref(null);
const tugboats = ref([]);
const isLoading = ref(false);

const categories = ['River Going', 'Sea Going'];
const statuses = ['Running', 'Maintenance', 'Pending', 'Down'];

const deletePrefix = (name) => {
  return name.replace(/Barge|Tugboat/gi, '').trim();
};

const fetchTugboats = async () => {
  try {
    isLoading.value = true;
    
    const [riverResponse, seaResponse] = await Promise.all([
      $api.get('/MachineStatus/GetTugboatRiver'),
      $api.get('/MachineStatus/GetTugboatSea')
    ]);
    
    const allTugboats = [
      ...riverResponse.data.flatMap(group => group.Devices),
      ...seaResponse.data.flatMap(group => group.Devices)
    ];

    const cmmsData = await fetchCMMSStatus(allTugboats);
    const processedData = processTugboatData(allTugboats, cmmsData);
    
    tugboats.value = processedData;
    emit('tugboat-data-loaded', processedData);
    
  } catch (error) {
    console.error('Error fetching tugboats:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchCMMSStatus = async (tugboats) => {
  try {
    const toolList = tugboats.map(tugboat => ({
      toolName: tugboat.Note
    }));
    
    const response = await $api_cmms.post(
      `/v1/companies/${open_api_company}/tools/last-status`, 
      { toolList }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch CMMS status:', error);
    return [];
  }
};

const processTugboatData = (tugboats, cmmsData) => {
  return tugboats.map(tugboat => {
    const cmmsStatus = cmmsData.find(item => 
      item.toolName === tugboat.Note
    );
    let status = 'Unknown';
    if (cmmsStatus) {
      status = mapCMMSStatus(cmmsStatus.status);
    }

    return {
      ...tugboat,
      status
    };
  });
};


const normalizeCategory = (typeVehicle) => {
  if (typeVehicle.includes('river')) return 'River Going';
  if (typeVehicle.includes('sea')) return 'Sea Going';
  return typeVehicle;
};

const filteredTugboats = computed(() => {
  return tugboats.value.filter(tugboat => {
    const categoryMatch = !selectedCategory.value || normalizeCategory(tugboat.TypeVehicle) === selectedCategory.value;
    const statusMatch = !selectedStatus.value || getStatusFromDevice(tugboat) === selectedStatus.value;
    return categoryMatch && statusMatch;
  });
});

const selectAll = computed({
  get: () => selectedBoats.value.length === filteredTugboats.value.length,
  set: (value) => {
    selectedBoats.value = value 
      ? filteredTugboats.value.map(tugboat => tugboat.DeviceId) 
      : [];
    emitSelectedBoats();
  }
});

const selectSome = computed(() => {
  return selectedBoats.value.length > 0 && selectedBoats.value.length < filteredTugboats.value.length;
});

const getStatusFromDevice = (device) => {
  const statusValue = device.Mesurement?.[0]?.Status || device.value?.find(v => v.Name === 'DeviceStatus')?.Value;
  return getStatusFromValue(statusValue);
};

const mapCMMSStatus = (cmmsStatus) => {
  switch (cmmsStatus) {
    case "ถูกใช้งานอยู่":
    case "พร้อมใช้งาน":
      return "Running";
    case "อยู่ระหว่างการสอบเทียบ":
      return "Pending";
    case "อยู่ระหว่างการซ่อม":
      return "Maintenance";
    case "ยกเลิกใช้งาน":
      return "Down";
    default:
      return 'Unknown';
  }
};

const getStatusFromValue = (value) => {
  switch(value?.toString()) {
    case '1': return 'Running';
    case '5': return 'Maintenance';
    case '0': return 'Unknown';
    default: return 'Unknown';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Running': return 'status-running';
    case 'Maintenance': return 'status-maintenance';
    case 'Pending': return 'status-pending';
    case 'Down': return 'status-down';
    default: return 'status-unknown';
  }
};

function toggleSelectAll() {
  selectAll.value = !selectAll.value;
}

function emitSelectedBoats() {
  emit('boat-selected', selectedBoats.value);
}

onMounted(() => {
  fetchTugboats();
});
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

.status-down {
  color: #000000;
}

.status-unknown {
  color: #C0C0C0;
}

.dropdown-list {
  background-color: #FFC107;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
}

.icon {
  border: #000000;
}
</style>