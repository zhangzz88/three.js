interface soleListFnn {
  roleName: string
  roleId: number
  authority: number[]
}
export interface userListFnn {
  id: number
  nickName: string
  userName: string
  rol: []
}
interface roleFnn {
  code: number
  data: soleListFnn[] | []
}
interface userFnn {
  code: number
  data: userListFnn[] | []
}

export class userData {
  roleFormData = {
    user: '',
    region: '',
  }
  // 角色列表
  roleList: roleFnn = {
    code: 0,
    data: [{ roleName: '', roleId: 0, authority: [] }],
  }
  userList: userFnn = {
    code: 0,
    data: [],
  }
  userListData=[]
}
