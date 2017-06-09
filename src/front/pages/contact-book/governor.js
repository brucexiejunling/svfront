'use strict';
import { Component } from 'react';
import Tab from '../../common/tab/index.js';
import Lazylist from '../../common/lazylist/index.js';
import { toast } from '../../common/utils/toast.js';
import List from './list';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import reqwest from 'reqwest';
import config from '../../common/config.js';

const PAGE_SIZE = 10;
const hostname = config.hostname;
const dataUrl = `${hostname}/api/user/list?levelGt=3`;

export default class Governor extends Component {
  constructor() {
    super();
    this.state = {
      tabs: [{ id: 0, text: '全部', name: 'all' }],
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
    this.getAllDepartments = this.getAllDepartments.bind(this);
  }

  componentWillMount() {
    this.switchTab({id: 0});
    this.getAllDepartments(data => {
      let tabs = this.state.tabs.slice(0);
      data.forEach((item)=> {
        tabs.push({
          id: item._id,
          name: item.name,
          text: item.name
        });
      })
      this.setState({tabs});
    });
  }

  getAllDepartments(callback) {
      reqwest({
        url: `${hostname}/api/department/all`,
        method: 'get',
        type: 'jsonp',
        data: {}
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            callback && callback(res.data.data);
          } else {
            let errMsg = res.message;
            toast(errMsg);
          }
        })
        .fail(err => {
          toast('获取部门列表失败，刷新试试吧～');
        });
  }

  switchTab(tab) {
    this.shouldToast = false;
    this.setState({
      currentTab: tab.id,
      currentOffset: 0,
      currentPageIndex: 1
    });
    let param = {
        offset: 0,
        pageSize: PAGE_SIZE
    }

    if(tab.id !== 0) {
      param.department = tab.id;
    }

    this.loadListData(
      dataUrl,
      param,
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
      dataUrl,
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
    const { tabs, list } = this.state;
    return (
      <div className="governor">
        <Tab data={tabs} type="tap" onItemClick={this.switchTab} />
        <div>
          {list.length > 0
            ? <Lazylist onScrollEnd={this.loadNextPageListData}>
                <List data={list} />
              </Lazylist>
            : <div className="nodata-tips">嘿嘿，暂无数据哟～</div>}
        </div>
      </div>
    );
  }
}
