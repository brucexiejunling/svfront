'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Footer from '../../common/footer/index.js';
import Slide from '../../common/slide/index.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import reqwest from 'reqwest';
import Lazylist from '../../common/lazylist/index';
import { toast } from '../../common/utils/toast.js';
import Feeds from '../../common/feeds/index.js';
import config from '../../common/config.js';
import './index.less';

const hostname = config.hostname;
const PAGE_SIZE = 10;
const page = { name: 'home', text: '网站首页' };
class Index extends Component {
  constructor() {
    super();
    this.state = {
      banners: [],
      desc: '',
      feeds: [],
      currentPageIndex: 1,
      currentOffset: 0,
      total: 0
    };
    this.loadNextPageFeeds = this.loadNextPageFeeds.bind(this);
  }
  componentWillMount() {
    Rem();
    showLoading();
    reqwest({
      url: hostname + '/api/page/get',
      method: 'get',
      type: 'jsonp',
      data: {
        name: 'home'
      }
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          this.setState({
            banners: res.data.banners || [],
            desc: res.data.desc
          });
          this.loadFeedsData(
            {
              tab: JSON.stringify({}),
              page: JSON.stringify(page),
              offset: 0,
              pageSize: PAGE_SIZE
            },
            data => {
              let list = data.data || [];
              this.setState({
                feeds: list,
                currentOffset: PAGE_SIZE,
                total: data.total
              });
            }
          );
        } else {
          toast(res.message);
        }
      })
      .fail(err => {
        hideLoading();
        toast('网络忙，刷新试试吧~');
      });
  }

  loadNextPageFeeds() {
    const {currentPageIndex, feeds, currentOffset, total} = this.state;
    if (currentOffset >= total && total > 0) {
      this.shouldToast && toast('没有更多了哟~', 1000);
      return;
    }
    this.shouldToast = true;
    this.loadFeedsData(
      {
        page: JSON.stringify(page),
        tab: JSON.stringify({}),
        offset: currentOffset,
        pageSize: PAGE_SIZE
      },
      data => {
        let list = data.data || [];
        Array.prototype.push.apply(feeds, list);
        this.setState({
          feeds: feeds,
          currentPageIndex: currentPageIndex + 1,
          currentOffset: PAGE_SIZE * (currentPageIndex + 1)
        });
      }
    );
  }

  loadFeedsData(param, callback) {
    showLoading();
    reqwest({
      url: hostname + '/api/article/feeds',
      method: 'get',
      type: 'jsonp',
      data: param
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          callback && callback(res.data);
        } else {
          toast(res.message);
        }
      })
      .fail(err => {
        hideLoading();
        toast('网络忙，刷新试试吧～');
      });
  }

  render() {
    let links = [
      {
        name: '精准扶贫',
        url: 'jzfp?tab=example'
      },
      {
        name: '党的建设',
        url: 'ddjs?tab=practice'
      },
      {
        name: '我要办事',
        url: 'wybs?tab=policy'
      },
      {
        name: '在线信访',
        url: 'zxxf?tab=rule'
      },
      {
        name: '科技致富',
        url: 'kjzf?tab=book'
      },
      {
        name: '民生答疑',
        url: 'msdy'
      },
      {
        name: '农技在线',
        url: 'njzx?tab=online'
      },
      {
        name: '乡贤在线',
        url: 'xxzx?tab=all'
      },
      {
        name: '移动办公',
        url: 'ydbg'
      }
    ];
    let linkEls = [];
    links.forEach((item, idx) => {
      linkEls.push(
        <a className="nav-item" href={item.url} key={idx}>{item.name}</a>
      );
    });
    return (
      <div className="wrap">
        <Header
          data={{
            title: '智慧乡村',
            links: [
              { url: 'javascript:void(0)', className: 'home active' },
              { url: '/grzx', name: '个人中心', className: 'personal' }
            ]
          }}
        />
        <div id="page_main">
          <Slide data={this.state.banners} />
          <div className="desc-wrap">
            <div className="title"><span>- -</span>政府简介<span>- -</span></div>
            <div className="desc">{this.state.desc}</div>
          </div>
          <div className="nav-wrap">
            <div className="title"><span>- -</span>快捷导航<span>- -</span></div>
            {linkEls}
          </div>
          <div className="news-wrap">
            <div className="title"><span>- -</span>最新动态<span>- -</span></div>
            {this.state.feeds.length > 0
              ? <Lazylist onScrollEnd={this.loadNextPageFeeds}>
                  <Feeds data={this.state.feeds} />
                </Lazylist>
              : <div className="nodata-tips">嘿嘿，暂无数据哟～</div>}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
