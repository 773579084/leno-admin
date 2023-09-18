import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Col, Row, Table, Pagination, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { putUserAuthAPI, getListAPI } from '@/api/modules/system/userAuth';
import useStore from '@/store';
import { toJS } from 'mobx';
import { tbasType } from '@/type/modules/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { IroleType } from '@/type/modules/system/role';
import { getUserInfoAPI } from '@/api/modules/system/user';
import classess from './index.module.scss';

const LenoUser: React.FC = () => {
  const [queryForm] = Form.useForm();
  const { userId } = useParams();

  const {
    useLayoutStore: { defaultObjMobx, changeTabsListMobx },
  } = useStore();
  const navigate = useNavigate();

  // 分页
  const [queryParams, setQueryParams] = useState<IroleType>({
    pageNum: 1,
    pageSize: 10,
  });
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IroleType[] });

  // table loading
  const [loading, setLoading] = useState(true);
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    async function initInfo() {
      const {
        data: { result },
      } = await getUserInfoAPI(userId as string);
      queryForm.setFieldsValue(result);
      setSelectKeys(result.roleIds as number[]);
      setLoading(false);
    }
    initInfo();
  }, []);

  // 查询列表
  const getList = async () => {
    try {
      const { data } = await getListAPI(queryParams);
      setDataList({ ...data.result });
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getList();
  }, [queryParams]);

  // row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectKeys(selectedRowKeys);
    },
  };

  // 分页
  const onPagChange = async (pageNum: number, pageSize: number) => {
    setQueryParams({ pageNum, pageSize });
  };

  // 关闭
  const closePage = () => {
    const tabs = toJS(defaultObjMobx.tabsListMobx) as tbasType[];
    changeTabsListMobx(tabs.filter((tab) => tab.path.indexOf(`userAuth/${userId}` as string) === -1));
    navigate('/system/user');
  };

  // 提交
  const submitUserRole = async () => {
    const { data } = await putUserAuthAPI({
      userId: userId as string,
      roleIds: selectKeys,
    });
    message.success(data.message);
    closePage();
  };

  // table
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    {
      title: '角色编号',
      dataIndex: 'roleId',
      key: 'roleId',
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      key: 'roleKey',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
  ] as ColumnsType<IroleType>;
  // table 数据源
  const tableData = dataList.rows;

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <h3 className={classess['h4-title']}>基本信息</h3>
          <Form form={queryForm} layout="inline" className={`${classess['base-info']} leno-search`}>
            <Form.Item label="用户昵称" name="nickName">
              <Input style={{ width: 240 }} readOnly />
            </Form.Item>
            <Form.Item label="登录账号" name="userName">
              <Input style={{ width: 240 }} readOnly />
            </Form.Item>
          </Form>
          <h3 className={classess['h4-title']}>角色信息</h3>
          <div className="leno-table">
            <Table rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }} columns={columns} dataSource={tableData} pagination={false} rowKey="roleId" size="middle" loading={loading} />
            <Pagination className="pagination" onChange={onPagChange} total={dataList.count} showSizeChanger showQuickJumper current={queryParams.pageNum} showTotal={(total) => `共 ${total} 条`} />
          </div>
        </Col>
        <Row gutter={24} justify="center" style={{ width: `${100}%`, marginTop: 10 }}>
          <Col>
            <Button onClick={submitUserRole} type="primary">
              提交
            </Button>
          </Col>
          <Col>
            <Button onClick={closePage}>返回</Button>
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default LenoUser;
