import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Input, InputNumber, Tabs, Radio, Row, Col, RadioChangeEvent, Card, Select } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import classes from './index.module.scss';
import { cronRunTime } from '../../utils/cronRunTime';
import { cronTimeEnum, IloopType, IperiodType, IpointType, IradioType } from './type';

// cron 类型
const cronType = ['second', 'minute', 'hour', 'day', 'month', 'week'] as cronTimeEnum[];
// 按钮基本样式
const radioStyle = {
  display: 'block',
  lineHeight: 2,
};

const Cron = (props: { cronExpression: string }, ref: any) => {
  const { cronExpression } = props;

  const [cronText, setCronText] = useState('');
  // 单选 选择执行类型
  const [radioValue, setRadioValue] = useState<IradioType>({
    second: 1,
    minute: 1,
    hour: 1,
    day: 1,
    month: 1,
    week: 1,
  });
  // 周期
  const [periodValue, setPeriodValue] = useState<IperiodType>({
    second: { min: 1, max: 2 },
    minute: { min: 1, max: 2 },
    hour: { min: 0, max: 1 },
    day: { min: 1, max: 2 },
    month: { min: 1, max: 2 },
    week: { min: 2, max: 3 },
  });
  // 从 ... 开始
  const [loopValue, setLoopValue] = useState<IloopType>({
    second: { start: 0, end: 1 },
    minute: { start: 0, end: 1 },
    hour: { start: 0, end: 1 },
    day: { start: 1, end: 1 },
    month: { start: 1, end: 1 },
    week: { start: 1, end: 1 },
  });
  // 指定
  const [pointValue, setPointValue] = useState<IpointType>({
    second: [],
    minute: [],
    hour: [],
    day: [],
    month: [],
    week: [],
  });

  /**
   * cron 回显
   * @param cronText
   */
  const cronComeShow = (cronStr: string) => {
    // 表达式回显
    setCronText(cronStr);

    // 拆分表达式
    const cronList = cronStr.split(' ');
    // 单选按钮
    const changeRadio = {} as IradioType;
    // 周期数组范围回显
    const initPeriodValue = {} as IperiodType;
    // 从...开始
    const initLoopValue = {} as IloopType;
    // 指定
    const initPointValue = {} as IpointType;

    // 单选按钮回显
    // 按钮内部的内容回显
    cronList.forEach((cron, index) => {
      if (cron.indexOf('*') !== -1) {
        /* empty */
      } else if (cron.indexOf('-') !== -1) {
        changeRadio[cronType[index]] = 'period';
        initPeriodValue[cronType[index]] = {
          min: Number(cron.split('-')[0]),
          max: Number(cron.split('-')[1]),
        };
      } else if (cron.indexOf('/') !== -1) {
        changeRadio[cronType[index]] = 'loop';
        initLoopValue[cronType[index]] = {
          start: Number(cron.split('/')[0]),
          end: Number(cron.split('/')[1]),
        };
      } else if (cron.indexOf('?') !== -1) {
        changeRadio[cronType[index]] = 2;
      } else {
        // 指定
        changeRadio[cronType[index]] = 'point';
        initPointValue[cronType[index]] = cron.split(',').map((item) => Number(item));
      }
    });

    setPeriodValue({
      ...periodValue,
      ...initPeriodValue,
    });
    setLoopValue({
      ...loopValue,
      ...initLoopValue,
    });
    setPointValue({
      ...pointValue,
      ...initPointValue,
    });
    setRadioValue({ ...radioValue, ...changeRadio });
  };

  // 最近运行时间
  const [resultTime, setResultTime] = useState<string[]>([]);

  // 重置或取消 -- 设置初始值
  const resetCronState = () => {
    setRadioValue({
      second: 1,
      minute: 1,
      hour: 1,
      day: 1,
      month: 1,
      week: 1,
    });
    setPeriodValue({
      second: { min: 1, max: 2 },
      minute: { min: 1, max: 2 },
      hour: { min: 0, max: 1 },
      day: { min: 1, max: 2 },
      month: { min: 1, max: 2 },
      week: { min: 2, max: 3 },
    });
    setLoopValue({
      second: { start: 0, end: 1 },
      minute: { start: 0, end: 1 },
      hour: { start: 0, end: 1 },
      day: { start: 1, end: 1 },
      month: { start: 1, end: 1 },
      week: { start: 1, end: 1 },
    });
    setPointValue({ second: [], minute: [], hour: [], day: [], month: [], week: [] });
    setCronText('');
  };

  /**
   * 对象生成器
   * @param type
   * @param data
   * @returns {{second: *}|{minute: *}}
   */
  const cronItemGenerator = (type: string, data: string): { [key: string]: string } => {
    switch (type) {
      case 'second':
        return { second: data };
      case 'minute':
        return { minute: data };
      case 'hour':
        return { hour: data };
      case 'day':
        return { day: data };
      case 'month':
        return { month: data };
      case 'week':
        return { week: data };
      default:
        return {};
    }
  };

  /**
   * cron生成器
   * @param type
   */
  const cronGenerator = (type: cronTimeEnum) => {
    const srv = radioValue[type];
    const period = periodValue[type];
    const loop = loopValue[type];
    const param = pointValue[type];
    let data = '';
    switch (srv) {
      case 1:
        data = '*';
        break;
      case 2:
        data = '?';
        break;
      case 'point':
        for (const v of param) {
          data = `${data + v},`;
        }
        data = data.substring(0, data.length - 1);
        break;
      case 'period':
        data = `${period.min}-${period.max}`;
        break;
      case 'loop':
        data = `${loop.start}/${loop.end}`;
        break;
      default:
        data = '*';
    }

    return cronItemGenerator(type, data);
  };

  // 生成cron
  const createCron = () => {
    let changeCron = {} as IradioType;
    // eslint-disable-next-line no-return-assign
    cronType.forEach((item) => (changeCron = { ...changeCron, ...cronGenerator(item) }));

    const { second, minute, hour, day, month, week } = changeCron;

    const cronTextCreate = `${second} ${minute} ${hour} ${day} ${month} ${week}`;

    setCronText(cronTextCreate);
    setResultTime(cronRunTime(cronTextCreate));
  };

  useEffect(() => {
    if (cronExpression) {
      cronComeShow(cronExpression);
    } else {
      resetCronState();
    }
  }, [props]);

  useEffect(() => {
    createCron();
  }, [radioValue, periodValue, loopValue]);

  // ref 获取值
  const refGetCron = () => cronText;
  // ref 上传函数
  useImperativeHandle(ref, () => ({
    refGetCron,
    resetCronState,
  }));

  /**
   * 生成 日期选择时间 options
   * @param num
   * @returns {lable:number,value:number}[]
   */
  const createSelectOption = (num: number): { label: number; value: number }[] => {
    const obj = [] as { label: number; value: number }[];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= num; i++) {
      obj.push({
        label: i,
        value: i,
      });
    }
    return obj;
  };

  /**
   * 生成 week options
   * @param num
   * @returns {lable:string,value:number}[]
   */
  const createWeekSelect = (num: number): { label: string; value: number }[] => {
    const obj = [] as { label: string; value: number }[];
    const weeks = ['', '一', '二', '三', '四', '五', '六', '日'];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= num; i++) {
      obj.push({
        label: `星期${weeks[i]}`,
        value: i + 1 === 8 ? 1 : i + 1,
      });
    }
    return obj;
  };

  /**
   * 单选按钮选择
   * @param e
   * @param type
   */
  const handleRadioChange = (e: RadioChangeEvent, type: string) => {
    switch (type) {
      case 'week':
        setRadioValue({ ...radioValue, day: 2, ...cronItemGenerator(type, e.target.value) });
        break;
      case 'day':
        setRadioValue({ ...radioValue, week: 2, ...cronItemGenerator(type, e.target.value) });
        break;

      default:
        setRadioValue({
          ...radioValue,
          ...cronItemGenerator(type, e.target.value),
        });
        break;
    }
  };

  /**
   * 指定时间选择
   * @param checkedValues
   * @param type
   * @param fun
   */
  const handleCheckboxChange = (checkedValues: string | CheckboxValueType[], type: string, fun: any) => {
    // select双向绑定
    fun({ ...pointValue, [type]: checkedValues });
    // 选择时间自动跳到 指定
    setRadioValue({
      ...radioValue,
      [type]: 'point',
    });
  };

  /**
   * 周期 InputNumber按钮选择
   * @param e
   * @param type
   * @param tar
   */
  const handlePeriodChange = (e: number, type: cronTimeEnum, tar: string) => {
    const data = periodValue;
    data[type] = tar === 'max' ? { max: e, min: data[type].min } : { max: data[type].max, min: e };
    setPeriodValue({
      ...periodValue,
      ...cronItemGenerator(type, data[type] as unknown as string),
    });
  };

  /**
   * 从...开始 InputNumber按钮选择
   * @param e
   * @param type
   * @param tar
   */
  const handleLoopChange = (e: number, type: cronTimeEnum, tar: string) => {
    const data = loopValue;
    data[type] = tar === 'start' ? { start: e, end: data[type].end } : { start: data[type].start, end: e };

    setLoopValue({
      ...loopValue,
      ...cronItemGenerator(type, data[type] as unknown as string),
    });
  };

  return (
    <div className={classes['cron-com']}>
      <Tabs
        type="card"
        items={[
          {
            label: `秒`,
            key: '1',
            children: (
              <Card className={classes['card-top']}>
                <Radio.Group
                  onChange={(e) => {
                    handleRadioChange(e, 'second');
                  }}
                  value={radioValue.second}
                >
                  <Radio style={radioStyle} value={1}>
                    每秒执行
                  </Radio>
                  <Radio style={radioStyle} value="period">
                    周期从
                    <InputNumber size="small" min={0} max={58} value={periodValue.second.min} onChange={(e) => handlePeriodChange(e as number, 'second', 'min')} />
                    -
                    <InputNumber size="small" min={1} max={59} value={periodValue.second.max} onChange={(e) => handlePeriodChange(e as number, 'second', 'max')} />秒
                  </Radio>
                  <Radio style={radioStyle} value="loop">
                    从
                    <InputNumber size="small" min={0} max={58} value={loopValue.second.start} onChange={(e) => handleLoopChange(e as number, 'second', 'start')} />
                    秒开始，每
                    <InputNumber size="small" min={1} max={59} value={loopValue.second.end} onChange={(e) => handleLoopChange(e as number, 'second', 'end')} />
                    秒执行一次
                  </Radio>
                  <Row>
                    <Radio style={radioStyle} value="point">
                      指定
                    </Radio>
                    <Col span={18}>
                      <Select
                        value={pointValue.second}
                        style={{ width: '80%', marginTop: 7 }}
                        mode="multiple"
                        allowClear
                        placeholder="请选择秒"
                        onChange={(value) => handleCheckboxChange(value, 'second', setPointValue)}
                        options={createSelectOption(59)}
                      />
                    </Col>
                  </Row>
                </Radio.Group>
              </Card>
            ),
          },
          {
            label: `分`,
            key: '2',
            children: (
              <Card className={classes['card-top']}>
                <Radio.Group value={radioValue.minute} onChange={(e) => handleRadioChange(e, 'minute')}>
                  <Radio style={radioStyle} value={1}>
                    每分执行
                  </Radio>
                  <Radio style={radioStyle} value="period">
                    周期从
                    <InputNumber size="small" min={0} max={58} value={periodValue.minute.min} onChange={(e) => handlePeriodChange(e as number, 'minute', 'min')} />
                    -
                    <InputNumber size="small" min={2} max={59} value={periodValue.minute.max} onChange={(e) => handlePeriodChange(e as number, 'minute', 'max')} />分
                  </Radio>
                  <Radio style={radioStyle} value="loop">
                    从
                    <InputNumber size="small" min={0} max={58} value={loopValue.minute.start} onChange={(e) => handleLoopChange(e as number, 'minute', 'start')} />
                    分开始，每
                    <InputNumber size="small" min={1} max={58} value={loopValue.minute.end} onChange={(e) => handleLoopChange(e as number, 'minute', 'end')} />
                    分执行一次
                  </Radio>

                  <Row>
                    <Radio style={radioStyle} value="point">
                      指定
                    </Radio>
                    <Col span={18}>
                      <Select
                        value={pointValue.minute}
                        style={{ width: '80%', marginTop: 7 }}
                        mode="multiple"
                        allowClear
                        placeholder="请选择分钟"
                        onChange={(value) => handleCheckboxChange(value, 'minute', setPointValue)}
                        options={createSelectOption(59)}
                      />
                    </Col>
                  </Row>
                </Radio.Group>
              </Card>
            ),
          },
          {
            label: `时`,
            key: '3',
            children: (
              <Card className={classes['card-top']}>
                <Radio.Group onChange={(e) => handleRadioChange(e, 'hour')} value={radioValue.hour}>
                  <Radio style={radioStyle} value={1}>
                    每小时执行
                  </Radio>
                  <Radio style={radioStyle} value="period">
                    周期从
                    <InputNumber size="small" min={0} max={22} value={periodValue.hour.min} onChange={(e) => handlePeriodChange(e as number, 'hour', 'min')} />
                    -
                    <InputNumber size="small" min={1} max={23} value={periodValue.hour.max} onChange={(e) => handlePeriodChange(e as number, 'hour', 'max')} />时
                  </Radio>
                  <Radio style={radioStyle} value="loop">
                    从
                    <InputNumber size="small" min={0} max={22} value={loopValue.hour.start} onChange={(e) => handleLoopChange(e as number, 'hour', 'start')} />
                    时开始，每
                    <InputNumber size="small" min={1} max={22} value={loopValue.hour.end} onChange={(e) => handleLoopChange(e as number, 'hour', 'end')} />
                    时执行一次
                  </Radio>

                  <Row>
                    <Radio style={radioStyle} value="point">
                      指定
                    </Radio>

                    <Col span={18}>
                      <Select
                        value={pointValue.hour}
                        style={{ width: '80%', marginTop: 7 }}
                        mode="multiple"
                        allowClear
                        placeholder="请选择小时"
                        onChange={(value) => handleCheckboxChange(value, 'hour', setPointValue)}
                        options={createSelectOption(23)}
                      />
                    </Col>
                  </Row>
                </Radio.Group>
              </Card>
            ),
          },
          {
            label: `日`,
            key: '4',
            children: (
              <Card className={classes['card-top']}>
                <Radio.Group onChange={(e) => handleRadioChange(e, 'day')} value={radioValue.day}>
                  <Radio style={radioStyle} value={1}>
                    每日执行
                  </Radio>
                  <Radio style={radioStyle} value={2}>
                    不指定
                  </Radio>
                  <Radio style={radioStyle} value="period">
                    周期从
                    <InputNumber size="small" min={1} max={30} value={periodValue.day.min} onChange={(e) => handlePeriodChange(e as number, 'day', 'min')} />
                    -
                    <InputNumber size="small" min={2} max={31} value={periodValue.day.max} onChange={(e) => handlePeriodChange(e as number, 'day', 'max')} />日
                  </Radio>
                  <Radio style={radioStyle} value="loop">
                    从
                    <InputNumber size="small" min={1} max={31} value={loopValue.day.start} onChange={(e) => handleLoopChange(e as number, 'day', 'start')} />
                    日开始，每
                    <InputNumber size="small" min={1} max={31} value={loopValue.day.end} onChange={(e) => handleLoopChange(e as number, 'day', 'end')} />
                    日执行一次
                  </Radio>

                  <Row>
                    <Radio style={radioStyle} value="point">
                      指定
                    </Radio>
                    <Col span={18}>
                      <Select
                        value={pointValue.day}
                        style={{ width: '80%', marginTop: 7 }}
                        mode="multiple"
                        allowClear
                        placeholder="请选择日期"
                        onChange={(value) => handleCheckboxChange(value, 'day', setPointValue)}
                        options={createSelectOption(23)}
                      />
                    </Col>
                  </Row>
                </Radio.Group>
              </Card>
            ),
          },
          {
            label: `月`,
            key: '5',
            children: (
              <Card className={classes['card-top']}>
                <Radio.Group onChange={(e) => handleRadioChange(e, 'month')} value={radioValue.month}>
                  <Radio style={radioStyle} value={1}>
                    每月执行
                  </Radio>
                  <Radio style={radioStyle} value={2}>
                    不指定
                  </Radio>
                  <Radio style={radioStyle} value="period">
                    周期从
                    <InputNumber size="small" min={1} max={11} value={periodValue.month.min} onChange={(e) => handlePeriodChange(e as number, 'month', 'min')} />
                    -
                    <InputNumber size="small" min={2} max={12} value={periodValue.month.max} onChange={(e) => handlePeriodChange(e as number, 'month', 'max')} />月
                  </Radio>
                  <Radio style={radioStyle} value="loop">
                    从
                    <InputNumber size="small" min={1} max={12} value={loopValue.month.start} onChange={(e) => handleLoopChange(e as number, 'month', 'start')} />
                    月开始，每
                    <InputNumber size="small" min={1} max={12} value={loopValue.month.end} onChange={(e) => handleLoopChange(e as number, 'month', 'end')} />
                    月执行一次
                  </Radio>
                  <Row>
                    <Radio style={radioStyle} value="point">
                      指定
                    </Radio>
                    <Col span={18}>
                      <Select
                        value={pointValue.month}
                        style={{ width: '80%', marginTop: 7 }}
                        mode="multiple"
                        allowClear
                        placeholder="请选择月份"
                        onChange={(value) => handleCheckboxChange(value, 'month', setPointValue)}
                        options={createSelectOption(12)}
                      />
                    </Col>
                  </Row>
                </Radio.Group>
              </Card>
            ),
          },
          {
            label: `周`,
            key: '6',
            children: (
              <Card className={classes['card-top']}>
                <Radio.Group onChange={(e) => handleRadioChange(e, 'week')} value={radioValue.week}>
                  <Radio style={radioStyle} value={1}>
                    每周执行
                  </Radio>
                  <Radio style={radioStyle} value={2}>
                    不指定
                  </Radio>
                  <Row>
                    <Col>
                      <Radio style={radioStyle} value="period">
                        周期从 周
                      </Radio>
                    </Col>
                    <Col>
                      <Select
                        style={{ marginTop: 7 }}
                        allowClear
                        value={periodValue.week.min}
                        placeholder="请选择周"
                        onChange={(e) => handlePeriodChange(e as number, 'week', 'min')}
                        options={createWeekSelect(7)}
                      />
                    </Col>
                    <Col className={classes['week-font']}>- 周</Col>
                    <Col>
                      <Select
                        style={{ marginTop: 7 }}
                        allowClear
                        value={periodValue.week.max}
                        placeholder="请选择周"
                        onChange={(e) => handlePeriodChange(e as number, 'week', 'max')}
                        options={createWeekSelect(7)}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Radio style={radioStyle} value="point">
                      指定
                    </Radio>
                    <Col span={18}>
                      <Select
                        value={pointValue.week}
                        style={{ width: '80%', marginTop: 7 }}
                        mode="multiple"
                        allowClear
                        placeholder="请选择周"
                        onChange={(value) => handleCheckboxChange(value, 'week', setPointValue)}
                        options={createWeekSelect(7)}
                      />
                    </Col>
                  </Row>
                </Radio.Group>
              </Card>
            ),
          },
        ]}
      />
      <Card className={classes['corn-time']}>
        <Row gutter={10}>
          <Col className={classes.titile}>时间表达式：</Col>
          <Col>
            <Input placeholder="生成Cron" style={{ width: 400, marginTop: 10 }} readOnly value={cronText} />
          </Col>
        </Row>
      </Card>
      <Card className={classes['run-time']}>
        <p className="title">最近五次运行时间</p>
        <ul>
          {resultTime.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default forwardRef(Cron);
