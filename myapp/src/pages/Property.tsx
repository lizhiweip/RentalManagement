import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Form, Select, message, Modal } from 'antd';

import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

const ListPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchData = async (params) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/property/list', { params });
      setDataSource(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: '房产类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      
    },
    {
      title: '租金',
      dataIndex: 'rentAmount',
      key: 'rentAmount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 0 ? '未出租' : '已出租'),
    },
    {
      title: '备注信息',
      dataIndex: 'otherInfo',
      key: 'otherInfo',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleGenerateContract(record)}>
          生成合同
        </Button>
      ),
    },
  ];
  const handleGenerateContract = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
  
      if (!selectedRow || !selectedRow.propertyId) {
        console.error('Error: Selected row or propertyId is undefined.');
        return;
      }
  
      const requestData = {
        propertyId: selectedRow.propertyId,
        email: values.email,
        userName: values.userName,
        password: values.password,
        startDate: values.startDate,
        endDate: values.endDate
      };
      const formatDate = (date) => {
        const formattedDate = new Date(date).toISOString();
        return formattedDate;
      };
  
      const result = await axios.post('http://localhost:8081/contract/save', null, {
  params: {
    propertyId: selectedRow.propertyId,
    email: values.email,
    userName: values.userName,
    password: values.password,
    startDate: formatDate(values.startDate),
    endDate: formatDate(values.endDate)
  },
});


      console.log("pramar111111:", requestData);
      console.log("result", result);

      if (result.data.code === 0) {
        message.error(result.data.msg);
      } else {
        message.success(result.data.data);
        console.log("message:",result.data.data)
      }
  
      setIsModalVisible(false);
      form.resetFields();
      fetchData(); // Refresh the table data
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleSearch = () => {
    const values = form.getFieldsValue();
    fetchData(values);
  };

  return (
    <div>
      <Form form={form} layout="inline">
        <Form.Item label="房产类型" name="propertyType">
          <Input placeholder="" />
        </Form.Item>
        <Form.Item label="地址" name="address">
          <Input placeholder="" />
        </Form.Item>
        <Form.Item label="最小金额" name="minAmount">
          <Input type="number" placeholder="" step={100} min={0}/>
        </Form.Item>
        <Form.Item label="最大金额" name="maxAmount">
          <Input type="number" placeholder="" step={100} min={0}/>
        </Form.Item>
        <Form.Item label="最小面积" name="minArea">
          <Input type="number" placeholder="" step={10} min={0}/>
        </Form.Item>
        <Form.Item label="最大面积" name="maxArea">
          <Input type="number" placeholder="" step={10} min={0}/>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select placeholder="选择状态">
            <Option value={0}>未出租</Option>
            <Option value={1}>已出租</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSearch} loading={loading}>
            查询
          </Button>
        </Form.Item>
        <Modal
          title="填写合同信息"
          visible={isModalVisible}
          onOk={handleConfirm}
          onCancel={handleCancel}
        >
          {/* Form for contract information */}
          <Form.Item label="用户名" name="userName" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="开始日期" name="startDate" rules={[{ required: true, message: '请选择开始日期' }]}>
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item label="结束日期" name="endDate" rules={[{ required: true, message: '请选择结束日期' }]}>
            <Input type="datetime-local" />
          </Form.Item>
        </Modal>
      </Form>

      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey={(record) => record.propertyId}
      />
    </div>
  );
};

export default ListPage;
