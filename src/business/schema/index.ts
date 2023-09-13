/**
 * 通用上传参数判断方法
 */
import { Context } from 'koa';
import path from 'path';
import Joi from 'joi';
import errors from '@/app/err.type';
import { imgType } from '@/types';
import { removeSpecifyFile } from '../utils';

const { uploadParamsErr, checkIdsErr, unAvatarSizeErr, unSupportedFileErr } = errors;

// 检查 新增|编辑 上传参数
export const addEditSchema = (judge: Joi.ObjectSchema<any>) => async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request.body;
    await judge.validateAsync(list);

    await next();
  } catch (error) {
    console.error('新增编辑上传参数出错', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 判断id是否正确
export const judgeIdSchema = () => async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request.path.split('/');
    const ids = list[list.length - 1];
    const idsList = ids.split(',');

    ctx.state.ids = idsList;
  } catch (error) {
    console.error('id格式错误!', ctx.request.body);
    return ctx.app.emit('error', checkIdsErr, ctx);
  }
  await next();
};

// 判断 上传图片的 大小是否合适
export const contrastFileSizeSchema =
  (limitSize = 1024 * 1024) =>
  async (ctx: Context, next: () => Promise<void>) => {
    const { avatar } = (ctx.request as any).files;
    const { size } = avatar as imgType;

    if (size > limitSize) {
      console.error('图片超过大小限制');
      return ctx.app.emit('error', unAvatarSizeErr, ctx);
    }
    await next();
  };

// 判断 上传图片的格式
export const judImgFormatSchema =
  (imgFormat = ['image/jpeg', 'image/png']) =>
  async (ctx: Context, next: () => Promise<void>) => {
    const { avatar } = (ctx.request as any).files;
    const { mimetype, filepath } = avatar as imgType;
    const basePath = path.basename(filepath) as string;

    if (!imgFormat.includes(mimetype)) {
      removeSpecifyFile(basePath);
      console.error('图片上传格式错误,请上传jpeg/png格式');
      return ctx.app.emit('error', unSupportedFileErr, ctx);
    }
    await next();
  };
