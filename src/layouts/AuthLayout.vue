<script setup lang="ts"></script>

<template>
  <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
    <div class="bg-overlay"></div>
    <div class="auth-page-content overflow-hidden pt-lg-5">
      <b-container>
        <b-row>
          <b-col lg="12">
            <b-card no-body class="overflow-hidden">
              <b-row class="g-0">
                <b-col lg="6" class="bg-white auth-left-part">
                  <div class="p-lg-5 p-4 auth-one-bg h-100">
                    <div class="bg-overlay"></div>
                    <div class="position-relative h-100 d-flex flex-column">
                      <!-- <div class="mb-4">
                        <router-link to="/" class="d-block">
                          <img src="@/assets/Aloqabank.png" alt="" height="18" />
                        </router-link>
                      </div> -->

                      <!-- <div class="mt-auto">
                        <div class="mb-3">
                          <i class="ri-double-quotes-l display-4 text-success"></i>
                        </div>

                        <div
                          id="qoutescarouselIndicators"
                          class="carousel slide"
                          data-bs-ride="carousel"
                        >
                          <div class="carousel-indicators">
                            <button
                              type="button"
                              data-bs-target="#qoutescarouselIndicators"
                              data-bs-slide-to="0"
                              class="active"
                              aria-current="true"
                              aria-label="Slide 1"
                            ></button>
                            <button
                              type="button"
                              data-bs-target="#qoutescarouselIndicators"
                              data-bs-slide-to="1"
                              aria-label="Slide 2"
                            ></button>
                            <button
                              type="button"
                              data-bs-target="#qoutescarouselIndicators"
                              data-bs-slide-to="2"
                              aria-label="Slide 3"
                            ></button>
                          </div>
                          <div class="carousel-inner text-center text-white-50 pb-5">
                            <div class="carousel-item active">
                              <p class="fs-15 fst-italic">
                                " Great! Clean code, clean design, easy for customization. Thanks
                                very much! "
                              </p>
                            </div>
                            <div class="carousel-item">
                              <p class="fs-15 fst-italic">
                                " The theme is really great with an amazing customer support."
                              </p>
                            </div>
                            <div class="carousel-item">
                              <p class="fs-15 fst-italic">
                                " Great! Clean code, clean design, easy for customization. Thanks
                                very much! "
                              </p>
                            </div>
                          </div>
                        </div>
                      </div> -->
                    </div>
                  </div>
                </b-col>

                <b-col lg="6">
                  <!--  login content  -->
                  <router-view></router-view>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <footer class="footer">
      <b-container>
        <b-row>
          <b-col lg="12">
            <div class="text-center">
              <p class="mb-0">&copy; {{ new Date().getFullYear() }} 
                <a href="https://aloqabank.uz/" target="_blank" class="text-white"> Aloqabank</a> 
              </p>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>
