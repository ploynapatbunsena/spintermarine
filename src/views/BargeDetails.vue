<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container>
      <v-row v-if="barge">
        <div class="title my-16">{{ barge.name }}</div>
        <v-col cols="12">
          <v-card elevation="0" class="background">
            <v-row>
              <v-col
                v-for="item in barge.items"
                :key="item.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <v-card 
                  class="rounded-lg" 
                  @click="goToItemDetail(item.id)"
                >
                  <v-row no-gutters>
                    <v-col>
                      <v-card-title>{{ item.title }}</v-card-title>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <router-view />
    </v-container>
  </v-app>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import { barges } from '@/data/config';

export default {
  props: ['id'],
  components: {
    NavigationBar,
    SpaceBar,
  },

  computed: {
    barge() {
      return barges.find(barge => barge.id === this.id) || null;
    }
  },

  methods: {
    goToItemDetail(itemId) {
      this.$router.push(`/Barge/${this.id}/${itemId}`);
    }
  }
}
</script>
