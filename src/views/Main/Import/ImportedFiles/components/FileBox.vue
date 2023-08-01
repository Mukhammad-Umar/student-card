<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useFilesStore } from '@/stores/files'
import { useAutopayFileStore } from '@/stores/autopayFile'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const { file }: any = defineProps<{ file: object }>()

const { t } = useI18n()
const toast = useToast()
const filesStore = useFilesStore()
const selectedFileId: any = ref(null)
const modals = reactive({ modal: false })
const autopayFileStore = useAutopayFileStore()

const allLoad = ref(false)
const fileLoad = ref(false)
const stopLoad = ref(false)
const errorLoad = ref(false)

const mathPercent = (successCount: number, allCount: number) => {
  let difference = ((successCount * 100) / allCount).toFixed(2)
  return Number(difference)
}

const progressColor = computed(() => {
  if(file.state === 2) return 'success-message-bg'
  else if(file.state === 1) return 'warning-message-bg'
  else if(file.state === 3) return 'error-message-bg'
  else return 'info-message-bg'
})

async function downloadFile(path: string) {
  try {
    fileLoad.value = true
    selectedFileId.value = file.id
    const data = await filesStore.getFile({ filePath: path })
    download(data)
  } finally {
    fileLoad.value = false
  }
}

async function downloadErrors(fileId: number) {
  try {
    selectedFileId.value = fileId
    errorLoad.value = true
    const data = await autopayFileStore.downloadErrorByFileId(fileId)
    download(data)
  } finally {
    errorLoad.value = false
  }
}

async function downloadAll(fileId: number) {
  try {
    selectedFileId.value = fileId
    allLoad.value = true
    const data = await autopayFileStore.downloadSuccessByFileId(fileId)
    download(data)
  } finally {
    allLoad.value = false
  }
}

const download = (data: any) => {
  const downloadUrl = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = downloadUrl
  link.setAttribute(
    'download',
    `${file.fileName?.split('.')[0] || 'Файл'}.xlsx`
  ) //any other extension
  document.body.appendChild(link)
  link.click()
  link.remove()
}

async function stopFile(fileId: number) {
  try {
    stopLoad.value = true
    const data = await autopayFileStore.stopFileProcessing({ fileId })

    if (data?.result) {
      modals.modal = false
      toast.success(t('success.stopped'))
      emit('emit:update')
    }
  } finally {
    stopLoad.value = false
  }
}

const emit = defineEmits(['emit:update'])
</script>

<template>
  <b-row class="mb-3 pb-3 border-bottom">
    <b-col lg="6" class="mb-2">
      <h5 class="mb-3">{{ file.organizationName }}</h5>

      <div v-if="file.state === 2" class="success-message br-6 d-flex align-items-center">
        <span>{{ $t('viewInfo.allCompleted') }}</span>
      </div>
      <div v-else-if="file.state === 0" class="info-message br-6 d-flex align-items-center">
        <span>{{ $t('viewInfo.inProccess') }}</span>
      </div>
      <div v-else-if="file.state === 1" class="warning-message br-6 d-flex align-items-center">
        <span>{{ $t('viewInfo.waitProcess') }}</span>
      </div>
      <div v-else-if="file.state === 3" class="error-message br-6 d-flex align-items-center">
        <span>{{ $t('viewInfo.notAllCompleted') }}</span>
      </div>
      <div v-else-if="file.state === 4" class="info-message br-6 d-flex align-items-center">
        <span>{{ $t('viewInfo.forceStopped') }}</span>
      </div>

      <div v-if="file.state !== 0 && file.state !== 1" class="file-progress mt-4">
        <div class="d-flex justify-content-between file-progress-info text-muted">
          <span>{{ $t('viewInfo.completedCount') }}</span>
          <span>{{ file.successCount }} {{ $t('table.of') }} {{ file.allCount }}</span>
        </div>
        <b-progress
          height="7px" :class="progressColor"
          :value="mathPercent(file.successCount, file.allCount)"
        ></b-progress>
      </div>
    </b-col>

    <b-col lg="6" class="d-flex flex-column mb-2">
      <div class="d-flex align-items-center justify-content-end mb-2">
        <div
          class="uploaded-list-top-text d-flex align-items-center cup mr-2"
          @click="downloadFile(file.filePath)"
        >
          <h5 class="mb-0">{{ file.fileName }}</h5>
        </div>

        <b-spinner
          v-if="fileLoad && selectedFileId === file.id"
          variant="primary"
          label="Spinning"
          style="width: 1.4rem; height: 1.4rem"
        ></b-spinner>

        <i v-else @click="downloadFile(file.filePath)" class="mdi mdi-download-outline fs-24 text-info cup"></i>
      </div>

      <router-link
        v-if="file.state !== 0 && file.state !== 1"
        :to="{name: 'MainImportView', params: { id: file.id }}"
        class="text-primary ms-auto"
      >{{ $t('viewInfo.viewFile') }}
      </router-link>
    </b-col>

    <b-col lg="12" class="mt-3 d-flex justify-content-between align-items-center">
      <p class="text-muted mb-1">{{ $t('viewInfo.importDate') }}: {{ file.date }}</p>

      <div class="d-flex justify-content-end flex-wrap">
        <b-button
          v-if="file.state !== 0 &&file.state !== 1 &&file.successCount !== file.allCount"
          variant="outline-danger" class="br-6 mb-1" 
          loading-mode="fill" :loading="errorLoad && selectedFileId === file.id"
          @click="downloadErrors(file.id)"
        >
          <i class="mdi mdi-download"></i> {{ $t('viewInfo.errorLoad') }}
        </b-button>

        <b-button
          v-if="file.state !== 0 && file.state !== 1"
          variant="outline-primary" class="ml-3 br-6 mb-1" 
          loading-mode="fill" :loading="allLoad && selectedFileId === file.id"
          @click="downloadAll(file.id)"
        >
          <i class="mdi mdi-download"></i> {{ $t('viewInfo.allLoad') }}
        </b-button>

        <b-button
          v-if="file.state === 1 || file.state === 0"
          variant="outline-warning" class="ml-3 px-2 mb-1"
          @click="modals.modal = true"
        >
          <i class="mdi mdi-download"></i> {{ $t('viewInfo.stopFile') }}
        </b-button>
      </div>
    </b-col>

    <MakeSureDialog
      :modals="modals"
      :loading="stopLoad"
      @emit:close="modals.modal = false"
      @emit:success="stopFile(file.id)"
    >
      {{ $t('dialog.finishFile') }}
    </MakeSureDialog>
  </b-row>
</template>
