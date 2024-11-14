/// <reference types="vite/client" />
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "./OfdViewUtil/index" {
  export function parseOfdDocument(...args: any[]): any;
  export function renderOfd(...args: any[]): any;
  export function renderOfdByScale(...args: any[]): any;
  export function setPageScale(...args: any[]): any;
  export function getPageScale(...args: any[]): any;
}
