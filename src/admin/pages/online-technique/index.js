'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Tab from '../../common/tab/index.js'
import Banner from './banner.js'
import Plant from './plant.js'
import Animal from './animal.js'
import Modal from 'rctui'
import Online from './online.js'
import Disaster from './disaster.js'
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
                name: 'njzx'
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
            url: hostname + '/api/page/save',
            method: 'post',
            type: 'json',
            data: {
                name: 'njzx',
                data: JSON.stringify({banners})
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                Modal.alert('保存成功！')
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('保存失败，请重试～')
        });
    }

    render () {
        let current = this.state.currentTab
        const bannerCls = classnames('banner-wrap', {active: current === 'banner'})
        const plantCls = classnames('plant-wrap', {active: current === 'plant'})
        const animalCls = classnames('animal-wrap', {active: current === 'animal'})
        const onlineCls = classnames('online-wrap', {active: current === 'online'})
        const disasterCls = classnames('disaster-wrap', {active: current === 'disaster'})
        return (
            <div className="wrap">
                <Tab data={this.state.tabs} onItemClick={this.switchTab}/>
                <div className={bannerCls}>
                    <Banner data={this.state.banners} onSave={this.saveBanners}/>
                </div>
                <div className={onlineCls}>
                    <Online />
                </div>
                <div className={plantCls}>
                    <Plant />
                </div>
                <div className={animalCls}>
                    <Animal />
                </div>
                <div className={disasterCls}>
                    <Disaster />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
