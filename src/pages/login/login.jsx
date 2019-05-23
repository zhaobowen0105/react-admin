import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Form, Icon, Input, Button, message} from 'antd'

import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api/index'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'

import './login.less'

class Login extends Component {

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {username, password} = values
        const result = await reqLogin(username, password)
        if (result.status === 0) {
          const user = result.data
          storageUtils.saveUser(user)
          memoryUtils.user = user
          message.success('登录成功')
          this.props.history.replace('/')
        } else {
          message.error(result.msg, 2)
        }
      } else {
        console.log('检验失败!', err)
      }
    })
  }
  // 自定义校验
  validator = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码')
    } else if (value.length > 12) {
      callback('密码的长度最多为12位')
    } else if (value.length < 4) {
      callback('密码的长度最少为4位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须由英文、数字或下划线组成')
    } else {
      callback()
    }
  }

  render() {
    if (memoryUtils.user && memoryUtils.user._id) {
      return <Redirect to='/'/>
    }
    const {getFieldDecorator} = this.props.form
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
                /*
                 用户名/密码的的合法性要求
                 1). 必须输入
                 2). 必须大于等于4位
                 3). 必须小于等于12位
                 4). 必须是英文、数字或下划线组成
                 */
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
                getFieldDecorator('password', {
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
/*
 包装Form组件生成一个新的组件: Form(Login)
 新组件会向Form组件传递一个强大的对象属性: form
 */
export default Form.create()(Login)