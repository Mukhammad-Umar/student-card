<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useCoreStore } from '@/stores/core'
import { useCardStore } from '@/stores/card'
import { ref, reactive, computed, onMounted } from 'vue'
import { useAutopayFileStore } from '@/stores/autopayFile'

import filters from '@/filters'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const coreStore = useCoreStore()
const cardStore = useCardStore()
const autopayFile = useAutopayFileStore()

const fileList: any = ref({})
const numerationIndex = ref(1)
const universities: any = ref([])

const loading = ref(false)
const fileLoad = ref(false)
const modalLoading = ref(false)
const modals = reactive({ modal: false })

const statuses = ref([{ id: null, name: 'Статус', disabled: true }])

const filterData: any = reactive({
  fio: null,
  pinfl: null,
  status: null,
  fileName: '',
  hemisId: null,
  university: null,
  passportInfo: null,
  pagination: {
    page: 1,
    rowsNumber: 1,
    totalCount: 1,
    successCount: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 30
  },
})

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'pinfl', label: t('filters.pinfl'), class: 'text-center' },
  { key: 'firstname', label: t('filters.fio') },
  { key: 'university_name', label: 'Название Вуза' },
  { key: 'serial_number', label: t('userInfo.numberSeries'), class: 'text-center',
    formatter: (value: any) => value ? value.substring(0, 2) + ' ' + value.slice(2) : '',
  },
  { key: 'hemis_id', label: 'ID студента', class: 'text-center' },
  { key: 'faculty_name', label: 'Факультет/Отделение', class: 'text-center' },
  { key: 'status', label: t('status'), class: 'text-center' },
])

async function getUniversities() {
  const data = await coreStore.getUniversities()
  universities.value = data
  universities.value.unshift({ hemis_code: null, name: 'Все ВУЗы' })
}

async function getFileInfoByFileId() {
  try {
    loading.value = true

    const data = await autopayFile.getFileInfoByFileId({
      pinfl: filterData.pinfl,
      status: filterData.status,
      full_name: filterData.fio,
      upload_id: route.params.id,
      hemis_id: filterData.hemisId,
      university_code: filterData.university,
      serial_number: filterData.passportInfo ? filterData.passportInfo.toUpperCase()?.replace(/\s/g, "") : null,
      count: filterData.pagination.page,
      page_size: filterData.pagination.rowsPerPage,
    })

    fileList.value = data?.results
    filterData.pagination.totalCount = data?.total
    filterData.pagination.successCount = data?.pending_to_print
    filterData.pagination.rowsNumber = Math.ceil(data?.total / data?.page_size)

    filterData.fileName = data?.results?.length ? data?.results[0].file_name : ''

    numerationIndex.value = (filterData.pagination.page - 1) * filterData.pagination.rowsPerPage
    signIndex()
  } finally {
    loading.value = false
  }
}

const signIndex = () => {
  if (fileList.value.length) {
    fileList.value.forEach((record: any, index: any) => {
      if (filterData.pagination.page === 1) record.index = index + 1
      else record.index = numerationIndex.value + index + 1
    })
  }
}

async function sendToPrint(){
  try{
    modalLoading.value = true
    const data = await cardStore.sendToPrint([
      { id: route.params.id }
    ])
    
    if(data.student_being_proccessed?.length){
      toast.success("Файл успешно отправлен на печать");
    }
  } finally {
    modals.modal = false
    modalLoading.value = false
  }
}

async function downloadFile(path: string) {
  try {
    fileLoad.value = true
    const link = document.createElement('a')
    link.href = path
    link.setAttribute('download',`Файл.xlsx`) // any other extension
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    fileLoad.value = false
  }
}

onMounted(async () => {
  await getUniversities()
  await getFileInfoByFileId()
})
</script>

<template>
  <b-row class="table-list mb-3">
    <b-col>
      <TableFilters
        :filterData="filterData"
        :statuses="statuses"
        :universities="universities"
        @emit:search="getFileInfoByFileId"
      />

      <div class="d-flex justify-content-between">
        <div class="mb-2">
          <b-button variant="warning" class="mb-1 px-5" @click="$router.go(-1)">
            {{ $t('btn_text.back') }}
          </b-button>
        </div>

        <div class="d-flex flex-wrap justify-content-end mb-2">
          <!-- <b-button class="mb-1" variant="primary">
            Перезапуск реестра
          </b-button> -->

          <b-button class="ml-2 mb-1" variant="primary" @click="modals.modal = true">
            Отправить на печать
          </b-button>
        </div>
      </div>

      <b-card no-body class="card-box-shadow">
        <b-card-header
          class="align-items-center d-flex flex-wrap justify-content-between"
        >
          <TablePerPage
            :pagination="filterData.pagination"
            @emit:update="getFileInfoByFileId"
          />

          <div class="table-count-info d-flex align-items-center ms-auto">
            <span class="fs-14 border-end text-right pr-2">
              Файл: {{ filterData.fileName }}
            </span>
            <span class="fs-14 border-end text-right pr-2 ml-2">
              Всего: {{ filters.filterMoney(filterData.pagination.totalCount) }}
            </span>
            <span class="fs-14 border-end text-right pr-2 ml-2">
              Обработаны успешно: {{ filters.filterMoney(filterData.pagination.successCount) }}
            </span>
            <span class="fs-14 ml-2 text-right">
              Ошибки: {{ filters.filterMoney(filterData.pagination.totalCount - filterData.pagination.successCount) }}
            </span>
          </div>
        </b-card-header>

        <div class="table-responsive mb-0">
          <b-table
            :items="fileList"
            :fields="fields"
            :busy="loading"
            :show-empty="!loading"
            class="import-view-table"
          >
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-2"></b-spinner>
                <strong>{{ $t('loading') }}...</strong>
              </div>
            </template>

            <template #empty="scope">
              <h6 class="text-center text-muted py-2 mb-0">
                {{ $t('error.noData') }}
              </h6>
            </template>

            <template v-slot:cell(pinfl)="{ item }">
              <router-link :to="{name: 'MainStudentsContractsView', params: {id: item.id}}">{{ item.pinfl }}</router-link>
            </template>

            <template v-slot:cell(firstname)="{ item }">
              <span v-if="item.firstname">{{ item.lastname + ' ' + item.firstname + ' ' + item.fathername }}</span>
            </template>

            <template v-slot:cell(status)="{ item }">
              <b-badge class="fs-11"
                :variant="item.status === 'PENDING_FOR_PRINT' 
                  ? 'primary' : item.status === 'REJECTED' || item.status === 'ERROR' ? 'danger' : 'success'"
              >
                {{ item.status }}
              </b-badge>
            </template>
          </b-table>
        </div>
      </b-card>

      <TablePagination
        :pagination="filterData.pagination"
        @emit:change="getFileInfoByFileId"
      />
    </b-col>

    <MakeSureDialog
      :modals="modals"
      :loading="modalLoading"
      @emit:close="modals.modal = false"
      @emit:success="sendToPrint"
    >
      Файл будет отправлен на печать. Продолжать?
    </MakeSureDialog>
  </b-row>
</template>
