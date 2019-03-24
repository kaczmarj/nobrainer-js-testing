<template>
  <div>
    <h2>Load nifti file</h2>
    <label>
      <input type="file" @change="loadVolumeFileArrayBuffer">
    </label>
  </div>
</template>

<script lang="ts">
import * as nifti from 'nifti/src';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoadVolume extends Vue {
  public loadVolumeFileArrayBuffer(event: Event) {
    this.$store.commit('SET_VOLUME_FILE_ARRAY_BUFFER', event);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
