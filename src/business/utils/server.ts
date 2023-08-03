import os from 'os'

export const getIpAddress = ()=> {
    const networkInterfaces = os.networkInterfaces();
  
    for (let interfaceName in networkInterfaces) {
      const networkInterface = networkInterfaces[interfaceName];
  
      for (let i = 0; i < networkInterface.length; i++) {
        const { address, family, internal } = networkInterface[i];
  
        // 跳过IPv6地址和内部地址
        if (family === 'IPv6' || internal) {
          continue;
        }
  
        return address;
      }
    }
  
    return '0.0.0.0'; // 如果没有找到有效的IP地址，则返回默认值
  }