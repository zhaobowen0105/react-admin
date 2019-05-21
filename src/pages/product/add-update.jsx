import React, {Component} from 'react';
import {
  Card,
  Icon,
  Form,
  Input,
  Button,
  Cascader,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const {TextArea} = Input

class AddUpdate extends Component {
  state = {
    options: []
  }

  constructor(props) {
    super(props)
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  /*
   异步获取一级/二级分类列表, 并显示
   async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
   */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        return categorys
      }
    }
  }

  initOptions = async (categorys) => {
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }))

    const {isUpdate, product} = this
    const {pCategoryId} = product
    if (isUpdate && pCategoryId !== 0) {
      const subCategorys = await this.getCategorys(pCategoryId)
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      const targetOption = options.find(option => option.value === pCategoryId)

      targetOption.children = childOptions
    }

    this.setState({
      options
    })
  }
  /*
   用加载下一级列表的回调函数
   */
  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0]
    targetOption.loading = true
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false

    if (subCategorys && subCategorys.length > 0) {
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      targetOption.children = childOptions
    } else {
      targetOption.isLeaf = true
    }

    this.setState({
      options: [...this.state.options]
    })
  }

  submit = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }

        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        const product = {name, desc, price, pCategoryId, categoryId, imgs, detail}

        if (this.isUpdate) {
          product._id = this.product._id
        }

        const result = await reqAddOrUpdateProduct(product)

        if (result.status === 0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
      }
    })
  }
  /*
   验证价格的自定义验证函数
   */
  validator = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }

  componentDidMount() {
    this.getCategorys('0')
  }

  componentWillMount() {
    const product = this.props.location.state;
    this.isUpdate = !!product
    this.product = product || {}
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product
    const categoryIds = []
    if (pCategoryId === '0') {
      categoryIds.push(categoryId)
    } else {
      categoryIds.push(pCategoryId)
      categoryIds.push(categoryId)
    }
    const formItemLayout = {
      labelCol: {span: 2},  // 左侧label的宽度
      wrapperCol: {span: 8}, // 右侧包裹的宽度
    }

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{fontSize: 20}}/>
        </LinkButton>
        <span>{ isUpdate ? '修改商品' : '添加商品' }</span>
      </span>
    )

    return (
      <Card title={title}>
        <Form  {...formItemLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                  initialValue: product.name,
                  rules: [
                    {required: true, message: '必须输入商品名称'}
                  ]
                }
              )(<Input />)
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                  initialValue: product.desc,
                  rules: [
                    {required: true, message: '必须输入商品描述'}
                  ]
                }
              )(<TextArea autosize/>)
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                  initialValue: product.price,
                  rules: [
                    {required: true, message: '必须输入商品价格'},
                    {validator: this.validator}
                  ]
                }
              )(<Input type="number" addonAfter="元"/>)
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryIds', {
                  initialValue: categoryIds,
                  rules: [
                    {required: true, message: '必须指定商品分类'},
                  ]
                }
              )(
                <Cascader
                  placeholder='请指定商品分类'
                  options={this.state.options}  /*需要显示的列表数据数组*/
                  loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                />)
            }
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(AddUpdate)