import React, {Component} from 'react';
import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProduct} from '../../api'
import {PAGE_SIZE} from '../../utils/constant'

const Option = Select.Option


export default class ProductHome extends Component {

  state = {
    Loading: false,
    products: [],
    total: 0,
    searchName: '',
    searchType: 'productName'
  }
  /*
   初始化table的列的数组
   */
  initColums = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '¥' + price
      },
      {
        width: 100,
        title: '状态',
        dataIndex: 'status',
        render: (status) => {
          return (
            <span>
              <Button type='primary'>下架</Button>
              <span>在售</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={()=> this.props.history.push('/product/detail', {product})}>详情</LinkButton>
              <LinkButton>修改</LinkButton>
            </span>
          )
        }
      }
    ]
  }
  /*
   获取指定页码的列表数据显示
   */
  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({Loading: true})
    const { searchName, searchType } = this.state
    let result
    if(searchName){
      result = await reqSearchProduct({searchName, searchType, pageSize: PAGE_SIZE, pageNum})
    } else{
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({Loading: false})
    if(result.status === 0){
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }


  componentWillMount() {
    this.initColums()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const { products, Loading, total, searchName, searchType } = this.state
    const title = (
      <span>
        <Select
          value={searchType}
          style={{width: 120}}
          onChange={value => this.setState({searchType: value})}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{width: 150, margin: '0 15px'}}
          onChange={event => this.setState({searchName:event.target.value})}
        />
        <Button
          type="primary"
          onClick={() => this.getProducts(1)}
        >
          搜索
        </Button>
      </span>
    )
    const extra = (
      <Button type="primary">
        <Icon type="plus"/>
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={Loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            total,
            pageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}