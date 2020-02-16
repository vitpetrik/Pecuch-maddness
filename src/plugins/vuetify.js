import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#063761",
        secondary: "#063761",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        button: "#063761",
        footer: "#FFFFFF",
        background: "#FAFAFA"
      },
      dark: {
        primary: "#ffffff",
        secondary: "#111111",
        button: "#009688",
        footer: "#111111",
        background: "#000000"
      }
    }
  },
  icons: {
    iconfont: 'mdi',
  },
});
