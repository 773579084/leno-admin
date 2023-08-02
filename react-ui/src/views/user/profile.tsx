import { useEffect, useState } from 'react'
import { Col, Row, Card, Upload, message, Tabs } from 'antd'
import type { RcFile } from 'antd/es/upload/interface'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import classes from './index.module.scss'
import useStore from '@/store'
import { observer } from 'mobx-react-lite'
import { uploadAvatarAPI, getProfileAPI } from '@/api/modules/user'
import avatarDef from '@/assets/images/avatar.jpeg'
import SvgIcon from '@/components/SvgIcon'
import dayjs from 'dayjs'

// 组件
import Basics from './component/Basics'
import ChangePwd from './component/ChangePwd'
import { userType } from '@/type/modules/system/sysUser'

// 头像上传
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('图片必须是 JPG/PNG 格式!')
  }
  const isLt1M = file.size / 1024 / 1024 < 1
  if (!isLt1M) {
    message.error('图片必须小于 1MB !')
  }
  return isJpgOrPng && isLt1M
}

const Profile = () => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [userInfo, setUserInfo] = useState<userType>({})
  const {
    useUserStore: { setProfile },
  } = useStore()

  // 初始化将 userInfo 内的头像放置到此处，如果没有默认用 蜡笔小新头像
  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    try {
      const {
        data: { result },
      } = await getProfileAPI()
      setUserInfo(result)

      result.avatar ? setImageUrl(result.avatar) : setImageUrl(avatarDef)
    } catch (error) {}
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const onModalOK = async (file: any) => {
    if (file) {
      const fd = new FormData()
      fd.append('avatar', file)

      try {
        const res = await uploadAvatarAPI(fd)
        message.success(res.data.message)
        setLoading(false)

        // 重新获取 用户的个人信息列表，更行 store中的用户个人信息
        const {
          data: { result },
        } = await getProfileAPI()
        setImageUrl(result.avatar)
        setUserInfo(result)
        setProfile(result)
      } catch (error) {}
    } else {
      setLoading(true)
    }
  }

  return (
    <div className="app-container">
      <Row gutter={[20, 0]} className={classes['profile']}>
        <Col span={7}>
          <Card title="个人信息" style={{ borderRadius: 5 }}>
            <ul className={classes['user-info']}>
              <li className={classes['avatar']}>
                <ImgCrop rotate onModalOk={(file: any) => onModalOK(file)}>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </ImgCrop>
              </li>
              <li>
                <div>
                  <SvgIcon iconClass="用户" />
                  <span className={classes['user-string']}>用户名称</span>
                </div>
                <div>{userInfo.userName}</div>
              </li>
              <li>
                <div>
                  <SvgIcon iconClass="手机号码" />
                  <span className={classes['user-string']}>手机号码</span>
                </div>
                <div>{userInfo.phonenumber}</div>
              </li>
              <li>
                <div>
                  <SvgIcon iconClass="邮箱" />
                  <span className={classes['user-string']}>用户邮箱</span>
                </div>
                <div>{userInfo.email}</div>
              </li>
              <li>
                <div>
                  <SvgIcon iconClass="部门管理" />
                  <span className={classes['user-string']}>所属部门</span>
                </div>
                <div>
                  {userInfo.dept?.deptName}
                  {userInfo.postGroup ? '/' + userInfo.postGroup : ''}
                </div>
              </li>
              <li>
                <div>
                  <SvgIcon iconClass="角色管理" />
                  <span className={classes['user-string']}>所属角色</span>
                </div>
                <div>{userInfo.roleGroup}</div>
              </li>
              <li>
                <div>
                  <SvgIcon iconClass="日历" />
                  <span className={classes['user-string']}>创建日期</span>
                </div>
                <div>{dayjs(userInfo.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
              </li>
            </ul>
          </Card>
        </Col>
        <Col span={17}>
          <Card title="基本资料" style={{ borderRadius: 5 }}>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  label: '基本资料',
                  key: '1',
                  children: <Basics />,
                },
                {
                  label: '修改密码',
                  key: '2',
                  children: <ChangePwd />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default observer(Profile)
