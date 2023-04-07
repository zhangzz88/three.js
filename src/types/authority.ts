import { useRoute, LocationQueryValue } from 'vue-router'
// import type { LocationQueryValue } from 'vue-router'
interface InitFace {
  authority: any
  roleId: any
  roleName: any
}
export class initData {
  routerData: InitFace = {
    authority: [],
    roleId: 0,
    roleName: '',
  }
  roleList = []
}
