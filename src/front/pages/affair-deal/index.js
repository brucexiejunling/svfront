'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Slide from '../../common/slide/index.js';
import Tab from '../../common/tab/index.js';
import Feeds from '../../common/feeds/index.js';
import Lazylist from '../../common/lazylist/index.js';
import SearchInput from './searchInput.js';
import {showLoading, hideLoading} from '../../common/utils/loading.js'
import TopBtn from '../../common/2top/index.js';
import {toast} from '../../common/utils/toast.js'
import Footer from '../../common/footer/index.js'
import reqwest from 'reqwest'
import assign from 'object-assign'
import config from '../../common/config.js'
import './index.less';

const PAGE_SIZE = 10;
const page = {name: 'wybs', text: '我要办事'}
const hostname = config.hostname
class Index extends Component {
    constructor() {
        super()
        this.state = {
            banners: [],
            tabs: [],
            feeds: [],
            currentTab: {},
            currentType: {},
            currentKeyword: '',
            intKeyword: '',
            currentPageIndex: 1,
            currentOffset: 0,
            total: 0
        }
        this.switchTab = this.switchTab.bind(this);
        this.selectType = this.selectType.bind(this);
        this.searchByKeyword = this.searchByKeyword.bind(this);
        this.loadNextPageFeeds = this.loadNextPageFeeds.bind(this);
    }
    componentWillMount() {
        Rem();
        this.getInitData({name: 'wybs'}, (data)=> {
            let types1 = [{name: '', text: '全部'}]
            let types2 = [{name: '', text: '全部'}]
            Array.prototype.push.apply(types1, data.types['policy'])
            Array.prototype.push.apply(types2, data.types['introduction'])
            data.tabs[0].types = types1
            data.tabs[1].types = types2
            console.log('xxxx', data.tabs)
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
            toast('网络忙，刷新试试吧~')
        });
    }

    switchTab(newTab, idx) {
        this.shouldToast = false;
        const newType = newTab.types[0];
        this.state.currentKeyword = '';
        let tab = assign({}, newTab)
        delete tab.types
        this.setState({
            currentTab: newTab,
            currentType: newType,
            currentOffset: 0,
            total: 0,
            currentPageIndex: 1,
            currentKeyword: ''
        });
        let param = {
            page: JSON.stringify(page),
            tab: JSON.stringify(tab),
            offset: 0,
            pageSize: PAGE_SIZE
        }
        if(newType && newType.name) {
           param.type = JSON.stringify(newType)
        }
        this.loadFeedsData(param, (data)=> {
            this.setState({
                feeds: data.data || [],
                total: data.total,
                currentOffset: PAGE_SIZE
            });
        });
    }

    selectType(newType, idx) {
        this.shouldToast = false;
        let currentTab = this.state.currentTab;
        this.setState({
            currentType: newType,
            total: 0,
            currentOffset: 0,
            currentPageIndex: 1
        });
        let tab = assign({}, currentTab)
        delete tab.types

        let param = {
            page: JSON.stringify(page),
            tab: JSON.stringify(tab),
            offset: 0,
            pageSize: PAGE_SIZE
        }
        if(newType && newType.name) {
            param.type = JSON.stringify(newType)
        }
        if(this.state.currentKeyword) {
            param.keywords = this.state.currentKeyword
        }
        this.loadFeedsData(param, (data)=> {
            this.setState({
                feeds: data.data || [],
                total: data.total,
                currentOffset: PAGE_SIZE
            });
        });
    }

    searchByKeyword(keyword) {
        this.shouldToast = false;
        this.setState({
            currentKeyword: keyword,
            currentOffset: 0,
            total: 0,
            currentPageIndex: 1
        });

        const currentTab = this.state.currentTab
        const currentType = this.state.currentType

        let tab = assign({}, currentTab)
        delete tab.types

        let param = {
            page: JSON.stringify(page),
            tab: JSON.stringify(tab),
            offset: 0,
            keywords: keyword,
            pageSize: PAGE_SIZE
        }
        if(currentType && currentType.name) {
            param.type = JSON.stringify(currentType)
        }
        this.loadFeedsData(param, (data)=> {
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
        this.shouldToast = true;

        let pageIndex = this.state.currentPageIndex;

        const currentTab = this.state.currentTab
        const currentType = this.state.currentType
        const currentKeyword = this.state.currentKeyword

        let tab = assign({}, currentTab)
        delete tab.types

        let param = {
            page: JSON.stringify(page),
            tab: JSON.stringify(tab),
            offset: this.state.currentOffset,
            pageSize: PAGE_SIZE
        }
        if(currentType && currentType.name) {
            param.type = JSON.stringify(currentType)
        }
        if(currentKeyword) {
            param.keywords = currentKeyword
        }

        let feeds = this.state.feeds;
        this.loadFeedsData(param, (data)=> {
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
            }
        }).fail((err)=> {
            hideLoading()
            toast('网络忙，刷新试试吧~')
        });
    }

    render () {
        let types = this.state.currentTab.types || [];
        return (
            <div className="wrap">
                <Header data={{title: '我要办事'}}/>
                <div id="page_main">
                    {this.state.banners.length > 0 ? <Slide data={this.state.banners} /> : null}
                    <Tab data={this.state.tabs} type='swipe' onItemClick={this.switchTab} />
                    <SearchInput placeholder='输入关键字进行搜索...' defaultValue={this.state.currentKeyword} onSearch={this.searchByKeyword} onClear={()=> this.state.currentKeyword = ''} />
                    <Tab data={types} type='tap' onItemClick={this.selectType} />
                    {this.state.feeds.length > 0 ?
                        <Lazylist onScrollEnd={this.loadNextPageFeeds}>
                            <Feeds data={this.state.feeds}/>
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
