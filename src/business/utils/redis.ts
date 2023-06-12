import ToolGen from '@/mysql/model/tool/gen.model'
import redis from '@/redis'
import { genQuerySerType, GenType } from '@/types/tools/gen'
import { formatHumpLineTransfer } from '.'
import { getListSer } from '../service'

/**
 * 存储所有表的信息（供全局调用）
 */
export const saveSqlMes = async () => {
  const { rows } = await getListSer<genQuerySerType>(ToolGen, { pageNum: 1, pageSize: 1000 })
  const res = formatHumpLineTransfer(rows)
  redis.set('sql_message', JSON.stringify(res))
}

/**
 * 查询表信息
 */
export const querySqlMes = async () => {
  return JSON.parse(await redis.get('sql_message')) as GenType[]
}
