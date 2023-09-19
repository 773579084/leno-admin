import axios, { type Method } from 'axios';
import { getToken, removeToken } from '@/utils/auth';
import { message, Modal } from 'antd';
import useStore from '@/store';
import cache from '@/utils/cache';
import NProgress from './nprogress';

const { confirm } = Modal;

const instance = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (response: any) => {
    // 是否需要防止数据重复提交
    const isRepeatSubmit = false;
    // token配置请求头
    if (!response.headers?.authorization && getToken()) {
      response.headers.Authorization = `Bearer ${getToken()}`;
    }

    if (isRepeatSubmit && (response.method === 'post' || response.method === 'put')) {
      console.log(25);

      const requestObj = {
        url: response.url,
        data: typeof response.data === 'object' ? JSON.stringify(response.data) : response.data,
        time: new Date().getTime(),
      };
      const sessionObj = cache.session.getJSON('sessionObj');
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj);
      } else {
        const s_url = sessionObj.url; // 请求地址
        const s_data = sessionObj.data; // 请求数据
        const s_time = sessionObj.time; // 请求时间
        const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const mes = '数据正在处理，请勿重复提交';
          message.warning(mes);
          return Promise.reject(new Error(mes));
        }
        cache.session.setJSON('sessionObj', requestObj);
      }
    }
    NProgress.start();
    return response;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    // 二进制数据则不走公用错误提示
    if ((error && error.request.responseType === 'blob') || error.request.responseType === 'arraybuffer') {
      return Promise.reject(error);
    }
    // userStore
    const {
      useGlobalStore: { logout, changeLogout },
      useUserStore: { removeLocalToken },
    } = useStore();
    NProgress.done();
    const { data } = error.response;

    /** 错误集中提示
     * 400 => 表示前端传参可能出现错误
     * 401 => 权限过期
     * 403 => 无访问权限
     * 500 => 服务器拒绝请求
     */
    switch (data && data.code) {
      case '400':
        message.error(`${data.code}: ${data.message}`);
        break;
      case '401':
        if (logout) {
          changeLogout(false);
          confirm({
            title: '系统提示',
            content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
            cancelText: '取消',
            okText: '重新登录',
            onCancel: () => {
              changeLogout(true);
            },
            onOk: () => {
              changeLogout(true);
              removeToken();
              removeLocalToken('');
              window.location.hash = '/login';
            },
          });
        }
        break;
      case '403':
        message.error(`${data.code}: ${data.message}`);
        break;
      case '500':
        message.error(`${data.code}: ${data.message}`);
        break;

      default:
        message.error('未知错误，请联系管理人员');
        break;
    }
    NProgress.done();
    return Promise.reject(error);
  },
);

// 后端返回的接口数据格式
export interface ResponseData<T> {
  status: number;
  data: T;
}

/**
 * axios 二次封装
 * @param {String} url  请求地址
 * @param {String} method  请求类型
 * @param {Object} submitData  对象类型，提交数据
 */
export const http = <T>(method: Method, url: string, submitData?: unknown) =>
  instance.request<T, ResponseData<T>>({
    url,
    method,
    // 自动设置合适的 params/data 键名称，如果 method 为 get 用 params 传请求参数，否则用 data
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData,
  });

/**
 * 通用下载方法
 * @param url 请求地址
 * @param fileName 下载的文件名
 * @param fileFormat 下载的文件格式
 * @param params 请求传参
 * @returns buffer
 */
// eslint-disable-next-line default-param-last
export async function download(url: string, fileName = 'excel', fileFormat = 'xlsx', params?: object) {
  try {
    const res = await instance.post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
    });
    const uploadExcel = (fileName_2: any) => {
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }) as any;
      const url_3 = URL.createObjectURL(blob);
      const aLink = document.createElement('a');
      aLink.setAttribute('download', fileName_2);
      aLink.setAttribute('href', url_3);
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      URL.revokeObjectURL(blob);
    };
    uploadExcel(`${fileName}_${new Date().valueOf()}.${fileFormat}`);
  } catch (r: any) {
    NProgress.done();
    const resText = await r.response.data.text();
    const rspObj = JSON.parse(resText);
    if (rspObj.code === '500') {
      return message.error(`${rspObj.code}: ${rspObj.message}`);
    }
    console.error(r);
    message.error('下载文件出现错误，请联系管理员！');
  }
}

export default instance;
