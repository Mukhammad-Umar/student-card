<script setup lang="ts">
import { computed } from 'vue'

const {info}: any = defineProps<{ info: Object }>()

const titles = computed(() => {
  return [
    { name: 'Имя', key: 'firstname' },
    { name: 'Фамилия', key: 'lastname' },
    { name: 'Фото', key: 'photo' },
    // { name: 'Отчество', key: 'fathername' },
    // { name: 'Статус студента', key: 'status_name' },
    { name: 'ID студента', key: 'hemis_id' },
    { name: 'ПИНФЛ', key: 'pinfl' },
    { name: 'Серия и номер паспорта', key: 'serial_number' },
    { name: 'Дата рождения', key: 'birthday' },
    { name: 'Пол', key: 'gender_name' },
    { name: 'Национальность', key: 'citizenship_name' },
    { name: 'Гражданство', key: 'nationality_name' },
    { name: 'Тип образования', key: 'education_type_name' },
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
    { name: 'Статус обучения', key: 'status_study' },
    { name: 'Тип студента', key: 'student_type_name' },
  ]
})
</script>

<template>
  <div class="px-0">
    <b-card no-body class="card-box-shadow">
      <b-card-header class="d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-1">Данные студента (HEMIS)</h5>
      </b-card-header>
      <b-card-body class="row g-4">
        <template v-for="title in titles">
          <b-col v-if="title.key === 'firstname'" lg="4" md="6" sm="6">
            <div class="d-flex flex-column">
              <label class="form-label">{{ title.name + ' ' }}</label>
              <input type="text" class="form-control" :value="info.firstname" readonly />
            </div>
            <div class="d-flex flex-column mt-input">
              <label class="form-label">Отчество</label>
              <input type="text" class="form-control" :value="info.fathername" readonly />
            </div>
          </b-col>

          <b-col v-else-if="title.key === 'lastname'" lg="4" md="6" sm="6">
            <div class="d-flex flex-column">
              <label class="form-label">{{ title.name + ' ' }}</label>
              <input type="text" class="form-control" :value="info.lastname" readonly />
            </div>
            <div class="d-flex flex-column mt-input">
              <label class="form-label">Статус студента</label>
              <input type="text" class="form-control" :value="info.status_name" readonly />
            </div>
          </b-col>

          <b-col v-else-if="title.key === 'photo'" lg="4" md="6" sm="6">
            <div class="d-flex flex-column">
              <label class="form-label">{{ title.name + ' ' }}</label>
              <img 
                :src="info.photo ? info.photo : '/images/users/no-photo.png'" 
                :width="info.photo ? '100' : '110'" :height="info.photo ? '' : '127'" class="border br-6"
              />
            </div>
          </b-col>

          <b-col v-else-if="title.key === 'university_name'" lg="8" md="6" sm="6">
            <div>
              <label class="form-label">{{ title.name + ' ' }}</label>
              <input type="text" class="form-control" :value="info.university_name" readonly />
            </div>
          </b-col>

          <b-col v-else-if="title.key === 'speciality_name'" lg="8" md="6" sm="6">
            <div>
              <label class="form-label">{{ title.name + ' ' }}</label>
              <input type="text" class="form-control" :value="info.speciality_name" :title="info.speciality_name" readonly />
            </div>
          </b-col>

          <b-col v-else-if="title.key === 'address'" lg="8" md="6" sm="6">
            <div>
              <label class="form-label">{{ title.name + ' ' }}</label>
              <input type="text" class="form-control" :value="info.address" readonly />
            </div>
          </b-col>

          <b-col v-else-if="title.key === 'address_current'" lg="8" md="6" sm="6">
            <div>
              <label class="form-label">{{ title.name + ' ' }}</label>
              <input type="text" class="form-control" :value="info.address_current" readonly />
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
