'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Tab from '../../common/tab/index.js'
import Banner from './banner.js'
import {Modal} from 'rctui'
import Practice from './practice.js'
import Basic from './basic.js'
import classnames from 'classnames';
import reqwest from 'reqwest';
import config from '../../common/config.js'
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabs: [],
            banners: [],
            currentTab: 'banner'
        }
        this.switchTab = this.switchTab.bind(this)
        this.saveBanners = this.saveBanners.bind(this)
    }

    componentWillMount() {
        reqwest({
            url: config.hostname + '/api/page/get',
            method: 'get',
            type: 'jsonp',
            data: {
                name: 'ddjs'
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                let data =res.data
                let tabs = [{text: '幻灯片管理', name: 'banner'}];
                data.tabs.forEach((item)=> {
                    tabs.push(item)
                })
                this.setState({
                    tabs: tabs,
                    banners: data.banners
                })
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧～')
        });
    }

    switchTab(name, idx) {
        let tabs = this.state.tabs;
        this.setState({
            currentTab: tabs[idx].name
        })
    }

    saveBanners(banners) {
        reqwest({
            url: config.hostname + '/api/page/save',
            method: 'post',
            type: 'json',
            data: {
                name: 'ddjs',
                data: JSON.stringify({banners})
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                Modal.alert('保存成功！')
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('保存失败，请稍后再试～')
        });
    }

    render () {
        let current = this.state.currentTab
        const bannerCls = classnames('banner-wrap', {active: current === 'banner'})
        const practiceCls = classnames('practice-wrap', {active: current === 'practice'})
        const basicCls = classnames('basic-wrap', {active: current === 'basic'})
        return (
            <div className="wrap">
                <Tab data={this.state.tabs} onItemClick={this.switchTab}/>
                <div className={bannerCls}>
                    <Banner data={this.state.banners} onSave={this.saveBanners}/>
                </div>
                <div className={practiceCls}>
                    <Practice />
                </div>
                <div className={basicCls}>
                    <Basic />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
