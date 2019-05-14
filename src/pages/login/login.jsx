import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd';

import logo from './images/logo.png';
import './login.less';

class Login extends Component {

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('提交登陆的ajax请求', values);
      }else {
        console.log('检验失败!', err);
      }
    });
  };

  validator = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码');
    } else if (value.length > 12) {
      callback('密码的长度最多为12位');
    } else if (value.length < 4) {
      callback('密码的长度最少为4位');
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须由英文、数字或下划线组成');
    } else {
      callback('');
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
              {
                getFieldDecorator('username', {
                  initialValue: 'admin',
                  rules: [
                    {required: true, whitespace: true, message: '请输入用户名'},
                    {max: 12, message: '用户名长度最多为12位'},
                    {min: 4, message: '用户名长度最少为4位',},
                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须由英文、数字或下划线组成'}
                  ]
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
                getFieldDecorator('paddword', {
                  rules: [{
                    validator: this.validator
                  }]
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