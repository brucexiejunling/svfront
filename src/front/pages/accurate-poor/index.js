'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Slide from '../../common/slide/index.js';
import Tab from '../../common/tab/index.js';
import Feeds from '../../common/feeds/index.js';
import Lazylist from '../../common/lazylist/index.js';
import TopBtn from '../../common/2top/index.js';
import { toast } from '../../common/utils/toast.js';
import Footer from '../../common/footer/index.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import './index.less';
import reqwest from 'reqwest';
import config from '../../common/config.js';

const PAGE_SIZE = 10;
const page = { name: 'jzfp', text: '精准扶贫' };

const hostname = config.hostname;
class Index extends Component {
  constructor() {
    super();
    this.state = {
      banners: [],
      tabs: [],
      feeds: [],
      currentTab: {},
      currentPageIndex: 1,
      currentOffset: 0,
      total: 0
    };
    this.shouldToast = false;
    this.switchTab = this.switchTab.bind(this);
    this.loadNextPageFeeds = this.loadNextPageFeeds.bind(this);
  }
  componentWillMount() {
    Rem();
    this.getInitData({ name: 'jzfp' }, data => {
      this.setState({
        banners: data.banners,
        tabs: data.tabs
      });
    });
  }

  getInitData(param, callback) {
    showLoading();
    reqwest({
      url: hostname + '/api/page/get',
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

  switchTab(tab) {
    this.shouldToast = false;
    this.setState({
      currentTab: tab,
      currentOffset: 0,
      currentPageIndex: 1
    });
    this.loadFeedsData(
      {
        tab: JSON.stringify(tab),
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
  }

  loadNextPageFeeds() {
    const { currentPageIndex, feeds, currentOffset, total } = this.state;
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
    return (
      <div className="wrap">
        <Header data={{ title: '精准扶贫' }} />
        <div id="page_main">
          {this.state.banners.length > 0
            ? <Slide data={this.state.banners} />
            : null}
          <Tab
            data={this.state.tabs}
            type="swipe"
            onItemClick={this.switchTab}
          />
          {this.state.feeds.length > 0
            ? <Lazylist onScrollEnd={this.loadNextPageFeeds}>
                <Feeds data={this.state.feeds} />
              </Lazylist>
            : <div className="nodata-tips">嘿嘿，暂无数据哟～</div>}
        </div>
        <Footer />
        <TopBtn />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
