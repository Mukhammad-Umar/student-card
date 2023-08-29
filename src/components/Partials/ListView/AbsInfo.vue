<script setup lang="ts">
import { computed } from 'vue'

const { info }: any = defineProps<{ info: Object }>()

const titles = computed(() => {
  return [
    { name: 'Код клиента', key: 'abs_client_id' },
    { name: 'Card Idn', key: 'abs_card_idn' },
  ]
})
</script>

<template>
  <div class="px-0">
    <b-card no-body class="card-box-shadow">
      <b-card-header class="d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-1">Данные АБС</h5>
      </b-card-header>
      <b-card-body class="row g-4">
        <b-col lg="4" md="6" sm="6" v-for="(title, index) in titles" :key="index">
          <div>
            <label class="form-label">{{ title.name + ' ' }}</label>
            <input
              type="text" class="form-control"
              :value="info[title.key]" readonly
            />
          </div>
        </b-col>
      </b-card-body>
    </b-card>
  </div>
</template>
