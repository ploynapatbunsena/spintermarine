<template>
  <v-app>
    <NavigationBar />
    <SpaceBar />
    <v-container class="ma-0">
      <v-row :gutter="32" class="ml-6">
        <v-col cols="auto">
          <v-sheet class="pa-2 ma-2">
            <v-card
              class="mx-auto rounded-lg"
              max-width="300"
              max-height="300"
            >
              <v-img
                class=" text-white"
                height="300"
                width="300"
                :src="require('@/assets/Images/profile_barge.jpg')"
                cover
              >
                <div class="pa-4 align-start">
                  <v-img
                    :src="require('@/assets/Icons/sp_logo.svg')"
                    width="100"
                    height="44"
                    position="relative"
                  ></v-img>
                </div>
                <div class="text-bottom">
                  <v-card-title class="card-title">Barge</v-card-title>
                  <v-card-text class="align-end card-text">
                    <router-link :to="{ name: 'Barge' }" class="text-white text-decoration-none">Explore Now </router-link> 
                    <span class="material-symbols-rounded icon-size">arrow_outward</span>
                  </v-card-text>
                </div>
              </v-img>
            </v-card>
          </v-sheet>
        </v-col>
        <v-col cols="auto">
          <v-sheet class="pa-2 ma-2">
            <v-card
              class="mx-auto rounded-lg"
              max-width="300"
              max-height="300"
            >
              <v-img
                class="text-white"
                height="300"
                width="300"
                :src="require('@/assets/Images/profile_tugboat.jpg')"
                cover
              >
                <div class="pa-4 align-start">
                  <v-img
                    :src="require('@/assets/Icons/sp_logo.svg')"
                    width="100"
                    height="44"
                    position="relative"
                  ></v-img>
                </div>
                <div class="text-bottom">
                  <v-card-title class="card-title">Tugboat</v-card-title>
                  <v-card-text class="align-end card-text">
                    <router-link :to="{ name: 'Tugboat' }" class="text-white text-decoration-none">Explore Now </router-link> 
                    <span class="material-symbols-rounded icon-size">arrow_outward</span>
                  </v-card-text>
                </div>
              </v-img>
            </v-card>
          </v-sheet>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';

export default {
  name: 'Homepage',
  components: {
    NavigationBar,
    SpaceBar
  },
};
</script>

<style lang="scss">

.icon-size {
  font-size: 16px;
}

.text-bottom {
  position: absolute;
  bottom: 0;
}

.card-title {
  font-size: 32px; 
  font-weight: 500;
  padding-bottom: 0;
}

.card-text {
  font-size: 14px;
  margin-bottom: 10px;
}

.text-decoration-none {
  text-decoration: none;
}
</style>
