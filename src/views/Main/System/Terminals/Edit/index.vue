<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GroupForm from '../components/GroupForm.vue'
import TerminalForm from '../components/TerminalForm.vue'

const route = useRoute()
const groupForm = ref({})
const terminalForm = ref({})
const groupLoading = ref(false)
const terminalLoading = ref(false)

async function getGroupById() {}

async function getTerminalById() {}

onMounted(async () => {
  await getGroupById()
  await getTerminalById()
})
</script>

<template>
  <GroupForm :form="groupForm" :loading="groupLoading" />
  <TerminalForm :form="terminalForm" :loading="terminalLoading" />
</template>
