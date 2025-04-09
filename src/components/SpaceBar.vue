<template>
  <div class="space-bar"></div>
</template>

<script>
export default {
  name: 'SpaceBar',
};
</script>

<style lang="scss" scoped>
.space-bar {
  height: 80px;

  @media(min-width: 2560px) {
    height: 136px;
  }

}
</style>