<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { read, utils } from 'xlsx'
import { Moment } from '@/plugins/moment'
import { useToast } from 'vue-toastification'
import { useFilesStore } from '@/stores/files'
import { useImportFileStore } from '@/stores/importFile'
import { computed, onMounted, reactive, ref, watch } from 'vue'

import filters from '@/filters'
import ListFilter from '@/components/Common/TableFilters.vue'
import NotImportDialog from '../Parts/NotImportDialog.vue'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const { t } = useI18n()
const toast = useToast()
const filesStore = useFilesStore()
const importFileStore = useImportFileStore()

const universities = ref([{ id: null, name: 'Название ВУЗа', disabled: true }])

const filterData: any = reactive({
  search: '',
  univerId: null,
  isImported: null,
  pagination: {
    page: 1,
    totalCount: 0,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 30
  }
})

const tmpData = ref([])
const patternSize = ref(0)
const excelData: any = ref([])
const formData: any = ref(null)
const missingData: any = ref([])
const importingData: any = ref([])

const loading = ref(false)
const modalLoading = ref(false)
const modals = reactive({ modal: false })

const resultQuery = computed(() => {
  if (filterData.search) {
    const search = filterData.search.toLowerCase()
    const filteredData = excelData.value.filter((data: any) => {
      return (
        data.pnfl?.toLowerCase().includes(search) ||
        data.firstName?.toLowerCase().includes(search) ||
        data.passportInfo?.toString().toLowerCase().includes(search) ||
        data.loanId?.toString().toLowerCase().includes(search) ||
        data.cardNumber?.toString().toLowerCase().includes(search)
      )
    })

    tmpData.value = filteredData
    return paginate(filteredData)
  } else {
    return paginate(excelData.value)
  }
})

watch(() => filterData.search, () => {
  filterData.pagination.page = 1
})

const setPages = (data: any) => {
  filterData.pagination.totalCount = data.length
}

const paginate = (items: any) => {
  let page = filterData.pagination.page
  let perPage = filterData.pagination.rowsPerPage
  let from = page * perPage - perPage
  let to = page * perPage
  return items.slice(from, to)
}

watch(() => resultQuery.value, () => {
  if (filterData.search) setPages(tmpData.value)
  else setPages(excelData.value)
})

const importExcel = async (event: any) => {
  const file = event.target.files[0]

  if (file) {
    formData.value = null

    const types = file.name.split('.')[file.name.split('.').length - 1]
    const fileType = ['xlsx', 'xls'].some((item) => item === types)

    if (!fileType) {
      return toast.error('File type error, please select again')
    }

    formData.value = new FormData()
    formData.value.append('FolderNameId', '1')
    formData.value.append('Files', file)

    loading.value = true
    excelData.value = []

    try {
      let tabJson: any = await file2Xce(file)

      if (tabJson && tabJson.length > 0) {
        excelData.value = tabJson

        for (let i = 0; i < excelData.value.length; i++) {
          excelData.value[i].id = i

          if (excelData.value[i]['ПИНФЛ']) {
            excelData.value[i].pnfl = excelData.value[i]['ПИНФЛ'].toString().trim()
            delete excelData.value[i]['ПИНФЛ']
          }

          if (excelData.value[i]['CLI_CODE']) {
            excelData.value[i].cliCode = excelData.value[i]['CLI_CODE'].toString().trim()
            delete excelData.value[i]['CLI_CODE']
          }

          if (excelData.value[i]['BIRDATE']) {
            excelData.value[i].birDate = excelData.value[i]['BIRDATE'].toString().trim()
            delete excelData.value[i]['BIRDATE']
          }
        }

        await setPages(excelData.value)
        await extractMissing()
        loading.value = false
      }
    } catch (e) {
      loading.value = false
    }
  } else {
    excelData.value = []
    missingData.value = []
    importingData.value = []
  }
}

const file2Xce = (file: any) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.onload = function (e: any) {
      let data = e.target.result
      let workbook = read(data, {
        type: 'binary'
      })
      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
        let XL_row_object = utils.sheet_to_json(workbook.Sheets[sheetName])
        let json_object = JSON.parse(JSON.stringify(XL_row_object))
        if (json_object?.length) {
          resolve(json_object)
        }
      })
    }

    reader.onerror = function (ex) {
      console.log(ex)
    }

    reader.readAsBinaryString(file)
  })
}

const extractMissing = async () => {
  missingData.value = []
  importingData.value = []

  for (let i = 0; i < excelData.value.length; i++) {
    let checkPnfl = /^\d+$/.test(excelData.value[i].pnfl)

    if (excelData.value[i].pnfl && excelData.value[i].pnfl.length === 14 && checkPnfl) {
      excelData.value[i].isImported = true
      importingData.value.push(excelData.value[i])
    } else {
      missingData.value.push(excelData.value[i])
      excelData.value[i].isImported = false
    }
  }
}

async function addFile() {
  if (importingData.value.length) {
    const data = await filesStore.addFile(formData.value)
    await submit(data?.result.path.slice(1), data?.result.fileName)
  } else {
    toast.error('Нет данных для импорта')
  }
}

async function submit(filePath: string, fileName: string) {
  try {
    modalLoading.value = true

    let params = JSON.parse(JSON.stringify(importingData.value))
    
    const data = await importFileStore.importFile({
      filePath: filePath,
      fileName: fileName,
      folderNameId: 1,
      rows: params
    })

    if (data?.result) {
      clearFile()
      filterData.search = ''
      filterData.isImported = null
      toast.success(t("success.imported"));
    }

  } catch (e) {
    toast.error('Произошла ошибка')
  } finally {
    modalLoading.value = false
    modals.modal = false
  }
}

const clearFile = () => {
  excelData.value = []
  missingData.value = []
  importingData.value = []
  const file: any = document.querySelector('#inputGroupFile')
  file.value = ''
}

const getFileStats = (url: string) => {
  let fileBlob;
  fetch(url).then((res) => {
    fileBlob = res.blob();
    return fileBlob;
  }).then((fileBlob)=>{
    patternSize.value = fileBlob.size / 1000
  });
}

onMounted(async () => {
  // Example of usage
  getFileStats('/excelPatterns/Template.xlsx');
})
</script>

<template>
  <b-row>
    <b-col lg="8">
      <b-card no-body class="card-box-shadow">
        <b-card-header>
          <h5 class="card-title mb-0">{{ $t('menus.importAll') }}</h5>
        </b-card-header>
        <b-card-body style="padding: 22px 16px;">
          <b-row class="g-4">
            <b-col lg="6">
              <div class="input-group">
                <input type="file" class="form-control" id="inputGroupFile" @change="importExcel" accept=".xls, .xlsx" />
                <label
                  v-if="excelData?.length"
                  class="input-group-text pr-2 pl-2 pt-1 pb-1"
                  @click="clearFile"
                >
                  <i class="mdi mdi-window-close fs-16"></i>
                </label>
                <label v-else class="input-group-text pr-2 pl-2 pt-1 pb-1" for="inputGroupFile">
                  <i class="mdi mdi-paperclip fs-16"></i>
                </label>
              </div>
            </b-col>

            <b-col lg="6">
              <b-form-select
                v-model="filterData.univerId" id="import-univerId"
                :class="{'text-inactive': filterData.univerId === null}"
                :options="universities" value-field="id" text-field="name"
              ></b-form-select>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
    <b-col lg="4">
      <b-card no-body class="card-box-shadow">
        <b-card-header>
          <h5 class="card-title mb-0">{{ $t('templates') }}</h5>
        </b-card-header>
        <b-card-body>
          <b-row class="g-4">
            <div class="gridjs-td">
              <span>
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-3">
                    <div class="avatar-sm bg-light rounded p-1 flex-center">
                      <i class="ri-file-excel-2-line img-fluid text-success fs-24"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <h5 class="fs-14 mb-1">template.xls</h5>
                    <p class="text-muted mb-0">{{ Math.ceil(patternSize) }} {{ $t('kb') }}</p>
                  </div>
                  <div class="ml-auto">
                    <a download href="/excelPatterns/Template.xlsx">
                      <i class="mdi mdi-download-outline fs-24 text-info"></i>
                    </a>
                  </div>
                </div>
              </span>
            </div>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>

    <b-col lg="12">
      <ListFilter :filterData="filterData" :noBtn="true" />
    </b-col>

    <b-col lg="12">
      <b-card no-body class="card-box-shadow">
        <b-card-header class="d-flex justify-content-between">
          <div class="table-count-info d-flex align-items-center mb-1">
            <span class="fs-14 border-end text-right pr-2">
              {{ $t('total') }}: {{ excelData.length }}
            </span>
            <span class="fs-14 border-end text-right pr-2 ml-2">
              {{ $t('importing') }}: {{ excelData.length - missingData.length }}
            </span>
            <span class="fs-14 border-end text-right pr-2 ml-2">
              {{ $t('notImporting') }}: {{ missingData.length }}
            </span>
          </div>

          <div class="d-flex">
            <template v-if="missingData.length">
              <NotImportDialog :data="missingData" />
            </template>

            <b-button
              variant="success" class="mb-1"
              :disabled="!importingData?.length"
              @click="modals.modal = true"
            >
              {{ $t('import') }}
            </b-button>
          </div>
        </b-card-header>
        <b-card-body>
          <div class="table-responsive table-card mb-1">
            <table class="table table-nowrap align-middle" id="orderTable">
              <thead class="text-muted table-light">
                <tr>
                  <th class="sort" data-sort="cliCode">Код клиента</th>
                  <th class="sort text-center" data-sort="pnfl">ПИНФЛ</th>
                  <th class="sort text-center" data-sort="birDate">Дата рождение</th>
                  <th class="sort text-center" data-sort="isImported">Статус</th>
                </tr>
              </thead>

              <tbody v-if="loading">
                <tr>
                  <td colspan="8" class="text-center">
                    <b-spinner variant="info" key="info" type="grow"></b-spinner>
                  </td>
                </tr>
              </tbody>

              <template v-else>
                <tbody
                  v-if="resultQuery?.length"
                  class="list form-check-all"
                  v-for="(row, index) of (resultQuery as any)"
                  :key="index"
                >
                  <tr>
                    <td class="cliCode text-center">{{ row.cliCode }}</td>
                    <td class="pnfl text-center">{{ row.pnfl }}</td>
                    <td class="birDate text-center">{{ row.birDate }}</td>
                    <td class="isImported text-center text-uppercase">
                      <b-badge v-if="row.isImported" variant="success" class="fs-10">Импортируемый</b-badge>
                      <b-badge v-else variant="danger" class="fs-10">Не импортируемый</b-badge>
                    </td>
                  </tr>
                </tbody>

                <tbody v-else>
                  <tr>
                    <td colspan="9" class="text-center text-muted">{{ $t('noData') }}</td>
                  </tr>
                </tbody>
              </template>
            </table>
          </div>

          <b-pagination
            v-model="filterData.pagination.page"
            :total-rows="filterData.pagination.totalCount"
            :per-page="filterData.pagination.rowsPerPage"
            align="end" class="mb-1 mt-3"
          ></b-pagination>
        </b-card-body>
      </b-card>
    </b-col>

    <MakeSureDialog
      :modals="modals"
      :loading="modalLoading"
      @emit:close="modals.modal = false"
      @emit:success="addFile"
    >
      {{ $t('totalImporting') }}: {{ excelData.length - missingData.length }}
    </MakeSureDialog>
  </b-row>
</template>
