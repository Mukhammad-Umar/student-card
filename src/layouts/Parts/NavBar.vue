<script setup lang="ts">
import { onMounted } from 'vue'
import { URL_IMG } from '@/defaults'
import { useAuthStore } from '@/stores/auth'
import Language from '@/components/Partials/Navbar/Language.vue'
import Notification from '@/components/Partials/Navbar/Notification.vue'

const props = defineProps({
  userInfo: Object
})

const authStore = useAuthStore()

const toggleDarkMode = () => {
  if (document.documentElement.getAttribute('data-layout-mode') == 'dark') {
    emit('mode-changed', false)
    localStorage.setItem('isDark', 'false')
    document.documentElement.setAttribute('data-sidebar', 'light')
    document.documentElement.setAttribute('data-layout-mode', 'light')
  } else {
    emit('mode-changed', true)
    localStorage.setItem('isDark', 'true')
    document.documentElement.setAttribute('data-sidebar', 'dark')
    document.documentElement.setAttribute('data-layout-mode', 'dark')
  }
}

const toggleHamburgerMenu = () => {
  var windowSize = document.documentElement.clientWidth
  let visiblilityType = document.documentElement.getAttribute('data-sidebar-visibility')

  document.documentElement.setAttribute('data-sidebar-visibility', 'show')

  if (windowSize > 767) document.querySelector('.hamburger-icon')?.classList.toggle('open')

  //For collapse vertical menu

  if (visiblilityType === 'show') {
    if (windowSize < 1025 && windowSize > 767) {
      document.body.classList.remove('vertical-sidebar-enable')
      document.documentElement.getAttribute('data-sidebar-size') == 'sm'
        ? document.documentElement.setAttribute('data-sidebar-size', '')
        : document.documentElement.setAttribute('data-sidebar-size', 'sm')
    } else if (windowSize > 1025) {
      document.body.classList.remove('vertical-sidebar-enable')
      document.documentElement.getAttribute('data-sidebar-size') == 'lg'
        ? document.documentElement.setAttribute('data-sidebar-size', 'sm')
        : document.documentElement.setAttribute('data-sidebar-size', 'lg')
    } else if (windowSize <= 767) {
      document.body.classList.add('vertical-sidebar-enable')
      document.documentElement.setAttribute('data-sidebar-size', 'lg')
    }
  }
}

async function logOut() {
  await authStore.logout()
}

onMounted(() => {
  document.getElementById('topnav-hamburger-icon')?.addEventListener('click', toggleHamburgerMenu)

  document.getElementById('overlay')?.addEventListener('click', () => {
    document.body.classList.remove('vertical-sidebar-enable');
  });
})

const emit = defineEmits(['mode-changed'])
</script>

<template>
  <header id="page-topbar">
    <div class="layout-width">
      <div class="navbar-header">
        <div class="d-flex">
          <button
            type="button"
            class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
            id="topnav-hamburger-icon"
          >
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        <div class="d-flex align-items-center">
          <Language />

          <div class="ms-1 header-item d-none d-sm-flex">
            <b-button
              type="button"
              variant="light"
              class="btn-icon btn-topbar rounded-circle light-dark-mode"
              @click="toggleDarkMode"
            >
              <i class="bx bx-moon fs-22"></i>
            </b-button>
          </div>

          <!-- <Notification /> -->

          <div class="dropdown ms-sm-3 header-item topbar-user">
            <button
              type="button"
              class="btn"
              id="page-header-user-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="d-flex align-items-center">
                <img
                  class="rounded-circle header-profile-user"
                  :src="userInfo?.photo ? URL_IMG + userInfo.photo : '/images/users/user-profile.png'"
                  alt="Profile photo"
                />
                <span class="text-start ms-xl-2">
                  <span class="d-none d-xl-inline-block ms-1 fw-medium user-name-text"
                    >{{ userInfo?.firstName || ' ' }} {{ userInfo?.lastName || ' ' }}</span
                  >
                  <span class="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{{
                    userInfo?.userName
                  }}</span>
                </span>
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
              <h5 class="dropdown-header">{{ $t('welcome') }} !</h5>
              <router-link class="dropdown-item" :to="{ name: 'MainProfile' }"
                ><i class="mdi mdi-account-circle text-info fs-16 align-middle me-1"></i>
                <span class="align-middle">{{ $t('profile') }}</span>
              </router-link>
              <div class="dropdown-divider"></div>
              <b-link class="dropdown-item" @click="logOut"
                ><i class="mdi mdi-logout text-danger fs-16 align-middle me-1"></i>
                <span class="align-middle" data-key="t-logout">{{ $t('menus.logout') }}</span>
              </b-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
