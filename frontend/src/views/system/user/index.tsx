/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo, useState, useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, Col, Row, Tooltip, Table, Switch, Pagination, Tree, message, Modal, Checkbox, Upload, UploadFile, Dropdown, MenuProps } from 'antd';
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VerticalAlignBottomOutlined,
  ToTopOutlined,
  AppstoreFilled,
  DoubleRightOutlined,
  CheckCircleOutlined,
  UnlockOutlined,
  InboxOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import type { ColumnsType } from 'antd/es/table';
import { getUserListAPI, delUserAPI, deptTreeAPI, getPostRoleAPI, patchUserPwdAPI, getUserInfoAPI, putUserStatusAPI, uploadExcelsAPI } from '@/api/modules/system/user';
import { getDictsApi } from '@/api/modules/system/dictData';
import { download } from '@/api';
import { DataType, userType, getAddUserResult, userQueryType } from '@/type';
import type { UploadProps } from 'antd';
import useStore from '@/store';
import ColorBtn from '@/components/ColorBtn';
import { Key } from 'rc-tree/lib/interface';
import dayjs from 'dayjs';
import { IdictType } from '@/type/modules/system/sysDictData';
import { hasPermi } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { MenuInfo } from 'rc-menu/lib/interface';
import { getConfigKeyAPI } from '@/api/modules/system/config';
import ShowHiddleColumn from './component/ShowHiddleColumn';
import AddEditUser from './component/AddEdit';

const { RangePicker } = DatePicker;
const { Dragger } = Upload;

const dataList: { key: React.Key; title: string }[] = [];

const User = () => {
  const [queryForm] = Form.useForm();
  const [resetForm] = Form.useForm();
  const { Search } = Input;
  const {
    useUserStore: { userInfo },
  } = useStore();
  const navigate = useNavigate();

  // 分页
  const [queryParams, setQueryParams] = useState<userQueryType>({ pageNum: 1, pageSize: 10 });
  // 用户列表数据
  const [userList, setUserList] = useState({ count: 0, rows: [] as userType[] });
  const { confirm } = Modal;
  // table loading
  const [loading, setLoading] = useState(true);
  // 更改用户密码
  const [changePwdModalOpen, setChangePwdModalOpen] = useState(false);
  // 保存 当前选择用户信息
  const [currentUser, setCurrentUser] = useState<userType>({});
  // 新增编辑 model显隐
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 显隐列 model显隐
  const [showHiddenOpen, setShowHiddenOpen] = useState(false);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  // add user btn
  const [postRole, setPostRole] = useState<getAddUserResult>({ posts: [], roles: [] });
  const [propsValues, setPropsValues] = useState<userType>({
    status: '0',
    sex: '2',
    password: '',
  });
  // 非单个禁用
  const [single, setSingle] = useState(true);
  // 非多个禁用
  const [multiple, setMultiple] = useState(true);
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true);
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
  // 保存table 选择的key
  const [rowKeys, setRowKeys] = useState('');
  // left deptTree
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 树状数据
  const [defaultData, setDefaultData] = useState<DataNode[]>([]);
  // 文件上传
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  // 文件上传 判断是否更新用户数据
  const [isUpdateSupport, setIsUpdateSupport] = useState('0');
  // 存储已上传的文件
  const [isFiles, setIsFiles] = useState<UploadFile<any>[]>([]);
  // dicts
  const [dictStatus, setDictStatus] = useState<IdictType[]>([]);
  const [dictSex, setDictSex] = useState<IdictType[]>([]);

  // 初始化获取字典
  const getDicts = async () => {
    try {
      const status = await getDictsApi('sys_normal_disable');
      setDictStatus(status.data.result);
      const sexs = await getDictsApi('sys_user_sex');
      setDictSex(sexs.data.result);
    } catch (error) {}
  };

  // 查询列表
  const getList = async () => {
    try {
      const { data } = await getUserListAPI(queryParams);

      setUserList({ ...data.result });
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    getList();
  }, [queryParams]);

  const searchQueryFn = () => {
    // eslint-disable-next-line prefer-const
    let { createdAt, ...form } = queryForm.getFieldsValue();
    if (createdAt) {
      form = {
        ...form,
        beginTime: dayjs(createdAt[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs(createdAt[1]).format('YYYY-MM-DD HH:mm:ss'),
      };
    }
    setQueryParams({
      pageNum: 1,
      pageSize: 10,
      ...form,
    });
  };

  const resetQueryFn = () => {
    queryForm.resetFields();
    setSelectKeys([]);
    setQueryParams({ pageNum: 1, pageSize: 10 });
  };

  // excel 导入
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.xlsx,.xls',
    fileList: isFiles,
    beforeUpload: () => false,
    onChange: (info) => {
      setIsFiles(info.fileList);
    },
  };
  const handleUploadOk = async () => {
    try {
      const fd = new FormData();
      fd.append('updateSupport', isUpdateSupport);
      isFiles.forEach((file: any) => {
        fd.append('excel', file.originFileObj);
      });
      const { data } = await uploadExcelsAPI(fd);
      message.success(data.message);
      setIsUploadModalOpen(false);
      setIsUpdateSupport('0');
      setIsFiles([]);
    } catch (error) {}
  };
  const handleUploadCancel = () => {
    setIsUploadModalOpen(false);
    setIsFiles([]);
    setIsUpdateSupport('0');
  };

  // row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      if (!selectedRowKeys.length || selectedRowKeys.length > 1) {
        setSingle(true);
      } else {
        setSingle(false);
      }
      setSelectKeys(selectedRowKeys);
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true);
      setRowKeys(selectedRowKeys.join(','));
    },
  };

  // left deptTree
  // 生成树状数据
  const generateData = async () => {
    try {
      const { data } = await deptTreeAPI();
      setDefaultData([...data.result]);
    } catch (error) {}
  };
  // create
  useEffect(() => {
    generateData();
    getDicts();
    getConfigKeyAPI('sys.user.initPassword')
      .then(({ data: { result } }) => {
        setPropsValues({
          ...propsValues,
          password: result,
        });
      })
      .catch();
  }, []);

  // 生成搜索用的扁平数据结构
  const generateList = (data: DataNode[]) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title: title as string });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  // 监听部门数据源结构，改变则重新生成搜索用的扁平数据结构
  useEffect(() => {
    dataList.splice(0);
    generateList(defaultData);
  }, [defaultData]);

  const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return parentKey!;
  };

  // 展开
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  // search输入后触发
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(defaultData);
  }, [searchValue, defaultData]);

  // tree
  const selectTreeFn = (selectedKeys: Key[]) => {
    setQueryParams({ ...queryParams, deptId: selectedKeys[0] as number });
  };

  // #region table
  // 分页
  const onPagChange = async (pageNum: number, pageSize: number) => {
    setQueryParams({ pageNum, pageSize });
  };

  // 用户状态修改
  const onUserStaChange = async (checked: string, userId: number) => {
    try {
      const { data } = await putUserStatusAPI({
        // eslint-disable-next-line no-param-reassign
        status: checked === '0' ? (checked = '1') : (checked = '0'),
        userId,
      });
      message.success(data.message);
      getList();
    } catch (error) {}
  };

  // 删除user
  const delFn = (ids: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除用户编号为"${ids}"的数据项？`,
      centered: true,
      onOk: async () => {
        try {
          const { data } = await delUserAPI(ids);
          message.success(data.message);
          setSelectKeys([]);
          const pageNum = Math.ceil((userList.count - ids.split(',').length) / queryParams.pageSize);
          setQueryParams({
            pageNum: pageNum || 1,
            pageSize: queryParams.pageSize,
          });
        } catch (error) {}
      },
    });
  };

  const resetPwdFn = (record: userType) => {
    setCurrentUser(record);
    setSelectKeys([]);
    setChangePwdModalOpen(true);
  };
  const handleMenuClick = async (e: MenuInfo, record: userType) => {
    switch (e.key) {
      case '1':
        resetPwdFn(record);
        break;
      case '2':
        navigate(`/system/userAuth/${record.userId}`);
        break;

      default:
        break;
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div hidden={hasPermi('system:user:resetPwd')}>
          <UnlockOutlined style={{ marginRight: 10 }} />
          重置密码
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <CheckCircleOutlined style={{ marginRight: 10 }} />
          分配角色
        </div>
      ),
    },
  ];

  // 获取用户数据
  const getUserListFn = async (userId: number | string) => {
    try {
      const { data } = await getUserInfoAPI(userId);
      setPropsValues(data.result);
      setPostRole({
        posts: data.result.posts,
        roles: data.result.roles,
      } as getAddUserResult);
    } catch (error) {}
  };

  // table columns
  const columns = [
    {
      title: '用户编号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text: any, record: any, index: number) => index + 1, // 渲染序号
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      align: 'center',
    },
    {
      title: '区域',
      dataIndex: ['dept', 'deptName'],
      key: 'deptName',
      align: 'center',
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_: any, record: userType) => (
        <div>
          <Switch
            checked={record.status === '0'}
            onChange={() => {
              if (record.userName === 'admin') {
                message.warn('超级管理员不可停用');
                return;
              }
              if (record.userName === userInfo.userName) {
                message.warn('不可停用当前登录账号');
                return;
              }
              onUserStaChange(record.status as string, record.userId as number);
            }}
          />
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: '180px',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (record: userType) => (
        <div hidden={record.userId === 1}>
          <Button
            hidden={hasPermi('system:user:edit')}
            onClick={() => {
              setIsModalOpen(true);
              getUserListFn(record.userId as number);
            }}
            size="small"
            icon={<EditOutlined />}
            type="link"
          >
            修改
          </Button>
          <Button hidden={hasPermi('system:user:import')} size="small" icon={<DeleteOutlined />} type="link" onClick={() => delFn(`${record.userId}`)}>
            删除
          </Button>
          <Dropdown
            menu={{
              items,
              onClick: (e) => {
                handleMenuClick(e, record);
              },
            }}
            placement="bottomRight"
          >
            <Button size="small" icon={<DoubleRightOutlined />} type="link">
              更多
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ].filter((item) => !targetKeys.some((key) => item.key === key)) as ColumnsType<DataType>;

  // table 数据源
  const data: any = userList.rows;
  // #endregion

  // 更改用户密码
  const changePwdhandleOk = () => {
    resetForm.submit();
    setChangePwdModalOpen(false);
  };

  const changePwdCancel = () => {
    setChangePwdModalOpen(false);
    resetForm.resetFields();
  };

  // 更改用户密码
  const onResntPwdFinish = async (values: { newPassword: string }) => {
    try {
      const res = await patchUserPwdAPI({
        password: values.newPassword,
        userId: currentUser.userId,
      });
      message.success(res.data.message);
      resetForm.resetFields();
    } catch (error) {
      resetForm.resetFields();
    }
  };

  // 获取 角色岗位
  const getPostRoleFn = async () => {
    try {
      const res = await getPostRoleAPI();
      // 遍历生成格式
      setPostRole(res.data.result as getAddUserResult);
    } catch (error) {}
  };

  return (
    <div className="app-container">
      <Row gutter={16} className="sys-user">
        <Col span={4}>
          <Search style={{ marginBottom: 8 }} placeholder="请输入部门名称" onChange={onChange} />
          <Tree
            onExpand={onExpand}
            expandedKeys={expandedKeys as any}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            onSelect={(selectedKeys: Key[]) => {
              selectTreeFn(selectedKeys);
            }}
          />
        </Col>
        <Col span={20}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" name={'query'} autoComplete="off" className="leno-search">
            <Form.Item label="用户名称" name="userName">
              <Input style={{ width: 240 }} placeholder="请输入用户名称" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item label="手机号码" name="phonenumber">
              <Input style={{ width: 240 }} placeholder="请输入手机号码" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                style={{ width: 240 }}
                placeholder="用户状态"
                allowClear
                options={dictStatus.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
            </Form.Item>
            <Form.Item label="创建时间" name="createdAt">
              <RangePicker style={{ width: 240 }} />
            </Form.Item>
            <Form.Item>
              <Button onClick={searchQueryFn} type="primary" icon={<SearchOutlined />}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={resetQueryFn} icon={<SyncOutlined />}>
                重置
              </Button>
            </Form.Item>
          </Form>
          <Row gutter={16} className="mb10">
            <Col span={16} className="leno-btn">
              <Row gutter={8}>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:user:add')}
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setIsModalOpen(true);
                      getPostRoleFn();
                    }}
                  >
                    新增
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:user:edit')}
                    disabled={single}
                    color="success"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setIsModalOpen(true);
                      getUserListFn(rowKeys);
                    }}
                  >
                    修改
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('system:user:import')} onClick={() => delFn(rowKeys)} disabled={multiple} color="danger" icon={<DeleteOutlined />}>
                    删除
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:user:remove')}
                    color="info"
                    icon={<ToTopOutlined />}
                    onClick={() => {
                      setIsUploadModalOpen(true);
                    }}
                  >
                    导入
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:user:export')}
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => {
                      try {
                        download('/system/user/export');
                      } catch (error) {}
                    }}
                  >
                    导出
                  </ColorBtn>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row gutter={8} justify="end">
                <Col>
                  <Tooltip placement="top" title={searchShow ? '隐藏搜索' : '显示搜索'}>
                    <Button
                      shape="circle"
                      icon={<SearchOutlined />}
                      onClick={() => {
                        setSearchShow(!searchShow);
                      }}
                    />
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip placement="top" title="刷新">
                    <Button
                      shape="circle"
                      icon={<SyncOutlined />}
                      onClick={() => {
                        searchQueryFn();
                        setSelectKeys([]);
                      }}
                    />
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip placement="top" title="显隐列">
                    <Button
                      shape="circle"
                      icon={<AppstoreFilled />}
                      onClick={() => {
                        setShowHiddenOpen(true);
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="leno-table">
            <Table rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }} columns={columns} dataSource={data} pagination={false} rowKey="userId" size="middle" loading={loading} />
            <Pagination className="pagination" onChange={onPagChange} total={userList.count} showSizeChanger showQuickJumper current={queryParams.pageNum} showTotal={(total) => `共 ${total} 条`} />
          </div>
          {/* 添加 编辑 用户 */}
          <Modal title="提示" open={changePwdModalOpen} onOk={changePwdhandleOk} onCancel={changePwdCancel}>
            <div style={{ marginBottom: 20 }}>请输入"{currentUser.userName}"的新密码</div>
            <Form form={resetForm} onFinish={onResntPwdFinish}>
              <Form.Item name="newPassword" rules={[{ required: true, min: 4, max: 11, message: '请输入4-11位密码!' }]}>
                <Input.Password placeholder="请输入4-11位密码" />
              </Form.Item>
            </Form>
          </Modal>

          <Modal title="用户导入" open={isUploadModalOpen} onOk={handleUploadOk} onCancel={handleUploadCancel}>
            <Dragger {...props} height={200}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
            </Dragger>
            <Row justify="center" align="middle" style={{ marginTop: 20 }}>
              <Checkbox
                checked={isUpdateSupport === '1'}
                onChange={() => {
                  isUpdateSupport === '1' ? setIsUpdateSupport('0') : setIsUpdateSupport('1');
                }}
                style={{ marginRight: 5 }}
              />
              是否更新已经存在的用户数据
            </Row>
            <Row justify="center" align="middle">
              仅允许导入xls、xlsx格式文件。
              <Button
                type="link"
                size="small"
                onClick={() => {
                  try {
                    download('/system/user/export/template', 'sys_user_template');
                  } catch (error) {}
                }}
              >
                下载模板
              </Button>
            </Row>
            <Row justify="center" align="middle" style={{ fontSize: 12, color: '#808080' }}>
              支持单文件、多文件上传
            </Row>
          </Modal>

          <AddEditUser
            isModalOpen={isModalOpen}
            defaultData={defaultData}
            postRole={postRole}
            propsValues={propsValues}
            dicts={{ statusList: dictStatus, sexs: dictSex }}
            onCancel={() => {
              setIsModalOpen(false);
              setPropsValues({
                status: '0',
                sex: '2',
                password: '123456',
              });
            }}
            onSubmit={() => {
              getList();
            }}
          />

          <ShowHiddleColumn
            showHiddenOpen={showHiddenOpen}
            columns={columns}
            onSubmit={(keys) => {
              setTargetKeys(keys as string[]);
              setShowHiddenOpen(false);
            }}
            onCancel={() => {
              setShowHiddenOpen(false);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default User;
