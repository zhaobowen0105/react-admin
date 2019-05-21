import React, {Component} from 'react'
import {Redirect, Switch, Route} from 'react-router-dom'
import {Layout} from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left_nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const {Footer, Sider, Content} = Layout

export default class Admin extends Component {

  render() {
    if (!memoryUtils.user || !memoryUtils.user._id) {
      return <Redirect to='/login'/>
    }

    return (
      <Layout style={{height: '100%'}}>
        <Sider style={{height: '100%'}}>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{backgroundColor: 'white', margin: '18px 18px 0'}}>
            <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/role' component={Role}/>
              <Route path='/user' component={User}/>
              <Route path='/charts/bar' component={Bar}/>
              <Route path='/charts/line' component={Line}/>
              <Route path='/charts/pie' component={Pie}/>
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#aaa'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
