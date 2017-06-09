'use strict'
import { Component } from 'react';
import './index.less';
import {deepEqual} from '../utils/object'
import PureRender from '../mixin/pureRender.js';

class Tab extends Component {
    constructor (props) {
        super(props);
        let data = this.props.data || [];
        this.state = {
            data: data,
            current: 0,
            total: data.length,
            tabCls: ['active']
        }
        this.handleItemClick = this.handleItemClick.bind(this)
    }

    componentWillReceiveProps(newProps) {
        //重置
        if(!deepEqual(newProps.data, this.props.data)) {
            this.setState({current: 0, tabCls: ['active'], data: newProps.data});
        }
    }

    handleItemClick(name, idx) {
        if(this.state.current === idx) {
            return;
        }
        let tabCls = this.state.tabCls;
        tabCls[this.state.current] = '';
        tabCls[idx] = 'active';
        this.setState({
            current: idx,
            tabCls: tabCls
        })
        this.props.onItemClick && this.props.onItemClick(name, idx);
    }

    render () {
        let data = this.state.data;
        let tabCls = this.state.tabCls;
        let tabs = [];
        let itemWidth = 100/data.length + '%';
        let itemStyle = {width: itemWidth};
        data.forEach((item, idx)=> {
            let cls = tabCls[idx] ? tabCls[idx] + ' item' : 'item';
            tabs.push(<span className={cls} key={idx} style={itemStyle} onClick={()=> this.handleItemClick(item.name, idx)}>{item.text}</span>)
        });
        return (
            <div className='tab'>{tabs}</div>
        )
    }
}

export default PureRender(true)(Tab)
