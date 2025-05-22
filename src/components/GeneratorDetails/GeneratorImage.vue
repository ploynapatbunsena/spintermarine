<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" lg="6">
        <v-row>
          <v-col cols="12">
            <p class="header">Total Fuel ALL</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="d-flex align-center">
            <p class="value">{{ measurements?.['Total Fuel ALL']?.value || '0' }}</p>
            <p class="unit">{{ measurements?.['Total Fuel ALL']?.unit || 'L' }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p class="header">Fuel Rate</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="d-flex align-center">
            <p class="value">{{ measurements?.['Fuel Rate']?.value || '0' }}</p>
            <p class="unit">{{ measurements?.['Fuel Rate']?.unit || 'L/hr' }}</p>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6" lg="6">
        <v-img
          :src="require('@/assets/Images/generator_green.png')"
          class="generator-image"
        >
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

defineProps({
  measurements: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.data-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  margin-left: 48px;
}

.value-unit {
  display: flex;
  align-items: flex-end;
}

.generator-image {
  max-width: 100%;
  max-height: 100%;
}

.header {
  font-size: 2vh;
  color: var(--white);
}

.value {
  font-family: 'Inter', sans-serif;
  font-size: 6vh;
  font-weight: 600;
  margin-right: 2vw;
  color: var(--text-gen);
}

.unit {
  font-size: 4vh;
  font-weight: 300;
  color: var(--white);
}
</style>