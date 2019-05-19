import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {

  static propTypes = {
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {

    const {getFieldDecorator} = this.props.form

    const {parentId, categorys} = this.props
    return (
      <Form>
        <Item>
          <span>所属分类:</span>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option value='0'>一级分类</Option>
                {
                  categorys.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item>
          <span>分类名称:</span>
          {
            getFieldDecorator('categoryName', {
              initialValue: '',
              rules: [
                {required: true, message: '分类名称必须输入'}
              ]
            })(
              <Input placeholder="请输入分类名称"/>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)