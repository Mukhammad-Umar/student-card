<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'

import PageHeader from '@/components/Common/PageHeader.vue'
import ClientData from '@/components/Partials/ListView/ClientData.vue'
import UniverData from '@/components/Partials/ListView/UniverData.vue'
import ImportData from '@/components/Partials/ListView/ImportData.vue'

import filters from '@/filters'
import AutopaymentCards from '@/components/Partials/Card/AutopaymentCards.vue'
import HumoGateCard from '@/components/Partials/Card/HumoGateCard.vue'
import SvGateCards from '@/components/Partials/Card/SvGateCards.vue'

const route = useRoute()
const loading = ref(true)
const student: any = ref({})
const studentData: any = ref({})
const univerData: any = ref({})
const importData: any = ref({})
const clientStore = useClientStore()

async function getData() {
  try{
    loading.value = true
  
    const data = await clientStore.getById(route.params.id)
  
    student.value = data

    studentData.value = {
      lastName: data.lastname,
      firstName: data.firstname,
      middleName: data.fathername,
      studentStatus: data.status_name,
    }

    univerData.value = {
      id: data.id,
      pinfl: data.pinfl,
      serial_number: data.serial_number?.substring(0, 2) + ' ' + data.serial_number?.slice(2),
      birthday: filters.filterMonthDate(data.birthday),
      studentStatus: data.status_name,
      gender_name: data.gender_name,
      citizenship_name: data.citizenship_name,
      nationality_name: data.nationality_name,
      education_form_name: data.education_form_name,
      payment_type_name: data.payment_type_name,
      university_name: data.university_name,
      university_type_name: data.university_type_name,
      university_ownership_name: data.university_ownership_name,
      faculty_name: data.faculty_name,
      speciality_name: data.speciality_name,
      course: data.course,
      country_name: data.country_name,
      region: data.region,
      district: data.district,
      address: data.address,
      address_current: data.address_current,
      accomodation_name: data.accomodation_name,
      social_category_name: data.social_category_name,
      education_year: data.education_year,
      education_language_name: data.education_language_name,
      group_name: data.group_name,
      status_name: data.status_name,
      student_type_name: data.student_type_name
    }

    importData.value = {
      id: data.id,
      pinfl: data.pinfl,
      birthday: filters.filterMonthDate(data.birthday),
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getData()
})
</script>

<template>
  <b-row>
    <div class="">
      <PageHeader
        :title="$t('breadcrumbs.clientView')"
        :route="'MainStudentsContractsList'"
        :text1="$t('breadcrumbs.clients')"
        :text2="$t('breadcrumbs.view')"
      />
    </div>

    <b-col lg="8">
      <ClientData :info="studentData" />

      <UniverData :info="univerData" />

      <ImportData :info="importData" />
    </b-col>

    <b-col lg="4">
      <!--
      <template v-if="loading">
        <AutopaymentCards :client="client" :integrationSystemId="1"/>

        <HumoGateCard :client="client" :integrationSystemId="2"/>

        <SvGateCards :client="client" :integrationSystemId="3"/>
      </template> -->
    </b-col>
  </b-row>
</template>
