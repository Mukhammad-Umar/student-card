<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { URL_IMG } from '@/defaults'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/user'
import { useFilesStore } from '@/stores/files'
import ChangePassword from './Parts/ChangePassword.vue'

const { t } = useI18n()
const toast = useToast()
const userStore = useUserStore()
const filesStore = useFilesStore()

const tmpImage = ref('')
const formData: any = ref(null)

const userInfo = ref({
  photo: '',
  email: '',
  phone: '',
  userName: '',
  lastName: '',
  firstName: '',
  middleName: ''
})

const userInfoLocale = ref({
  photo: '',
  email: '',
  phone: '',
  userName: '',
  lastName: '',
  firstName: '',
  middleName: ''
})

async function getMe() {
  userInfo.value = await userStore.getMe()
  userInfo.value.phone = userInfo.value.phone?.slice(3)
  userInfoLocale.value = JSON.parse(JSON.stringify(userInfo.value))
}

const resetForm = () => {
  userInfoLocale.value = JSON.parse(JSON.stringify(userInfo.value))
}

async function uploadImg(event: any) {
  tmpImage.value = URL.createObjectURL(event.target.files[0])

  formData.value = new FormData()
  formData.value.append('FolderNameId', '2')
  formData.value.append('Files', event.target.files[0])
}

async function update() {
  if (tmpImage.value) {
    const res = await filesStore.addFile(formData.value)
    userInfoLocale.value.photo = res?.result.path.slice(1)
  }

  const data = await userStore.updateMe({
    photo: userInfoLocale.value.photo,
    email: userInfoLocale.value.email,
    phone: userInfoLocale.value.phone ? '998' + userInfoLocale.value.phone.replace(/[^0-9]/g, '') : '',
    userName: userInfoLocale.value.userName,
    lastName: userInfoLocale.value.lastName,
    firstName: userInfoLocale.value.firstName,
    middleName: userInfoLocale.value.middleName
  })

  if (data) {
    getMe()
    toast.success(t('success.paramMessage'))
  }
}

setTimeout(() => resetForm(), 0)

onMounted(() => getMe())
</script>

<template>
  <div class="position-relative mx-n4 mt-n4">
    <div class="profile-wid-bg profile-setting-img">
      <img src="@/assets/images/header-default-big.webp" class="profile-wid-img" alt="" />
    </div>
  </div>

  <b-row>
    <b-col xxl="3">
      <b-card no-body class="mt-n5">
        <b-card-body class="p-4">
          <div class="text-center">
            <div class="profile-user position-relative d-inline-block mx-auto mb-4">
              <img
                :src="tmpImage
                  ? tmpImage : userInfoLocale.photo
                  ? URL_IMG + userInfoLocale.photo : '/images/users/user-profile.png'
                "
                class="rounded-circle avatar-xl img-thumbnail user-profile-image"
              />
              <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                <input
                  id="profile-img-file-input"
                  type="file" accept=".png, .jpg, .jpeg"
                  class="profile-img-file-input"
                  @change="uploadImg"
                />
                <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                  <span class="avatar-title rounded-circle bg-light text-body">
                    <i class="ri-camera-fill"></i>
                  </span>
                </label>
              </div>
            </div>
            <h5 class="fs-16 mb-1">{{ userInfo.firstName + ' ' + userInfo.lastName }}</h5>
            <p class="text-muted mb-0">{{ userInfo.userName }}</p>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
    <b-col xxl="9">
      <b-card no-body class="mt-xxl-n5">
        <b-card-header>
          <ul class="nav nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
            <li class="nav-item">
              <b-link class="nav-link active" data-bs-toggle="tab" href="#personalDetails" role="tab">
                <i class="fas fa-home"></i>
                {{ $t('personalDetails') }}
              </b-link>
            </li>
            <li class="nav-item">
              <b-link class="nav-link" data-bs-toggle="tab" href="#changePassword" role="tab">
                <i class="far fa-user"></i>
                {{ $t('changePassword') }}
              </b-link>
            </li>
          </ul>
        </b-card-header>

        <b-card-body class="p-4">
          <div class="tab-content">
            <div class="tab-pane active" id="personalDetails" role="tabpanel">
              <form @submit.prevent="update">
                <b-row>
                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="profile-userName" class="form-label text-muted">{{ $t('userInfo.userName') }}</label>
                      <input
                        v-model="userInfoLocale.userName"
                        type="text"
                        class="form-control"
                        id="profile-userName"
                      />
                    </div>
                  </b-col>

                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="profile-firstName" class="form-label text-muted">{{ $t('userInfo.name') }}</label>
                      <input
                        v-model="userInfoLocale.firstName"
                        type="text"
                        class="form-control"
                        id="profile-firstName"
                      />
                    </div>
                  </b-col>

                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="profile-lastName" class="form-label text-muted">{{ $t('userInfo.lastName') }}</label>
                      <input
                        v-model="userInfoLocale.lastName"
                        type="text"
                        class="form-control"
                        id="profile-lastName"
                      />
                    </div>
                  </b-col>

                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="profile-middleName" class="form-label text-muted">{{ $t('userInfo.middleName') }}</label>
                      <input
                        v-model="userInfoLocale.middleName"
                        type="text"
                        class="form-control"
                        id="profile-middleName"
                      />
                    </div>
                  </b-col>

                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="profile-email" class="form-label text-muted">{{ $t('userInfo.email') }}</label>
                      <input
                        v-model="userInfoLocale.email"
                        type="email"
                        class="form-control"
                        id="profile-email"
                      />
                    </div>
                  </b-col>

                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="profile-phone" class="form-label text-muted">{{ $t('userInfo.phoneNumber') }}</label>

                      <div class="input-group">
                        <span class="input-group-text" id="basic-addon1">+998</span>
                        <input
                          v-model="userInfoLocale.phone"
                          id="profile-phone" class="form-control"
                          v-maska data-maska="## ###-##-##"
                        />
                      </div>
                    </div>
                  </b-col>

                  <b-col lg="12">
                    <div class="hstack gap-2 justify-content-end">
                      <b-button type="submit" variant="primary">
                        {{ $t('update') }}
                      </b-button>
                      <b-button type="reset" variant="warning" @click.prevent="resetForm">
                        {{ $t('btn_text.cancel') }}
                      </b-button>
                    </div>
                  </b-col>
                </b-row>
              </form>
            </div>

            <div class="tab-pane" id="changePassword" role="tabpanel">
              <ChangePassword />
            </div>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>
