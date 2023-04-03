import { Context } from 'koa'
import {
  getUserListSer,
  getdeptTreeSer,
  getPostSer,
  getRoleSer,
  addUserRoleSer,
  addUserPostSer,
  addUserSer,
  getUserPostSer,
  getUserRoleSer,
  putUserSer,
  delUserRole,
  delUserPost,
  putUserStatusSer,
  exportUserListSer
} from '@/service/system/user.service'
import {
  userListType,
  deptType,
  userType,
  IUserDetail,
  userQueryType,
  userQuerySerType
} from '@/types'
import {
  IdJudge,
  IdsJudge,
  addUserJudg,
  checkPwdJudg,
  putUserJudg
} from '@/schema/system/sys_user.schema'
import { updatePassword, getAllUserInfoSer } from '@/service/user.service'
import errors from '@/constants/err.type'
import { formatHumpLineTransfer, timeChange } from '@/utils'
const {
  checkUserIdErr,
  getDeptTreeErr,
  addUserErr,
  getPostRoleErr,
  checkPwdErr,
  sqlErr,
  putUserErr,
  exportUserListErr
} = errors

// 生成用户列表
const getUserListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as userQueryType
    let newParams = { pageNum, pageSize } as userQuerySerType
    if (params.deptId) {
      try {
        const depts = (await getdeptTreeSer()) as any
        let deptIds = []
        depts.forEach((item) => {
          if (item.dataValues.ancestors.indexOf(`${params.deptId}`) !== -1) {
            deptIds.push(item.dept_id)
          }
        })
        newParams.dept_id = [params.deptId, ...deptIds]
      } catch (error) {
        console.error('查询部门失败!', ctx.request['body'])
      }
    }
    if (params.beginTime) {
      newParams.beginTime = params.beginTime
      newParams.endTime = params.endTime
    }
    params.userName ? (newParams.user_name = params.userName) : null
    params.phonenumber ? (newParams.phonenumber = params.phonenumber) : null
    params.status ? (newParams.status = params.status) : null

    const res = (await getUserListSer(newParams)) as userListType

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询部门角色失败', error)
    return ctx.app.emit('error', getPostRoleErr, ctx)
  }
}

// 导出用户列表
const exportUserListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await exportUserListSer()
    ctx.state.formatData = res
  } catch (error) {
    console.error('导出用户列表错误!', ctx.request['body'])
    return ctx.app.emit('error', exportUserListErr, ctx)
  }
  await next()
}

// 判断用户名id是否正确
const userIdSchema = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request.path.split('/')
    const userId = list[list.length - 1]
    const userIdList = userId.split(',')
    await IdsJudge.validateAsync({ userId: userIdList })
    ctx.state.userId = userIdList
  } catch (error) {
    console.error('用户名id格式错误!', ctx.request['body'])
    return ctx.app.emit('error', checkUserIdErr, ctx)
  }
  await next()
}

// 查询部门下拉树结构
const deptTreeMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = (await getdeptTreeSer()) as unknown as deptType[]

    // 将部门进行树状结构数据
    const deptTree = []

    for (let i = 0; i < res.length; i++) {
      if (res[i].parent_id === 0) {
        const newObj = {
          key: res[i].dept_id,
          title: res[i].dept_name
        }
        // 此步骤减少递归次数，增加性能
        res.splice(i, 1)
        i ? (i = 0) : i--
        // 递归查找子集结构
        checkChild(newObj, newObj.key)
        function checkChild(obj, parent_id) {
          // 判断 子 父 结构的 parent_id 是否相等
          for (let j = 0; j < res.length; j++) {
            if (res[j].parent_id === parent_id) {
              const newObj = {
                key: res[j].dept_id,
                title: res[j].dept_name
              }
              if (!(obj.children instanceof Array)) obj.children = []
              obj.children.push(newObj)
              res.splice(j, 1)
              j ? (j = 0) : j--
              checkChild(newObj, newObj.key)
            }
          }
        }
        deptTree.push(newObj)
      }
    }

    ctx.state.formatData = deptTree
  } catch (error) {
    console.error('查询部门失败!', ctx.request['body'])
    return ctx.app.emit('error', getDeptTreeErr, ctx)
  }
  await next()
}
// 岗位及角色数据获取
const getPostRoleMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const postRes = await getPostSer()
    const roleRes = await getRoleSer()
    ctx.state.formatData = {
      posts: postRes,
      roles: roleRes
    }
    await next()
  } catch (error) {
    console.error('获取部门和角色信息失败', error)
    return ctx.app.emit('error', addUserErr, ctx)
  }
}

// 检查新增用户上传参数
const addUserSchema = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const userList = ctx.request['body'] as userType
    await addUserJudg.validateAsync(userList)
  } catch (error) {
    console.error('新增用户上传参数出错', error)
    return ctx.app.emit('error', addUserErr, ctx)
  }
  await next()
}

// 检查新增用户上传参数
const putUserSchema = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const userList = ctx.request['body'] as userType
    await putUserJudg.validateAsync(userList)
  } catch (error) {
    console.error('修改用户上传参数出错', error)
    return ctx.app.emit('error', putUserErr, ctx)
  }
  await next()
}

// 新增用户
const getAddUserMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const { postIds, roleIds, ...user } = ctx.request['body'] as userType
    const user2 = { ...user, createBy: userName }
    const newUser = formatHumpLineTransfer(user2, 'line')
    const { user_id } = await addUserSer(newUser)
    // //绑定角色岗位关系
    if (roleIds?.length > 0) {
      const createRole = []

      roleIds?.forEach((item) => {
        createRole.push({
          user_id: user_id,
          role_id: item
        })
      })
      await addUserRoleSer(createRole)
    }
    if (postIds?.length > 0) {
      const createPost = []
      postIds?.forEach((item) => {
        createPost.push({
          user_id: user_id,
          post_id: item
        })
      })
      await addUserPostSer(createPost)
    }
    await next()
  } catch (error) {
    console.error('新增用户失败', error)
    return ctx.app.emit('error', addUserErr, ctx)
  }
}

// 修改密码
const updatePwdMid = async (ctx: Context, next: () => Promise<void>) => {
  const { password, userId } = ctx.request['body']
  const { userName } = ctx.state.user as userType
  try {
    await checkPwdJudg.validateAsync({ password })
  } catch (error) {
    console.error('密码参数错误', error)
    return ctx.app.emit('error', checkPwdErr, ctx)
  }

  try {
    await updatePassword({ newPwd: password, userId, update_by: userName })
  } catch (error) {
    console.error('服务器错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 获取用户个人详细数据
const userInfoMid = async (ctx: Context, next: () => Promise<void>) => {
  const path = ctx.request.path
  const userId = path.split('/')[path.split('/').length - 1]
  let finRes = {} as IUserDetail

  try {
    await IdJudge.validateAsync({ userId })
  } catch (error) {
    console.error('用户上传id错误', error)
    return ctx.app.emit('error', checkUserIdErr, ctx)
  }

  try {
    const { password, ...res } = await getAllUserInfoSer({ userId })
    finRes = { ...res }
  } catch (error) {
    console.error('用户个人信息查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  try {
    const res = (await getUserPostSer(userId)) as any
    const postIds = [],
      roleIds = []
    res.forEach((item) => postIds.push(item.post_id))
    finRes.postIds = postIds
    const res2 = await getPostSer()
    finRes.posts = res2 as any
    const roleRes = (await getUserRoleSer(userId)) as any
    roleRes.forEach((item) => roleIds.push(item.role_id))
    finRes.roleIds = roleIds as number[]
    const roleRes2 = await getRoleSer()
    finRes.roles = roleRes2 as any
  } catch (error) {
    console.error('查询用户岗位与角色信息错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  ctx.state.formatData = finRes
  await next()
}

// 修改用户
const putUserMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const { postIds, roleIds, ...user } = ctx.request['body'] as userType
    await putUserSer({ ...user, update_by: userName })
    // 重新绑定 用户与岗位&角色关系
    if (roleIds?.length > 0) {
      await delUserRole(user.userId)
      const createRole = []
      roleIds?.forEach((item) => {
        createRole.push({
          user_id: user.userId,
          role_id: item
        })
      })
      await addUserRoleSer(createRole)
    }
    if (postIds?.length > 0) {
      await delUserPost(user.userId)
      const createPost = []
      postIds?.forEach((item) => {
        createPost.push({
          user_id: user.userId,
          post_id: item
        })
      })
      await addUserPostSer(createPost)
    }

    await next()
  } catch (error) {
    console.error('修改用户失败', error)
    return ctx.app.emit('error', putUserErr, ctx)
  }
}

const putUserStatusMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    let { userId, status } = ctx.request['body'] as userType
    ctx.state.status = status
    await putUserStatusSer({ userId, status, update_by: userName })

    await next()
  } catch (error) {
    console.error('修改用户状态失败', error)
    return ctx.app.emit('error', putUserErr, ctx)
  }
}

export {
  getUserListMid,
  userIdSchema,
  deptTreeMid,
  getAddUserMid,
  getPostRoleMid,
  addUserSchema,
  updatePwdMid,
  userInfoMid,
  putUserSchema,
  putUserMid,
  putUserStatusMid,
  exportUserListMid
}
