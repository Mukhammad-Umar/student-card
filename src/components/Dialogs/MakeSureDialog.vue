<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modals: Object,
  loading: Boolean
})

const modals: any = ref(props.modals)
</script>

<template>
  <b-modal
    v-model="modals.modal"
    hide-footer
    hide-header
    class="v-modal-custom"
    centered
  >
    <div class="mt-2 text-center py-1">
      <h4 class="mb-3"><slot /></h4>
      <div class="hstack gap-2 justify-content-center">
        <b-button class="btn btn-light" @click="$emit('emit:close')">{{ $t('btn_text.no') }}</b-button>
        <b-button class="btn btn-info" @click="$emit('emit:success')" :loading="loading" :loading-mode="'fill'">
          {{ $t('btn_text.yes') }}
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<style>
.v-modal-custom .hstack .btn {
  width: 120px;
}
</style>
