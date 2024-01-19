import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message, Modal } from 'antd';
import axios from 'axios';

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [landNameFilter, setLandNameFilter] = useState('');
  const [tenantNameFilter, setTenantNameFilter] = useState('');
  const [handleContractModalVisible, setHandleContractModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const columns = [
    {
      title: '房东姓名',
      dataIndex: 'landName',
      key: 'landName',
    },
    {
      title: '租户姓名',
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
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
      title: '合同金额',
      dataIndex: 'contractAmount',
      key: 'contractAmount',
    },
    {
      title: '合同开始日期',
      dataIndex: 'contractStartDate',
      key: 'contractStartDate',
    },
    {
      title: '合同结束日期',
      dataIndex: 'contractEndDate',
      key: 'contractEndDate',
    },
    {
      title: '其他合同信息',
      dataIndex: 'otherContractInfo',
      key: 'otherContractInfo',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleContract(record)}>
            处理合同
          </Button>
        </Space>
      ),
    },
  ];
  

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/contract/list', {
        params: {
          landName: landNameFilter,
          tenantName: tenantNameFilter,
        },
      });

      if (response.data.code === 1) {
        setContracts(response.data.data);
      } else {
        message.error(response.data.msg || '获取数据失败');
      }
    } catch (error) {
      console.error('获取数据出错', error);
      message.error('系统出现问题，请稍后重试');
    }
  };

  useEffect(() => {
    fetchData();
  }, [landNameFilter, tenantNameFilter]); // Refetch data when filters change

  const handleContract = async (record) => {
    const contractId = record.contractId;
    console.log("contractId:",contractId)
    try {
      const response = await axios.get(`http://localhost:8081/contract/handle?contractId=${contractId}`);
  
      if (response.data.code === 1) {
        message.success(response.data.data || '处理成功！');
        
      } else {
        message.error(response.data.msg || '处理失败，请重试');
      }
    } catch (error) {
      console.error('处理合同出现问题:', error);
      message.error('系统出现问题，请稍后重试');
    }
  };



  return (
    <div>
      <Input
        placeholder="输入房东姓名"
        value={landNameFilter}
        onChange={(e) => setLandNameFilter(e.target.value)}
        style={{ width: 200, marginRight: 16 }}
      />
      <Input
        placeholder="输入租户姓名"
        value={tenantNameFilter}
        onChange={(e) => setTenantNameFilter(e.target.value)}
        style={{ width: 200, marginRight: 16 }}
      />
      <Button type="primary" onClick={fetchData} style={{ marginBottom: 16 }}>
        查询
      </Button>

      <Table columns={columns} dataSource={contracts} rowKey="contractId" />

     
    </div>
  );
};

export default ContractList;
