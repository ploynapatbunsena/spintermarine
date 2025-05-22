<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <v-row>
        <v-col cols="6" sm="4" lg="2">
          <v-sheet class="pa-2 ma-2">
            <v-card class="rounded-lg" >
              <v-img
                class="text-white"
                :src="require('@/assets/Images/profile_barge.jpg')"
                cover
              >
                <div class="pa-4 align-start">
                  <v-img
                    :src="require('@/assets/Icons/sp_logo.svg')"
                    style="width: 5vw; position: relative;"
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
        <v-col cols="6" sm="4" lg="2">
          <v-sheet class="pa-2 ma-2">
            <v-card class="rounded-lg" >
              <v-img
                class="text-white"
                :src="require('@/assets/Images/profile_tugboat.jpg')"
                cover
              >
                <div class="pa-4 align-start">
                  <v-img
                    :src="require('@/assets/Icons/sp_logo.svg')"
                    style="width: 5vw; position: relative;"
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
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepae');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101010000');
  
  if (!permission || !permission.IsActive) {
    return router.push('/Homepage');
  }
};

onMounted(() => {
  initialize();
})
</script>

<style scoped lang="scss">
.icon-size {
  font-size: 1vh;
}

.text-bottom {
  position: absolute;
  bottom: 0;
}

.card-title {
  font-size: 3vh; 
  font-weight: 500;
  padding-bottom: 0;
}

.card-text {
  font-size: 1vh;
}

.text-decoration-none {
  text-decoration: none;
}
</style>
