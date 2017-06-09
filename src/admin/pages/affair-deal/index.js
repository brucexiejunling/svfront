'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Tab from '../../common/tab/index.js'
import Banner from './banner.js'
import Policy from './policy.js'
import {Modal} from 'rctui'
import Introduction from './introduction.js'
import classnames from 'classnames';
import reqwest from 'reqwest';
import config from '../../common/config.js'
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabs: [],
            types: {},
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
                name: 'wybs'
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
                    types: data.types || {},
                    banners: data.banners || []
                })
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧')
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
                name: 'wybs',
                data: JSON.stringify({banners})
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                Modal.alert('保存成功！')
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，请稍后再试～')
        });
    }

    saveTypes(tab, typeData) {
        let types = this.state.types || {}
        types[tab] = typeData
        reqwest({
            url: config.hostname + '/api/page/save',
            method: 'post',
            type: 'json',
            data: {
                name: 'wybs',
                data: JSON.stringify({types})
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                Modal.alert('保存成功！')
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，请稍后再试')
        });
    }

    render () {
        let current = this.state.currentTab
        const bannerCls = classnames('banner-wrap', {active: current === 'banner'})
        const policyCls = classnames('policy-wrap', {active: current === 'policy'})
        const introductionCls = classnames('introduction-wrap', {active: current === 'introduction'})
        return (
            <div className="wrap">
                <Tab data={this.state.tabs} onItemClick={this.switchTab}/>
                <div className={bannerCls}>
                    <Banner data={this.state.banners} onSave={this.saveBanners}/>
                </div>
                <div className={policyCls}>
                    <Policy types={this.state.types['policy']} onSubmitTypes={(data)=> this.saveTypes('policy', data)} />
                </div>
                <div className={introductionCls}>
                    <Introduction types={this.state.types['introduction']} onSubmitTypes={(data)=> this.saveTypes('introduction', data)} />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
