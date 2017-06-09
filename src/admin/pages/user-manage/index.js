import { Component } from 'react';
import {
  Button,
  Modal,
  Form,
  FormControl,
  Input,
  Table,
  Pagination
} from 'rctui';
import ReactDOM from 'react-dom';
import Tab from '../../common/tab/index.js';
import reqwest from 'reqwest';
import config from '../../common/config.js';
import './index.less';

const PAGE_SIZE = 10;
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createModalIsOpen: false,
      editModalIsOpen: false,
      toEdit: {},
      data: [],
      departments: [],
      currentTab: '',
      currentOffset: 0,
      currentPage: 1,
      total: 0
    };
    this.switchTab = this.switchTab.bind(this);
    this.editItem = this.editItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getOnePageUsers = this.getOnePageUsers.bind(this);
    this.handleSelectUserType = this.handleSelectUserType.bind(this);
  }

  componentWillMount() {
    this.switchTab('governor', 0);
    this.initDepartments();
  }

  initDepartments() {
    reqwest({
      url: config.hostname + '/api/department/all',
      method: 'get',
      type: 'jsonp'
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          const data = res.data;
          this.setState({
            departments: data.data || []
          });
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('网络忙，刷新试试吧～');
      });
  }

  handleSelectUserType(level) {
    if (level >= 3) {
      this.setState({ isGovernor: true });
    } else {
      this.setState({ isGovernor: false });
    }
    if(level == 2) {
      this.setState({
        isTownsmen: true
      });
    } else {
      this.setState({
        isTownsmen: false
      });
    }
  }

  switchTab(tabName, idx) {
    if (tabName === this.state.currentTab) {
      return;
    }
    let query = {
      offset: 0,
      pageSize: PAGE_SIZE
    };
    if (tabName === 'governor') {
      query.levelGt = 3;
    } else if (tabName === 'townsmen') {
      query.level = 2;
    } else if (tabName === 'normal') {
      query.level = 1;
    }
    reqwest({
      url: config.hostname + '/api/user/list',
      method: 'get',
      type: 'jsonp',
      data: query
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          const data = res.data;
          this.setState({
            data: data.data || [],
            total: data.total,
            currentTab: tabName,
            currentOffset: PAGE_SIZE,
            currentPage: 1
          });
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('网络忙，刷新试试吧～');
      });
  }

  getOnePageUsers(pageIndex) {
    const tabName = this.state.currentTab;
    const offset = PAGE_SIZE * (pageIndex - 1);
    let query = {
      offset: offset,
      pageSize: PAGE_SIZE
    };
    if (tabName === 'governor') {
      query.levelGt = 3;
    } else if (tabName === 'townsmen') {
      query.level = 2;
    } else if (tabName === 'normal') {
      query.level = 1;
    }
    reqwest({
      url: config.hostname + '/api/user/list',
      method: 'get',
      type: 'jsonp',
      data: query
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          const data = res.data;
          this.setState({
            data: data.data || [],
            total: data.total,
            currentOffset: offset,
            currentPage: pageIndex
          });
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('网络忙，刷新试试吧～');
      });
  }

  editItem(item) {
    item.password = '';
    this.setState({
      toEdit: item,
      editModalIsOpen: true
    });
  }

  removeItem(itemId) {
    let items = [];
    Array.prototype.push.apply(items, this.state.data);
    items.forEach((item, idx) => {
      if (item._id === itemId) {
        items.splice(idx, 1);
        return false;
      }
    });
    reqwest({
      url: config.hostname + '/api/user/remove',
      method: 'post',
      type: 'json',
      data: { id: itemId }
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          this.setState({ data: items });
          Modal.alert('已删除该用户！');
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('删除失败，请重试！！');
      });
  }

  handleSubmit(data) {
    data.realnameStatus = 2;
    data.realnameResult = '已认证';
    let items = [];
    Array.prototype.push.apply(items, this.state.data);
    items.push(data);
    reqwest({
      url: config.hostname + '/api/user/add',
      method: 'get',
      type: 'jsonp',
      data: data
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          this.setState({ data: items, createModalIsOpen: false });
          Modal.alert(`添加用户成功！账号：${data.phone}，密码：${data.password}`);
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('添加用户失败，请重试！');
      });
  }

  handleSave(data) {
    let items = [];
    items = this.state.data.slice(0);
    items.forEach(item => {
      if (item._id === data._id) {
        Object.assign(item, data);
        return false;
      }
    });
    if(!data.password) {
      delete data.password;
    }
    delete data.unused;
    delete data.department;
    reqwest({
      url: config.hostname + '/api/user/modify',
      method: 'post',
      type: 'json',
      data: data
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          this.setState({ editModalIsOpen: false, data: items });
          Modal.alert('修改用户信息成功！');
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('修改用户信息失败，请重试！');
      });
  }

  render() {
    const tabs = [
      { name: 'governor', text: '政府职员' },
      { name: 'townsmen', text: '乡贤用户' },
      { name: 'normal', text: '普通用户' }
    ];
    return (
      <div className="wrap">
        <div className="title">说明：用户管理，以下是所有用户账号，您可以在这里管理这些用户</div>
        <Tab data={tabs} onItemClick={this.switchTab} />
        <div className="add-btn">
          <Button
            status="primary"
            onClick={() => this.setState({ createModalIsOpen: true })}
          >
            添加用户
          </Button>
        </div>
        <div className="list">
          <div className="table">
            <Table
              ref="table"
              bordered={true}
              striped={true}
              data={this.state.data}
              columns={[
                { name: 'name', header: '姓名' },
                { name: 'gender', header: '性别' },
                { name: 'age', header: '年龄' },
                { name: 'phone', header: '手机' },
                {
                  name: 'realnameStatus',
                  header: '实名状态',
                  content: d => {
                    const realnameStatus = d.realnameStatus;
                    const map = ['未认证', '审核中', '已认证', '认证失败'];
                    return map[realnameStatus];
                  }
                },
                {
                  name: 'level',
                  header: '类型',
                  content: d => {
                    const map = ['普通用户', '乡贤', '政府职员', '部门负责人', '镇长/书记'];
                    return map[d.level - 1];
                  }
                },
                {
                  name: 'position',
                  header: '部门',
                  content: d => {
                    const dep = d.department || { name: '' };
                    return dep.name;
                  }
                },
                { name: 'position', header: '职称' },
                {
                  name: 'tools',
                  header: '操作',
                  width: 100,
                  content: d => {
                    return (
                      <span className="operations">
                        <a
                          style={{
                            color: '#0075e4',
                            cursor: 'pointer',
                            marginRight: 10
                          }}
                          onClick={() => {
                            this.editItem(d);
                          }}
                        >
                          编辑
                        </a>
                        <a
                          style={{ color: '#0075e4', cursor: 'pointer' }}
                          onClick={() => {
                            Modal.confirm(
                              `确定删除用户${d.name}吗？删除之后无法恢复!`,
                              () => {
                                this.removeItem(d._id);
                              },
                              '确认删除？'
                            );
                          }}
                        >
                          删除
                        </a>
                      </span>
                    );
                  }
                }
              ]}
            />

            <div className="pagination">
              {this.state.total > PAGE_SIZE
                ? <Pagination
                    page={this.state.currentPage} // 当前页码，默认为 1
                    size={PAGE_SIZE} // 每页显示条数，默认为 20
                    total={this.state.total} // 总条目数，默认为 0
                    onChange={pageIndex => this.getOnePageUsers(pageIndex)}
                  />
                : null}
            </div>
          </div>
        </div>

        <Modal
          width={700}
          header="编辑用户"
          isOpen={this.state.editModalIsOpen}
          onClose={() => this.setState({ editModalIsOpen: false })}
          clickaway
          buttons={{
            保存: 'submit',
            取消: true
          }}
        >
          <div className="edit-form">
            <Form
              data={this.state.toEdit}
              onSubmit={this.handleSave}
              layout="inline"
            >
              <FormControl
                name="phone"
                grid={1 / 2}
                required
                label="手机"
                placeholder="请填写用户手机号码"
                type="text"
              />
              <FormControl
                name="password"
                grid={1 / 2}
                label="密码"
                placeholder="请设置用户密码(6-16位)"
                type="password"
                min={6}
                max={16}
              />
              <FormControl
                name="name"
                grid={1 / 2}
                required
                label="姓名"
                placeholder="请填写用户姓名"
                type="text"
              />
              <FormControl
                name="gender"
                grid={1 / 2}
                data={[{ text: '男', id: 'male' }, { text: '女', id: 'female' }]}
                required
                label="性别"
                placeholder="请选择性别"
                type="radio-group"
              />
              <FormControl
                name="birthplace"
                grid={1}
                required
                label="籍贯"
                placeholder="请填写用户籍贯"
                type="text"
              />
              <FormControl
                name="address"
                grid={1}
                required
                label="住址"
                placeholder="请填写用户住址"
                type="text"
              />
              <FormControl
                name="age"
                grid={1 / 2}
                required
                label="年龄"
                placeholder="请填写用户年龄"
                type="text"
              />
              <FormControl
                name="idNumber"
                grid={1 / 2}
                required
                label="身份证"
                placeholder="请填写用户身份证号码"
                type="text"
              />
              <FormControl
                name="level"
                grid={1 / 2}
                required
                label="用户类型"
                placeholder="请选择用户类型"
                type="select"
                readOnly
                data={[
                  { text: '普通用户', id: 1 },
                  { text: '乡贤', id: 2 },
                  { text: '政府职员', id: 3 },
                  { text: '部门负责人', id: 4 },
                  { text: '镇长/书记', id: 5 }
                ]}
              />
              {this.state.toEdit.department
                ? <FormControl
                    name="unused"
                    grid={1 / 2}
                    required
                    label="所属部门"
                    type="text"
                    value={this.state.toEdit.department.name}
                    readOnly
                  />
                : null}
              }
              {this.state.toEdit.company
                ? <FormControl
                    name="company"
                    grid={1}
                    required
                    label="企业"
                    placeholder="请填写企业名称"
                    type="text"
                  />
                : null}
              {this.state.toEdit.position
                ? <FormControl
                    name="position"
                    grid={1 / 2}
                    required
                    label="职位"
                    placeholder="请填写职位名称"
                    type="text"
                  />
                : null}
            </Form>
          </div>
        </Modal>

        <Modal
          width={700}
          header="新增用户"
          isOpen={this.state.createModalIsOpen}
          onClose={() => this.setState({ createModalIsOpen: false })}
          clickaway
          buttons={{
            保存: 'submit',
            取消: true
          }}
        >
          <div className="create-form">
            <Form data={{}} onSubmit={this.handleSubmit} layout="inline">
              <FormControl
                name="phone"
                grid={1 / 2}
                required
                label="手机"
                placeholder="请填写用户手机号码"
                type="text"
              />
              <FormControl
                name="password"
                grid={1 / 2}
                required
                label="密码"
                placeholder="请设置密码（6-16位）"
                type="password"
                min={6}
                max={16}
              />
              <FormControl
                name="name"
                grid={1 / 2}
                required
                label="姓名"
                placeholder="请填写用户姓名"
                type="text"
              />
              <FormControl
                name="gender"
                grid={1 / 2}
                data={[{ text: '男', id: 'male' }, { text: '女', id: 'female' }]}
                required
                label="性别"
                placeholder="请选择性别"
                type="radio-group"
              />
              <FormControl
                name="birthplace"
                grid={1}
                required
                label="籍贯"
                placeholder="请填写用户籍贯"
                type="text"
              />
              <FormControl
                name="address"
                grid={1}
                required
                label="住址"
                placeholder="请填写用户住址"
                type="text"
              />
              <FormControl
                name="age"
                grid={1 / 2}
                required
                label="年龄"
                placeholder="请填写用户年龄"
                type="text"
              />
              <FormControl
                name="idNumber"
                grid={1 / 2}
                required
                label="身份证"
                placeholder="请填写用户身份证号码"
                type="text"
              />
              <FormControl
                name="level"
                grid={1 / 2}
                required
                label="用户类型"
                placeholder="请选择用户类型"
                type="select"
                onChange={this.handleSelectUserType}
                data={[
                  { text: '普通用户', id: 1 },
                  { text: '乡贤', id: 2 },
                  { text: '政府职员', id: 3 },
                  { text: '部门负责人', id: 4 },
                  { text: '镇长/书记', id: 5 }
                ]}
              />
              {this.state.isGovernor
                ? <FormControl
                    name="department"
                    grid={1 / 2}
                    required
                    label="所属部门"
                    placeholder="请选择部门"
                    type="select"
                    data={this.state.departments}
                    optionTpl="{name}"
                    valueTpl="{_id}"
                  />
                : null}
              {this.state.isTownsmen
                ? <FormControl
                    name="company"
                    grid={1}
                    required
                    label="企业"
                    placeholder="请填写企业名称"
                    type="text"
                  />
                : null}
              {this.state.isGovernor || this.state.isTownsmen
                ? <FormControl
                    name="position"
                    grid={1 / 2}
                    required
                    label="职位"
                    placeholder="请填写职位名称"
                    type="text"
                  />
                : null}
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
