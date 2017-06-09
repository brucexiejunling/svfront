'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Footer from '../../common/footer/index.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import reqwest from 'reqwest';
import { toast } from '../../common/utils/toast.js';
import News from './news';
import config from '../../common/config.js';
import './index.less';

const hostname = config.hostname;
const PAGE_SIZE = 10;
class Index extends Component {
  constructor() {
    super();
    this.state = {
      news: {}
    };
  }
  componentWillMount() {
    Rem();
    showLoading();
    reqwest({
      url: hostname + '/api/news/get',
      method: 'get',
      type: 'jsonp'
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          this.setState({ news: res.data.data });
        } else {
          toast(res.message);
        }
      })
      .fail(err => {
        hideLoading();
        toast('网络忙，刷新试试吧~');
      });
  }

  render() {
    let links = [
      {
        name: '工作计划',
        url: 'gzjh?tab=consult'
      },
      {
        name: '工作日志',
        url: 'gzrz?tab=my'
      },
      {
        name: '通知公告',
        url: 'tzgg?tab=my'
      },
      {
        name: '考勤签到',
        url: 'kqqd?tab=my'
      },
      {
        name: '通讯录',
        url: 'txl?tab=governor'
      }
    ];
    let linkEls = [];
    links.forEach((item, idx) => {
      linkEls.push(
        <a className="nav-item" href={item.url} key={idx}>{item.name}</a>
      );
    });
    const news = this.state.news;
    return (
      <div className="wrap">
        <Header
          data={{
            title: '移动办公',
            links: [
              { url: '/', className: 'home', name: '首页' },
              { url: '/grzx', name: '个人中心', className: 'personal' }
            ]
          }}
        />
        <div id="page_main">
          <div className="nav-wrap">
            <div className="title"><span>- -</span>快捷导航<span>- -</span></div>
            {linkEls}
          </div>
          <div className="news-wrap">
            <div className="title"><span>- -</span>最新动态<span>- -</span></div>
            {news.plans || news.notices
              ? <News data={news} />
              : <div className="nodata-tips">嘿嘿，暂无数据哟～</div>}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
