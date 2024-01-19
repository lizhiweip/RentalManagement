import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography, Image, } from 'antd';


const { Title, Paragraph } = Typography;

const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
          display: 'flex',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '24px',
          }}
        >
          <div>
            <Title level={2} style={{ color: '#1890ff', marginBottom: '20px' }}>
              欢迎登录租房管理系统
            </Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '24px', color: '#666' }}>
              租房管理系统后端采用 Spring Boot + Mybatis-Plus 架构，前端使用 Ant Design Pro 脚手架快速开发，
              提供了便捷的租房解决方案，为您提供海量房源和海量客户，解决租房难问题。
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '24px', color: '#666' }}>
              系统采用了角色分离，分为管理员角色，房东角色，租户角色，每个角色都有独有的功能，使用方便，您可以根据您的需求获得您想获得的信息。
            </Paragraph>
            
          </div>
        </div>
        <div
          style={{
            flex: 0.35,
            marginLeft: '20px',
          }}
        >
          <Image
            src="https://img.zcool.cn/community/0193285e747a2ba80120a895ca313c.jpg@1280w_1l_2o_100sh.jpg"
            alt="Welcome Image"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
