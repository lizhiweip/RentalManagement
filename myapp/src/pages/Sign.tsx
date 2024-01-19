import React, { useState } from 'react';
import { Form, Input, Button, message, Select} from 'antd';
import axios from 'axios';

interface User {
  userId?: string;
  userName: string;
  passWord: string;
  email: string;
  phoneNumber: string;
  description: string;
  role: number;
}

const RegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: User) => {
    try {
      const response = await axios.post('http://localhost:8081/user/sign', values);
      console.log(response.data); 
      if(response.data.code === 1){
        message.success('注册成功！');
        form.resetFields();
      }else{
        message.error(response.data.msg);
      }
      
    } catch (error) {
      setError(error.response.data.message || 'An error occurred during registration.');
    }
  };

  return (
    <div style={{ width: 300 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>用户注册</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="userName" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="passWord" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email', message: '请输入邮箱' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="电话号码">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色!' }]}>
          <Select placeholder="选择角色">
            <Option value={-1}>管理员</Option>
            <Option value={0}>房东</Option>
            <Option value={1}>租户</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
    </div>
  );
};

export default RegistrationForm;
