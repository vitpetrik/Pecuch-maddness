<template>
  <v-app
    :style="{background: $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].background}"
  >
    <v-navigation-drawer
      color="background"
      app
      v-model="drawer"
      disable-resize-watcher
      disable-route-watcher
      temporary
    >
      <template v-slot:append>
        <v-list>
          <v-list-item>
            <v-select
              v-model="themeSettings"
              @change="themeSettingChange"
              label="Theme setting"
              :items="themeItems"
            ></v-select>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <transition name="fade">
      <v-app-bar dense app dark color="secondary">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <transition name="fade">
          <v-toolbar-title class="montserrat unselectable">Pecuchovo šílenství</v-toolbar-title>
        </transition>
        <div class="flex-grow-1"></div>
        <v-btn icon @click="$router.push('/').catch(() => {})">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-app-bar>
    </transition>

    <v-content>
      <v-container fluid style="padding: 0px 0px 0px 0px" justify-center>
        <v-flex xs12 sm9 md7 lg6 justify-center style="margin:auto">
          <transition name="fade">
            <router-view
              v-if="loaded"
              style="padding: 10px 10px 0px 10px;"
            ></router-view>
            <loading v-else></loading>
          </transition>
        </v-flex>
      </v-container>
    </v-content>

    <transition name="fade">
      <v-footer
        :style="{background: $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].footer}"
        padless
      >
        <v-row justify="center" no-gutters>
          <v-col class="v-card footer py-4 text-center montserrat unselectable" light cols="12">
            🦄 <strong>A4</strong> — Vít Petřík 🦄
          </v-col>
        </v-row>
      </v-footer>
    </transition>
  </v-app>
</template>

<script>
import firebase from "firebase/app";

export default {
  name: "App",
  components: {
    loading: () =>
      import(/* webpackChunkName: "dynamic-list" */ "@/components/loading.vue")
  },
  data: () => ({
    drawer: null,
    themeSettings: "Dark theme",
    themeItems: ["Dark theme", "Light theme", "System setting"],
    showTabs: false,
    loaded: false
  }),
  methods: {
    themeSettingChange(value) {
      switch (value) {
        case this.themeItems[0]:
          this.themeSwitch(true);
          break;
        case this.themeItems[1]:
          this.themeSwitch(false);
          break;
        case this.themeItems[2]:
          this.themeSwitch(
            window.matchMedia("(prefers-color-scheme: dark)").matches
          );
          break;
      }
    },
    themeSwitch(darkMode) {
      this.$vuetify.theme.dark = darkMode;
      let metaThemeColor = document.querySelector("meta[name=theme-color]");
      metaThemeColor.setAttribute("content", darkMode ? "#111111" : "#063761");
      document.body.style.backgroundColor = darkMode ? "#111111" : "#063761";
    }
  },
  computed: {
  },
  mounted() {
    if (localStorage.themeSettings) {
      this.themeSettings = localStorage.themeSettings;
      this.themeSettingChange(this.themeSettings);
    } else {
      this.themeSettings = this.themeItems[0];
      this.themeSettingChange(this.themeSettings);
    }

    if (window.matchMedia("(prefers-color-scheme)").media !== "not all") {
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      darkModeMediaQuery.addListener(() => {
        if (this.themeSettings === this.themeItems[2])
          this.themeSwitch(darkModeMediaQuery.matches);
      });
    }
    let self = this
    setTimeout(() => { self.loaded = true }, 3000);
  },
  watch: {
    themeSettings(value) {
      localStorage.themeSettings = value;
      this.themeSettingChange(value);
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-timing-function: ease-in;
  transition-duration: 0.15s;
}

.fade-enter-active {
  transition-delay: 0.15s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-50px);
  opacity: 0;
}

.theme--dark.v-card {
  background-color: #151515 !important;
}

.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: #151515 !important;
}

.theme--dark.v-data-table {
  background-color: #151515 !important;
  color: #ffffff;
}

.theme--dark.v-list {
  background: transparent !important;
}

.v-tab {
  min-width: 60px !important;
}

.montserrat {
  font-family: "Montserrat", sans-serif;
}

.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
