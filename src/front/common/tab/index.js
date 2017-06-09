'use strict';
import { Component } from 'react';
import './index.less';
import { deepEqual } from '../utils/object';
import { swipeLeft, swipeRight } from '../utils/event';
import PureRender from '../mixin/pureRender.js';
import Tappable from 'react-tappable';
import { getUriQuery } from '../utils/url';

const tabName = getUriQuery('tab');
class Tab extends Component {
  constructor(props) {
    super(props);
    let data = this.props.data || [];
    this.state = {
      data: data,
      current: 0,
      total: data.length,
      tabCls: ['active']
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleSwipeLeft = this.handleSwipeLeft.bind(this);
    this.handleSwipeRight = this.handleSwipeRight.bind(this);
  }

  componentWillReceiveProps(newProps) {
    //重置
    if (!deepEqual(newProps.data, this.props.data)) {
      this.initTab(newProps);
    }
  }

  componentDidMount() {
    if (this.props.type === 'swipe') {
      swipeLeft(window, this.handleSwipeLeft, { triggerOnMove: true });
      swipeRight(window, this.handleSwipeRight, { triggerOnMove: true });
      this.initTab(this.props);
    }
  }

  initTab(props) {
    let current = 0, tabCls = ['active'];
    if (tabName && props.data) {
      const currentTab = tabName;
      props.data.some((item, idx) => {
        if (item.name === currentTab) {
          current = idx;
          tabCls = [];
          tabCls[idx] = 'active';
          return true;
        }
      });
    }
    this.setState({
      current: current,
      tabCls: tabCls,
      data: props.data || [],
      total: props.data.length
    });
    if (props.type === 'swipe' && props.data && props.data[0] && !tabName) {
      location.replace(
        `${location.href.replace(/\?.*$/, '')}?tab=${props.data[0].name}`
      );
    }

    props.type === 'swipe' &&
      props.data &&
      props.data[current] &&
      props.onItemClick &&
      props.onItemClick(props.data[current], current);
  }

  handleSwipeLeft(e) {
    let targetEl = e.target;
    if (targetEl.className && targetEl.className.indexOf('slide') > -1) {
      return;
    }
    let parentNode = targetEl.parentNode;
    if (parentNode) {
      if (parentNode.className && parentNode.className.indexOf('slide') > -1) {
        return;
      }
      let grandParent = parentNode.parentNode;
      if (grandParent) {
        if (
          grandParent.className && grandParent.className.indexOf('slide') > -1
        ) {
          return;
        }
      }
    }
    const total = this.state.total;
    let current = this.state.current;
    if (++current >= total) {
      return;
    } else {
      let tabCls = this.state.tabCls;
      tabCls[this.state.current] = '';
      tabCls[current] = 'active';
      this.setState({
        current: current,
        tabCls: tabCls
      });
      let newTab = this.state.data[current];
      if (newTab.url) {
        location.href = newTab.url;
      } else {
        location.replace(
          `${location.href.replace(/\?.*$/, '')}?tab=${newTab.name}`
        );
      }
    }
  }

  handleSwipeRight(e) {
    let targetEl = e.target;
    if (targetEl.className && targetEl.className.indexOf('slide') > -1) {
      return;
    }
    let parentNode = targetEl.parentNode;
    if (parentNode) {
      if (parentNode.className && parentNode.className.indexOf('slide') > -1) {
        return;
      }
      let grandParent = parentNode.parentNode;
      if (grandParent) {
        if (
          grandParent.className && grandParent.className.indexOf('slide') > -1
        ) {
          return;
        }
      }
    }
    let current = this.state.current;
    if (--current < 0) {
      return;
    } else {
      let tabCls = this.state.tabCls;
      tabCls[this.state.current] = '';
      tabCls[current] = 'active';
      this.setState({
        current: current,
        tabCls: tabCls
      });
      let newTab = this.state.data[current];
      if (newTab.url) {
        location.href = newTab.url;
      } else {
        location.replace(
          `${location.href.replace(/\?.*$/, '')}?tab=${newTab.name}`
        );
      }
    }
  }

  handleItemClick(tab, idx) {
    if (this.state.current === idx) {
      return;
    }
    let tabCls = this.state.tabCls;
    tabCls[this.state.current] = '';
    tabCls[idx] = 'active';
    this.setState({
      current: idx,
      tabCls: tabCls
    });
    if (this.props.type === 'swipe') {
      location.replace(`${location.href.replace(/\?.*$/, '')}?tab=${tab.name}`);
    } else {
      this.props.onItemClick && this.props.onItemClick(tab, idx);
    }
  }

  render() {
    let data = this.state.data;
    let type = this.props.type;
    let tabCls = this.state.tabCls;
    let tabs = [];
    let itemWidth = 100 / data.length + '%';
    let itemStyle = type === 'swipe' ? { width: itemWidth } : null;
    data.forEach((item, idx) => {
      let cls = tabCls[idx] ? tabCls[idx] + ' item' : 'item';
      if (item.url) {
        tabs.push(
          <a className={cls} href={item.url} key={idx} style={itemStyle}>
            {item.text}
          </a>
        );
      } else {
        tabs.push(
          <Tappable onTap={() => this.handleItemClick(item, idx)}>
            <span className={cls} key={idx} style={itemStyle}>{item.text}</span>
          </Tappable>
        );
      }
    });
    return <div className={'tab ' + type}>{tabs}</div>;
  }
}

export default PureRender(true)(Tab);
