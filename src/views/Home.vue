<template>
  <div class="home">
    <LoadVolume/>
    <Predict/>
    <DownloadVolume/>
  </div>
</template>

<script lang="ts">
import DownloadVolume from '@/components/DownloadVolume.vue';
import LoadVolume from '@/components/LoadVolume.vue';
import Predict from '@/components/Predict.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    LoadVolume,
    Predict,
    DownloadVolume,
  },
})

export default class Home extends Vue {}
</script>
