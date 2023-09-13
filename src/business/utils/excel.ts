import XLSX from 'exceljs';
import fs from 'fs';
import path from 'path';
import { dictMapType, excelParamsType } from '@/types';
import { dictMapFn, flatten } from '.';

/**
 * excel 导出
 * style:excel表的样式配置
 * tableData:表的数据内容
 * headerColumns:表头配置
 * sheetName：工作表名
 */
export const excelJsExport = async (options: excelParamsType) => {
  const { sheetName, style, headerColumns, tableData } = options;

  // 创建工作簿
  const workbook = new XLSX.Workbook();
  workbook.creator = '我隔这敲代码呢';
  workbook.created = new Date();

  // 添加工作表
  const worksheet = workbook.addWorksheet(sheetName);

  if (headerColumns.length > 0) {
    // 设置列头
    const columnsData = headerColumns.map((column) => {
      const { width } = column;
      return {
        header: column.title,
        key: column.dataIndex,
        width: Number.isNaN(width) ? 20 : width / 10,
      };
    });
    worksheet.columns = columnsData;
    // 设置表头样式
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.style = style as Partial<XLSX.Style>;
    });
  }
  // 设置行数据
  if (tableData.length > 0) {
    // 将传入的数据格式化为exceljs可使用的数据格式
    const data = [];

    // 拿取字典相关的值
    let dictMap = {} as dictMapType;
    if (options.dicts) {
      dictMap = dictMapFn(options.dicts);
    }

    tableData.forEach((table: { [x: string]: string | number }) => {
      const obj = {};
      const tableFlat = flatten(table);

      headerColumns.forEach((header) => {
        // 字典转换
        if (dictMap[header.dataIndex]) {
          obj[header.dataIndex] = dictMap[header.dataIndex][table[header.dataIndex]];
        } else {
          obj[header.dataIndex] = tableFlat[header.dataIndex];
        }
      });
      data.push(obj);
    });

    // 添加行
    if (data) worksheet.addRows(data);
    // 获取每列数据，依次对齐
    worksheet.columns.forEach((column) => {
      // eslint-disable-next-line no-param-reassign
      column.alignment = style.alignment as Partial<XLSX.Alignment>;
    });
    // 设置每行的边框
    const dataLength = data.length as number;
    const tabeRows = worksheet.getRows(2, dataLength + 1);
    tabeRows.forEach((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        // eslint-disable-next-line no-param-reassign
        cell.border = style.border as Partial<XLSX.Borders>;
      });
    });
  }

  const res = await workbook.xlsx.writeBuffer();
  return res;
};

/**
 * EXCEL 获取文件上传地址
 */
export const getExcelAddress = async (fileExistPath: string) => {
  // 多个excel文件保存路径

  const fileNames = [];
  fs.readdirSync(path.format({ dir: fileExistPath })).forEach((excel) => {
    if (excel.split('.')[excel.split('.').length - 1] === 'xlsx' && 'xls') {
      fileNames.push(excel);
    }
  });
  return fileNames;
};

/**
 * EXCEL 解析上传文件
 */
export const parsingExcel = async (fileName: string, fileExistPath: string) => {
  const workbook = new XLSX.Workbook();
  // 整个文件的绝对路径
  const absoluteFilePath = `${fileExistPath}/${fileName}`;
  // 这种方式是解析buffer
  const res = await workbook.xlsx.load(fs.readFileSync(absoluteFilePath));
  return res;
};
