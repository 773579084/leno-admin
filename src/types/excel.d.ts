/* global XLSX */
import { IdictDataSer } from '@/types';

export interface headerType {
  title: string;
  dataIndex: string;
  width?: number;
}

export interface dictMapType {
  [key: string]: {
    [key: string]: string;
  };
}

export interface dictMapListType {
  [key: string]: IdictDataSer[];
}

export interface excelParamsType {
  headerColumns: headerType[];
  tableData: any;
  sheetName: string;
  style?: Partial<XLSX.Style>;
  dicts?: dictMapListType;
}
