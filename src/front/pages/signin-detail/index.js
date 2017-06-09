import { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../../common/header/index.js';
import { getUriQuery } from '../../common/utils/url.js';
import Rem from '../../common/utils/rem.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import TopBtn from '../../common/2top/index.js';
import Tab from '../../common/tab/index.js';
import { toast } from '../../common/utils/toast.js';
import reqwest from 'reqwest';
import Footer from '../../common/footer/index.js';
import config from '../../common/config.js';
import './index.less';

const id = getUriQuery('id'), type = getUriQuery('type');
const hostname = config.hostname;
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [{ id: 0, text: '全部', name: 'all' }],
      data: {}
    };
    this.switchTab = this.switchTab.bind(this);
  }

  componentWillMount() {
    this.getData({id, type}, data => {
      this.setState({ data });
    });
    this.getAllDepartments(data => {
      let tabs = this.state.tabs.slice(0);
      data.forEach((item)=> {
        tabs.push({
          id: item._id,
          name: item.name,
          text: item.name
        });
      })
      this.setState({tabs});
    });
  }

  componentDidMount() {
    Rem();
  }

  getAllDepartments(callback) {
      reqwest({
        url: `${hostname}/api/department/all`,
        method: 'get',
        type: 'jsonp',
        data: {}
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            callback && callback(res.data.data);
          } else {
            let errMsg = res.message;
            toast(errMsg);
          }
        })
        .fail(err => {
          toast('获取部门列表失败，刷新试试吧～');
        });
  }

  switchTab(tab) {
    let query = {
      id: id,
      type: type
    }
    if(tab.id) {
      query.department = tab.id;
    }
    this.getData(query, (data)=> {
      this.setState({data});
    })
  }

  getData(param, callback) {
    showLoading();
    reqwest({
      url: hostname + '/api/record/detail',
      method: 'get',
      type: 'jsonp',
      data: param
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
        toast('加载签到数据失败，刷新试试吧～');
      });
  }

  render() {
    const links = [
      {
        url: document.referrer ? document.referrer : '/',
        name: document.referrer ? '返回' : '首页',
        className: document.referrer ? 'back' : 'home'
      },
      {}
    ];
    const {data, tabs} = this.state;
    const date = data.date || '';
    const members = data.members || [];
    let list = [
      <div className="head item">
        <div className="name">姓名</div>
        <div className="time">签到时间</div>
        <div className="location">签到地点</div>
        <div className="time">签退时间</div>
        <div className="location">签退地点</div>
      </div>
    ];
    members.forEach((item, idx) => {
      list.push(
        <div className="item" key={idx}>
          <div className="name">{item.name}</div>
          <div className="time">{item.signinTime}</div>
          <div className="location">{item.signinLocation}</div>
          <div className="time">{item.signoutTime}</div>
          <div className="location">{item.signoutLocation}</div>
        </div>
      );
    });

    return (
      <div className="wrap">
        <Header data={{ title: `${date} 考勤明细`, links: links }} />
        {type === 'all' ? 
        <Tab data={tabs} type="tap" onItemClick={this.switchTab} /> : null
        } 
        <div className="main" id="page_main">
          <div className="top">
            {type === 'department' ? 
              <div className="department">部门名称：{data.department}</div> : null
            }
            <span>签到时间：{data.signinTime}</span>
            <span>签退时间：{data.signoutTime}</span>
          </div>
          <div className="list">
            {list}
          </div>
        </div>
        <Footer />
        <TopBtn />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
