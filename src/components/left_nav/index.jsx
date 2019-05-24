import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'
import {connect} from 'react-redux'

import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import memoryUtils from '../../utils/memoryUtils'
import {setHeadTitle} from '../../redux/actions'
import './index.less'

const SubMenu = Menu.SubMenu

class LeftNav extends Component {
  /*
   判断当前登陆用户对item是否有权限
   */
  hasAuth = (item) => {
    const {key, isPublic} = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) {
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }

  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          if(item.key === path || path.indexOf(item.key) === 0){
            this.props.setHeadTitle(item.title)
          }

          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {
          // 查找当前路由所在的子菜单项
          const cItem = item.children.find((cItem) => path.indexOf(cItem.key) === 0)
          if (cItem) {this.openKey = item.key}
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon}/>
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }
      return pre
    }, [])
  }

  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    let path = this.props.location.pathname
    if (path.indexOf('/product') === 0) {
      path = '/product'
    }
    const openKey = this.openKey
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          theme="dark"
          mode="inline"
          // defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}

export default connect(
  stete => ({}),
  {setHeadTitle}
)(withRouter(LeftNav))