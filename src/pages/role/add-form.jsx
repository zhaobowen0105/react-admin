import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
  Form,
  Input,
} from 'antd'

const Item = Form.Item

class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired
  }

  componentWillMount(){
    this.props.setForm(this.props.form)
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    const {getFieldDecorator} = this.props.form

    return (
      <Form>
        <Item label='角色名称' {...formItemLayout}>
          {
            getFieldDecorator('roleName', {
              initialValue: '',
              rules: [
                {required: true, message: '角色名称必须输入'}
              ]
            })(
              <Input placeholder='请输入角色名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)