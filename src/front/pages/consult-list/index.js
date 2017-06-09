'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
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
const page = { name: 'gzjh', text: '工作计划' };
const hostname = config.hostname;

class Index extends Component {
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
    Rem();
    this.setState({
      currentOffset: 0,
      currentPageIndex: 1
    });
    this.loadListData(
      `${hostname}/api/consult/list?type=my`,
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
      list
    } = this.state;
    if (currentOffset >= total && total > 0) {
      this.shouldToast && toast('没有更多了哟~', 1000);
      return;
    }
    this.shouldToast = true;
    let pageIndex = currentPageIndex;
    this.loadListData(
      `${hostname}/api/consult/list?type=my`,
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
    const links = [
      {
        url: '/grzx',
        className: 'back'
      },
      {}
    ];
    return (
      <div className="wrap">
        <Header data={{ title: '我的在线信访', links: links }} />
        <div id="page_main">
          {list.length > 0
            ? <Lazylist onScrollEnd={this.loadNextPageListData}>
                <List data={list} />
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
