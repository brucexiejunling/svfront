'use strict';
import { Component } from 'react';
import Tab from '../../common/tab/index.js';
import Lazylist from '../../common/lazylist/index.js';
import { toast } from '../../common/utils/toast.js';
import List from './list';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import './index.less';
import reqwest from 'reqwest';
import config from '../../common/config.js';

const PAGE_SIZE = 10;
const hostname = config.hostname;

const dataUrls = [
  `${hostname}/api/plan/list?type=my`,
  `${hostname}/api/plan/list?type=relative`
];
class Plan extends Component {
  constructor(props) {
    super(props);
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
    this.switchTab({idx: 0})
  }

  switchTab(tab) {
    tab = tab.idx;
    this.shouldToast = false;
    this.setState({
      currentTab: tab,
      currentOffset: 0,
      currentPageIndex: 1
    });

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
    const list = this.state.list;
    const tabs = [
      { text: '我发布的', idx: 0, name: 'my' },
      { text: '指派给我的', idx: 1, name: 'all' }
    ];
    return (
      <div className="plans">
        <Tab data={tabs} type="tap" onItemClick={this.switchTab} />
        {list.length > 0
          ? <Lazylist onScrollEnd={this.loadNextPageListData}>
              <List data={list} type='plan' />
            </Lazylist>
          : <div className="nodata-tips">嘿嘿，暂无数据哟～</div>}
      </div>
    );
  }
}

module.exports = Plan;
