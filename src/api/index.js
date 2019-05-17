import ajax from './ajax';
import jsonp from 'jsonp';
import {message} from 'antd';

export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST');

export const reqAddUser = user => ajax('/manage/user/add', user, 'POST');

export const reqWeather = city => {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
  return new Promise((resolve, reject) => {
    jsonp(url, {
      param: 'callback'
    }, (error, response) => {
      if (!error && response.status === 'success') {
        const {dayPictureUrl, weather} = response.results[0].weather_data[0];
        message.success('获取天气信息成功');
        resolve({dayPictureUrl, weather})
      } else {
        message.error('获取天气信息失败')
      }
    })
  })
};