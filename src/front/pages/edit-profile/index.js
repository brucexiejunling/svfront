import { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../../common/header/index.js';
import { getUriQuery } from '../../common/utils/url.js';
import Rem from '../../common/utils/rem.js';
import Input from '../../common/input/index';
import Textarea from '../../common/textarea/index';
import Captcha from '../../common/captcha/index';
import MsgCaptcha from '../../common/msgCaptcha/index';
import { toast } from '../../common/utils/toast';
import reqwest from 'reqwest';
import Tappable from 'react-tappable';
import Footer from '../../common/footer/index.js';
import config from '../../common/config.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import './index.less';

const hostname = config.hostname;
const name = decodeURI(getUriQuery('name'));
const age = decodeURI(getUriQuery('age'));
const gender = decodeURI(getUriQuery('gender'));
const address = decodeURI(getUriQuery('address'));
const company = decodeURI(getUriQuery('company'));
const position = decodeURI(getUriQuery('position'));
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name,
      age,
      gender,
      address,
      company,
      position
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleAgeInput = this.handleAgeInput.bind(this);
    this.handleAddressInput = this.handleAddressInput.bind(this);
    this.handleCompanyInput = this.handleCompanyInput.bind(this);
    this.handlePositionInput = this.handlePositionInput.bind(this);
    this.handleRadioClick = this.handleRadioClick.bind(this);
  }

  componentDidMount() {
    Rem();
  }

  handlePositionInput(result) {
    const position = result.value;
    this.setState({ position });
  }

  handleCompanyInput(result) {
    const company = result.value;
    this.setState({ company });
  }

  handleNameInput(result) {
    const name = result.value;
    this.setState({ name });
  }

  handleAgeInput(result) {
    const age = result.value;
    this.setState({ age });
  }

  handleAddressInput(result) {
    const address = result.value;
    this.setState({ address });
  }

  handleRadioClick() {
    if (this._maleRadio.checked) {
      this.setState({ gender: 'male' });
    } else if (this._femaleRadio.checked) {
      this.setState({ gender: 'female' });
    }
  }

  handleSubmit() {
    const { name, gender, age, address, company, position } = this.state;
    if (!name) {
      toast('请输入您的真实姓名', 3000);
      return;
    }
    if (!gender) {
      toast('请输入您的真实性别', 3000);
      return;
    }
    if (!age) {
      toast('请输入您的真实年龄', 3000);
      return;
    }
    if (!address) {
      toast('请输入您的详细家庭住址', 3000);
      return;
    }
    let data = { name, gender, age, address };
    if(company) {
      data.company = company;
    }
    if(position) {
      data.position = position;
    }
    showLoading('保存中');
    reqwest({
      url: hostname + '/api/user/save',
      method: 'post',
      type: 'json',
      data: data
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          toast('修改成功!');
        } else {
          toast('保存失败，请稍后再试');
        }
      })
      .fail(err => {
        hideLoading();
        toast('网络忙，请稍后再试~');
      });
  }

  render() {
    const links = [
      {
        url: document.referrer ? document.referrer : '/',
        name: document.referrer ? '返回' : '首页',
        className: document.referrer ? 'back' : 'home'
      },
      {
        url: '',
        text: '保存',
        className: 'btn',
        onClick: this.handleSubmit
      }
    ];
    let maleRadio = [
      this.state.gender === 'male'
        ? <input
            id="male"
            ref={c => this._maleRadio = c}
            type="radio"
            name="gender"
            value="male"
            checked="checked"
          />
        : <input
            id="male"
            ref={c => this._maleRadio = c}
            type="radio"
            name="gender"
            value="male"
          />
    ];
    let femaleRadio = [
      this.state.gender === 'female'
        ? <input
            id="female"
            ref={c => this._femaleRadio = c}
            type="radio"
            name="gender"
            value="female"
            checked="checked"
          />
        : <input
            id="female"
            ref={c => this._femaleRadio = c}
            type="radio"
            name="gender"
            value="female"
          />
    ];
    const { name, gender, age, idNumber, address } = this.state;
    return (
      <div className="wrap">
        <Header data={{ title: '修改资料', links: links }} />
        <div id="page_main">
          <div className="form">
            <Input
              label="姓名"
              type="text"
              value={name}
              placeholder="请输入您的真实姓名"
              onChange={this.handleNameInput}
            />
            <div className="row">
              <label>性别：</label>
              <span
                className="radio-wrap"
                onClick={this.handleRadioClick}
                onTouchEnd={this.handleRadioClick}
              >
                <span className="radio">
                  <label for="male">男</label>{maleRadio}
                </span>
                <span className="radio">
                  <label for="female">女</label>{femaleRadio}
                </span>
              </span>
            </div>
            <Input
              label="年龄"
              value={age}
              type="text"
              placeholder="请输入您的真实年龄"
              onChange={this.handleAgeInput}
            />
            <Input
              label="企业"
              value={company}
              type="text"
              placeholder="请输入您所在企业"
              onChange={this.handleCompanyInput}
            />
            <Input
              label="职位"
              value={position}
              type="text"
              placeholder="请输入您的职位名称"
              onChange={this.handlePositionInput}
            />
            <Textarea
              label="家庭住址"
              value={address}
              type="text"
              placeholder="请输入您的详细家庭住址"
              onChange={this.handleAddressInput}
            />
            <Tappable onTap={this.handleSubmit}>
              <button className="submit-btn">保存</button>
            </Tappable>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
