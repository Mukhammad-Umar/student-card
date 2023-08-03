<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useClientStore } from '@/stores/client'
import { useWhiteListStore } from '@/stores/whiteList'
import { useCoborrowerStore } from '@/stores/coborrower'
import { computed, ref, reactive, onMounted } from 'vue'
import MakeSureDialog from '@/components/Dialogs/MakeSureDialog.vue'

const props = defineProps({ clientId: String })

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const clientStore = useClientStore()
const whiteListStore = useWhiteListStore()
const coborrowerStore = useCoborrowerStore()

const info: any = ref({})
const loading = ref(true)
const modalLoading = ref(false)
const excludeInfo: any = ref({})
const modals = reactive({ modal: false })

const titles = computed(() => {
  return [
    { name: t('userInfo.lastName'), key: 'lastName' },
    { name: t('userInfo.name'), key: 'firstName' },
    { name: t('userInfo.middleName'), key: 'middleName' },
    { name: t('userInfo.dateBirth'), key: 'birthDate' },
    { name: t('userInfo.pinfl'), key: 'pinfl' },
    { name: t('userInfo.numberSeries'), key: 'passportInfo' }
  ]
})

async function getData() {
  loading.value = true

  const data = route.query?.type 
    ? await coborrowerStore.getById(props.clientId || route.params.id)
    : await clientStore.getById(props.clientId || route.params.id)

  if (data.result.passportInfo) {
    data.result.passportInfo = data.result.passportInfo.substring(0, 2).toUpperCase() + ' ' + data.result.passportInfo.substring(2)
  }
  info.value = data.result

  emit('emit:client', info.value)
  existWhiteList(info.value.organizationDebtorId)
}

async function existWhiteList(organizationDebtorId: string) {
  const data = await clientStore.getExcludeClient(organizationDebtorId)
  excludeInfo.value = data.result
  setTimeout(() => (loading.value = false), 0)
}

async function addWhiteList() {
  try{
    modalLoading.value = true
    const data = await whiteListStore.addPayer({
      organizationDebtorId: info.value.organizationDebtorId
    })
    modals.modal = false
    toast.success(t('success.added'))
    existWhiteList(info.value.organizationDebtorId)
  } finally {
    modalLoading.value = false
  }
}

async function removeWhiteList() {
  try{
    modalLoading.value = true
    const data = await whiteListStore.removeByOrganizationDebtor(info.value.organizationDebtorId)
    modals.modal = false
    toast.success(t('success.deleted'))
    existWhiteList(info.value.organizationDebtorId)
  } finally {
    modalLoading.value = false
  }
}

onMounted(() => getData())

const emit = defineEmits(['emit:client'])
</script>

<template>
  <div class="px-0">
    <div
      v-if="excludeInfo?.success"
      class="warning-message br-6 d-flex align-items-center bg-white mb-2"
    >
      <span>
        Данный плательщик находится в белом листе. Дата:
        {{ excludeInfo.createDate }}. Добавлен со стороны
        {{ excludeInfo.createdByUserName }}.
      </span>
    </div>

    <b-card no-body class="card-box-shadow">
      <b-card-header class="d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-1">{{ $t('viewBox.clientData') }}</h5>

        <div v-if="!loading" class="d-flex flex-wrap justify-content-end">
          <b-button 
            v-if="excludeInfo?.success === false" variant="info" 
            class="mb-1" @click="modals.modal = true" v-can="['client_white_list_add']"
          >
            {{ $t('btn_text.addWhiteList') }} <i class="mdi mdi-plus"></i>
          </b-button>

          <b-button 
            v-else class="mb-1" @click="modals.modal = true"
            v-can="['client_white_list_remove']" variant="danger" 
          >
            Удалить из белого листа
          </b-button>

          <b-button
            variant="info" class="mb-1 ml-2"
            v-if="route.name !== 'MainStudentsContractsView'" 
            :to="{ name: 'MainStudentsContractsView', params: { id: info.organizationDebtorId } }"
          >
            {{ $t('goToPage') }} <i class="mdi mdi-arrow-right"></i>
          </b-button>
        </div>
      </b-card-header>
      <b-card-body class="row g-4">
        <b-col lg="4" md="6" sm="6" v-for="(title, index) in titles" :key="index">
          <div>
            <label class="form-label">{{ title.name + ' ' }}</label>
            <input type="text" class="form-control" :value="info[title.key]" readonly />
          </div>
        </b-col>
      </b-card-body>
    </b-card>

    <MakeSureDialog
      :modals="modals"
      :loading="modalLoading"
      @emit:close="modals.modal = false"
      @emit:success="excludeInfo?.success ? removeWhiteList() : addWhiteList()"
    >
      {{ excludeInfo?.success ? 'Удалить из белого листа?' : $t('btn_text.addWhiteList') + '?' }}
    </MakeSureDialog>
  </div>
</template>
