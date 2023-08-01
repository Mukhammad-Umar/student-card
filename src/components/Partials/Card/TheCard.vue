<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useCardStore } from '@/stores/card'

import filters from '@/filters'
import BankType from './BankType.vue'
import CardType from '@/components/Partials/Card/CardType.vue'
import MakeSureDialog from '../../Dialogs/MakeSureDialog.vue'

const props = defineProps({
  card: Object,
  removes: Boolean,
  balanceLoad: Boolean,
  integrationSystemId: Number
})

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()

const loading = ref(false)
const detectText = ref('')
const dialogText = ref('')
const modals = reactive({ modal: false })

const preAction = (text: string) => {
  detectText.value = text
  modals.modal = true
  if (text === 'approve') dialogText.value = t('viewBox.isApprove')
  else if (text === 'restore') dialogText.value = t('viewBox.restoreCard') + '?'
  else if (text === 'delete') dialogText.value = t('cancelCard') + '?'
}

async function actionCard() {
  try {
    loading.value = true
    let resText: string = ''
    let data

    if (detectText.value === 'approve') {
      resText = t('success.successApproved')
      data = await cardStore.verifyCard({
        organizationDebtorId: route.params.id,
        integrationSystemId: props.integrationSystemId,
        id: props.card?.id
      })
    } else if (detectText.value === 'restore') {
      resText = t('success.successRestored')
      data = await cardStore.setUnblockCard({
        organizationDebtorId: route.params.id,
        integrationSystemId: props.integrationSystemId,
        id: props.card?.id
      })
    } else if (detectText.value === 'delete') {
      resText = t('success.successDeleted')
      data = await cardStore.setBlockCard({
        organizationDebtorId: route.params.id,
        integrationSystemId: props.integrationSystemId,
        id: props.card?.id
      })
    }

    if (data.result) {
      toast.success(resText)
      modals.modal = false
      if (props.card?.pan.slice(0, 4) === '9860') emit(detectText.value === 'approve' ? 'emit:cards' : 'emit:action', 1)
      else emit(detectText.value === 'approve' ? 'emit:cards' : 'emit:action', 0)
    }
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['emit:cards', 'emit:action'])
</script>

<template>
  <div class="mx-auto position-relative card-pattern">
    <div class="text-bg-info card-wallpaper bg-gradient p-4 rounded-3 mb-3">
      <div class="d-flex">
        <BankType :pan="card?.pan" />
        <div class="flex-shrink-0">
          <card-type :pan="card?.pan" class="display-2 mt-n3 cards-card-type justify-content-start"></card-type>
        </div>
      </div>

      <div class="card-number fs-20" id="card-num-elem">{{ filters.filterCard(card?.pan) }}</div>

      <b-row class="mt-4">
        <b-col cols="12">
          <div>
            <div class="text-white-50">{{ $t('cardHolder') }}</div>
            <div id="card-holder-elem" class="fw-medium fs-14">{{ card?.fullName }}</div>
          </div>
        </b-col>

        <!-- <b-col cols="4">
          <div class="expiry">
            <div class="text-white-50">{{ $t('balance') }}</div>
            <div class="fw-medium fs-14">
              <span id="card-balance-elem">
                {{ card?.balance ? filters.filterMoney(card.balance / 100) : 0 }}
              </span>
            </div>
          </div>
        </b-col> -->

        <div class="card-error-message position-absolute px-0">
          <p v-if="card?.status === 100">{{ $t('error.unveilableBanks')}} </p>
          <p v-else-if="card?.status === 101">{{ $t('error.matchError')}} </p>
          <p v-else-if="card?.status === 103">{{ $t('error.overdraftCard')}} </p>
          <p v-else-if="card?.status === 104">{{ $t('error.creditCard')}} </p>
          <p v-else-if="card?.status !== 100 && card?.status !== 0">{{ $t('error.blockedCard')}} </p>
        </div>

        <div class="cards-btns position-absolute px-0">
          <template v-if="removes">
            <i
              @click="preAction('restore')"
              v-can="['action_on_cards']" v-tooltip="$t('viewBox.restoreCard')"
              class="mdi mdi-restore label-icon align-middle rounded-pill fs-18 pb-1 cup float-end"
            ></i>
          </template>
          <template v-else>
            <i
              v-if="card?.status === 101"
              @click="preAction('approve')"
              v-can="['action_on_cards']" v-tooltip="$t('viewBox.approveWriteOff')"
              class="mdi mdi-check-outline label-icon align-middle rounded-pill fs-18 pb-1 cup float-end"
            ></i>
            <i
              @click="preAction('delete')"
              v-can="['action_on_cards']" v-tooltip="$t('cancelCard')"
              class="mdi mdi-cancel label-icon align-middle rounded-pill fs-18 pb-1 cup float-end"
            ></i>
          </template>
        </div>
      </b-row>
    </div>

    <MakeSureDialog :modals="modals" :loading="loading" @emit:close="modals.modal = false" @emit:success="actionCard">
      {{ dialogText }}
    </MakeSureDialog>
  </div>
</template>

<style lang="scss">
.card-wallpaper{
  background-color: var(--bg-color) !important;
}

.card-pattern{
  min-width: 270px;
  max-width: 370px;
}

.card-info-row {
  margin-top: 38px;
}

.cards-card-type {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 72px;
  height: 72px;
}

.card-error-message {
  display: flex;
  align-items: center;
  top: 106px;
  left: 0;
  right: 0;
  z-index: 3;
}

.card-error-message p {
  width: 100%;
  padding: 5px;
  text-align: center;
  background-color: #f23d5b;
  color: #fff;
}

.cards-btns {
  bottom: 0;
  right: 0;
  i {
    padding-right: 12px;
  }
}

@media (max-width: 450px){
  .card-number{
    font-size: 16px !important;
  }

  .card-error-message{
    top: 101px;
  }

  #card-holder-elem, 
  #card-balance-elem{
    font-size: 12px !important;
  }
}
</style>
