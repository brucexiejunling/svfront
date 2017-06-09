import { Component } from 'react';
import classnames from 'classnames';
import Select from '../select/index';
import PureRender from '../mixin/pureRender.js';
import reqwest from 'reqwest';
import { toast } from '../../common/utils/toast';
import Config from '../config.js';
import './index.less';

const hostname = Config.hostname;
class Receiver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personList: [],
      departmentList: [],
      type: 3,
      receiverId: ''
    };
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.fetchDepartmentList = this.fetchDepartmentList.bind(this);
    this.fetchPersonList = this.fetchPersonList.bind(this);
    this.handleSelectDep = this.handleSelectDep.bind(this);
    this.handleSelectPerson = this.handleSelectPerson.bind(this);
  }

  handleTypeChange(type) {
    this.setState({ type });
    if (type === 1 && this.state.personList.length <= 0) {
      this.fetchPersonList(personList => {
        this.setState({ personList });
      });
    }
    if (type === 2 && this.state.departmentList.length <= 0) {
      this.fetchDepartmentList(departmentList => {
        this.setState({ departmentList });
      });
    }
    this.props.onChange && this.props.onChange({type: type, id: this.state.receiverId})
  }

  fetchDepartmentList(callback) {
    reqwest({
      url: hostname + '/api/department/all',
      method: 'get',
      type: 'jsonp'
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          callback(res.data.data || []);
        } else {
          toast(res.message);
        }
      })
      .fail(err => {
        toast('网络忙，刷新试试吧～');
      });
  }

  fetchPersonList(callback) {
    //获取政府工作人员
    reqwest({
      url: hostname + '/api/user/list?levelGt=3',
      method: 'get',
      type: 'jsonp'
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          callback(res.data.data || []);
        } else {
          toast(res.message);
        }
      })
      .fail(err => {
        toast('网络忙，刷新试试吧～');
      });
  }

  handleSelectDep(dep) {
    this.state.receiverId = dep;
    this.props.onChange && this.props.onChange({type: this.state.type, id: dep})
  }
  
  handleSelectPerson(person) {
    this.state.receiverId = person
    this.props.onChange && this.props.onChange({type: this.state.type, id: person})
  }

  render() {
    const { personList, departmentList, type } = this.state; //1个人，2部门，3全体
    let children = null;

    if (type === 1) {
      children = <Select data={personList} id="_id" value="name" label="接收人" required={true} onChange={this.handleSelectPerson} />;
    } else if (type === 2) {
      children = <Select data={departmentList} id="_id" value="name" label="接收部门" required={true} onChange={this.handleSelectDep} />;
    }
    return (
      <div className="receiver">
        <div className="radio">
          <label><span>*</span>接收人类型：</label>
          <span>
            <input
              id="per"
              type="radio"
              name="type"
              checked={this.state.type === 1}
              onClick={() => this.handleTypeChange(1)}
            />
            <label htmlFor="per">个人</label>
          </span>
          <span>
            <input
              id="dep"
              name="type"
              type="radio"
              checked={this.state.type === 2}
              onClick={() => this.handleTypeChange(2)}
            />
            <label htmlFor="dep">部门</label>
          </span>
          <span>
            <input
              id="all"
              name="type"
              type="radio"
              checked={this.state.type === 3}
              onClick={() => this.handleTypeChange(3)}
            />
            <label htmlFor="all">全体</label>
          </span>
        </div>
        {children}
      </div>
    );
  }
}

export default PureRender(true)(Receiver);
