import React, {Component} from 'react'
import {
  Card,
  Button,
  Icon,
  Table,
  message,
  Modal
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Catepory extends Component {
  state = {
    loading: false, // 是否正在获取数据中
    categorys: [], // 一级分类列表
    subCategorys: [], // 二级分类列表
    parentId: '0', // 当前需要显示的分类列表的父分类ID
    parentName: '', // 当前需要显示的分类列表的父分类名称
    showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
  }
  /*异步获取一级/二级分类列表显示*/
  getCategorys = async (parentId) => {
    this.setState({loading: true})
    parentId = parentId || this.state.parentId
    const result = await reqCategorys(parentId)
    this.setState({loading: false})
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.setState({
          categorys
        })
      } else {
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }
  /*初始化Table所有列的数组*/
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => {
              this.showUpdate(category)
            }}>修改分类</LinkButton>
            {
              this.state.parentId === '0' ? <LinkButton onClick={() => {
                this.showSubCategorys(category)
              }}>查看子分类</LinkButton> : null
            }
          </span>
        )
      }
    ]
  }
  /*显示指定一级分类对象的二子列表*/
  showSubCategorys = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      this.getCategorys()
    })
  }
  /*显示指定一级分类列表*/
  showFirstCategroys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
  /*显示添加的确认框*/
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }
  /*显示修改的确认框*/
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category
    // 更新状态
    this.setState({
      showStatus: 2
    })
  }
  /*添加分类*/
  addCategory = () => {
    this.addForm.validateFields(async (err, values) => {
      console.log(values)
      if (!err) {
        this.setState({
          showStatus: 0
        })
        const {parentId, categoryName} = values
        this.addForm.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if (result.status === 0) {
          if (parentId === this.state.parentId) {
            this.getCategorys()
          } else if (parentId === '0') {
            this.getCategorys('0')
          }
        }
      }
    })
  }
  /*更新分类*/
  updateCategory = () => {
    this.updateForm.validateFields(async (err, values) => {
      if (!err) {
        // 1. 隐藏确定框
        this.setState({
          showStatus: 0
        })

        // 准备数据
        const categoryId = this.category._id
        const {categoryName} = values

        // 清除输入数据
        this.updateForm.resetFields()

        // 2. 发请求更新分类
        console.log(categoryId, categoryName)
        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status === 0) {
          // 3. 重新显示列表
          this.getCategorys()
        }
      }
    })
  }
  /*响应点击取消: 隐藏确定框*/
  handleCancel = () => {
    // 清除输入数据
    this.updateForm && this.updateForm.resetFields()
    this.addForm && this.addForm.resetFields()
    // 隐藏确认框
    this.setState({
      showStatus: 0
    })
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getCategorys()
  }

  render() {
    const {categorys, subCategorys, parentId, parentName, showStatus} = this.state
    const category = this.category || {}
    const title = parentId === '0' ? "一级分类列表" : (
      <span>
        <LinkButton onClick={this.showFirstCategroys}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type="plus"/>
        添加
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
        />

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={form => this.addForm = form}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={form => this.updateForm = form }
          />
        </Modal>
      </Card>
    )
  }
}