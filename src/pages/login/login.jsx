import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd';

import logo from './images/logo.png';
import './login.less';

class Login extends Component {

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('提交登录的ajax请求', values);
      }
    });
  };

  validator = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码');
    } else if (value.length < 4) {
      callback('密码的最小长度为4位');
    } else if (value.length > 12) {
      callback('密码的最大长度为12位');
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须由英文、数字或下划线组成');
    } else {
      callback();
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {/*
               用户名/密码的的合法性要求
               1). 必须输入
               2). 必须大于等于4位
               3). 必须小于等于12位
               4). 必须是英文、数字或下划线组成
               */}
              {
                getFieldDecorator('username', {
                  rules: [
                    {required: true, whitespace: true, message: '请输入用户名'},
                    {min: 4, message: '用户名的最小长度为4位'},
                    {max: 12, message: '用户名的最大长度为12位'},
                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须由英文、数字或下划线组成'}
                  ],
                })(
                  <Input
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    placeholder="用户名"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {validator: this.validator}
                  ],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
const WrapLogin = Form.create()(Login);
export default WrapLogin;