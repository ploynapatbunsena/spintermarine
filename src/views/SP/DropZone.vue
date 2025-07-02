<template>
  <v-card
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="handleDrop"
    :class="{ 'active-dropzone': active }"
    class="dropzone"
    elevation="0"
  >
    <template v-if="!previewUrl">
      <div style="display: flex; flex-direction: column; align-items: center">
        <label for="dropzoneFile">
          <span
            class="material-symbols-rounded"
            style="font-size: 5vh; color: #cbd0dc"
            >backup</span
          >
        </label>
        <p class="text-grey"><span>Click to upload</span> or drag and drop</p>
      </div>
    </template>
    <div v-else class="preview-container">
      <img :src="previewUrl" alt="Preview" class="thumbnail" />
      <v-btn
        class="delete-btn"
        icon="mdi-trash-can-outline"
        variant="text"
        @click="removeFile"
      ></v-btn>
    </div>

    <span class="file-info">{{ selectedFile?.name || "" }}</span>
    <input
      type="file"
      id="dropzoneFile"
      class="dropzoneFile"
      @change="handleFileInput"
      accept="image/*"
      ref="fileInput"
    />
  </v-card>
</template>

<script setup>
import { ref, onUnmounted, defineEmits } from "vue"

const emit = defineEmits(["file-selected"])
const active = ref(false)
const previewUrl = ref(null)
const selectedFile = ref(null)
const fileInput = ref(null)

const toggleActive = () => {
  active.value = !active.value
}

const handleDrop = (e) => {
  toggleActive()
  const file = e.dataTransfer.files[0]
  processFile(file)
}

const handleFileInput = (e) => {
  const file = e.target.files[0]
  processFile(file)
}

const processFile = (file) => {
  if (file && file.type.startsWith("image/")) {
    const url = URL.createObjectURL(file)
    previewUrl.value = url
    selectedFile.value = file
    emit("file-selected", file)
  }
}

const removeFile = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ""
    }
    emit("file-selected", null)
  }
}

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<style scoped lang="scss">
.dropzone {
  max-width: 100vw;
  max-height: 300px;
  height: 100vh;
  border: 2px dashed #cbd0dc;
  border-radius: 32px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.preview-container {
  position: relative;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.thumbnail {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #000000;
  background-color: #ffffff;
  width: 32px;
  height: 32px;
  min-width: 32px;
}

.delete-btn:hover {
  background-color: #dc2b2b;
  color: #ffffff;
}

.file-info {
  position: absolute;
  bottom: 10px;
  left: 16px;
  color: #707070;
  font-size: 14px;
  width: calc(100% - 32px);
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}

label {
  width: 8vh;
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #cbd0dc;
  transition: 0.3s ease all;
  border-radius: 100%;
  cursor: pointer;
}

input {
  display: none;
}

.text-grey {
  color: #707070;
  font-family: "Inter", sans-serif;
  text-align: center;
  margin-top: 2vh;
}
</style>
