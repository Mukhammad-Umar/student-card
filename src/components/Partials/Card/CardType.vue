<template>
  <div>
    <div class="nd_card_logo uzcard" v-if="computedCardType === systemCards.CARD_TYPE.UZCARD">
      <img src="/images/cardLogos/uzcard-white.svg" />
      <!--      <img :src="$q.dark.isActive ? '/images/cardLogos/uzcard-white.svg' : '/images/cardLogos/uzcard-blue.svg'" />-->
    </div>

    <div class="nd_card_logo humo" v-else-if="computedCardType === systemCards.CARD_TYPE.HUMO">
      <img src="/images/cardLogos/logo_humo.png" />
    </div>

    <div class="nd_card_logo mir" v-else-if="computedCardType === systemCards.CARD_TYPE.MIR">
      <img src="/images/cardLogos/logo_mir.png" />
    </div>

    <div class="nd_card_logo unionpay" v-else-if="computedCardType === systemCards.CARD_TYPE.UNION">
      <img src="/images/cardLogos/logo_unionpay.png" />
    </div>

    <div class="nd_card_logo visa" v-else-if="computedCardType === systemCards.CARD_TYPE.VISA">
      <img src="/images/cardLogos/logo_visa.png" />
    </div>

    <div
      class="nd_card_logo mastercard"
      v-else-if="computedCardType === systemCards.CARD_TYPE.MASTER"
    >
      <img src="/images/cardLogos/logo_mastercard.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { systemCardsStore } from '@/stores'

const props = defineProps({
  pan: {
    type: String,
    required: true
  }
})

const systemCards = systemCardsStore()

const computedCardType = computed(() => {
  if (props.pan.replace(/[^0-9]/g, '').length < 4) {
    return null
  }

  switch (props.pan.slice(0, 4)) {
    case '8600':
      return systemCards.CARD_TYPE.UZCARD

    case '9860': case '4062':
      return systemCards.CARD_TYPE.HUMO

    case '5614':
      return systemCards.CARD_TYPE.MIR

    case '6262':
      return systemCards.CARD_TYPE.UNION

    case '5440': case '5555':
      return systemCards.CARD_TYPE.MASTER

    case '4278': case '4073': case '4023': case '4790': case '4166':
    case '4097': case '4198': case '4728': case '4008': case '4187':
    case '4294': case '4067':
      return systemCards.CARD_TYPE.VISA
  }
})
</script>
