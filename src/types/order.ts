
interface orderFnn {
  user: string
  region: string
}
interface LisInt {
  date: string
  name: string
  address: string
}
interface tableFnn {
  title: number
  body: LisInt[] | []
  page: number
  count: number
}

// 查询字符串
export class orderData {
  // 查询表单数据
  formInline: orderFnn = {
    user: '',
    region: '',
  }
  // 渲染表单和分页数据
  tableData: tableFnn = {
    title: 0, //总数量
    body: [],
    page: 1, //当前页面
    count: 0,
  }

  // 渲染数据  设定数组中每一项必须是lisint格式
  listData: LisInt[] = []
}

// let list:any[]=[] //list数组的值可以是任何类型
// let arr:number[]=[1,2,3,4] //arr数组内必须是number类型
// let list: Array<number> = [1, 2, 3]//list数组内容必须是number类型
