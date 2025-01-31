<template>
  <v-container>
    <v-card class="rounded-lg pa-4" v-if="barge && item">
      <v-card-title>{{ item.title }}</v-card-title>
      <v-card-text>
        <p><strong>อยู่ใน: </strong> {{ barge.name }}</p>
        <p><strong>รหัส: </strong> {{ item.id }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="$router.push(`/barge/${barge.id}`)">
          กลับไป
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-text>ไม่พบข้อมูล</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { barges } from '@/data/config'

export default {
  props: ['id', 'itemId'],
  computed: {
    barge() {
      return barges.find(barge => barge.id === this.id) || null
    },
    item() {
      return this.barge?.items.find(item => item.id === this.itemId) || null
    }
  }
}
</script>
