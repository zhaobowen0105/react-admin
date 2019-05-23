import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

class UserForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { roles, user } = this.props
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }
    return (
      <Form {...formItemLayout}>
        <Item label="用户名">
          {
            getFieldDecorator('username', {
              initialValue: user.username,
              rules: [
                {required: true, whitespace: true, message: '请输入用户名'},
                {max: 12, message: '用户名长度最多为12位'},
                {min: 4, message: '用户名长度最少为4位',},
                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须由英文、数字或下划线组成'}
              ]
            })(
              <Input placeholder="请输入用户名"/>
            )
          }
        </Item>
        {
          user._id ? null : (
            <Item label="密码">
              {
                getFieldDecorator('password', {
                  initialValue: '',
                  rules: [
                    {required: true, whitespace: true, message: '请输入密码'},
                    {max: 12, message: '密码的长度最多为12位'},
                    {min: 4, message: '密码的长度最少为4位',},
                    {pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须由英文、数字或下划线组成'}
                  ]
                })(
                  <Input type="password" placeholder="请输入密码"/>
                )
              }
            </Item>
          )
        }

        <Item label="手机号">
          {
            getFieldDecorator('phone', {
              initialValue: user.phone
            })(
              <Input placeholder="请输入手机号"/>
            )
          }
        </Item>
        <Item label="邮箱">
          {
            getFieldDecorator('email', {
              initialValue: user.email
            })(
              <Input placeholder="请输入邮箱"/>
            )
          }
        </Item>
        <Item label="角色">
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UserForm)