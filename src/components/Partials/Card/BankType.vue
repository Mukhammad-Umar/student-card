<script setup lang="ts">
import { computed } from 'vue'

const { pan }: any = defineProps<{ pan: String }>()

const bankType = computed(() => {
  if (pan?.length < 6) return ''

  switch (pan?.replace(/[^0-9]/g, '').slice(0, 6)) {
    case '860002': case '561468': case '986012':
      return '/images/bank-logos/860002.png' // nbu
    case '860003': case '986002':
      return '/images/bank-logos/860003.png' // sqb (psb)
    case '860004': case '626257': case '986003': case '407342':
      return '/images/bank-logos/860004.png' // agro_bank
    case '860005': case '626292': case '986013':
      return '/images/bank-logos/860005.png' // mikrokredit_bank
    case '860006': case '626291': case '986008':
      return '/images/bank-logos/860006.png' // xalq_bank
    case '860008': case '986014':
      return '/images/bank-logos/860008.png' // savdogar_bank
    case '860009': case '626248': case '986006':
      return '/images/bank-logos/860009.png' // qqb
    case '860011': case '986015':
      return '/images/bank-logos/860011.png' // turon_bank
    case '860012': case '626256': case '986016':
      return '/images/bank-logos/860012.png' // hamkor_bank
    case '860013': case '986004':
      return '/images/bank-logos/860013.png' // asaka_bank
    case '860014': case '986017':
      return '/images/bank-logos/860014.png' // ipak_yuli_bank
    case '860020':
      return '/images/bank-logos/860020.png' // ziraat_bank
    case '860030': case '986018':
      return '/images/bank-logos/860030.png' // trast_bank
    case '860031': case '626247': case '986019': case '561468':
      return '/images/bank-logos/860031.png' // aloqa_bank
    case '860033': case '986001':
      return '/images/bank-logos/860033.png' // ipoteka_bank
    case '860034': case '986020':
      return '/images/bank-logos/860034.png' // kdb
    case '860038': case '626282':
      return '/images/bank-logos/860038.png' // turkiston_bank
    case '860043':
      return '/images/bank-logos/860043.png' // saderat_bank
    case '860048': case '626283':
      return '/images/bank-logos/860048.png' // universal_bank
    case '860049': case '986010':
      return '/images/bank-logos/860049.png' // kapital_bank
    case '860050':
      return '/images/bank-logos/860050.png' // ravnaq_bank
    case '860051': case '626273': case '429434': case '986025':
      return '/images/bank-logos/860051.png' // davr_bank
    case '860053': case '986026':
      return '/images/bank-logos/860053.png' // infin_bank
    case '860055': case '986009':
      return '/images/bank-logos/860055.png' // asia_alliance_bank
    case '860056':
      return '/images/bank-logos/860056.png' // htb
    case '860057':
      return '/images/bank-logos/860057.png' // ofb
    case '860058': case '986032':
      return '/images/bank-logos/860058.png' // madad_invest_bank
    case '860059':
      return '/images/bank-logos/860059.png' // uz_agro_export_bank
    case '860060':
      return '/images/bank-logos/860060.png' // poytaxt_bank
    case '986035':
      return '/images/bank-logos/tbc.png' // tbc
    case '986060': case '555536':
      return '/images/bank-logos/anor.png' // anor_bank
    case '986034':
      return '/images/bank-logos/tenge.png' // tenge_bank
    default:
      return ''
  }
})
</script>

<template>
  <div class="flex-grow-1 card-logo d-flex align-items-center mb-2">
    <img :src="bankType" alt="" />
  </div>
</template>
