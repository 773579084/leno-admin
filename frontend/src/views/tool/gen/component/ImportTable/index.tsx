import { Button, Form, Input, Modal, Pagination } from 'antd';
import React, { useState, useEffect, memo } from 'react';
import { SyncOutlined, SearchOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/lib/table';
import { GenTableType, GenType, importTableLimitType } from '@/type/modules/tool/gen';
import { getDbListAPI, importTableAPI } from '@/api/modules/tool/gen';
import { arePropsEqual } from '@/utils';

export type ImportTableType = {
  onCancel: () => void;
  onSubmit: () => void;
  isImportOpen: boolean;
};

const ImportTable: React.FC<ImportTableType> = (props) => {
  const [queryForm] = Form.useForm();
  const { isImportOpen, onSubmit, onCancel } = props;

  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as GenType[] });
  // 分页
  const [queryParams, setQueryParams] = useState<importTableLimitType>({ pageNum: 1, pageSize: 10 });
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
  // table 后台使用的key
  const [rowKeys, setRowKeys] = useState('');
  // table loading
  const [loading, setLoading] = useState(true);

  // 请求list
  const getList = async () => {
    try {
      const { data } = await getDbListAPI(queryParams);
      setDataList({ ...data.result });
      setLoading(false);
    } catch (error) {}
  };

  // 监听显隐，请求table数据
  useEffect(() => {
    if (isImportOpen) {
      getList();
    }
  }, [isImportOpen, queryParams]);

  // 搜索
  const searchQueryFn = () => {
    const { createdAt, ...form } = queryForm.getFieldsValue();

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

  // table columns
  const columns = [
    {
      title: '表名称',
      dataIndex: 'tableName',
      key: 'tableName',
      align: 'center',
      width: '80px',
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
      key: 'tableComment',
      align: 'center',
      width: '150px',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: '180px',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      width: '180px',
    },
  ] as ColumnsType<GenTableType>;

  // table 数据源
  const tableData = dataList.rows;

  // row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: GenTableType[]) => {
      setSelectKeys(selectedRowKeys);
      const tableNames = [] as string[];
      selectedRows.forEach((raw) => {
        tableNames.push(raw.tableName);
      });
      setRowKeys(tableNames.join(','));
    },
  };

  // 分页
  const onPagChange = async (pageNum: number, pageSize: number) => {
    setQueryParams({ pageNum, pageSize });
  };

  // 确认导入
  const importTableFn = async () => {
    try {
      await importTableAPI(rowKeys);
      resetQueryFn();
      onSubmit();
    } catch (error) {}
  };

  return (
    <Modal
      title="导入表"
      open={isImportOpen}
      onOk={() => {
        importTableFn();
      }}
      onCancel={onCancel}
      width={900}
    >
      <Form form={queryForm} layout="inline" autoComplete="off" className="leno-search">
        <Form.Item label="表名称" name="tableName">
          <Input style={{ width: 240 }} placeholder="请输入表名称" allowClear onPressEnter={searchQueryFn} />
        </Form.Item>
        <Form.Item label="表描述" name="tableComment">
          <Input style={{ width: 240 }} placeholder="请输入表描述" allowClear onPressEnter={searchQueryFn} />
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

      <div className="leno-table" style={{ paddingBottom: 50 }}>
        <Table
          rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }}
          columns={columns}
          dataSource={tableData as GenType[]}
          pagination={false}
          rowKey="tableId"
          loading={loading}
          size="middle"
        />
        <Pagination className="pagination" onChange={onPagChange} total={dataList.count} showSizeChanger showQuickJumper current={queryParams.pageNum} showTotal={(total) => `共 ${total} 条`} />
      </div>
    </Modal>
  );
};

export default memo(ImportTable, arePropsEqual);
