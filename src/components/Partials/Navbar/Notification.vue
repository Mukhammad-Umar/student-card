<script setup lang="ts">
import { SimpleBar } from 'simplebar-vue3'
</script>

<template>
  <div class="dropdown topbar-head-dropdown ms-1 header-item">
    <button
      type="button"
      class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
      id="page-header-notifications-dropdown"
      data-bs-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <i class="bx bx-bell fs-22"></i>
      <span class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
        3<span class="visually-hidden">unread messages</span>
      </span>
    </button>
    <div
      class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
      aria-labelledby="page-header-notifications-dropdown"
    >
      <div class="dropdown-head bg-primary bg-pattern rounded-top">
        <div class="p-3">
          <b-row class="align-items-center">
            <b-col>
              <h6 class="m-0 fs-16 fw-semibold text-white">Notifications</h6>
            </b-col>
            <b-col cols="auto" class="dropdown-tabs">
              <b-badge variant="light" class="badge-soft-light fs-13"> 4 New</b-badge>
            </b-col>
          </b-row>
        </div>

        <div class="px-2 pt-2">
          <ul
            class="nav nav-tabs dropdown-tabs nav-tabs-custom"
            data-dropdown-tabs="true"
            id="notificationItemsTab"
            role="tablist"
          >
            <li class="nav-item">
              <b-link
                class="nav-link active"
                data-bs-toggle="tab"
                href="#all-noti-tab"
                role="tab"
                aria-selected="false"
                @click.capture.stop
              >
                All (4)
              </b-link>
            </li>
            <li class="nav-item">
              <b-link
                class="nav-link"
                data-bs-toggle="tab"
                href="#messages-tab"
                role="tab"
                aria-selected="true"
                @click.capture.stop
              >
                Messages
              </b-link>
            </li>
            <li class="nav-item">
              <b-link
                class="nav-link"
                data-bs-toggle="tab"
                href="#alerts-tab"
                role="tab"
                aria-selected="false"
                @click.capture.stop
              >
                Alerts
              </b-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="tab-content" id="notificationItemsTabContent">
        <div class="tab-pane fade py-2 ps-2 show active" id="all-noti-tab" role="tabpanel">
          <SimpleBar data-simplebar style="max-height: 300px" class="pe-2">
            <div class="text-reset notification-item d-block dropdown-item position-relative">
              <div class="d-flex">
                <div class="avatar-xs me-3">
                  <span class="avatar-title bg-soft-info text-info rounded-circle fs-16">
                    <i class="bx bx-badge-check"></i>
                  </span>
                </div>
                <div class="flex-1">
                  <b-link href="#!" class="stretched-link">
                    <h6 class="mt-0 mb-2 lh-base">
                      Your <b>Elite</b> author Graphic Optimization
                      <span class="text-secondary">reward</span> is ready!
                    </h6>
                  </b-link>
                  <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                    <span><i class="mdi mdi-clock-outline"></i> Just 30 sec ago</span>
                  </p>
                </div>
                <div class="px-2 fs-15">
                  <input class="form-check-input" type="checkbox" />
                </div>
              </div>
            </div>

            <div class="my-3 text-center">
              <b-button type="button" variant="success">
                View All Notifications
                <i class="ri-arrow-right-line align-middle"></i>
              </b-button>
            </div>
          </SimpleBar>
        </div>

        <div
          class="tab-pane fade py-2 ps-2"
          id="messages-tab"
          role="tabpanel"
          aria-labelledby="messages-tab"
        >
          <SimpleBar data-simplebar style="max-height: 300px" class="pe-2">
            <div class="text-reset notification-item d-block dropdown-item">
              <div class="d-flex">
                <img
                  src="/images/users/user-profile.png"
                  class="me-3 rounded-circle avatar-xs"
                  alt="user-pic"
                />
                <div class="flex-1">
                  <b-link href="#!" class="stretched-link">
                    <h6 class="mt-0 mb-1 fs-13 fw-semibold">James Lemire</h6>
                  </b-link>
                  <div class="fs-13 text-muted">
                    <p class="mb-1">We talked about a project on linkedin.</p>
                  </div>
                  <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                    <span><i class="mdi mdi-clock-outline"></i> 30 min ago</span>
                  </p>
                </div>
                <div class="px-2 fs-15">
                  <input class="form-check-input" type="checkbox" />
                </div>
              </div>
            </div>

            <div class="my-3 text-center">
              <b-button type="button" variant="success">
                View All Messages
                <i class="ri-arrow-right-line align-middle"></i>
              </b-button>
            </div>
          </SimpleBar>
        </div>

        <div class="tab-pane fade p-4" id="alerts-tab" role="tabpanel" aria-labelledby="alerts-tab">
          <div class="w-25 w-sm-50 pt-3 mx-auto">
            <img src="@/assets/images/svg/bell.svg" class="img-fluid" alt="user-pic" />
          </div>
          <div class="text-center pb-5 mt-2">
            <h6 class="fs-18 fw-semibold lh-base">Hey! You have no any notifications</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
