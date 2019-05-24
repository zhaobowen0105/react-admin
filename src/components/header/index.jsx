import React, {Component} from 'react'
import {Modal} from 'antd'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import LinkButton from '../link-button'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'
import menuList from '../../config/menuConfig'
import {reqWeather} from '../../api'
import './index.less'

class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()),
    dayPictureUrl: '',
    weather: '',
  }

  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('北京')
    this.setState({
      dayPictureUrl,
      weather,
    })
  }

  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({
        currentTime
      })
    }, 1000)
  }

  logout = () => {
    Modal.confirm({
      title: '确定退出吗?',
      onOk: () => {
        storageUtils.removeUser()
        memoryUtils.user = {}
        this.props.history.replace('/login')
      }
    })
  }

  getTitle = () => {
    let path = this.props.location.pathname
    if (path.indexOf('/product') === 0) {
      path = '/product'
    }
    let title
    menuList.forEach((item) => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find((cItem) => {
          return cItem.key === path
        })
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  componentDidMount() {
    this.getTime()
    this.getWeather()
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const {currentTime, dayPictureUrl, weather} = this.state
    const {username} = memoryUtils.user
    const title = this.props.headTitle
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎, {username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({headTitle: state.headTitle}),
  {}
)(withRouter(Header))