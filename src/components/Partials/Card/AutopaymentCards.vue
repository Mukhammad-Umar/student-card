<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCardStore } from '@/stores/card'
import { onMounted, reactive, ref, watch } from 'vue'
import { useCoborrowerCardStore } from '@/stores/coborrowerCard'

import TheCard from './TheCard.vue'
import SimpleLoader from '@/components/Common/SimpleLoader.vue'

const props = defineProps({
  client: Object,
  cardsRefresh: Number,
  integrationSystemId: Number
})

const uzCards = ref([])
const route = useRoute()
const humoCards = ref([])
const deletedCards = ref([])
const cardStore = useCardStore()
const coborrowerCardStore = useCoborrowerCardStore()

const cardLoaders = reactive({
  uzCardLoad: true,
  uzCardBalance: true,
  humoLoad: true,
  humoBalance: true,
  deletedLoad: true
})

watch(() => props.cardsRefresh, () => {
  getUzCards()
  getHumo()
})

async function getUzCards() {
  try {
    uzCards.value = []
    cardLoaders.uzCardLoad = true
    const data = route.query?.type
      ? await coborrowerCardStore.getCards({
        organizationDebtorId: route.params.id,
        integrationSystemId: props.integrationSystemId,
        cardGateType: 0
      })
      : await cardStore.getCards({
        organizationDebtorId: route.params.id,
        integrationSystemId: props.integrationSystemId,
        cardGateType: 0
      })
    uzCards.value = data.result
    cardLoaders.uzCardLoad = false
  } catch (err) {}
}

async function getHumo() {
  try {
    humoCards.value = []
    cardLoaders.humoLoad = true
    const data = route.query?.type
      ? await coborrowerCardStore.getCards({
        organizationDebtorId: route.params.id,
        integrationSystemId: props.integrationSystemId,
        cardGateType: 1
      })
      : await cardStore.getCards({
        organizationDebtorId: route.params.id,
        integrationSystemId: props.integrationSystemId,
        cardGateType: 1
      })
    humoCards.value = data.result
    cardLoaders.humoLoad = false
  } catch (err) {}
}

async function getDeletedCards() {
  try {
    deletedCards.value = []
    cardLoaders.deletedLoad = true
    const data = route.query?.type
    ? await coborrowerCardStore.getBlockedCards({
      organizationDebtorId: route.params.id,
      integrationSystemId: props.integrationSystemId
    })
    : await cardStore.getBlockedCards({
      organizationDebtorId: route.params.id,
      integrationSystemId: props.integrationSystemId
    })
    deletedCards.value = data.result
  } finally {
    cardLoaders.deletedLoad = false
  }
}

const updateCards = (key: number) => {
  if (key === 2) {
    getUzCards()
    getHumo()
  } else if (key === 0) getUzCards()
  else getHumo()
}

const updateTwo = (key: number) => {
  if (key === 1) {
    getHumo()
    getDeletedCards()
  } else {
    getUzCards()
    getDeletedCards()
  }
}

onMounted(async () => {
  getUzCards()
  getHumo()
  await getDeletedCards()
})
</script>

<template>
  <b-card no-body class="card-box-shadow">
    <b-card-header class="d-flex justify-content-between">
      <h5 class="card-title mb-0 flex-center">GenesisGate</h5>
      <i class="mdi mdi-update h3 mb-0 text-info cup" v-tooltip="$t('btn_text.refreshCards')" @click="getUzCards(); getHumo();"></i>
    </b-card-header>
    <b-card-body>
      <b-tabs content-class="mt-1" fill>
        <b-tab :title="'UzCard (' + uzCards.length + ')'" active>
          <b-card-body class="scrollbar mh-300">
            <SimpleLoader v-if="cardLoaders.uzCardLoad" />

            <template v-else>
              <div v-if="uzCards?.length">
                <template v-for="card in uzCards" :key="card.id">
                  <TheCard 
                    :card="card" 
                    :balanceLoad="cardLoaders.uzCardBalance" 
                    :integrationSystemId="integrationSystemId" 
                    @emit:cards="updateCards" @emit:action="updateTwo"
                  />
                </template>
              </div>

              <div v-else class="pt-2 flex-center">
                <span class="text-primary">{{ $t('viewBox.noCards') }}</span>
              </div>
            </template>
          </b-card-body>
        </b-tab>
        <b-tab :title="'Humo (' + humoCards.length + ')'">
          <b-card-body class="scrollbar mh-300">
            <SimpleLoader v-if="cardLoaders.humoLoad" />

            <template v-else>
              <div v-if="humoCards?.length">
                <template v-for="card in humoCards" :key="card.id">
                  <TheCard 
                    :card="card" 
                    :balanceLoad="cardLoaders.humoBalance"
                    :integrationSystemId="integrationSystemId" 
                    @emit:cards="updateCards" @emit:action="updateTwo"
                  />
                </template>
              </div>

              <div v-else class="pt-2 flex-center">
                <span class="text-primary">{{ $t('viewBox.noCards') }}</span>
              </div>
            </template>
          </b-card-body>
        </b-tab>
        <b-tab :title="$t('rejectedCards') + ' (' + deletedCards.length + ')'">
          <b-card-body class="scrollbar mh-300">
            <SimpleLoader v-if="cardLoaders.deletedLoad" />

            <template v-else>
              <div v-if="deletedCards?.length">
                <template v-for="card in deletedCards" :key="card.id">
                  <TheCard 
                    :card="card" 
                    :removes="true"
                    :balanceLoad="false"
                    :integrationSystemId="integrationSystemId" 
                    @emit:action="updateTwo" 
                  />
                </template>
              </div>

              <div v-else class="pt-2 flex-center">
                <span class="text-primary">{{ $t('viewBox.noCards') }}</span>
              </div>
            </template>
          </b-card-body>
        </b-tab>
      </b-tabs>
    </b-card-body>
  </b-card>
</template>
