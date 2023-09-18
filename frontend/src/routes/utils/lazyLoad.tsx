import React, { Suspense } from 'react';

/**
 * @description 路由懒加载
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */
const lazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => (
  <Suspense fallback={null}>
    <Comp />
  </Suspense>
);

export default lazyLoad;
