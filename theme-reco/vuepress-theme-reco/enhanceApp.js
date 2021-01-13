/* eslint-disable no-proto */
import postMixin from "@theme/mixins/posts";
import localMixin from "@theme/mixins/locales";
import { addLinkToHead, addScriptToHead } from "@theme/helpers/utils";
import {
  registerCodeThemeCss,
  interceptRouterError
} from "@theme/helpers/other";
import VueCompositionAPI from "@vue/composition-api";
import ElementUI from "element-ui";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
// import "element-ui/lib/theme-chalk/index.css";
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-vue/dist/bootstrap-vue.css";

export default ({ Vue, siteData, isServer, router }) => {
  // Make BootstrapVue available throughout your project
  Vue.use(BootstrapVue);
  // Optionally install the BootstrapVue icon components plugin
  Vue.use(IconsPlugin);
  Vue.use(ElementUI);
  Vue.use(VueCompositionAPI);
  Vue.mixin(postMixin);
  Vue.mixin(localMixin);
  if (!isServer) {
    addLinkToHead("//at.alicdn.com/t/font_1030519_2ciwdtb4x65.css");
    addScriptToHead("//kit.fontawesome.com/51b01de608.js");
    registerCodeThemeCss(siteData.themeConfig.codeTheme);
  }

  interceptRouterError(router);
};
