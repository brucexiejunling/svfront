import { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../../common/header/index.js';
import { getUriQuery } from '../../common/utils/url.js';
import Rem from '../../common/utils/rem.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import TopBtn from '../../common/2top/index.js';
import { toast } from '../../common/utils/toast.js';
import reqwest from 'reqwest';
import Footer from '../../common/footer/index.js';
import Consult from './consult';
import Disaster from './disaster';
import Question from './question';
import Plan from './plan';
import Notice from './notice';
import Diary from './diary';
import config from '../../common/config.js';
import './index.less';

const hostname = config.hostname;
const issueId = getUriQuery('id');
const issueType = getUriQuery('type');
const mode = getUriQuery('mode') || 'read';
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentWillMount() {
    this.getDetail(issueId, data => this.setState({ data }));
  }

  componentDidMount() {
    Rem();
  }

  getDetail(id, callback) {
    showLoading();
    reqwest({
      url: hostname + `/api/${issueType}/get`,
      method: 'get',
      type: 'jsonp',
      data: { id }
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          callback && callback(res.data);
        } else {
          toast(res.message);
        }
      })
      .fail(err => {
        hideLoading();
        toast('加载数据失败，刷新试试吧～');
      });
  }

  render() {
    const { data } = this.state;
    const links = [
      {
        url: document.referrer && document.referrer !== location.href
          ? document.referrer
          : '/',
        name: document.referrer && document.referrer !== location.href
          ? '返回'
          : '首页',
        className: document.referrer ? 'back' : 'home'
      },
      {}
    ];
    let children, title;
    switch (issueType) {
      case 'consult':
        children = <Consult data={data} mode={mode} />;
        title = '信访详情';
        break;
      case 'question':
        children = <Question data={data} mode={mode} />;
        title = '问题详情';
        break;
      case 'disaster':
        children = <Disaster data={data} mode={mode} />;
        title = '病虫害详情';
        break;
      case 'plan':
        children = <Plan data={data} mode={mode} />;
        title = '任务详情';
        break;
      case 'diary':
        children = <Diary data={data} mode={mode} />;
        title = '日志详情';
        break;
      case 'notice':
        children = <Notice data={data}/>;
        title = '通知详情';
        break;
    }
    return (
      <div className="wrap">
        <Header data={{ title: title, links: links }} />
        <div className="main" id="page_main">
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
