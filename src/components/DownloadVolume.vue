<template>
  <div>
    <h2>Download predictions as nifti</h2>
    <form @submit.prevent="downloadPredictedVolume">
      Filename ending in .nii or .nii.gz
      <input
        type="text"
        v-model="outputFilename"
        required
        pattern=".*\.(nii|nii.gz)"
      >
      <a ref="hiddenAnchor" href="#" style="display: none"></a>
      <button type="submit">Download</button>
    </form>
  </div>
</template>

<script lang="ts">
import * as nifti from 'nifti/src';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DownloadVolume extends Vue {
  public data() {
    return {outputFilename: ''};
  }
  public downloadPredictedVolume() {

    const featuresNifti: nifti.Image = this.$store.getters.featuresNifti;
    const predictionsArray: Uint16Array = this.$store.getters.predictionsArray;

    const shape = featuresNifti.header.dim.slice(1, 4) as [number, number, number];
    const predictionsNifti = nifti.Image.fromTypedArray(predictionsArray, featuresNifti.affine, shape);

    const outputFilename = this.$data.outputFilename;
    let predictionsArrayBuffer: ArrayBuffer;
    if (outputFilename.endsWith('.gz')) {
      predictionsArrayBuffer = predictionsNifti.toGzippedBuffer();
    } else {
      predictionsArrayBuffer = predictionsNifti.toBuffer();
    }

    const blob = new Blob([predictionsArrayBuffer], {type: 'application/octet-stream'});
    const url = window.URL.createObjectURL(blob);
    const anchor = this.$refs.hiddenAnchor as HTMLAnchorElement;
    anchor.download = outputFilename;
    anchor.href = url;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
</script>

<style scoped>
</style>
