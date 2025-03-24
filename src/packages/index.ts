import type { App } from "vue";
import bxButton from "./bxButton.vue";
import OfdView from "./OfdViewComp/index.vue";
import "./OfdViewComp/index.css";
import "../assets/main.css";
import "../polyfills";

export { bxButton, OfdView };

const install = function (app: App) {
  app.component("bxButton", bxButton);
  app.component("OfdView", OfdView);
};

export default install;
