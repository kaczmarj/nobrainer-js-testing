import * as nifti from 'nifti/src';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    featuresArrayBuffer: new ArrayBuffer(0),
    predictionsArray: new Uint8Array(0),
  },
  mutations: {
    SET_VOLUME_FILE_ARRAY_BUFFER(state, event: Event) {
      if (event.target !== null) {
        const input = event.target as HTMLInputElement;
        const files = input.files as FileList;
        if (files !== null && files[0]) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent) => {
            if (e.target !== null) {
              state.featuresArrayBuffer = reader.result as ArrayBuffer;
            } else {
              throw Error('Error loading volume file.');
            }
          };
          reader.readAsArrayBuffer(files[0]);
        }
      }
    },
    SET_PREDICTIONS_ARRAY(state, data: Uint8Array) {
      state.predictionsArray = data;
    },
  },

  getters: {
    featuresNifti(state): nifti.Image {
      if (state.featuresArrayBuffer.byteLength === 0) {
        throw Error('Volume array is empty. Was the volume file loaded?');
      }
      return nifti.fromBuffer(state.featuresArrayBuffer);
    },
    predictionsArray(state): Uint8Array {
      if (state.predictionsArray.byteLength === 0) {
        throw Error('Prediction array is empty.');
      }
      return state.predictionsArray;
    },

  },
});
