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
import Plan from './plan';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import './index.less';
import reqwest from 'reqwest';
import config from '../../common/config.js';

const PAGE_SIZE = 10;
const page = { name: 'gzjh', text: '工作计划' };

const hostname = config.hostname;
const dataUrls = [
  `${hostname}/api/consult/list?type=relative`,
  `${hostname}/api/question/list?type=relative`,
  `${hostname}/api/disaster/list?type=relative`,
  `${hostname}/api/plan/list?type=relative`
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
    
    if(tab >= 3) { return }

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
      { text: '在线信访', idx: 0, name: 'consult' },
      { text: '民生答疑', idx: 1, name: 'question' },
      { text: '病虫害上报', idx: 2, name: 'disaster' },
      { text: '工作任务', idx: 3, name: 'plan' }
    ];
    const list = this.state.list;
    const links = [
      {
        url: '/ydbg',
        className: 'back'
      },
      {
        url: '/fbjh',
        text: '新增',
        className: 'btn'
      }
    ];
    return (
      <div className="wrap">
        <Header data={{ title: '工作计划', links: links }} />
        <div id="page_main">
          <Tab data={tabs} type="swipe" onItemClick={this.switchTab} />
          {this.state.currentTab !== 3
            ? <div>
                {list.length > 0
                  ? <Lazylist onScrollEnd={this.loadNextPageListData}>
                      <List
                        data={list}
                        type={tabs[this.state.currentTab].name}
                      />
                    </Lazylist>
                  : <div className="nodata-tips">嘿嘿，暂无数据哟～</div>}
              </div>
            : <Plan />}
        </div>
        <Footer />
        <TopBtn />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
