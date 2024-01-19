import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import axios from 'axios';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // 发起登录请求
      const response = await axios.get('http://localhost:8081/user/login', {
        params: { email, password },
      });

      // 处理登录成功逻辑
      if (response.data.code === 1) {
        const user = response.data.data;
        console.log("user1111",user);
        // 保存用户信息，这里可以使用redux、context等来保存全局状态
        localStorage.setItem('user', JSON.stringify(user));
        message.success('登录成功');
      } else {
        // 处理登录失败逻辑
        message.error(response.data.msg);
      }
    } catch (error) {
      console.error('登录请求失败:', error);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto', marginTop: '100px' }}>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <Input.Password
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <Button type="primary" onClick={handleLogin}>
        登录
      </Button>
    </div>
  );
};

export default LoginForm;
