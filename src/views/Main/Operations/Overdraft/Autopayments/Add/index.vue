<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import FormComponent from './Parts/FormComponent.vue'
import AutopaymentsTable from '@/components/Partials/ListView/AutopaymentsTable.vue'

const { t } = useI18n()
const clientId = ref('')
const toast = useToast()
const router = useRouter()
const haveData = ref(false)
const isCollapsed = ref(false)

const assignClientId = (id: any) => {
  if (id) {
    haveData.value = false
    isCollapsed.value = false
    clientId.value = id
    setTimeout(() => (isCollapsed.value = true), 0)
  } else isCollapsed.value = false
}

const checkLength = (key: number) => {
  if (key > 0) haveData.value = true
  else haveData.value = false
}

const result = () => {
  toast.success(t('success.added'))
  router.push({ name: 'MainOperationsOverdraftsAutopaymentsList' })
}
</script>

<template>
  <b-row>
    <b-col lg="12">
      <FormComponent @emit:val="assignClientId" @emit:success="result" />
    </b-col>

    <b-collapse id="collapse-4" v-model="isCollapsed" class="mt-2">
      <b-col lg="12" v-if="isCollapsed" v-show="haveData">
        <AutopaymentsTable :clientId="clientId" @emit:show="checkLength" :onlyActives="true" />
      </b-col>
    </b-collapse>
  </b-row>
</template>
