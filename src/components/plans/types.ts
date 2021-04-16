export interface planListIF {
  id: number
  title: string //第n天
  getMapLine?: (pos: any) => {} //数组传入当天行程所有的点，返回当天行程的路线
  details: planDetailIF[] //每天的详细内容
}

export interface planDetailIF {
  id: number | string
  place: string[] // 地点数组，接收一个或两个地点(from to)
  mapPosition?: [any] //地图位置信息，数组
  actType?: string //活动类别
  startTime?: Date | string //开始时间
  endTime?: Date | string //结束时间
  duration?: string //历时
}

export interface columnIF {
  id: string | number
  title: string
  item: planDetailIF[]
}

export interface planColumnPropsIF {
  columnIndex: number
  column: planListIF
  key: number
}

export interface planDetailPropsIF {
  id: number | string
  detailIndex: number
  detail: planDetailIF
}
