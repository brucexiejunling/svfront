'use strict';
import { Component } from 'react';
import Lazylist from '../../common/lazylist/index.js';
import { toast } from '../../common/utils/toast.js';
import List from './list';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import reqwest from 'reqwest';
import config from '../../common/config.js';

const PAGE_SIZE = 10;
const hostname = config.hostname;
const dataUrl = `${hostname}/api/user/list`;

export default class Townsmen extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      currentPageIndex: 1,
      currentOffset: 0,
      total: 0
    };
    this.shouldToast = false;
    this.loadListData = this.loadListData.bind(this);
    this.loadNextPageListData = this.loadNextPageListData.bind(this);
  }

  componentWillMount() {
    const param = {
        offset: 0,
        pageSize: PAGE_SIZE,
        level: 2
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
        pageSize: PAGE_SIZE,
        level: 2
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
    const { list } = this.state;
    return (
      <div className="governor">
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
