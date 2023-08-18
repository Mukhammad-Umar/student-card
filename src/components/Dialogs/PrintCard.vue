<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  universityList: Array,
})

const printCard = ref(false)
const faculties = ref([
  { id: null, name: 'Факультет/Отделение', disabled: true },
])
const reestres = ref([{ id: null, name: 'Реестр', disabled: true }])
const courses = ref([{ id: null, name: 'Курс обучения', disabled: true }])

const form: any = ref({
  univerId: null,
  facultyId: null,
  reestrId: null,
  courseId: null,
})

async function submit() {

}
</script>

<template>
  <b-button class="ml-2 mb-1" variant="primary" @click="printCard = true">
    Отправить на печать
  </b-button>

  <b-modal
    id="showModal"
    v-model="printCard"
    header-class="p-3 bg-light"
    class="v-modal-custom import-modal"
    title="Формирование реестра на печать"
    hide-footer centered no-close-on-backdrop
  >
    <b-card no-body class="border-0 shadow-none mb-0">
      <b-row class="g-4 pt-3">
        <b-col lg="6">
          <b-form-select
            v-model="form.univerId"
            value-field="hemis_code" text-field="name"
            id="import-univerId" :options="universityList"
            :class="{ 'text-inactive': form.univerId === null }"
          ></b-form-select>
        </b-col>
        <b-col lg="6">
          <b-form-select
            v-model="form.facultyId"
            value-field="id" text-field="name"
            id="import-facultyId" :options="faculties"
            :class="{ 'text-inactive': form.facultyId === null }"
          ></b-form-select>
        </b-col>
        <b-col lg="6">
          <b-form-select
            v-model="form.reestrId"
            value-field="id" text-field="name"
            id="import-reestrId" :options="reestres"
            :class="{ 'text-inactive': form.reestrId === null }"
          ></b-form-select>
        </b-col>
        <b-col lg="6">
          <b-form-select
            v-model="form.courseId"
            value-field="id" text-field="name"
            id="import-courseId" :options="courses"
            :class="{ 'text-inactive': form.courseId === null }"
          ></b-form-select>
        </b-col>

        <b-col lg="12" class="d-flex justify-content-center">
          <b-button variant="warning" class="mb-1 px-5" @click="printCard = false">
            {{ $t('btn_text.close') }}
          </b-button>
          <b-button variant="primary" class="mb-1 ml-3 px-5" @click="submit">
            Печатать
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </b-modal>
</template>
