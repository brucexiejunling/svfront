'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Tab from '../../common/tab/index.js';
import TopBtn from '../../common/2top/index.js';
import Footer from '../../common/footer/index.js';
import Governor from './governor';
import Townsmen from './townsmen';
import './index.less';
import reqwest from 'reqwest';

const PAGE_SIZE = 10;
const page = { name: 'txl', text: '通讯录' };

class Index extends Component {
  constructor() {
    super();
    this.state = {};
    this.switchTab = this.switchTab.bind(this);
  }

  componentWillMount() {
    Rem();
  }

  switchTab(tab) {
    this.setState({
      currentTab: tab.idx
    });
  }

  render() {
    const tabs = [
      { text: '政府通讯录', idx: 0, name: 'governor' },
      { text: '乡贤通讯录', idx: 1, name: 'townsmen' }
    ];
    const links = [
      {
        url: '/ydbg',
        className: 'back'
      },
      {}
    ];
    const currentTab = this.state.currentTab;
    return (
      <div className="wrap">
        <Header data={{ title: '通讯录', links: links }} />
        <div id="page_main">
          <Tab data={tabs} type="swipe" onItemClick={this.switchTab} />
          {currentTab === 0 ? <Governor /> : null}
          {currentTab === 1 ? <Townsmen /> : null}
        </div>
        <Footer />
        <TopBtn />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
