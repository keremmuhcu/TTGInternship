import { useState, useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  
  const errorComp = (errorMesage) => {
    messageApi.open({
      type: 'error',
      content: errorMesage,
    });
  };

  const login = () => {
    form.validateFields().then(values => {
      axios.post('http://127.0.0.1:5000/login', values)
      .then(response => {
        const token = response.data.access_token;
        localStorage.setItem('token', token);  // Token'ı localStorage'a kaydet
        navigate('/');
      })
      .catch(error => {
        console.error("Giriş yapılırken bir hata oluştu", error);
        errorComp("Hatalı giriş.")
      });
    }).catch(info => {
      console.log('Boş alanlar var:', info);
    });
  };
  

  return (
    <>
      {contextHolder}
      <div className='login-container'>
      <Form
      form={form}
      name="loginForm"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
    >
      <Form.Item
        label="Kullanıcı Adı"
        name="username"
        rules={[
          {
            required: true,
            message: 'Lütfen kullanıcı adınızı girin!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Şifre"
        name="password"
        rules={[
          {
            required: true,
            message: 'Lütfen şifrenizi girin!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" onClick={login}>
          Giriş
        </Button>
      </Form.Item>
    </Form>
  </div>
  </>
  )
};
export default Login;