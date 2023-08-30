import { useEffect, useState } from 'react'
import classes from './index.module.scss'
import LoginForm from './component/LoginForm'
import RegisterForm from './component/RegisterForm'
import SvgIcon from '@/components/SvgIcon'
import { IcaptchaImageType, ILogin } from '@/type'
import { captchaImageAPI } from '@/api/modules/user'

const Login = () => {
  // 控制 login 与 register 切换
  const [isLogin, setIsLogin] = useState(true)
  const [login, setLogin] = useState({
    userName: 'admin',
    password: '123456',
    code: '',
    uuid: '',
  } as ILogin)
  const [registerList, setRegisterList] = useState({
    userName: '',
    password: '',
    password2: '',
    code: '',
    uuid: '',
  } as ILogin)
  const [svgCode, setSvgCode] = useState<IcaptchaImageType>({
    img: '',
    uuid: '',
  })

  useEffect(() => {
    getCaptchaImage()
  }, [])

  // 验证图片
  const getCaptchaImage = async () => {
    try {
      const {
        data: { result },
      } = await captchaImageAPI()
      setSvgCode(result)
    } catch (error) {}
  }

  const changeIsLogin = (data: ILogin, isStatus: string) => {
    switch (isStatus) {
      case 'reg':
        setRegisterList({ ...data })
        break
      case 'regErr':
        setRegisterList({ ...data })
        return
      case 'regOk':
        setLogin({ ...data })
        return
      default:
        break
    }
    setIsLogin(!isLogin)
  }

  return (
    <div className={classes['login-container']}>
      <SvgIcon iconClass="login_bg" svgClass={classes['svg-bg']}></SvgIcon>
      <div className={classes['login-sencond-box']}>
        <div className={classes['left-img']}>
          <div className={classes['react-logo']}></div>
          <h1 className={classes['project-name']}>Leno-Admin</h1>
        </div>
        {/* login && Register */}
        <div className={classes['login-box']}>
          {isLogin ? (
            <LoginForm
              toggleLogin={isLogin}
              changeIsLogin={changeIsLogin}
              loginData={login}
              svgCode={svgCode}
              getCaptchaImage={getCaptchaImage}
            />
          ) : (
            <RegisterForm
              changeIsLogin={changeIsLogin}
              registerList={registerList}
              svgCode={svgCode}
              getCaptchaImage={getCaptchaImage}
            />
          )}
        </div>

        <div className={classes['copyright']}>
          Copyright © 2023-current zhaowenchao.top All Rights Reserved
        </div>
      </div>
    </div>
  )
}

export default Login
