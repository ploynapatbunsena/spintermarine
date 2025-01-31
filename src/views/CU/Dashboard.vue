<template>
  <v-app>
    <v-img
      :src="require('@/assets/Images/Picture1.png')"
      class="pa-0 ma-0"
      position="relative"
    >
    <div style="position: absolute; width: 3840px; height: 2160px;">
      <v-row>
        <v-col cols="4" class="column-setting" style="margin-top: 200px;" >คอลัมน์ที่ 1</v-col>
        <v-col cols="4" class="column-setting" style="margin-top: 200px;">คอลัมน์ที่ 2</v-col>
        <v-col cols="4" style="margin-top: 200px; padding-left: 270px;">
          <v-card style="width: 950px; height: 563px; display: flex; align-items: center; justify-content: center;">
            <div class="box-left">
              <!-- แสดงค่าเปอร์เซ็นต์ -->
              <div class="box-percent">
                <p class="text-percent">{{ sensorValue }}%</p>
              </div>  
              <div class="box-grey"></div>
              <div class="box-chart" :style="{ width: computedChartWidth + 'px' }"></div>
              <div class="line-chart"></div>
              <div class="box-grey"></div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" class="column-setting">คอลัมน์ที่ 4</v-col>
        <v-col cols="4" class="column-setting">คอลัมน์ที่ 5</v-col>
        <v-col cols="4" class="right-box">คอลัมน์ที่ 6</v-col>
      </v-row>
      <v-row>
        <v-col cols="4" class="left-box">คอลัมน์ที่ 7</v-col>
        <v-col cols="4" class="column-setting">คอลัมน์ที่ 8</v-col>
        <v-col cols="4" class="right-box">คอลัมน์ที่ 9</v-col>
      </v-row>
    </div>
      
    </v-img>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      sensorValuesMock: [10, 25, 50, 75, 90, 100],
      sensorValue: 0,
      maxWidth: 700,
      index: 0,
    };
  },
  computed: {
    computedChartWidth() {
      return (this.sensorValue / 100) * this.maxWidth;
    },
  },
  mounted() {
    setInterval(() => {
      this.sensorValue = this.sensorValuesMock[this.index];
      this.index = (this.index + 1) % this.sensorValuesMock.length;
    }, 2000);
  }
};
</script>

<style>
.left-box {
  width: 1200px;
  height: 750px;
  padding: 0;
}

.right-box {
  width: 950px;
  height: 563px;
}

.box-left {
  display: flex;
  align-items: center;
  margin-top: 107px;
}

/* กล่องแสดงเปอร์เซ็นต์ */
.box-percent {
  width: 120px;
  height: 120px;
  background-color: #ecbd00;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
}

/* จุดเริ่มต้นของกราฟ */
.box-grey {
  width: 24px;
  height: 24px;
  background-color: #b4b4b4;
  margin-left: 10px;
}

/* แท่งกราฟที่ยาวออกทางขวาตามเปอร์เซ็นต์ */
.box-chart {
  height: 40px;
  background-color: #ecbd00;
  transition: width 0.5s ease-in-out; /* ทำให้การเปลี่ยนแปลงดูสมูท */
}

.line-chart {
  flex-grow: 1;
  height: 2px;
  background-color: #b4b4b4;
}

</style>