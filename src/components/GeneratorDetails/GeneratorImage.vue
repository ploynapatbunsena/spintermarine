<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <div class="data-item">
          <p class="header">Total Flow</p>
          <div class="value-unit">
            <p class="value">11.06</p>
            <p class="unit">m³</p>
          </div>
        </div>
        <div class="data-item">
          <p class="header">Fuel Rate</p>
          <div class="value-unit">
            <p class="value">0</p>
            <p class="unit">m³/h</p>
          </div>
        </div>
      </v-col>
      <v-col cols="6">
        <v-img
          :src="require('@/assets/Images/generator_green.png')"
          class="generator-image"
        >
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'GeneratorInfo',
}
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
  width: 100%;
  height: 100%;
}

.header {
  font-size: 20px;
  color: var(--white);
}

.value {
  font-family: 'Inter', sans-serif;
  font-size: 64px;
  font-weight: 600;
  color: var(--text-gen);
}

.unit {
  font-size: 56px;
  font-weight: 300;
  margin-left: 24px;
  color: var(--white);
}
</style>