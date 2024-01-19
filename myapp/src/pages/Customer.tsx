import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Descriptions, Spin, message, List, Button,Modal, DatePicker, Form, Input, InputNumber} from 'antd';

const userId = sessionStorage.getItem('user');
if (userId) {
  console.log("user",userId);
} else {
  message.error("请先登录")
}


const UserProfile = () => {
  const [propertyForm] = Form.useForm();
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [userSeekingInfo, setUserSeekingInfo] = useState([]);
  const [userContracts, setUserContracts] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedSeekInfo, setSelectedSeekInfo] = useState(null);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [propertyPublishModalVisible, setPropertyPublishModalVisible] = useState(false);
  const [propertyUpdateModalVisible, setPropertyUpdateModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyUpdateForm] = Form.useForm();
  
    const userId = sessionStorage.getItem('user');

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/user/getUser?userId=${userId}`);
        if (response.data.code === 1) {
          setUserData(response.data.data);
        } else {
          console.error('Error fetching user data:', response.data.msg);
        }

        const propertyResponse = await axios.get(`http://localhost:8081/user/property?userId=${userId}`);
        if (propertyResponse.data.code === 1) {
          setUserProperties(propertyResponse.data.data);
        } else {
          console.error('Error fetching user properties:', propertyResponse.data.msg);
        }

        const seekInfoResponse = await axios.get(`http://localhost:8081/user/seekinfo?userId=${userId}`);
        if (seekInfoResponse.data.code === 1) {
          setUserSeekingInfo(seekInfoResponse.data.data);
        } else {
          console.error('Error fetching user seeking info:', seekInfoResponse.data.msg);
        }

        const contractResponse = await axios.get(`http://localhost:8081/user/contract?userId=${userId}`);
        if (contractResponse.data.code === 1) {
          setUserContracts(contractResponse.data.data);
        } else {
          console.error('Error fetching user contracts:', contractResponse.data.msg);
        }

        const messageResponse = await axios.get(`http://localhost:8081/user/message?userId=${userId}`);
        if (messageResponse.data.code === 1) {
          setMessageData(messageResponse.data.data);
        } else {
          console.error('Error fetching user properties:', messageResponse.data.msg);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    useEffect(() => {
    fetchUserData();
  }, []); 

  const handleDeleteMessage = async (propertyId) => {
    try {
      const response = await axios.delete(`http://localhost:8081/message/delete?userId=${userId}&propertyId=${propertyId}`);
      if (response.data.code === 1) {
        message.success('信息删除成功');
        fetchUserData();
      } else {
        message.error(response.data.msg || '删除失败');
      }
    } catch (error) {
      console.error('删除出现问题', error);
      message.error('系统出现问题，请稍后重试');
    }
  };
  const handleGenerateContract = async (propertyId) => {
    setSelectedPropertyId(propertyId);
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      // Check if both start and end dates are selected
      if (!startDate || !endDate) {
        message.error('请选择开始日期和结束日期');
        return;
      }
      const formatDate = (date) => {
        const formattedDate = new Date(date).toISOString();
        return formattedDate;
      };
      const response = await axios.post(`http://localhost:8081/contract/saveByUser?userId=${userId}&propertyId=${selectedPropertyId}&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`);
  
      if (response.data.code === 1) {
        message.success('生成合同成功');
        setVisible(false);
        handleDeleteMessage(selectedPropertyId);
      } else {
        message.error(response.data.msg || '生成合同失败');
      }
      fetchUserData();
    } catch (error) {
      console.error('生成合同出现问题', error);
      message.error('系统出现问题，请稍后重试');
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleUpdateSeekInfo = (seekInfo) => {
    setSelectedSeekInfo(seekInfo);
    setUpdateModalVisible(true);
  };
  const handleUpdateOk = async (values) => {
    console.log('Form Values:', values);
    try {
      const updatedSeekInfo = {
        seekInfoId: selectedSeekInfo.seekInfoId,
        seekerId: userId,
        ...values,
      };
      console.log(updatedSeekInfo);
      const response = await axios.post('http://localhost:8081/seekInfo/update', updatedSeekInfo);
  
      if (response.data.code === 1) {
        message.success('更新成功');
        setUpdateModalVisible(false);
        fetchUserData(); 
      } else {
        message.error(response.data.msg || '更新失败');
      }
    } catch (error) {
      console.error('更新出现问题', error);
      message.error('系统出现问题，请稍后重试');
    }
  };
  const onFinish = (values) => {
    handleUpdateOk(values);
  };
  
  
  const handleUpdateCancel = () => {
    setUpdateModalVisible(false);
  };
  
  const handleDeleteSeekInfo = async (seekInfoId) => {
    console.log("seekInfoId",seekInfoId)
    console.log("userId:", userId)
    try {
      const response = await axios.delete(`http://localhost:8081/seekInfo/delete?userId=${userId}&seekInfoId=${seekInfoId}`);
      if (response.data.code === 1) {
        message.success('信息删除成功');
        fetchUserData();
      } else {
        message.error(response.data.msg || '删除失败');
      }
    } catch (error) {
      console.error('删除出现问题', error);
      message.error('系统出现问题，请稍后重试');
    }
  };

  const handlePublish = () => {
    setPublishModalVisible(true);
  };

  const handlePublishOk = async (values) => {
    try {
      const SeekInfo = {
        seekerId: userId,
        ...values,
      };
      console.log("seekInfo",SeekInfo)
      const response = await axios.post('http://localhost:8081/seekInfo/save', SeekInfo);

      if (response.data.code === 1) {
        message.success('发布成功');
        setPublishModalVisible(false);
        fetchUserData();
      } else {
        message.error(response.data.msg || '发布失败');
      }
    } catch (error) {
      console.error('发布出现问题', error);
      message.error('系统出现问题，请稍后重试');
    }
  };

  const handlePublishCancel = () => {
    setPublishModalVisible(false);
  };

  const handlePublishProperty = () => {
    setPropertyPublishModalVisible(true);
  };

  const handlePropertyPublishOk = async (values) => {
      
    const property = {
      ownerId: userId,
      status: 0,
      ...values,
    };
    console.log("property:",property)
    try {
      const response = await axios.post('http://localhost:8081/property/save', property);

      if (response.data.code === 1) {
        message.success('发布成功');
        setPropertyPublishModalVisible(false);
        fetchUserData(); 
      } else {
        message.error(response.data.msg || '发布失败');
      }
    } catch (error) {
      console.error('发布出现问题', error);
      message.error('系统出现问题，请稍后重试');
    }
  };

  const handlePropertyPublishCancel = () => {
    setPropertyPublishModalVisible(false);
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await axios.delete(`http://localhost:8081/property/delete?propertyId=${propertyId}`);
      if (response.data.code === 1) {
        message.success('房产删除成功');
        fetchUserData();
      } else {
        message.error(response.data.msg || '删除失败');
      }
    } catch (error) {
      console.error('删除出现问题', error);
      message.error('系统出现问题，请稍后重试');
    }
  };

  const handleUpdateProperty = (property) => {
    setSelectedProperty(property);
    propertyUpdateForm.setFieldsValue({
      propertyType: property.propertyType,
      address: property.address,
      area: property.area,
      rentAmount: property.rentAmount,
      otherInfo: property.otherInfo,
    });
    setPropertyUpdateModalVisible(true);
  };

  const handlePropertyUpdateOk = async (values) => {
    try {
      const response = await axios.post('http://localhost:8081/property/update', {
        propertyId: selectedProperty.propertyId,
        ...values,
      });

      if (response.data.code === 1) {
        message.success('更新成功');
        setPropertyUpdateModalVisible(false);
        fetchUserData(); 
      } else {
        message.error(response.data.msg || '更新失败');
      }
    } catch (error) {
      console.error('更新出现问题', error);
      message.error('系统出现问题，请稍后重试');
    }
  };

  const handlePropertyUpdateCancel = () => {
    setPropertyUpdateModalVisible(false);
  };


  return (
    <>
    <Card title="用户基本信息" bordered={false}>
      {userData ? (
        <Descriptions column={2}>
          <Descriptions.Item label="用户姓名">{userData.userName}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="电话">{userData.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="备注">{userData.description}</Descriptions.Item>
          <Descriptions.Item label="角色">
            {userData.role === -1 ? '管理员' : userData.role === 0 ? '租户' : '房东'}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Spin size="large" />
      )}
    </Card>
    <Card title={
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         用户房产信息
       <Button type="primary" onClick={handlePublishProperty}>
         发布
       </Button>
      </div>
      } bordered={false} style={{ marginTop: '16px' }}>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={userProperties}
          renderItem={(property) => (
            <List.Item>
              <Card title={property.propertyType} style={{ width: 300 }}>
                <p>
                  <strong>地址:</strong> {property.address}
                </p>
                <p>
                  <strong>面积:</strong> {property.area}㎡
                </p>
                <p>
                  <strong>租金:</strong> {property.rentAmount}元/月
                </p>
                <p>
                  <strong>状态:</strong> {property.status === 0 ? '未出租' : '已出租'}
                </p>
                <p>
                  <strong>其他信息:</strong> {property.otherInfo}
                </p>
                <Button type="link" danger onClick={() => handleDeleteProperty(property.propertyId)}>
                 删除
               </Button>
               <Button type="primary" onClick={() => handleUpdateProperty(property)}>
                 更新
               </Button>
              </Card>
            </List.Item>
          )}
        />
      </Card>
      <Card title={
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            用户求租信息
          <Button type="primary" onClick={handlePublish}>
            发布
          </Button>
           </div>
         } bordered={false} style={{ marginTop: '16px' }}>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={userSeekingInfo}
          renderItem={(seekInfo) => (
            <List.Item>
              <Card title={seekInfo.seekingType} style={{ width: 300 }}>
                <p>
                  <strong>期望地点:</strong> {seekInfo.desiredLocation}
                </p>
                <p>
                  <strong>最大租金:</strong> {seekInfo.maxRentAmount}元/月
                </p>
                <p>
                  <strong>其他求租信息:</strong> {seekInfo.otherSeekInfo}
                </p>
                <Button type="link" danger onClick={() => handleDeleteSeekInfo(seekInfo.seekInfoId)}>
                    删除
               </Button>
                <Button type="primary" onClick={() => handleUpdateSeekInfo(seekInfo)}>
                    更新
               </Button>
              </Card>
            </List.Item>
          )}
        />
      </Card>
      <Card title="用户合同信息" bordered={false} style={{ marginTop: '16px' }}>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={userContracts}
          renderItem={(contract) => (
            <List.Item>
              <Card title={`合同 ${contract.contractId}`} style={{ width: 300 }}>
                <p>
                  <strong>房东姓名:</strong> {contract.landName}
                </p>
                <p>
                  <strong>租户姓名:</strong> {contract.tenantName}
                </p>
                <p>
                  <strong>房产类型:</strong> {contract.propertyType}
                </p>
                <p>
                  <strong>地址:</strong> {contract.address}
                </p>
                <p>
                  <strong>面积:</strong> {contract.area}
                </p>
                <p>
                  <strong>合同金额:</strong> {contract.contractAmount}元
                </p>
                <p>
                  <strong>合同开始日期:</strong> {contract.contractStartDate}
                </p>
                <p>
                  <strong>合同结束日期:</strong> {contract.contractEndDate}
                </p>
                <p>
                  <strong>其他合同信息:</strong> {contract.otherContractInfo}
                </p>
               
              </Card>
            </List.Item>
          )}
        />
      </Card>
      <Card title="用户信箱" bordered={false} style={{ marginTop: '16px' }}>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={messageData}
          renderItem={(property) => (
            <List.Item>
              <Card title={property.propertyType} style={{ width: 300 }}>
                <p>
                  <strong>地址:</strong> {property.address}
                </p>
                <p>
                  <strong>面积:</strong> {property.area}㎡
                </p>
                <p>
                  <strong>租金:</strong> {property.rentAmount}元/月
                </p>
                <p>
                  <strong>状态:</strong> {property.status === 0 ? '未出租' : '已出租'}
                </p>
                <p>
                  <strong>其他信息:</strong> {property.otherInfo}
                </p>
                <Button type="link" danger onClick={() => handleDeleteMessage(property.propertyId)}>
              删除
            </Button>
            <Button type="primary" onClick={() => handleGenerateContract(property.propertyId)} style={{ marginLeft: '8px' }}>
                  生成合同
                </Button>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="选择合同日期"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <DatePicker
          placeholder="开始日期"
          value={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <DatePicker
          placeholder="结束日期"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          style={{ marginLeft: '16px' }}
        />
      </Modal>
      <Modal
  title="更新求租信息"
  visible={updateModalVisible}
  onOk={() => form.submit()}  
  onCancel={handleUpdateCancel}
>
  <Form
    form={form}  
    initialValues={{
      seekingType: selectedSeekInfo?.seekingType,
      desiredLocation: selectedSeekInfo?.desiredLocation,
      maxRentAmount: selectedSeekInfo?.maxRentAmount,
      otherSeekInfo: selectedSeekInfo?.otherSeekInfo,
    }}
    onFinish={handleUpdateOk}
  >
    <Form.Item label="求租类型" name="seekingType">
      <Input />
    </Form.Item>
    <Form.Item label="期望地点" name="desiredLocation">
      <Input />
    </Form.Item>
    <Form.Item label="最大租金" name="maxRentAmount">
      <InputNumber />
    </Form.Item>
    <Form.Item label="其他求租信息" name="otherSeekInfo">
      <Input.TextArea />
    </Form.Item>
  </Form>
</Modal>
<Modal
        title="发布求租信息"
        visible={publishModalVisible}
        onOk={() => form.submit()}
        onCancel={handlePublishCancel}
      >
        <Form form={form} onFinish={handlePublishOk}>
          <Form.Item
            label="求租类型"
            name="seekingType"
            rules={[{ required: true, message: '请输入求租类型' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="期望地点"
            name="desiredLocation"
            rules={[{ required: true, message: '请输入期望地点' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="最大租金"
            name="maxRentAmount"
            rules={[{ required: true, message: '请输入最大租金' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="其他求租信息"
            name="otherSeekInfo"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="发布房产信息"
        visible={propertyPublishModalVisible}
        onOk={() => propertyForm.submit()}
        onCancel={handlePropertyPublishCancel}
      >
        <Form form={propertyForm} onFinish={handlePropertyPublishOk}>
          <Form.Item
            label="房产类型"
            name="propertyType"
            rules={[{ required: true, message: '请输入房产类型' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="地址"
            name="address"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="面积"
            name="area"
            rules={[{ required: true, message: '请输入面积' }]}
          >
            <InputNumber min={0} step={10}/>
          </Form.Item>
          <Form.Item
            label="租金"
            name="rentAmount"
            rules={[{ required: true, message: '请输入租金' }]}
          >
            <InputNumber min={0} step={100}/>
          </Form.Item>
          <Form.Item
            label="其他信息"
            name="otherInfo"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="更新房产信息"
        visible={propertyUpdateModalVisible}
        onOk={() => propertyUpdateForm.submit()}
        onCancel={handlePropertyUpdateCancel}
      >
        <Form form={propertyUpdateForm} onFinish={handlePropertyUpdateOk}>
          <Form.Item
            label="房产类型"
            name="propertyType"
            rules={[{ required: true, message: '请输入房产类型' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="地址"
            name="address"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="面积"
            name="area"
            rules={[{ required: true, message: '请输入面积' }]}
          >
            <InputNumber min={0} step={10}/>
          </Form.Item>
          <Form.Item
            label="租金"
            name="rentAmount"
            rules={[{ required: true, message: '请输入租金' }]}
          >
            <InputNumber min={0} step={100}/>
          </Form.Item>
          <Form.Item
            label="其他信息"
            name="otherInfo"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserProfile;


