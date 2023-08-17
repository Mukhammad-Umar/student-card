<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'

import filters from '@/filters'
import PageHeader from '@/components/Common/PageHeader.vue'
import ApplicationInfo from '@/components/Partials/ListView/ApplicationInfo.vue'
import StatusInfo from '@/components/Partials/ListView/StatusInfo.vue'
import AbsInfo from '@/components/Partials/ListView/AbsInfo.vue'
import HemisInfo from '@/components/Partials/ListView/HemisInfo.vue'
import DpmInfo from '@/components/Partials/ListView/DpmInfo.vue'
import ProcessLog from '@/components/Partials/ListView/ProcessLog.vue'
import GeneretedCard from '@/components/Partials/ListView/GeneretedCard.vue'

const route = useRoute()
const loading = ref(true)
const clientStore = useClientStore()

const dpmData: any = ref({})
const absData: any = ref({})
const hemisData: any = ref({})
const statusData: any = ref({})
const applicationData: any = ref({})

async function getData() {
  try{
    loading.value = true
  
    const data = await clientStore.getById(route.params.id)
  
    applicationData.value = {
      pinfl: data.pinfl,
      phone_number: data.phone_number,
      file_name: data.file_name,
      file_upload_id: data.file_upload_id
    }

    statusData.value = {
      status: data.status,
      comment: data.comment,
    }

    absData.value = {
      id: data.id,
      contract_number: data.contract_number,
      card_number: data.card_number,
    }

    hemisData.value = {
      firstname: data.firstname,
      lastname: data.lastname,
      photo: data.photo,
      fathername: data.fathername,
      status_name: data.status_name,
      hemis_id: data.hemis_id,
      pinfl: data.pinfl,
      serial_number: data.serial_number ? data.serial_number?.substring(0, 2) + ' ' + data.serial_number?.slice(2) : '',
      birthday: filters.filterMonthDate(data.birthday),
      studentStatus: data.status_name,
      gender_name: data.gender_name,
      citizenship_name: data.citizenship_name,
      nationality_name: data.nationality_name,
      education_type_name: data.education_type_name,
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
      status_study: data.status_name,
      student_type_name: data.student_type_name
    }

    dpmData.value = {
      pinfl: data.pinfl,
      firstname: data.firstname,
      lastname: data.lastname,
      fathername: data.fathername,
      birthday: filters.filterMonthDate(data.birthday),
      gender_name: data.gender_name,
      country_name: data.country_name,
      citizenship_name: data.citizenship_name,
      payment_type_name: data.payment_type_name,
      serial_number: data.serial_number ? data.serial_number?.substring(0, 2) + ' ' + data.serial_number?.slice(2) : '',
      issue_date: data.issue_date,
      expire_date: data.expire_date,
      given_place: data.given_place,
      status_marriage: data.status_marriage,
      nationality_name: data.nationality_name,
      region: data.region,
      district: data.district,
      address: data.address,
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
      <ApplicationInfo :info="applicationData" />

      <StatusInfo :info="statusData" />

      <AbsInfo :info="absData" />

      <HemisInfo :info="hemisData" />
      
      <DpmInfo :info="dpmData" />
    </b-col>

    <b-col lg="4">
      <ProcessLog />

      <GeneretedCard />
    </b-col>
  </b-row>
</template>
