import got from 'got'
import iconv from 'iconv-lite'

export default async function getNetIp(req: any) {
  const ipArray = [
    ...new Set([
      ...(req.headers['x-real-ip'] || '').split(','),
      ...(req.headers['x-forwarded-for'] || '').split(','),
      req.ip,
      ...req.ips,
      req.socket.remoteAddress
    ])
  ]
  let ip = ipArray[0]

  if (ipArray.length > 1) {
    for (let i = 0; i < ipArray.length; i++) {
      const ipNumArray = ipArray[i].split('.')
      const tmp = ipNumArray[0] + '.' + ipNumArray[1]
      if (
        tmp === '192.168' ||
        (ipNumArray[0] === '172' && ipNumArray[1] >= 16 && ipNumArray[1] <= 32) ||
        tmp === '10.7' ||
        tmp === '127.0'
      ) {
        continue
      }
      ip = ipArray[i]
      break
    }
  }
  ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length)
  if (ip.includes('127.0') || ip.includes('192.168') || ip.includes('10.7')) {
    ip = ''
  }
  try {
    const baiduApi = got.get(`https://www.cip.cc/${ip}`, { timeout: 10000, retry: 0 }).text()
    const ipApi = got
      .get(`https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`, {
        timeout: 10000,
        retry: 0
      })
      .buffer()
    const [data, ipApiBody] = await await Promise.all<any>([baiduApi, ipApi])

    const ipRegx = /.*IP	:(.*)\n/
    const addrRegx = /.*数据二	:(.*)\n/
    if (data && ipRegx.test(data) && addrRegx.test(data)) {
      const ip = data.match(ipRegx)[1]
      const addr = data.match(addrRegx)[1]
      return { address: addr, ip }
    } else if (ipApiBody) {
      const { addr, ip } = JSON.parse(iconv.decode(ipApiBody, 'GBK'))
      return { address: `${addr}`, ip }
    } else {
      return { address: `获取失败`, ip }
    }
  } catch (error) {
    return { address: `获取失败`, ip }
  }
}
