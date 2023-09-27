import { Context } from 'koa';
import path from 'path';
import XLSX from 'exceljs';
import { ModelStatic, Op } from 'sequelize';
import { dictMapListType, imgType } from '@/types';
import errors from '@/app/err.type';
import { getExcelAddress, parsingExcel } from '@/business/utils/excel';
import { getDataTypeSer } from '@/business/service/system/dict_data.service';
import { formatHumpLineTransfer, pwdHash, removeSpecifyFile } from '@/business/utils';
import { userExcelHeader } from '@/business/public/excelMap';
import env from '@/config/default';

const { importUserListErr, sqlErr, verifyErr, uploadImageErr, exportUserListErr, uploadFilesErr, delErr } = errors;
const { IMG_URL } = env();

// 下划线转驼峰
export const formatHandle = async (ctx: Context, next: () => Promise<void>) => {
  const res = formatHumpLineTransfer(ctx.state.formatData);
  // 转换时间格式
  ctx.state.formatData = res;
  await next();
};

/**
 * 判断 是否不唯一(sql与upload需要按照对应顺序传入)
 * @param sqlNames 需要判断唯一变量的key[]
 * @param Model sql表单
 * @param judge 修改时除开判断自身
 * @returns
 */
export const verifyMid = (sqlNames: string[], Model: ModelStatic<any>, judge?: string) => async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { body } = ctx.request;

    const res = formatHumpLineTransfer(body, 'line');
    const whereOpt = {};

    if (judge) {
      Object.assign(whereOpt, { [judge]: { [Op.ne]: res[judge] } });
    }

    sqlNames.forEach((item, index) => {
      if (res[item]) {
        Object.assign(whereOpt, { [sqlNames[index]]: res[item] });
      }
    });

    // ser 查找是否有值
    const isRepeat = await Model.findOne({
      raw: true,
      attributes: [...sqlNames],
      where: whereOpt,
    });

    if (isRepeat) {
      console.error('内容已存在,不唯一!', ctx.request.body);
      ctx.app.emit('error', verifyErr, ctx);
      return;
    }
  } catch (error) {
    console.error('sql查询信息错误', error);
    ctx.app.emit('error', sqlErr, ctx);
  }

  await next();
};

// 导入excel--解析
export const importExcelsMid = (option: { password: boolean }) => async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { password } = option;
    const fileExistPath = `${path.resolve()}/uploads`;
    const fileNames = await getExcelAddress(fileExistPath);

    // 获取字典的值
    const { dicts } = ctx.state;

    // 存储多个excel文件
    const workbooksFromBuffer = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < fileNames.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const res = await parsingExcel(fileNames[i], fileExistPath);
      workbooksFromBuffer.push(res);
    }

    // 存储excel表提取的excel数据
    const dataSource = [];

    // 第一遍遍历处每个excel文件
    workbooksFromBuffer.forEach((workbook) => {
      // 第二遍遍历操作每个excel文件夹里的每个excel表
      // eslint-disable-next-line no-underscore-dangle
      workbook._worksheets.forEach((sheet: XLSX.Worksheet) => {
        // 删除sheet开头的空行
        const sheetValues = workbook.getWorksheet(sheet.id).getSheetValues();
        sheetValues.shift();

        // 拿取字段头数据转成key
        const headerKeys = [];
        sheetValues[0].shift();
        sheetValues[0].forEach((header: string, index: number) => {
          headerKeys.push(userExcelHeader[index].dataIndex);
        });
        sheetValues.shift();
        // 第三遍遍历，解析组合数据
        sheetValues.forEach((value: (string | number | null)[]) => {
          value.shift();
          const obj = { password: '' };
          value.forEach((item, index: number) => {
            // 如果值为字典内有的值，则需要转换
            const dictKey = dicts[headerKeys[index]];

            if (dictKey) {
              for (const key in dictKey) {
                if (item === dictKey[key]) {
                  obj[headerKeys[index]] = key;
                }
              }
            } else {
              obj[headerKeys[index]] = item;
            }
            if (password) {
              obj.password = pwdHash('123456');
            }
          });
          dataSource.push(obj);
        });
      });
    });

    // 获取数据后删除excel文件
    fileNames.forEach((pathName) => {
      removeSpecifyFile(pathName);
    });

    ctx.state.excelData = dataSource;
  } catch (error) {
    console.error('用户excel上传表头格式不正确!', ctx.request.body);
    return ctx.app.emit('error', importUserListErr, ctx);
  }
  await next();
};

// 导入excel--修改sql
export const judegImportMid = (table: ModelStatic<any>, updates: string[]) => async (ctx: Context, next: () => Promise<void>) => {
  const { updateSupport } = ctx.request.body as {
    updateSupport: string;
  };

  const data = ctx.state.excelData.map((item: any) => ({
    ...item,
    create_by: ctx.state.user.userName,
    update_by: ctx.state.user.userName,
  }));

  try {
    if (updateSupport === '1') {
      // 新增 且 修改
      await table.bulkCreate(data, { updateOnDuplicate: updates });
    } else {
      // 不更改 只新增
      await table.bulkCreate(data);
    }
  } catch (error) {
    console.error('user excel新增与修改错误', ctx.request.body);
    return ctx.app.emit('error', { code: '400', message: error.errors[0].message }, ctx);
  }

  await next();
};

// 导出列表数据及字典转换（excel）
export const exportExcelMid = (serve: any, model: ModelStatic<any>, maps?: { [key: string]: string }) => async (ctx: Context, next: () => Promise<void>) => {
  try {
    if (serve) {
      const res = await serve(model);
      ctx.state.formatData = res;
    }

    // 字典转换
    if (maps) {
      const arr = {} as dictMapListType;
      for (const key in maps) {
        if (Object.hasOwn(maps, key)) {
          // eslint-disable-next-line no-await-in-loop
          const dict = await getDataTypeSer({ dict_type: maps[key] });
          arr[key] = dict;
        }
      }
      ctx.state.dicts = arr;
    }
    await next();
  } catch (error) {
    console.error('导出用户列表错误!', ctx.request.body);
    return ctx.app.emit('error', exportUserListErr, ctx);
  }
};

// 导出列表数据及字典转换（excel）
export const importExcelDictMapMid = (maps?: { [key: string]: string }) => async (ctx: Context, next: () => Promise<void>) => {
  try {
    if (maps) {
      const arr = {} as dictMapListType;
      for (const key in maps) {
        if (Object.hasOwn(maps, key)) {
          // eslint-disable-next-line no-await-in-loop
          const dict = await getDataTypeSer({ dict_type: maps[key] });
          arr[key] = dict;
        }
      }
      ctx.state.dicts = arr;
    }
  } catch (error) {
    console.error('导出用户列表错误!', ctx.request.body);
    return ctx.app.emit('error', exportUserListErr, ctx);
  }
  await next();
};

// 公用图片上传 会给下一级图片名 sting
export const commondUploadImgMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { avatar } = (ctx.request as any).files;
    const { filepath } = avatar as imgType;
    const basePath = path.basename(filepath) as string;

    ctx.state.formatData = { imgName: IMG_URL + basePath };
    await next();
  } catch (error) {
    console.error('公用图片上传失败');
    return ctx.app.emit('error', uploadImageErr, ctx);
  }
};

// 公用删除图片
export const commondDelImgMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const data = (ctx.request as any).body;
    data.forEach((item: string) => {
      removeSpecifyFile(item);
    });
    await next();
  } catch (error) {
    console.error('公用删除图片失败');
    return ctx.app.emit('error', delErr, ctx);
  }
};

// 公用文件图片上传
export const commondUploadFilesMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { files } = (ctx.request as any).files;

    if (Object.prototype.toString.call(files) === '[object Object]') {
      // 单
      const { newFilename } = files;
      ctx.state.formatData = [IMG_URL + newFilename];
    } else {
      // 多
      const fileNames = [];
      files.forEach((file: any) => {
        const { newFilename } = file;
        fileNames.push(IMG_URL + newFilename);
      });

      ctx.state.formatData = fileNames;
    }

    await next();
  } catch (error) {
    console.error('公用文件上传');
    return ctx.app.emit('error', uploadFilesErr, ctx);
  }
};
