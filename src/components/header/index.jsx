import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal} from 'antd';

import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';
import LinkButton from '../link-button';
import {formateDate} from '../../utils/dateUtils';
import {reqWeather} from '../../api';
import menuList from '../../config/menuConfig';
import './index.less';

class Header extends Component {
  state = {
    sysTime: formateDate(Date.now()),
    dayPictureUrl: '',
    weather: ''
  };

  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('北京');
    this.setState({
      dayPictureUrl,
      weather
    })
  };

  getSysTime = () => {
    this.interval = setInterval(() => {
      this.setState({
        sysTime: formateDate(Date.now())
      })
    }, 1000)
  };

  logout = () => {
    Modal.confirm({
      title: '确定退出吗?',
      onOk: () => {
        storageUtils.removeUser();
        memoryUtils.user = {};
        this.props.history.replace('/login');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  getTitle = (path) => {
    let title;
    menuList.forEach(menu => {
      if (menu.key === path) {
        title = menu.title
      } else if (menu.children) {
        menu.children.forEach(item => {
          if (path.indexOf(item.key) === 0) {
            title = item.title
          }
        })
      }
    });
    return title;
  };

  componentDidMount() {
    this.getSysTime();
    this.getWeather();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {dayPictureUrl, weather, sysTime} = this.state;
    const user = storageUtils.getUser();
    const path = this.props.location.pathname;
    const title = this.getTitle(path);
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎, {user.username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{sysTime}</span>
            <img src={dayPictureUrl} alt="dayPictureUrl"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)