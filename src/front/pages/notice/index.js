'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Tab from '../../common/tab/index.js';
import Lazylist from '../../common/lazylist/index.js';
import TopBtn from '../../common/2top/index.js';
import { toast } from '../../common/utils/toast.js';
import Footer from '../../common/footer/index.js';
import List from './list';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import './index.less';
import reqwest from 'reqwest';
import config from '../../common/config.js';

const PAGE_SIZE = 10;
const page = { name: 'tzgg', text: '通知公告' };

const hostname = config.hostname;
const dataUrls = [
  `${hostname}/api/notice/list?type=my`,
  `${hostname}/api/notice/list?type=relative`
];
class Index extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      currentTab: 0,
      currentPageIndex: 1,
      currentOffset: 0,
      total: 0
    };
    this.shouldToast = false;
    this.switchTab = this.switchTab.bind(this);
    this.loadListData = this.loadListData.bind(this);
    this.loadNextPageListData = this.loadNextPageListData.bind(this);
  }

  componentWillMount() {
    Rem();
    // this.switchTab({ idx: 0 });
  }

  switchTab(tab) {
    tab = tab.idx;
    this.shouldToast = false;
    this.setState({
      currentTab: tab,
      currentOffset: 0,
      currentPageIndex: 1
    });

    if (tab >= 3) {
      return;
    }

    this.loadListData(
      dataUrls[tab],
      {
        offset: 0,
        pageSize: PAGE_SIZE
      },
      data => {
        let list = data.data || [];
        this.setState({
          list: list,
          currentOffset: PAGE_SIZE,
          total: data.total
        });
      }
    );
  }

  loadNextPageListData() {
    const {
      currentOffset,
      total,
      currentPageIndex,
      currentTab,
      list
    } = this.state;
    if (currentOffset >= total && total > 0) {
      this.shouldToast && toast('没有更多了哟~', 1000);
      return;
    }
    this.shouldToast = true;
    let pageIndex = currentPageIndex;
    this.loadListData(
      dataUrls[currentTab],
      {
        offset: currentOffset,
        pageSize: PAGE_SIZE
      },
      data => {
        const dataList = data.data || [];
        Array.prototype.push.apply(list, dataList);
        this.setState({
          list: list,
          currentPageIndex: pageIndex + 1,
          currentOffset: PAGE_SIZE * (pageIndex + 1)
        });
      }
    );
  }

  loadListData(url, param, callback) {
    showLoading();
    reqwest({
      url: url,
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
    const tabs = [
      { text: '我发送的', idx: 0, name: 'my' },
      { text: '发送给我的', idx: 1, name: 'relative' }
    ];
    const list = this.state.list;
    const links = [
      {
        url: '/ydbg',
        className: 'back'
      },
      {
        url: '/fbtz',
        text: '写通告',
        className: 'btn'
      }
    ];
    return (
      <div className="wrap">
        <Header data={{ title: '通知公告', links: links }} />
        <div id="page_main">
          <Tab data={tabs} type="swipe" onItemClick={this.switchTab} />
          <div>
            {list.length > 0
              ? <Lazylist onScrollEnd={this.loadNextPageListData}>
                  <List data={list} type="notice" />
                </Lazylist>
              : <div className="nodata-tips">嘿嘿，暂无数据哟～</div>}
          </div>
        </div>
        <Footer />
        <TopBtn />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
