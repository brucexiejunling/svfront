'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Slide from '../../common/slide/index.js';
import Tab from '../../common/tab/index.js';
import Feeds from '../../common/feeds/index.js';
import Lazylist from '../../common/lazylist/index.js';
import TopBtn from '../../common/2top/index.js';
import Footer from '../../common/footer/index.js'
import {toast} from '../../common/utils/toast.js'
import {showLoading, hideLoading} from '../../common/utils/loading.js'
import './index.less';
import reqwest from 'reqwest'
import config from '../../common/config.js'

const PAGE_SIZE = 10;
const page = {name: 'kjzf', text: '科技致富'}
const hostname = config.hostname
class Index extends Component {
    constructor() {
        super()
        this.state = {
            banners: [],
            tabs: [],
            feeds: [],
            currentTab: {},
            currentPageIndex: 1,
            currentOffset: 0,
            total: 0
        }
        this.switchTab = this.switchTab.bind(this)
        this.loadNextPageFeeds = this.loadNextPageFeeds.bind(this)
    }
    componentWillMount() {
        Rem();
        this.getInitData({name: 'kjzf'}, (data)=> {
            this.setState({
                banners: data.banners,
                tabs: data.tabs
            });
            // this.switchTab(data.tabs[0]);
        });
    }

    getInitData(param, callback) {
        showLoading()
        reqwest({
            url: hostname + '/api/page/get',
            method: 'get',
            type: 'jsonp',
            data: param
        }).then((res)=> {
            hideLoading()
            if(res.code === 0 && res.data) {
                callback && callback(res.data)
            } else {
                toast(res.message)
            }
        }).fail((err)=> {
            hideLoading()
            toast('网络忙，刷新试试吧～')
        });
    }

    switchTab(tab) {
        this.shouldToast = false
        this.setState({
            currentTab: tab,
            currentOffset: 0,
            currentPageIndex: 1
        });
        this.loadFeedsData({
            tab: JSON.stringify(tab),
            page: JSON.stringify(page),
            offset: 0,
            pageSize: PAGE_SIZE
        }, (data)=> {
            this.setState({
                feeds: data.data || [],
                currentOffset: PAGE_SIZE,
                total: data.total
            });
        });
    }

    loadNextPageFeeds() {
        if(this.state.currentOffset >= this.state.total && this.state.total > 0) {
            this.shouldToast && toast('没有更多了哟~', 1000)
            return
        }
        this.shouldToast = true
        let pageIndex = this.state.currentPageIndex;
        let feeds = this.state.feeds;
        this.loadFeedsData({
            tab: JSON.stringify(this.state.currentTab),
            page: JSON.stringify(page),
            offset: this.state.currentOffset,
            pageSize: PAGE_SIZE
        }, (data)=> {
            Array.prototype.push.apply(feeds, data.data || []);
            this.setState({
                feeds: feeds,
                currentPageIndex: pageIndex + 1,
                currentOffset: PAGE_SIZE * (pageIndex + 1)
            });
        });
    }

    loadFeedsData(param, callback) {
        showLoading()
        reqwest({
            url: hostname + '/api/article/feeds',
            method: 'get',
            type: 'jsonp',
            data: param
        }).then((res)=> {
            hideLoading()
            if(res.code === 0 && res.data) {
                callback && callback(res.data)
            } else {
                toast(res.message)
            }
        }).fail((err)=> {
            hideLoading()
            toast('网络忙，请稍后再试～')
        });
    }

    render () {
        return (
            <div className="wrap">
                <Header data={{title: '科技致富'}}/>
                <div id="page_main">
                    {this.state.banners.length > 0 ? <Slide data={this.state.banners} /> : null}
                    <Tab data={this.state.tabs} type='swipe' onItemClick={this.switchTab} />
                    {
                        this.state.feeds.length > 0 ?
                            <Lazylist onScrollEnd={this.loadNextPageFeeds}>
                                <Feeds data={this.state.feeds} />
                            </Lazylist> : <div className="nodata-tips">嘿嘿，暂无数据哟～</div>
                    }
                </div>
                <Footer />
                <TopBtn />
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
