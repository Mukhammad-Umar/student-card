<script setup lang="ts">
import { computed } from 'vue'
import filters from '@/filters'

const { info }: any = defineProps<{ info: Object }>()

const titles = computed(() => {
  return [
    { name: 'ПИНФЛ', key: 'pinfl' },
    { name: 'Номер телефона', key: 'phone_number' },
    { name: 'Название файла', key: 'file_name' },
  ]
})
</script>

<template>
  <div class="px-0">
    <b-card no-body class="card-box-shadow">
      <b-card-header class="d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-1">Заявка</h5>
      </b-card-header>
      <b-card-body class="row g-4">
        <b-col lg="4" md="6" sm="6" v-for="(title, index) in titles" :key="index">
          <div>
            <label class="form-label">{{ title.name + ' ' }}</label>
            <input
              v-if="title.key === 'file_name'"
              :value="info[title.key]" readonly
              type="text" class="form-control text-primary cup"
              @click="$router.push({name: 'MainImportDataView', params: {id: info.file_upload_id}})"
            />
            <input
              v-else-if="title.key === 'phone_number'"
              :value="info.phone_number?.length === 12 
                ? filters.filterFullPhoneNumber(info.phone_number) : info.phone_number?.length === 9 
                ? filters.filterPhoneNumber(info.phone_number) : info.phone_number" 
              readonly type="text" class="form-control"
            />
            <input
              v-else type="text" class="form-control"
              :value="info[title.key]" readonly
            />
          </div>
        </b-col>
      </b-card-body>
    </b-card>
  </div>
</template>
