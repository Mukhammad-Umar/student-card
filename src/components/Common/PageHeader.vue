<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  route: String,
  text1: String,
  text2: String
})

const items: any = [
  { text: props.text1, route: props.route },
  { text: props.text2, active: true }
]
</script>

<template>
  <b-row>
    <b-col cols="12">
      <div class="page-title-box d-sm-flex align-items-center justify-content-between">
        <h4 class="mb-sm-0">{{ title }}</h4>

        <div class="page-title-right">
          <ol class="breadcrumb m-0">
            <li
              class="breadcrumb-item"
              v-for="(item, index) in items"
              :key="index"
              :class="{ active: item[0] }"
            >
              <b-link v-if="item.route" :to="{ name: item.route }" class="text-primary">{{ item.text }}</b-link>
              <span v-else>{{ item.text }}</span>
            </li>
          </ol>
        </div>
      </div>
    </b-col>
  </b-row>
</template>
