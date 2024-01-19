import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Form, message} from 'antd';
import axios from 'axios';

const { Search } = Input;

const userId = sessionStorage.getItem('user');
if (userId) {
  console.log("user",userId);
} else {
  message.error("请先登录")
}


const SeekListPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

 


  const fetchData = async (params) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/seekInfo/list', { params });
      setDataSource(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteSeekInfo = async (seekInfoId) => {
    try {
      const response = await axios.delete(`http://localhost:8081/seekInfo/remove?seekInfoId=${seekInfoId}`);
  
      if (response.data.code === 1) {
        message.success(response.data.data || '删除成功！');
        fetchData();
      } else {
        message.error(response.data.msg || '删除失败，请重试');
      }
    } catch (error) {
      console.error('删除出现问题:', error);
      message.error('系统出现问题，请稍后重试');
    }
  };




  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: '求房类型',
      dataIndex: 'seekingType',
      key: 'seekingType',
    },
    {
      title: '期望地点',
      dataIndex: 'desiredLocation',
      key: 'desiredLocation',
    },
    {
      title: '最大租金',
      dataIndex: 'maxRentAmount',
      key: 'maxRentAmount',
    },
    {
      title: '其他信息',
      dataIndex: 'otherSeekInfo',
      key: 'otherSeekInfo',
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <Button type="link" danger onClick={() => handleDeleteSeekInfo(record.seekInfoId)}>
              删除
            </Button>
            {/* Add other buttons or actions as needed */}
          </Space>
        ),
      },
  ];
   
  

  const handleSearch = () => {
    const values = form.getFieldsValue();
    fetchData(values);
  };

 

  return (
    <div>
      <Form form={form} layout="inline">
        <Form.Item label="租户求房类型" name="seekingType">
          <Input placeholder="" />
        </Form.Item>
        <Form.Item label="租户期望地址" name="desiredLocation">
          <Input placeholder="" />
        </Form.Item>
        <Form.Item label="最小租金" name="min">
          <Input type="number" placeholder="" step={100} min={0}/>
        </Form.Item>
        <Form.Item label="最大租金" name="max">
          <Input type="number" placeholder="" step={100} min={0}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSearch} loading={loading}>
            查询
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey={(record) => record.seekInfoId}
      />



    </div>
    
  );
};

export default SeekListPage;
