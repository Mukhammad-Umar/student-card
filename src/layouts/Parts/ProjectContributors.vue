<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const triggerBack = (e: any) => {
  if (e.key === 'Escape' && e.target.localName !== 'input') {
    emit('emit:close')
  }
}

onMounted(() => {
  window.addEventListener('keyup', triggerBack)
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', triggerBack)
})

const emit = defineEmits(['emit:close'])
</script>

<template>
  <div class="project-contributors">
    <div class="modal-backdrop fade show"></div>
    <i
      class="mdi mdi-window-close text-info cup h2 project-close-icon"
      @click="emit('emit:close')"
    ></i>
    <div class="project-contributors-cnt">
      <div title="Авторы проекта" class="contributors-title">
        Авторы проекта
      </div>

      <div class="firework"></div>
      <div class="firework"></div>
      <div class="firework"></div>

      <div class="project-contributors-list">
        <div class="glitch" data-text="Back-end developer: Temirov Eldor">
          Back-end developer: Temirov Eldor
        </div>
        <div class="glow">Back-end developer: Temirov Eldor</div>

        <div class="glitch" data-text="Colvir developer: Akhmedjanov Sardor">
          Colvir developer: Akhmedjanov Sardor
        </div>
        <div class="glow">Colvir developer: Akhmedjanov Sardor</div>

        <div
          class="glitch"
          data-text="Front-end developer: Yokubjonov Mukhammad-Umar"
        >
          Front-end developer: Yokubjonov Mukhammad-Umar
        </div>
        <div class="glow">Front-end developer: Yokubjonov Mukhammad-Umar</div>

        <div class="glitch" data-text="Project manager: Ismatov Akhmadjon">
          Project manager: Ismatov Akhmadjon
        </div>
        <div class="glow">Project manager: Ismatov Akhmadjon</div>

        <div class="glitch" data-text="System Observer: Olimov Ortiqjon">
          System Observer: Olimov Ortiqjon
        </div>
        <div class="glow">System Observer: Olimov Ortiqjon</div>
      </div>
    </div>
  </div>
</template>
