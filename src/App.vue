<template>
  <div id="app">
    <header id="header">
      <div class="header-group">
        <button id="loadButton" aria-label="Upload Image" @click="onLoadClick">
          ↑
        </button>
        <p id="fileName">{{ currentFileName || "No file selected" }}</p>
      </div>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        ref="fileInput"
        @change="onFileChange"
        style="display: none"
      />
    </header>

    <!-- Pannellum Viewer Component -->
    <PannellumViewer :panoramaUrl="panoramaUrl" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PannellumViewer from "./components/PannellumViewer.vue";

// Reactive state variables
const currentFileDataURL = ref(null);
const currentFileName = ref("");
const panoramaUrl = ref("");

// Reference to the file input element
const fileInput = ref(null);

function onLoadClick() {
  fileInput.value.click();
}

function onFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    currentFileDataURL.value = e.target.result;
    currentFileName.value = file.name;

    // Once the file data is loaded, process it (resize if necessary).
    const img = new Image();
    img.onload = () => {
      const maxTextureSize = getMaxTextureSize();
      if (img.width > maxTextureSize) {
        const scaleFactor = maxTextureSize / img.width;
        const newWidth = maxTextureSize;
        const newHeight = img.height * scaleFactor;

        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob(
          (blob) => {
            const imageUrl = URL.createObjectURL(blob);
            panoramaUrl.value = imageUrl;
          },
          "image/jpeg",
          0.9
        );
      } else {
        // If the image is within limits, use it directly.
        panoramaUrl.value = currentFileDataURL.value;
      }
    };
    img.src = currentFileDataURL.value;
  };
  reader.readAsDataURL(file);
}

function getMaxTextureSize() {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (gl) {
    return gl.getParameter(gl.MAX_TEXTURE_SIZE);
  }
  // Fallback value if WebGL isn't available.
  return 4096;
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#header {
  background-color: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
}

.header-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

#loadButton {
  height: 2.75rem;
  width: 2.75rem;
  font-size: 1.25rem;
  background-color: #3b82f6;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}
#loadButton:hover {
  background-color: #2563eb;
}

/* Make the filename horizontally scrollable when too long */
#fileName {
  font-family: Arial, Helvetica, sans-serif;
  color: #ffffff;
  font-size: 14px;
  white-space: nowrap;
  overflow-x: auto; /* enable horizontal scrolling */
  max-width: 100%; /* adjust to desired width */
  text-overflow: clip; /* or 'ellipsis' if you prefer */
  -webkit-overflow-scrolling: touch; /* smoother scrolling on mobile */
}
</style>
