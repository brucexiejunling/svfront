'use strict'
import { Component } from 'react';
import './index.less';
import Tappable from 'react-tappable'

class Header extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftClass: 'left-link',
            rightClass: 'right-link'
        }
        this.handleLeftClick = this.handleLeftClick.bind(this)
        this.handleRightClick = this.handleRightClick.bind(this)
    }

    handleLeftClick() {
        const link = this.state.links[0]
        if(link.url && link.url.indexOf('javascript') < 0) {
            window.location = link.url
        } else if(link.onClick) {
            link.onClick()
        }
    }

    handleRightClick() {
        const link = this.state.links[1]
        if(link.url && link.url.indexOf('javascript') < 0) {
            window.location = link.url
        } else if(link.onClick) {
            link.onClick()
        }
    }
    render () {
        let data = this.props.data || {};
        let links = data.links || [{url: '/', name: '首页', className: 'home'}, {url: 'grzx', name: '个人中心', className: 'personal'}];
        this.state.links = links
        let cls1 = links[0].className, cls2 = links[1].className;
        return (
            <div className="header">
                <div className="inner">
                    <Tappable onTap={this.handleLeftClick}><a onTouchStart={()=> this.setState({leftClass: this.state.leftClass + ' active'})} className={this.state.leftClass + ' ' + cls1} href='javascript:void(0)' style={links[0].style}></a></Tappable>
                    <span className="title">{data.title}</span>
                    <Tappable onTap={this.handleRightClick}><a onTouchStart={()=> this.setState({rightClass: this.state.rightClass + ' active'})} className={this.state.rightClass + ' ' + cls2} href='javascript:void(0)' style={links[1].style}>{links[1].text ? links[1].text : ''}</a></Tappable>
                </div>
            </div>
        )
    }
}

module.exports = Header;
