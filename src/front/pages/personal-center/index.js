'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Footer from '../../common/footer/index.js';
import './index.less';
import { toast } from '../../common/utils/toast';
import reqwest from 'reqwest';
import Tappable from 'react-tappable';
import config from '../../common/config.js';

const hostname = config.hostname;
const PAGE_SIZE = 10;
class Index extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      gender: '',
      age: '',
      phone: '',
      address: '',
      company: '',
      position: ''
    };
    this.goEditPage = this.goEditPage.bind(this);
  }
  componentWillMount() {
    Rem();
    reqwest({
      url: hostname + '/api/user/get',
      method: 'get',
      type: 'jsonp'
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          const data = res.data;
          this.setState({
            name: data.name || '我的大名',
            gender: data.gender || '',
            age: data.age || '',
            phone: data.phone,
            address: data.address,
            idNumber: data.idNumber,
            realnameStatus: data.realnameStatus === undefined
              ? 0
              : data.realnameStatus,
            realnameResult: data.realnameResult || '',
            level: data.level,
            position: data.position,
            company: data.company
          });
        } else {
          if (res.code === 103) {
            location.replace('/login');
          }
          toast(res.message);
        }
      })
      .fail(err => {
        toast('网络忙，刷新试试吧~');
      });
  }

  goEditPage() {
    let { name, gender, age, address, company, position } = this.state;
    name = name || '';
    gender = gender || 'male';
    age = age || '';
    address = address || '';
    position = position || '';
    company = company || '';
    location.href = `/xgzl?name=${encodeURI(name)}&age=${encodeURI(age)}&gender=${encodeURI(gender)}&address=${encodeURI(address)}&company=${encodeURI(company)}&position=${encodeURI(position)}`;
  }

  render() {
    const links = [
      { url: '/', name: '首页', className: 'home' },
      { url: 'javascript:void(0)', className: 'personal active' }
    ];
    let {
      name,
      level,
      position,
      company,
      gender,
      age,
      phone,
      address,
      realnameStatus,
      realnameResult
    } = this.state;
    let realnameTxt = '未认证', genderTxt = '未知', rightsHtml = [];
    let statusClass = '';
    if (realnameStatus === 1) {
      realnameTxt = '审核中';
      statusClass = 'identifying';
      rightsHtml.push(
        <div className="identifying">
          您已提交实名认证审核，待通过审核后，您将可以使用"在线信访", "民生答疑", "病虫害上报"等权利
        </div>
      );
    } else if (realnameStatus === 2) {
      realnameTxt = '已认证';
      statusClass = 'success';
      rightsHtml.push(
        <div className="rights">
          <div className="item consult">
            <a href="/wdxf"><span>我的信访</span><span className="go-icon" /></a>
          </div>
          <div className="item question">
            <a href="/wddy"><span>我的答疑</span><span className="go-icon" /></a>
          </div>
          <div className="item disaster">
            <a href="/wdbch">
              <span>我的病虫害上报</span><span className="go-icon" />
            </a>
          </div>
        </div>
      );
    } else if (realnameStatus === 3) {
      statusClass = 'rejected';
      rightsHtml.push(
        <div className="rejected">
          很抱歉，您提交的实名认证未通过审核，原因是"{realnameResult}"，请重新进行<a href="/smrz">实名认证</a>
        </div>
      );
    } else if (realnameStatus === 0) {
      statusClass = 'normal';
      rightsHtml.push(
        <div className="unrealname">
          您尚未进行实名认证，暂时不能使用实名权利，马上去<a href="/smrz">实名认证</a>
        </div>
      );
    }
    if (gender === 'male') {
      genderTxt = '男';
    } else if (gender === 'female') {
      genderTxt = '女';
    }
    address = address || '未设置';
    age = age + '岁' || '未知';

    if (level === 2) {
      realnameTxt = '乡贤';
    } else if (level === 3) {
      realnameTxt = position || '职员';
    } else if (level === 4) {
      realnameTxt = position || '部长';
    } else if (level === 5) {
      realnameTxt = position || '书记';
    }

    return (
      <div className="wrap">
        <Header data={{ title: '个人中心', links: links }} />
        <div id="page_main">
          <div className="account-wrap">
            <div className="left">
              <div className="name">{name}</div>
              <div className={'realname-status ' + statusClass}>
                {realnameTxt}
              </div>
            </div>
            <div className="line" />
            <Tappable onTap={this.goEditPage}>
              <div className="right">
                <div className={'gender ' + gender}>
                  <span /><span>{genderTxt}</span>
                </div>
                <div className="age"><span /><span>{age}</span></div>
                <div className="phone"><span /><span>{phone}</span></div>
                <div className="address"><span /><span>{address}</span></div>
              </div>
              <div className="go-icon" />
            </Tappable>
          </div>
          {level === 1 || level === undefined
            ? <div className="rights-wrap">
                <div className="title">实名权利</div>
                {rightsHtml}
              </div>
            : null}
          {level === 2
            ? <div className="rights-wrap">
                <div className="title">专享权益</div>
                <div className="rights">
                  <div className="item question"><a href="/xxzx?tab=all">乡贤在线</a></div>
                </div>
              </div>
            : null}
          {level >= 3
            ? <div className="rights-wrap">
                <div className="title">移动办公</div>
                <div className="rights">
                  <div className="item home"><a href="/ydbg">系统主页</a></div>
                  <div className="item signin"><a href="/kqqd">考勤签到</a></div>
                  <div className="item consult"><a href="/tzgg?tab=my">通知公告</a></div>
                  <div className="item disaster"><a href="/gzjh?tab=consult">工作计划</a></div>
                  <div className="item question"><a href="/gzrz?tab=my">工作日志</a></div>
                </div>
              </div>
            : null}
        </div>
        <div className="logout-btn">
          <a href="/login">退出登陆</a>
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
