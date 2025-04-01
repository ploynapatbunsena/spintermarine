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
      <label for="dropzoneFile">
        <span class="material-symbols-rounded" style="font-size: 52px;">backup</span>
      </label>
      <p class="text-grey"><span>Click to upload</span> or drag and drop</p>
    </template>
    <div v-else class="preview-container">
      <img :src="previewUrl" alt="Preview" class="thumbnail" />
      <v-icon @click="removeFile" class="delete-btn">
        <span class="material-symbols-rounded" style="font-size: 24px;">close</span>
      </v-icon>
    </div>

    <span class="file-info">{{ selectedFile?.name || '' }}</span>
    <input 
      type="file" 
      id="dropzoneFile" 
      class="dropzoneFile" 
      @change="handleFileInput"
      accept="image/*"
    />
  </v-card>
</template>

<script setup>
import { ref, onUnmounted, defineEmits } from "vue";

const emit = defineEmits(['file-selected']);
const active = ref(false);
const previewUrl = ref(null);
const selectedFile = ref(null);

const toggleActive = () => {
  active.value = !active.value;
};

const handleDrop = (e) => {
  toggleActive();
  const file = e.dataTransfer.files[0];
  processFile(file);
};

const handleFileInput = (e) => {
  const file = e.target.files[0];
  processFile(file);
};

const processFile = (file) => {
  if (file && file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file);
    previewUrl.value = url;
    selectedFile.value = file;
    emit('file-selected', file);
  }
};

const removeFile = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
    selectedFile.value = null;
    document.querySelector('.dropzoneFile').value = '';
    emit('file-selected', null);
  }
};

// Cleanup URL object when component is unmounted
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped lang="scss">
// .dropzone {
//   width: 550px;
//   height: 320px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   border-radius: 16px;
//   row-gap: 16px;
//   border: 1px dashed #9f9f9f;
//   background-color: #efefef;
//   transition: 0.3s ease all;
//   position: absolute;
//   padding: 16px;
//   overflow: hidden;
// }

.dropzone {
  max-width: 100vw;
  max-height: 320px;
  border: 1px dashed #9f9f9f;
  background-color: #efefef;
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
  height: 80%;
}

.thumbnail {
  max-width: 90%;
  max-height: 80%;
  object-fit: contain;
  border-radius: 8px;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #000000;
  border-radius: 100%;
  background-color: #FFFFFF;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.delete-btn:hover {
  background-color: #DC2B2B;
  color: #FFFFFF;
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
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  background-color: #ffffff;
  transition: 0.3s ease all;
  border-radius: 100%;
  cursor: pointer;
}

input {
  display: none;
}

.active-dropzone {
  color: #ffffff;
  border-color: #00b8f2;
  background-color: #d6e6f2;

  label {
    background-color: #ffffff;
    color: #00b8f2;
  }
}

.text-grey {
  color: #707070;
}
</style>