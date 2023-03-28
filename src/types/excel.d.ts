export interface excelParamsType {
  headerColumns: headerType[]
  tableData: any
  sheetName: string
  style?: Partial<XLSX.Style>
}

export interface headerType {
  title: sting
  dataIndex: string
  width?: number
}
