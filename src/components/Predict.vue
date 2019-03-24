<template>
  <div>
    <h2>Predict</h2>
    <a href="#" @click="predictOnVolume">Predict</a>
  </div>
</template>

<script lang="ts">
import { predict } from '@/lib/predict';
import * as nifti from 'nifti/src';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Predict extends Vue {

  public predictOnVolume() {
    const featuresNifti: nifti.Image = this.$store.getters.featuresNifti;

    const rank = featuresNifti.header.dim[0];
    const shape = featuresNifti.header.dim.slice(1, 4) as [number, number, number];

    if (rank !== 3) {
      throw Error(`Can only predict on rank 3 input but got rank ${rank}`);
    }

    let features = featuresNifti.data;
    if (!(features instanceof Float32Array)) {
      features = new Float32Array(features);
    }

    const predictions = predict('path/to/model.json', features, shape);

    this.$store.commit('SET_PREDICTIONS_ARRAY', predictions);
  }
}
</script>

<style scoped>
</style>
