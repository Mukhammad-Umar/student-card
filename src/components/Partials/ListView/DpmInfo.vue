<script setup lang="ts">
import { computed } from 'vue'

const {info}: any = defineProps<{ info: Object }>()

const titles = computed(() => {
  return [
    { name: 'ПИНФЛ', key: 'pinfl' },
    { name: 'Имя', key: 'spc_firstname' },
    { name: 'Фамилия', key: 'spc_lastname' },
    { name: 'Отчество', key: 'spc_fathername' },
    { name: 'Дата рождения', key: 'spc_birthdate' },
    { name: 'Пол', key: 'gender_name' },
    { name: 'Страна рождения', key: 'spc_birthcountry' },
    { name: 'Гражданство', key: 'spc_citizenship' },
    { name: 'Тип документа', key: '' },
    { name: 'Серия и номер', key: 'serial_number' },
    { name: 'Дата выдачи документа', key: 'spc_docdatebegin' },
    { name: 'Срок действия документа', key: 'spc_docdateend' },
    { name: 'Место выдачи', key: 'spc_docgiveplace' },
    { name: 'Семейное положение', key: '' },
    { name: 'Страна резидентства', key: '' },
    { name: 'Регион регистрации', key: '' },
    { name: 'Область регистрации', key: '' },
    { name: 'Адрес регистрации', key: '' },
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
