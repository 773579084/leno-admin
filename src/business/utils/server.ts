import os from 'os';

export const getIpAddress = () => {
  const networkInterfaces = os.networkInterfaces();

  // eslint-disable-next-line guard-for-in
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < networkInterface.length; i++) {
      const { address, family, internal } = networkInterface[i];

      // 跳过IPv6地址和内部地址
      if (family === 'IPv6' || internal) {
        // eslint-disable-next-line no-continue
        continue;
      }

      return address;
    }
  }

  return '0.0.0.0'; // 如果没有找到有效的IP地址，则返回默认值
};
