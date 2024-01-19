import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Form, message, Modal} from 'antd';
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
  const [propertySource, setPropertySource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);

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

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/property/getByUser?userId=${userId}`);
      setPropertySource(response.data.data);
      console.log("property:", response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSend = () => {
    fetchProperty();
    console.log(propertySource);
    setVisible(true);
  };

  const handleSelectProperty = async (selectedProperty) => {
  
    console.log('Selected Property:', selectedProperty);
    const propertyId = selectedProperty.propertyId;
    try {
      const response = await axios.post(`http://localhost:8081/message/send?userId=${userId}&propertyId=${propertyId}`);
       message.success(response.data.data);
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
      render: () => (
        <Button type="primary" onClick={() => handleSend()}>
          联系
        </Button>
      ),
    },
  ];
   
  

  const handleSearch = () => {
    const values = form.getFieldsValue();
    fetchData(values);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const handleOk = () => {
    setVisible(false);
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

<Modal
        title="选择要发送的房产"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table
          dataSource={propertySource}
          columns={[
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
              title: '其他信息',
              dataIndex: 'otherInfo',
              key: 'otherInfo',
            },
            {
              title: '操作',
              render: (record) => (
                <Button
                  type="primary"
                  onClick={() => handleSelectProperty(record)}
                >
                  发送
                </Button>
              ),
            },
          ]}
          rowKey="propertyId"
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedProperties(selectedRows);
            },
          }}
        />
      </Modal>

    </div>
    
  );
};

export default SeekListPage;
