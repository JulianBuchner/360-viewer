<template>
  <div id="panorama">
    <div id="placeholder" v-if="!viewerInitialized">Please upload an image</div>
  </div>
</template>

<script setup>
/* global defineProps */
import { onMounted, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  panoramaUrl: {
    type: String,
    default: "",
  },
});

const viewerInitialized = ref(false);
let viewer = null;

const initViewer = () => {
  if (props.panoramaUrl) {
    viewerInitialized.value = true;
    viewer = window.pannellum.viewer("panorama", {
      type: "equirectangular",
      panorama: props.panoramaUrl,
      autoLoad: true,
    });
  }
};

onMounted(() => {
  initViewer();
});

// Reinitialize viewer when the panoramaUrl changes.
watch(
  () => props.panoramaUrl,
  () => {
    if (viewer !== null) {
      viewer.destroy();
      const panoramaEl = document.getElementById("panorama");
      if (panoramaEl) panoramaEl.innerHTML = "";
    }
    initViewer();
  }
);

onBeforeUnmount(() => {
  if (viewer) viewer.destroy();
});
</script>

<style scoped>
#panorama {
  flex: 1;
  width: 100%;
  position: relative;
  background-color: #121212;
}

#placeholder {
  font-family: Arial, Helvetica, sans-serif;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  color: #ffffff;
}
</style>
