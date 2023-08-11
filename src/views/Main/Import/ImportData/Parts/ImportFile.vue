<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { read, utils } from 'xlsx'
import { useToast } from 'vue-toastification'
import { ref, reactive, onMounted } from 'vue'
import { useImportFileStore } from '@/stores/importFile'

import filters from '@/filters'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const { t } = useI18n()
const toast = useToast()
const fileName = ref('')
const patternSize = ref(0)
const excelData: any = ref([])
const importFileStore = useImportFileStore()

const modal = ref(false)
const loading = ref(false)
const modalLoading = ref(false)
const modals = reactive({ modal: false })
const universities = ref([{ id: null, name: 'Название ВУЗа', disabled: true }])

const filterData: any = reactive({
  univerId: null,
  pagination: {
    page: 1,
    totalCount: 0,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 30
  }
})

const importExcel = async (event: any) => {
  const file = event.target.files[0]
  fileName.value = file.name

  if (file) {
    const types = file.name.split('.')[file.name.split('.').length - 1]
    const fileType = ['xlsx', 'xls'].some((item) => item === types)

    if (!fileType) {
      return toast.error('File type error, please select again')
    }

    loading.value = true
    excelData.value = []

    try {
      let tabJson: any = await file2Xce(file)

      if (tabJson && tabJson.length > 0) {
        excelData.value = tabJson

        for (let i = 0; i < excelData.value.length; i++) {
          excelData.value[i].id = i

          if (excelData.value[i]['ПИНФЛ']) {
            excelData.value[i].pinfl = excelData.value[i]['ПИНФЛ'].toString().trim()
            delete excelData.value[i]['ПИНФЛ']
          }

          if (excelData.value[i]['CLI_CODE']) {
            excelData.value[i].cli_code = excelData.value[i]['CLI_CODE'].toString().trim()
            delete excelData.value[i]['CLI_CODE']
          }

          if (excelData.value[i]['BIRDATE']) {
            excelData.value[i].birdate = excelData.value[i]['BIRDATE'] ? filters.filterDate(excelData.value[i]['BIRDATE']) : ''
            delete excelData.value[i]['BIRDATE']
          }

          if (excelData.value[i]['CLI_DEA_CNT']) {
            excelData.value[i].cli_dea_cnt = excelData.value[i]['CLI_DEA_CNT'].toString().trim()
            delete excelData.value[i]['CLI_DEA_CNT']
          }
        }

        loading.value = false
      }
    } catch (e) {
      loading.value = false
    }
  } else {
    excelData.value = []
  }
}

const file2Xce = (file: any) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.onload = function (e: any) {
      let data = e.target.result
      let workbook = read(data, {
        type: "binary", cellDates: true, dateNF: 'yyyy-mm-dd'
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

    reader.onerror = function (ex) { console.log(ex) }
    reader.readAsBinaryString(file)
  })
}

async function submit() {
  try {
    modalLoading.value = true

    let params: any = []
    excelData.value.map((data: any) => {
      params.push({
        pinfl: data.pinfl,
        cli_code: data.cli_code,
        cli_dea_cnt: data.cli_dea_cnt || '',
        birdate: data.birdate?.split('.').reverse().join('-') || ''
      })
    })

    const data = await importFileStore.importFile({
      file_name: fileName.value,
      data: params
    })

    if (data) {
      clearFile()
      toast.success(t("success.imported"));
    }

    emit('emit:refresh')
  } catch (e) {
    toast.error('Произошла ошибка')
  } finally {
    modalLoading.value = false
    modals.modal = false
    modal.value = false
  }
}

const clearFile = () => {
  excelData.value = []
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

const emit = defineEmits(['emit:refresh'])
</script>

<template>
  <b-button class="mb-1 fs-14" variant="outline-success" @click="modal = true">
    <i class="mdi mdi-file-excel-outline fs-16"></i> Импортировать
  </b-button>

  <!-- add cutomer modal  -->
  <b-modal
    v-model="modal"
    id="showModal"
    title="Импортировать"
    header-class="p-3 bg-light"
    class="v-modal-custom import-modal"
    hide-footer centered no-close-on-backdrop
  >
    <b-card no-body>
      <b-card-header>
        <h5 class="card-title mb-0">Импорт файлов</h5>
      </b-card-header>
      <b-card-body>
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

          <b-col lg="12" class="d-flex justify-content-end">
            <b-button
              variant="success" class="mb-1 px-5"
              :disabled="!excelData?.length"
              @click="modals.modal = true"
            >
              {{ $t('import') }}
            </b-button>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <b-card no-body class="w-50">
      <b-card-header>
        <h5 class="card-title mb-0">Шаблоны</h5>
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
                    <i class="mdi mdi-download-outline fs-24 text-success"></i>
                  </a>
                </div>
              </div>
            </span>
          </div>
        </b-row>
      </b-card-body>
    </b-card>

    <MakeSureDialog
      :modals="modals"
      :loading="modalLoading"
      @emit:close="modals.modal = false"
      @emit:success="submit"
    >
      {{ $t('totalImporting') }}: {{ excelData.length }}
    </MakeSureDialog>
  </b-modal>
</template>
