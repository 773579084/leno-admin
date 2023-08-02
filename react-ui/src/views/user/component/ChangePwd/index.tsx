import React from 'react'
import { Button, Form, Input, message, Space } from 'antd'
import { IChangePwd } from '@/type'
import { updatePwdAPI } from '@/api/modules/user'
import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '@/store'
import { HOME_URL } from '@/config/config'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}
const tailLayout = {
  wrapperCol: { offset: 3, span: 21 },
}

const ChangePwd = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    useLayoutStore: { defaultObjMobx, changeTabsListMobx },
  } = useStore()

  const onClose = () => {
    form.resetFields()
    const newTabs = defaultObjMobx.tabsListMobx.filter((item) => item.path !== pathname)
    changeTabsListMobx(newTabs)
    navigate(HOME_URL)
  }

  const onFinish = async ({ newPwd, oldPwd }: IChangePwd) => {
    try {
      const res = await updatePwdAPI({ oldPwd, newPwd })
      message.success(res.data.message)
      form.resetFields()
    } catch (error) {
      form.resetFields()
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  // 自定义验证
  const equalPwdFn = (val: string) => {
    const { newPwd } = form.getFieldsValue()
    if (newPwd !== val) {
      return new Promise((resolve, reject) => {
        reject('两次密码输入不一致!')
      })
    }
    return Promise.resolve()
  }

  return (
    <Form
      {...layout}
      form={form}
      name="control-pwd"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="oldPwd"
        label="旧密码"
        rules={[
          {
            min: 4,
            max: 11,
            required: true,
            message: '请输入4~11位密码!',
          },
        ]}
      >
        <Input.Password placeholder="请输入旧密码" type="password" />
      </Form.Item>
      <Form.Item
        name="newPwd"
        label="新密码"
        rules={[
          {
            min: 4,
            max: 11,
            required: true,
            message: '请输入4~11位密码!',
          },
        ]}
      >
        <Input.Password placeholder="请输入新密码" type="password" />
      </Form.Item>
      <Form.Item
        name="confirmPwd"
        label="确认密码"
        rules={[
          {
            required: true,
            validator: (rule, val) => equalPwdFn(val),
          },
        ]}
      >
        <Input.Password placeholder="请输入新密码" type="password" />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button type="primary" danger onClick={onClose}>
            关闭
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default ChangePwd
