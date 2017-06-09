'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Tab from '../../common/tab/index.js'
import Banner from './banner.js'
import Rule from './rule.js'
import Law from './law.js'
import Consult from './consult.js'
import {Modal} from 'rctui'
import classnames from 'classnames';
import reqwest from 'reqwest';
import './index.less';
import config from '../../common/config.js'

const hostname = config.hostname
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
            url: hostname + '/api/page/get',
            method: 'get',
            type: 'jsonp',
            data: {
                name: 'zxxf'
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
                    banners: data.banners || []
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
            url: hostname + '/api/page/save',
            method: 'post',
            type: 'json',
            data: {
                name: 'zxxf',
                data: JSON.stringify({banners})
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                Modal.alert('保存成功！')
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，保存失败，请重试～')
        });
    }

    render () {
        let current = this.state.currentTab
        const bannerCls = classnames('banner-wrap', {active: current === 'banner'})
        const ruleCls = classnames('rule-wrap', {active: current === 'rule'})
        const lawCls = classnames('law-wrap', {active: current === 'law'})
        const consultCls = classnames('consult-wrap', {active: current === 'consult'})
        return (
            <div className="wrap">
                <Tab data={this.state.tabs} onItemClick={this.switchTab}/>
                <div className={bannerCls}>
                    <Banner data={this.state.banners} onSave={this.saveBanners}/>
                </div>
                <div className={ruleCls}>
                    <Rule />
                </div>
                <div className={lawCls}>
                    <Law />
                </div>
                <div className={consultCls}>
                    <Consult />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
