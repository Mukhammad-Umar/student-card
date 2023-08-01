<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useCardStore } from '@/stores/card'
import CardType from '@/components/Partials/Card/CardType.vue'

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()

const loading = ref(false)
const cardNumber = ref('')
const cardExpire = ref('')
const cardRef: any = ref(null)
const addCardModal = ref(false)
const expireRef: any = ref(null)

watch(() => addCardModal.value, val => {
  if (val) {
    setTimeout(() => cardRef.value.focus(), 0)
  }
})

watch(() => cardNumber.value, val => {
  if (val.replace(/[^0-9]/g, '').length === 16) {
    expireRef.value.focus()
  }
})

async function submit() {
  try {
    loading.value = true
    const cardNum = cardNumber.value.replace(/[^0-9]/g, '')

    if (cardNum.length === 16 && cardExpire.value.length === 5) {
      const data = await cardStore.addCard({
        cardNumber: cardNum,
        cardExpiry: cardExpire.value.split('/')[1] + cardExpire.value.split('/')[0],
        organizationDebtorId: route.params.id
      })

      cardNumber.value = ''
      cardExpire.value = ''
      addCardModal.value = false
      toast.success(t('success.added'))
      emit('emit:success')
    }
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['emit:success'])
</script>

<template>
  <div>
    <b-button
      v-can="['action_on_cards']"
      type="button" variant="info"
      class="add-btn me-1" id="create-btn"
      @click="addCardModal = true"
    >
      {{ $t('btn_text.addCard') }}
    </b-button>

    <!-- add cutomer modal  -->
    <b-modal
      v-model="addCardModal"
      id="showModal"
      hide-footer
      :title="$t('btn_text.addCard')"
      header-class="p-3 bg-light"
      class="v-modal-custom"
      centered
      no-close-on-backdrop
    >
      <b-form @submit.prevent="submit" id="addform" class="tablelist-form" autocomplete="off">
        <div class="w-100 px-2 mb-3">
          <div class="nd_card_block nd_text_shadow mb-4 position-relative mx-auto">
            <div class="card_header">
              <div class="card-logo"></div>
              <card-type :pan="cardNumber"></card-type>
            </div>

            <div class="card_body">
              <p class="nd_text_h1_bah nd_color_white text-left mb-0 mt-4">
                {{ cardNumber }}
              </p>
            </div>

            <div class="card_footer d-flex justify-content-end">
              <p class="nd_text_h1_bah nd_color_white mb-0">
                {{ cardExpire }}
              </p>
            </div>
          </div>

          <div class="row mt-4">
            <b-col md="8" class="input-with-info px-2 mb-2">
              <h6 class="input-title">
                {{ $t('dialog.cardNumber') }}
                <span class="text-danger">*</span>
              </h6>
              <b-form-input
                v-model="cardNumber"
                ref="cardRef"
                color="deep-purple-12"
                v-maska
                data-maska="#### #### #### ####"
                placeholder="#### #### #### ####"
              />
            </b-col>
            <b-col md="4" class="input-with-info px-2 mb-2">
              <h6 class="input-title">
                {{ $t('dialog.cardExpire') }}
                <span class="text-danger">*</span>
              </h6>
              <b-form-input
                v-model="cardExpire"
                ref="expireRef"
                color="deep-purple-12"
                v-maska
                data-maska="##/##"
                placeholder="##/##"
              />
            </b-col>
          </div>
        </div>

        <div class="hstack gap-2 justify-content-center">
          <b-button type="button" id="closemodal" variant="light" @click="addCardModal = false">
            {{ $t('btn_text.close') }}
          </b-button>
          <b-button type="submit" variant="info" :loading="loading" :loading-mode="'fill'">{{
            $t('add')
          }}</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>
