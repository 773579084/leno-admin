import { IdictDataSer } from '@/types'
export interface excelParamsType {
  headerColumns: headerType[]
  tableData: any
  sheetName: string
  style?: Partial<XLSX.Style>
  dicts?: dictMapListType
}

export interface headerType {
  title: sting
  dataIndex: string
  width?: number
}

export interface dictMapType {
  [key: string]: {
    [key: string]: string
  }
}

export interface dictMapListType {
  [key: string]: IdictDataSer[]
}
