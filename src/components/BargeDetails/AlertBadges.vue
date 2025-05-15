<template>
  <v-badge
    :content="dangerCount"
    :color="dangerCount > 0 ? '#DC2B2B' : '#C0C0C0'"
    overlap
    class="alert-badge"
  >
    <v-icon style="font-size: 2.5vh;">mdi-bell-ring</v-icon>
  </v-badge>
  <v-badge
    :content="warningCount"
    :color="warningCount > 0 ? '#FAC12A' : '#C0C0C0'"
    overlap
    class="warning-badge"
  >
    <v-icon style="font-size: 2.5vh;">mdi-alert</v-icon>
  </v-badge>
</template>

<script setup>
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
  margin-right: 3vh;
  cursor: pointer;

  :deep(.v-badge__badge) {
    border: 2px solid #FFFFFF;
    font-weight: bold !important;
    font-family: 'Inter', sans-serif;
  }
}

.warning-badge {
  color: #FAC12A;
  margin-right: 2vh;
  cursor: pointer;

  :deep(.v-badge__badge) {
    border: 2px solid #FFFFFF;
    font-weight: bold;
    font-family: 'Inter', sans-serif;
  }
}
</style>
