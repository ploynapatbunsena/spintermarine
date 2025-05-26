<template>
  <v-badge
    :content="dangerCount"
    :color="dangerCount > 0 ? '#DC2B2B' : '#C0C0C0'"
    overlap
    class="alert-badge"
  >
    <v-icon style="font-size: 2vh;">mdi-bell-ring</v-icon>
  </v-badge>
  <v-badge
    :content="warningCount"
    :color="warningCount > 0 ? '#FAC12A' : '#C0C0C0'"
    overlap
    class="warning-badge"
  >
    <v-icon style="font-size: 2vh;">mdi-alert</v-icon>
  </v-badge>
</template>

<script setup>
import { defineProps } from "vue"

defineProps({
  warningCount: {
    type: Number,
    required: true,
  },
  dangerCount: {
    type: Number,
    required: true,
  }
});
</script>

<style lang="scss" scoped>
.alert-badge {
  color: #DC2B2B;
  margin-right: 2vh;
  cursor: pointer;
}

.warning-badge {
  color: #FAC12A;
  cursor: pointer;
}

@media (min-width: 2560px) {
  :deep(.v-badge__badge) {
    font-size: 1vh;
    padding: 12px;
    border-radius: 24px;
  }
}

:deep(.v-badge__badge) {
  border: 2px solid #FFFFFF;
  font-weight: bold !important;
  font-family: 'Inter', sans-serif;
}
</style>
