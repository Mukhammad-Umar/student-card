<script setup lang="ts">
import { useCoreStore } from '@/stores/core'
import { useCardStore } from '@/stores/card'
import { useToast } from 'vue-toastification'
import { computed, onMounted, ref, reactive } from 'vue'
import { useImportFileStore } from '@/stores/importFile'

import filters from '@/filters'
import ImportFile from './Parts/ImportFile.vue'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const { filterData }: any = defineProps<{filterData: Object}>()

const toast = useToast()
const fileId = ref(null)
const numerationIndex = ref(1)
const coreStore = useCoreStore()
const cardStore = useCardStore()
const importFileStore = useImportFileStore()

const loading = ref(false)
const modalLoading = ref(false)
const modals = reactive({ modal: false })

const files = ref([])
const users: any = ref([])
const universities: any = ref([])
const universityList: any = ref([])

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'file_name', label: 'Файл' },
  { key: 'username', label: 'Пользователь', class: 'text-center' },
  { key: 'university_name', label: 'Название Вуза', class: 'text-center' },
  { key: 'students_total', label: 'Кол-во записей', class: 'text-center',
    formatter: (val: any) => filters.filterMoney(val) },
  { key: 'ready_to_print_count', label: 'Успешно обработано', class: 'text-center',
    formatter: (val: any) => filters.filterMoney(val) },
  { key: 'status', label: 'Статус', class: 'text-center' },
  { key: 'created_at', label: 'Дата', class: 'text-center',
    formatter: (val: any) => filters.filterDateAndTime(val)},
  { key: 'actions', label: 'Действие', class: 'text-center' },
])

async function getUsers() {
  const data = await coreStore.getUsers()
  users.value = data
  users.value.unshift({ id: null, username: 'Все пользователи' })
}

async function getUniversities() {
  const data = await coreStore.getUniversities()
  universityList.value = JSON.parse(JSON.stringify(data))
  universityList.value.unshift({ hemis_code: null, name: 'Выберите ВУЗа', disabled: true })

  universities.value = data
  universities.value.unshift({ hemis_code: null, name: 'Все ВУЗы' })
}

async function getList() {
  try {
    loading.value = true

    const data = await importFileStore.getImportedFiles({
      date_from: filterData.startDate,
      date_to: filterData.endDate,
      user: filterData.userId,
      university_code: filterData.university,
      count: filterData.pagination.page,
      page_size: filterData.pagination.rowsPerPage
    })

    files.value = data?.results
    filterData.pagination.rowsNumber = Math.ceil(data?.total / data?.page_size)
    filterData.pagination.totalCount = data?.total

    numerationIndex.value = (filterData?.pagination.page - 1) * filterData?.pagination.rowsPerPage
    signIndex()
  } finally {
    loading.value = false
  }
}

const signIndex = () => {
  if (files.value?.length) {
    files.value.forEach((row: any, index) => {
      if (filterData.pagination.page === 1) row.index = index + 1
      else row.index = numerationIndex.value + index + 1
    })
  }
}

async function sendToPrint(){
  try{
    modalLoading.value = true
    const data = await cardStore.sendToPrint([
      { id: fileId.value }
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
    loading.value = true
    const link = document.createElement('a')
    link.href = path
    link.setAttribute('download',`Файл.xlsx`) //any other extension
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getUsers()
  await getUniversities()
  await getList()
})
</script>

<template>
  <b-row>
    <b-col lg="12">
      <TableFilters
        :users="users"
        :filterData="filterData"
        :universities="universities"
        @emit:search="getList"
      />
    </b-col>

    <b-col lg="12" class="mb-3">
      <b-card no-body class="card-box-shadow">
        <b-card-header class="d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">Загруженные файлы</h5>
          <ImportFile :universityList="universityList" @emit:refresh="getList"/>
        </b-card-header>

        <div class="table-responsive mb-0">
          <div class="py-2 px-3">
            <TablePerPage
              :pagination="filterData.pagination"
              @emit:update="getList"
            />
          </div>

          <b-table
            :items="files"
            :fields="fields"
            :busy="loading"
            :show-empty="!loading"
            hover
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

            <template v-slot:cell(status)="{ item }">
              <b-badge v-if="item.status === 'IN_QUEUE'" variant="primary" class="fs-11">В очереди</b-badge>
              <b-badge v-else-if="item.status === 'DATA_LOADING'" variant="primary" class="fs-11">Обрабатывается</b-badge>
              <b-badge v-else-if="item.status === 'LOADED'" variant="success" class="fs-11">Загружен</b-badge>
              <b-badge v-else-if="item.status === 'ERROR'" variant="danger" class="fs-11">Отклонена</b-badge>
            </template>

            <template v-slot:cell(actions)="{ item }">
              <div class="d-flex justify-content-center">
                <i
                  v-if="item.file_to_export"
                  v-tooltip:bottom="'Отправить на печать'"
                  @click="fileId = item.id; modals.modal = true;"
                  class="mdi mdi-send-outline text-primary cup fs-21 ml-1"
                ></i>

                <i
                  v-if="item.file_to_export"
                  v-tooltip:bottom="'Скачать'"
                  @click="downloadFile(item.file_to_export)"
                  class="mdi mdi-tray-arrow-down text-success cup fs-22 ml-1"
                ></i>

                <i
                  class="mdi mdi-arrow-right-circle-outline text-primary cup fs-22 ml-1"
                  @click="$router.push({name: 'MainImportDataView', params: { id: item.id }})" 
                ></i>
              </div>
            </template>
          </b-table>
        </div>
      </b-card>

      <TablePagination
        :pagination="filterData?.pagination"
        @emit:change="getList"
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
