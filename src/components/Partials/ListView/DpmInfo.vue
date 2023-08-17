<script setup lang="ts">
import { computed } from 'vue'

const {info}: any = defineProps<{ info: Object }>()

const titles = computed(() => {
  return [
    { name: 'ПИНФЛ', key: 'pinfl' },
    { name: 'Имя', key: 'firstname' },
    { name: 'Фамилия', key: 'lastname' },
    { name: 'Отчество', key: 'fathername' },
    { name: 'Дата рождения', key: 'birthday' },
    { name: 'Пол', key: 'gender_name' },
    { name: 'Страна рождения', key: 'country_name' },
    { name: 'Гражданство', key: 'citizenship_name' },
    { name: 'Тип документа', key: 'payment_type_name' },
    { name: 'Серия и номер', key: 'serial_number' },
    { name: 'Дата выдачи документа', key: 'issue_date' },
    { name: 'Срок действия документа', key: 'expire_date' },
    { name: 'Место выдачи', key: 'given_place' },
    { name: 'Семейное положение', key: 'university_type_name' },
    { name: 'Страна резидентства', key: 'nationality_name' },
    { name: 'Регион регистрации', key: 'region' },
    { name: 'Область регистрации', key: 'district' },
    { name: 'Адрес регистрации', key: 'address' },
  ]
})
</script>

<template>
  <div class="px-0">
    <b-card no-body class="card-box-shadow">
      <b-card-header class="d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-1">Данные паспорта (ГЦП)</h5>
      </b-card-header>
      <b-card-body class="row g-4">
        <template v-for="title in titles">
          <b-col v-if="title.key === 'address'" lg="8" md="6" sm="6">
            <div>
              <label class="form-label">{{ title.name + ' ' }}</label>
              <input type="text" class="form-control" :value="info[title.key]" readonly />
            </div>
          </b-col>
          <b-col v-else lg="4" md="6" sm="6">
            <div>
              <label class="form-label">{{ title.name + ' ' }}</label>
              <input type="text" class="form-control" :value="info[title.key]" readonly />
            </div>
          </b-col>
        </template>
      </b-card-body>
    </b-card>
  </div>
</template>
