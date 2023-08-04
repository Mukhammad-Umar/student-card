<script setup lang="ts">
import { useRoute } from 'vue-router'
import { SimpleBar } from 'simplebar-vue3'
import { ref, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

import Navbar from './Parts/NavBar.vue'
import TheFooter from './Parts/TheFooter.vue'
import SidebarMenu from './Parts/SidebarMenu.vue'
import ProjectContributors from './Parts/ProjectContributors.vue'

const route = useRoute()
const loading = ref(true)
const authStore = useAuthStore()
const userStore = useUserStore()

watch(() => userStore.userInfo,(val) => {
  if (route.name === 'MainProfile') userInfo.value = val
})

const clickCount = ref(0)
const showContributors = ref(false)

watch(() => clickCount.value, val => {
  if(val === 5) showContributors.value = true
})

const closeContributors = () => {
  clickCount.value = 0
  showContributors.value = false
}

async function checkTokenValid() {
  try {
    const data = await authStore.checkTokenValid()
    if (!data?.result.success) await authStore.logout()
    else await getMe()
  } catch (e) {
    await authStore.errorLogout()
    loading.value = false
  }
}

// onMounted(() => checkTokenValid())

const userInfo = ref({})

async function getMe() {
  try {
    const data = await userStore.getMe()
    userInfo.value = data
  } finally {
    loading.value = false
  }
}

const webMode = ref(JSON.parse(localStorage.getItem('isDark') as string) ?? false)

const initActiveMenu = () => {
  if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover') {
    localStorage.setItem('hoverd', 'true')
    document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active')
  } else if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover-active') {
    localStorage.setItem('hoverd', 'false')
    document.documentElement.setAttribute('data-sidebar-size', 'sm-hover')
  } else {
    document.documentElement.setAttribute('data-sidebar-size', 'sm-hover')
  }
}

const modeChanged = (val: boolean) => (webMode.value = val)

onMounted(() => {
  document.documentElement.setAttribute('data-layout', 'vertical')
  document.documentElement.setAttribute('data-sidebar-size', 'lg')
  document.documentElement.setAttribute('data-sidebar-visibility', 'show')
})
</script>

<template>
  <div id="layout-wrapper">
    <!-- <ProjectContributors v-if="showContributors" @emit:close="closeContributors" /> -->

    <Navbar @mode-changed="modeChanged" :userInfo="userInfo" />

    <div>
      <!-- ========== Left Sidebar Start ========== -->
      <!-- ========== App Menu ========== -->
      <div class="app-menu navbar-menu">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <!-- Logo-->
          <router-link :to="{name: 'MainStudents'}" class="logo" :class="webMode ? 'logo-light' : 'logo-dark'" @click="clickCount++">
            <span class="logo-lg">
              <img v-if="!webMode" src="@/assets/aloqa-logo.gif" alt="Aloqabank" height="41" />
              <img v-else src="@/assets/logo-light.svg" alt="Aloqabank" height="28" />
            </span>
            <span class="logo-sm">
              <img src="@/assets/login-logo.svg" alt="" height="24" class="rounded" />
            </span>
          </router-link>
          <button
            type="button" id="vertical-hover"
            class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            @click="initActiveMenu"
          >
            <i class="ri-record-circle-line"></i>
          </button>
        </div>

        <SidebarMenu />
        <div class="sidebar-background"></div>
      </div>
      <!-- Left Sidebar End -->
      <!-- Vertical Overlay-->
      <div class="vertical-overlay" id="overlay"></div>
    </div>
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="main-content">
      <div class="page-content">
        <!-- Start Content-->
        <b-container fluid>
          <router-view></router-view>
        </b-container>
      </div>
      <TheFooter />
    </div>
  </div>
</template>

<style lang="scss">
.navbar-menu .navbar-nav {
  .nav-link.active,
  .nav-sm .nav-link.active {
    color: var(--logo-color);
  }
}
</style>
