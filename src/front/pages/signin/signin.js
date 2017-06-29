'use strict';
import { Component } from 'react';
import Card from '../../common/issueCard/index.js';
import Tappable from 'react-tappable';
import Location from './location';
import { toast } from '../../common/utils/toast.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import reqwest from 'reqwest';
import config from '../../common/config.js';
import './index.less';

const hostname = config.hostname;
const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {
        streetNumber: '',
        street: '',
        district: '',
        city: '',
        province: ''
      },
      hasSignin: false,
      hasSignout: false,
      canSign: false
    };
    this.handleSignin = this.handleSignin.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
  }

  componentWillMount() {
    this.initLocation();
    this.getSignData(data => {
      this.setState({
        signinTime: data.signinTime,
        signoutTime: data.signoutTime
      })
    });
    if(window.localStorage) {
      const hasSignin = localStorage[`${this.getToday()}_signin`] ? true : false;
      const hasSignout = localStorage[`${this.getToday()}_signout`] ? true : false;
      this.setState({hasSignin, hasSignout});
    }
  }

  getSignData(callback) {
    reqwest({
      url: `${hostname}/api/record/get?date=${this.getToday()}`,
      method: 'get',
      type: 'jsonp'
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          callback && callback(res.data);
          this.setState({canSign: true});
        } else {
          let errMsg = res.message;
          toast(errMsg);
          this.setState({canSign: false});
        }
      })
      .fail(err => {
        hideLoading();
        toast('网络忙，刷新试试吧～');
      });
  }

  initLocation() {
    Location.getLocation(position => {
      position.streetNumber = position.streetNumber || position.street_number;
      const str = `${position.province} ${position.city} ${position.district} ${position.street} ${position.streetNumber}`;
      window.localStorage && window.localStorage.setItem('location', str);
      this.setState({ position });
    });
  }

  getToday(week) {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month > 9 ? month : `0${month}`;
    day = day > 9 ? day : `0${day}`;
    let str = `${year}-${month}-${day}`;
    if (week) {
      str += ` ${dayMap[date.getDay()]}`;
    }
    return str;
  }

  handleSignin() {
    const pos = this.state.position;
    let posStr = `${pos.province} ${pos.city} ${pos.district} ${pos.street} ${pos.streetNumber}`;
    if(!posStr.replace(/\s/g, '')) {
      posStr = '江西省 赣州市';
    }
    reqwest({
      url: `${hostname}/api/record/signin`,
      method: 'get',
      type: 'jsonp',
      data: {
        position: posStr,
        date: this.getToday()
      }
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          toast(`签到成功！签到时间：${res.data.signinTime}`, 3000);
          window.localStorage && window.localStorage.setItem(`${this.getToday()}_signin`, res.data.signinTime);
          this.setState({ hasSignin: true });
        } else {
          let errMsg = res.message;
          toast(errMsg);
        }
      })
      .fail(err => {
        hideLoading();
        toast('网络忙，刷新试试吧～');
      });
  }

  handleSignout() {
    const pos = this.state.position;
    let posStr = `${pos.province} ${pos.city} ${pos.district} ${pos.street} ${pos.streetNumber}`;
    if(!posStr.replace(/\s/g, '') && window.localStorage) {
      posStr = window.localStorage['location'] || '江西省 赣州市';
    }
    reqwest({
      url: `${hostname}/api/record/signout`,
      method: 'get',
      type: 'jsonp',
      data: {
        position: posStr,
        date: this.getToday()
      }
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          toast(`签退成功！签退时间：${res.data.signoutTime}`, 3000);
          window.localStorage && window.localStorage.setItem(`${this.getToday()}_signout`, res.data.signinTime);
          this.setState({ hasSignout: true });
        } else {
          let errMsg = res.message;
          toast(errMsg);
        }
      })
      .fail(err => {
        hideLoading();
        toast('网络忙，刷新试试吧～');
      });
  }

  render() {
    const position = this.state.position;
    let currentCity = '';
    if(position.province && position.city) {
      currentCity = `${position.province} ${position.city} ${position.district} ${position.street} ${position.streetNumber}`;
    }
    if(!currentCity && window.localStorage && window.localStorage['location']) {
      currentCity = window.localStorage['location'];
    }
    return (
      <div className="signin">
        <div className="title">
          <span className="date">{this.getToday(true)}</span>
        </div>
        <div className="in">
          <div className="group">
            <div className="signin-time">
              规定时间：<span className="time">{this.state.signinTime || '09:00'}</span>
            </div>
            <div className="location">
              当前定位：
              <span className="city">{currentCity || '定位中...'}</span>
            </div>
          </div>
          {!this.state.hasSignin && this.state.canSign
            ? <Tappable onTap={this.handleSignin}>
                <button>我要签到</button>
              </Tappable>
            : <button className="disabled">{this.state.hasSignin ? '您已签到' : '我要签到'}</button>}
        </div>
        <div className="out">
          <div className="group">
            <div className="signin-time">
              规定时间：<span className="time">{this.state.signoutTime || '18:00'}</span>
            </div>
            <div className="location">
              当前定位：
              <span className="city">{currentCity || '定位中...'}</span>
            </div>
          </div>
          {!this.state.hasSignout && this.state.canSign
            ? <Tappable onTap={this.handleSignout}>
                <button>我要签退</button>
              </Tappable>
            : <button className="disabled">{this.state.hasSignout ? '您已签退' : '我要签退'}</button>}
        </div>
      </div>
    );
  }
}

module.exports = Signin;
