<script setup lang="ts">
import SimpleLoader from '@/components/Common/SimpleLoader.vue'

const { info }: any = defineProps<{ info: Object }>()
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header class="d-flex justify-content-between">
      <h5 class="card-title mb-0 flex-center">Сгенерированный дизайн карты</h5>
    </b-card-header>
    <b-card-body>
      <div v-if="info?.student_card" class="d-flex border px-3 br-15">
        <img :src="info.student_card" style="width: 100%;" />
      </div>
      <div v-else class="py-2 flex-center">
        <span class="text-inactive">{{ $t('viewBox.noCards') }}</span>
      </div>
    </b-card-body>
  </b-card>
</template>
