import { App } from "vue";
import bxButton from "./bxButton.vue";
import OfdView from "./OfdViewComp/index.vue";
export { bxButton, OfdView };

const install = function (app: App) {
  app.component("bxButton", bxButton);
  app.component("OfdView", OfdView);
};

export default install;
