<script setup lang="ts">
import TopInfo from './Parts/TopInfo.vue';
import BottomInfo from './Parts/BottomInfo.vue';
import TransactionsByDay from './Parts/TransactionsByDay.vue';
import TransactionsReverseByDay from './Parts/TransactionsReverseByDay.vue';
</script>

<template>
  <div>
    <TopInfo />

    <TransactionsByDay />

    <TransactionsReverseByDay />

    <BottomInfo />
  </div>
</template>
