<script setup lang="ts">
import { computed } from 'vue'

const {info}: any = defineProps<{ info: Object }>()

const titles = computed(() => {
  return [
    { name: 'ID студента', key: 'id' },
    { name: 'ПИНФЛ', key: 'pinfl' },
    { name: 'Серия номер паспорта', key: 'serial_number' },
    { name: 'Дата рождения', key: 'birthday' },
    { name: 'Пол', key: 'studentStatus' },
    { name: 'Национальность', key: 'gender_name' },
    { name: 'Гражданство', key: 'citizenship_name' },
    { name: 'Тип образования', key: 'nationality_name' },
    { name: 'Смена образования', key: 'education_form_name' },
    { name: 'Тип оплаты', key: 'payment_type_name' },
    { name: 'Наименование ВУЗа', key: 'university_name' },
    { name: 'Тип ВУЗа', key: 'university_type_name' },
    { name: 'Наименования типа ВУЗа', key: 'university_ownership_name' },
    { name: 'Наименование факультета', key: 'faculty_name' },
    { name: 'Наименование специальности', key: 'speciality_name' },
    { name: 'Учебный курс', key: 'course' },
    { name: 'Страна проживания', key: 'country_name' },
    { name: 'Регион проживания', key: 'region' },
    { name: 'Район проживания', key: 'district' },
    { name: 'Адрес', key: 'address' },
    { name: 'Адрес проживания', key: 'address_current' },
    { name: 'Место проживания', key: 'accomodation_name' },
    { name: 'Спец. наименование категории', key: 'social_category_name' },
    { name: 'Год поступления', key: 'education_year' },
    { name: 'Язык образования', key: 'education_language_name' },
    { name: 'Наименование группы', key: 'group_name' },
    { name: 'Статус обучения', key: 'status_name' },
    { name: 'Тип студента', key: 'student_type_name' },
  ]
})
</script>

<template>
  <div class="px-0">
    <b-card no-body class="card-box-shadow">
      <b-card-header class="d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-1">Данные ВУЗа (HEMIS)</h5>
      </b-card-header>
      <b-card-body class="row g-4">
        <b-col lg="4" md="6" sm="6" v-for="(title, index) in titles" :key="index">
          <div>
            <label class="form-label">{{ title.name + ' ' }}</label>
            <input type="text" class="form-control" :value="info[title.key]" readonly />
          </div>
        </b-col>
      </b-card-body>
    </b-card>
  </div>
</template>
