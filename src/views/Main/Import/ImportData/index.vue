<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { read, utils } from 'xlsx'
import { Moment } from '@/plugins/moment'
import { useToast } from 'vue-toastification'
import { useFilesStore } from '@/stores/files'
import { useImportFileStore } from '@/stores/importFile'
import { computed, onMounted, reactive, ref, watch } from 'vue'

import filters from '@/filters'
import EposSelect from '@/components/UI/EposSelect.vue'
import BranchSelect from '@/components/UI/BranchSelect.vue'
import ListFilter from '@/components/Common/TableFilters.vue'
import NotImportDialog from '../Parts/NotImportDialog.vue'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const { t } = useI18n()
const toast = useToast()
const filesStore = useFilesStore()
const importFileStore = useImportFileStore()

const filterData: any = reactive({
  search: '',
  eposId: null,
  organizationBranchId: null,
  isImported: null,
  pagination: {
    page: 1,
    totalCount: 0,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 30
  }
})

const tmpData = ref([])
const branches = ref([])
const epos: any = ref([])
const patternSize = ref(0)
const excelData: any = ref([])
const formData: any = ref(null)
const missingData: any = ref([])
const importingData: any = ref([])
const selectedEpos: any = ref(null)

const loading = ref(false)
const modalShow = ref(false)
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

watch(() => filterData.organizationBranchId, val => {
  filterData.eposId = null
  getTerminalGroups(val || 0)
})

watch(() => filterData.eposId, val => {
  if (val) selectedEpos.value = epos.value.filter((oneEpos: any) => oneEpos.id === val)[0].name
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

async function getBranches() {
  const data = await importFileStore.getBranches()
  filterData.organizationBranchId = data.result[0].id || 0
  branches.value = data.result
}

async function getTerminalGroups(organizationBranchId: number) {
  const data = await importFileStore.getTerminalGroups(organizationBranchId)
  if (data.result?.length === 1) filterData.eposId = data.result[0].id
  epos.value = data.result
}

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

          if (excelData.value[i]['Имя']) {
            excelData.value[i].firstName = excelData.value[i]['Имя']?.trim()
            delete excelData.value[i]['Имя']
          }
          if (excelData.value[i]['Фамилия']) {
            excelData.value[i].lastName = excelData.value[i]['Фамилия']?.trim()
            delete excelData.value[i]['Фамилия']
          }
          if (excelData.value[i]['Серия/Номер паспорта']) {
            excelData.value[i].passportInfo = excelData.value[i]['Серия/Номер паспорта']?.toString().replace(/\s/g, '')
            if (excelData.value[i].passportInfo.length === 9) {
              excelData.value[i].passportInfo = excelData.value[i].passportInfo?.slice(0, 2) + ' ' + excelData.value[i].passportInfo?.slice(2, 9)
              delete excelData.value[i]['Серия/Номер паспорта']
            }
          }
          if (excelData.value[i]['Сумма списания']) {
            excelData.value[i].autopayAmount = excelData.value[i]['Сумма списания']?.trim()
            delete excelData.value[i]['Сумма списания']
          }
          if (excelData.value[i]['ID договора']) {
            excelData.value[i].loanId = excelData.value[i]['ID договора'].toString().trim()
            delete excelData.value[i]['ID договора']
          }
          if (excelData.value[i]['ПИНФЛ']) {
            excelData.value[i].pnfl = excelData.value[i]['ПИНФЛ'].toString().trim()
            delete excelData.value[i]['ПИНФЛ']
          }
          if (excelData.value[i]['Дата начало (ДД.ММ.ГГГГ)']) {
            excelData.value[i].startDate = excelData.value[i]['Дата начало (ДД.ММ.ГГГГ)']?.trim()
            delete excelData.value[i]['Дата начало (ДД.ММ.ГГГГ)']
          }
          if (excelData.value[i]['Номер карты']) {
            excelData.value[i].cardNumber = excelData.value[i]['Номер карты']?.trim()
            delete excelData.value[i]['Номер карты']
          }
          if (excelData.value[i]['Срок действия (ммГГ)']) {
            let cardExpire = excelData.value[i]['Срок действия (ммГГ)'].toString()
            excelData.value[i].cardExpiry = cardExpire?.substring(0, 2) + '/' + cardExpire?.substring(2, 4)
            delete excelData.value[i]['Срок действия (ммГГ)']
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
        let json_object = JSON.stringify(XL_row_object)
        let tillParse = JSON.parse(json_object)
        if (tillParse.length) {
          for (let i = 0; i < tillParse.length; i++) {
            if(tillParse[i][' Сумма списания ']){
              tillParse[i]['Сумма списания'] = tillParse[i][' Сумма списания ']
              delete tillParse[i][' Сумма списания ']
            }

            if (tillParse[i]['Сумма списания']) {
              if (typeof tillParse[i]['Сумма списания'] === 'number') {
                tillParse[i]['Сумма списания'] = tillParse[i]['Сумма списания'].toFixed(2)
              }
              if (tillParse[i]['Сумма списания'].indexOf('.')) {
                tillParse[i]['Сумма списания'] = tillParse[i]['Сумма списания'].split('.').join(',')
              }
            }
          }
          resolve(tillParse)
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
    if (excelData.value[i].autopayAmount) {
      excelData.value[i].autopayAmount = excelData.value[i].autopayAmount.toString()

      let tmpCon = excelData.value[i].autopayAmount?.split(',')

      if (tmpCon.length === 2) {
        if (tmpCon[1].length > 1) tmpCon[1] = tmpCon[1]?.substring(0, 2)
        let val = tmpCon.join('').replace(/[^0-9]/g, '')

        if (tmpCon[1].length === 1) excelData.value[i].autopayAmount = parseInt(val) * 10
        else if (tmpCon[1].length === 0) excelData.value[i].autopayAmount = parseInt(val) * 100
        else excelData.value[i].autopayAmount = parseInt(val)
      } else excelData.value[i].autopayAmount = parseInt(excelData.value[i].autopayAmount.replace(/[^0-9]/g, '')) * 100
    }

    let checkPnfl = /^\d+$/.test(excelData.value[i].pnfl)
    let checkNumber = /^\d+$/.test(excelData.value[i].passportInfo?.substring(3, 10))

    if (
      excelData.value[i].pnfl && excelData.value[i].pnfl.length === 14 &&
      excelData.value[i].passportInfo && excelData.value[i].passportInfo.includes(' ') &&
      excelData.value[i].passportInfo.toString().length === 10 && checkPnfl && checkNumber
    ) {
      excelData.value[i].isImported = true

      if (excelData.value[i].cardNumber || excelData.value[i].cardExpiry) {
        if (
          !excelData.value[i].cardNumber || excelData.value[i].cardNumber.length !== 16 ||
          !excelData.value[i].cardExpiry || excelData.value[i].cardExpiry.length !== 5
        ) {
          missingData.value.push(excelData.value[i])
          excelData.value[i].isImported = false
          continue
        }
      }

      if (!excelData.value[i].startDate) {
        excelData.value[i].startDate = Moment(new Date()).format('DD.MM.YYYY')
      }

      if (excelData.value[i].autopayAmount) {
        if (excelData.value[i].autopayAmount < 0 || !excelData.value[i].loanId) {
          missingData.value.push(excelData.value[i])
          excelData.value[i].isImported = false
          continue
        }
      }

      importingData.value.push(excelData.value[i])
    } else {
      missingData.value.push(excelData.value[i])
      excelData.value[i].isImported = false
    }
  }
}

async function addFile() {
  if (importingData.value.length) {
    if (filterData.eposId) {
      const data = await filesStore.addFile(formData.value)
      await submit(data?.result.path.slice(1), data?.result.fileName)
    } else toast.error('Выберите ЕПОС')
  } else {
    toast.error('Нет данных для импорта')
  }
}

async function submit(filePath: string, fileName: string) {
  try {
    modalLoading.value = true

    let params = JSON.parse(JSON.stringify(importingData.value))

    for (let i = 0; i < params.length; i++) {
      if (params[i].cardExpiry) params[i].cardExpiry = params[i].cardExpiry.split('/').reverse().join('')
      if (params[i].startDate) params[i].startDate = params[i].startDate.split('.').reverse().join('-')

      if (params[i].passportInfo) {
        params[i].passportSeries = params[i].passportInfo.split(' ')[0]
        params[i].passportNumber = params[i].passportInfo.split(' ')[1]
        delete params[i].passportInfo
      }
    }
    
    const data = await importFileStore.importFile({
      organizationBranchId: filterData.organizationBranchId || 0,
      terminalGroupId: filterData.eposId,
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
  await getBranches()

  // Example of usage
  getFileStats('/excelPatterns/TemplateAutoPayments.xlsx');
})
</script>

<template>
  <b-row>
    <b-col lg="8">
      <b-card no-body class="card-box-shadow">
        <b-card-header>
          <h5 class="card-title mb-0">{{ $t('menus.importAll') }}</h5>
        </b-card-header>
        <b-card-body>
          <b-row class="g-4">
            <b-col lg="6">
              <div>
                <label for="import-branch" class="form-label">{{ $t('branch') }}</label>
                <BranchSelect :params="filterData" :branches="branches" />
              </div>
            </b-col>
            <b-col lg="6">
              <div>
                <label for="import-file" class="form-label">{{ $t('epos') }}</label>
                  <b-form-input
                    id="import-file" @click="modalShow = true"
                    :model-value="selectedEpos" class="cup" readonly
                  ></b-form-input>
              </div>
            </b-col>
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
                    <a download href="/excelPatterns/TemplateAutoPayments.xlsx">
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
                  <th class="sort text-center" data-sort="pnfl">ПИНФЛ</th>
                  <th class="sort" data-sort="firstName">Плательщик</th>
                  <th class="sort text-center" data-sort="passportInfo">Серия и Номер паспорта</th>
                  <th class="sort text-center" data-sort="loanId">Названия конт.</th>
                  <th class="sort text-center" data-sort="autopayAmount">Сумма автоплатежа</th>
                  <th class="sort text-center" data-sort="cardNumber">Номер карты</th>
                  <th class="sort text-center" data-sort="cardExpiry">Срок действия</th>
                  <th class="sort text-center" data-sort="startDate">Период</th>
                  <th class="sort text-center" data-sort="isImported">Имортируемые</th>
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
                  <tr :class="{ 'bg-danger': row.isImported === false }">
                    <td class="pnfl text-center">{{ row.pnfl }}</td>
                    <td class="firstName">
                      <span>{{ row.firstName }}</span>
                      <span v-if="row?.lastName">{{ ' ' + row.lastName }}</span>
                    </td>
                    <td class="passportInfo text-center">{{ row.passportInfo }}</td>
                    <td class="loanId text-center">{{ row.loanId }}</td>
                    <td class="autopayAmount text-center">
                      {{ row.autopayAmount ? filters.filterMoney(row.autopayAmount / 100) : '' }}
                    </td>
                    <td class="cardNumber text-center">{{ row.cardNumber ? filters.filterCard(row.cardNumber) : " " }}</td>
                    <td class="cardExpiry text-center">{{ row.cardExpiry }}</td>
                    <td class="startDate text-center">{{ row.startDate }}</td>
                    <td class="isImported text-center text-uppercase">
                      <b-badge v-if="row.isImported" variant="success">{{
                        $t('btn_text.yes')
                      }}</b-badge>
                      <b-badge v-else variant="danger">{{ $t('btn_text.no') }}</b-badge>
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
            align="end"
            class="mb-1 mt-3"
          ></b-pagination>
        </b-card-body>
      </b-card>
    </b-col>

    <b-modal
      v-model="modalShow"
      class="v-modal-custom epos-select-modal" centered
      hide-footer :title="$t('chooseEpos')"
    >
      <div v-if="epos.length" class="w-100 px-1">
        <b-row
          v-for="oneEpos in epos" :key="oneEpos.id"
          @click="filterData.eposId = oneEpos.id" :class="{'active': filterData.eposId === oneEpos.id}"
          class="list-group list-group-dialog justify-content-around pb-1 pt-3 position-relative flex-row cup"
        >
          <p class="absolute-group-name position-absolute w-auto">{{ oneEpos.name }}</p>

          <b-col
            v-for="terminal in oneEpos.terminals" :key="terminal.id"
            lg="6" md="6" sm="12" class="draggable-items row mb-2 position-relative"
          >
            <div class="draggable-items__box d-flex flex-column justify-content-center w-100 px-2 py-1">
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ $t('epos') }}: </span>
                <span class="text-right">{{ terminal.name?.replace(';', ' ') }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ $t('filters.terminalId') }}: </span>
                <span>{{ terminal.terminalId }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ $t('filters.merchantId') }}: </span>
                <span>{{ terminal.merchantId }}</span>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>

      <div v-else class="d-flex justify-content-center w-100 mb-2">
        <span class="text-muted">Нет терминала</span>
      </div>

      <div class="modal-footer v-modal-footer justify-content-center">
        <b-button type="button" class="px-5" variant="warning" @click="modalShow = false"
          >{{ $t('btn_text.close') }}
        </b-button>
      </div>
    </b-modal>

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
