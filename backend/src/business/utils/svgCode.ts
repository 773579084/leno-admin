// 图片验证
import svgCode from 'svg-captcha';

export default () =>
  svgCode.createMathExpr({
    color: true,
    background: '#cc9966',
    fontSize: 50,
    height: 46,
    width: 120,
  });
