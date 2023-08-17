<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SimpleLoader from '@/components/Common/SimpleLoader.vue'

const cards = ref([])
const loading = ref(true)

async function getList() {
  try {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header class="d-flex justify-content-between">
      <h5 class="card-title mb-0 flex-center">Сгенерированный дизайн карты</h5>
    </b-card-header>
    <b-card-body>
      <div v-if="cards?.length">
        <h6>Content</h6>
      </div>
      <div v-else class="py-2 flex-center">
        <span class="text-inactive">{{ $t('viewBox.noCards') }}</span>
      </div>
    </b-card-body>
  </b-card>
</template>
