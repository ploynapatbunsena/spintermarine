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

const checkPermission = async () => {
  const memberPermission = localStorage.getItem('member');
  const memberPermissionList = JSON.parse(memberPermission);
  
  const position = memberPermissionList.Position;
  switch (position) {
    // Barge Cases
    case "Barge Karaket":
      return router.push({ name: "BargeDetail", params: { typeDeviceName: "Barge Karaket" } });
    case "Barge Supharat":
      return router.push({ name: "BargeDetail", params: { typeDeviceName: "Barge Supharat" } });
    case "Barge Chamchuri":
      return router.push({ name: "BargeDetail", params: { typeDeviceName: "Barge Chamchuri" } });
    case "Barge Ladawan":
      return router.push({ name: "BargeDetail", params: { typeDeviceName: "Barge Ladawan" } });
    case "Barge Kaentawan":
      return router.push({ name: "BargeDetail", params: { typeDeviceName: "Barge Kaentawan" } });
    case "Barge Bunga":
      return router.push({ name: "BargeDetail", params: { typeDeviceName: "Barge Bunga" } });
    case "Barge Thongarun":
      return router.push({ name: "BargeDetail", params: { typeDeviceName: "Barge Thongarun" } });

    // Tugboat Series
    case "Tugboat Kesarin01":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000092" } });
    case "Tugboat Kesarin02":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000093" } });
    // case "Tugboat Kesarin03":
    //   return router.push({ name: "TugboatDetail", params: { deviceId: "00000094" } });
    case "Tugboat Kesarin04":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000094" } });
    case "Tugboat Kesarin05":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000095" } });
    case "Tugboat Kesarin06":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000096" } });
    // case "Tugboat Kesarin07":
    //   return router.push({ name: "TugboatDetail", params: { deviceId: "00000098" } });
    case "Tugboat Kesarin08":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000097" } });
    case "Tugboat Kesarin09":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000098" } });
    case "Tugboat Kesarin10":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000099" } });
    case "Tugboat Kesarin11":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000100" } });
    case "Tugboat Kesarin12":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000101" } });
    case "Tugboat Kesarin13":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000102" } });
    case "Tugboat Kesarin14":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000103" } });
    case "Tugboat Kesarin15":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000104" } });
    case "Tugboat Kesarin16":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000105" } });
    case "Tugboat Kesarin17":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000106" } });
    case "Tugboat Kesarin18":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000107" } });
    case "Tugboat Buachompoo":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000091" } });
    case "Tugboat Watthana01":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000108" } });
    case "Tugboat Watthana02":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000109" } });
    case "Tugboat Watthana03":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000110" } });
    case "Tugboat Watthana04":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000111" } });
    case "Tugboat Watthana05":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000112" } });
    case "Tugboat Watthana06":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000113" } });
    case "Tugboat Watthana07":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000114" } });
    case "Tugboat Watthana10":
      return router.push({ name: "TugboatDetail", params: { deviceId: "00000115" } });
    default:
      return router.push('/Homepage');
  }
};

onMounted(async() => {
  initialize();
  checkPermission();
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
