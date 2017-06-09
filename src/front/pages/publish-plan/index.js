'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Footer from '../../common/footer/index.js';
import UploadImg from '../../common/uploadImg/index.js';
import Textarea from '../../common/textarea/index.js';
import Input from '../../common/input/index.js';
import Tappable from 'react-tappable';
import Select from '../../common/select/index.js';
import DatePicker from '../../common/datePicker/index.js';
import Receiver from '../../common/receiver/index.js';
import reqwest from 'reqwest';
import { toast } from '../../common/utils/toast';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import config from '../../common/config.js';
import './index.less';

const PAGE_SIZE = 10;
const hostname = config.hostname;
class Index extends Component {
  constructor() {
    super();
    this.formData = {
      title: '',
      content: '',
      startDate: '',
      endDate: '',
      receiverType: 3,
      receiver: null,
      imgs: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUploadImg = this.handleUploadImg.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setContent = this.setContent.bind(this);
    this.setReceiver = this.setReceiver.bind(this);
    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
  }

  componentWillMount() {
    Rem();
  }

  setTitle(result) {
    if (result.valid) {
      this.formData.title = result.value;
    } else {
      this.formData.title = '';
    }
  }

  setContent(result) {
    if (result.valid) {
      this.formData.content = result.value;
    } else {
      this.formData.content = '';
    }
  }

  setStartDate(result) {
    this.formData.startDate = result;
  }

  setEndDate(result) {
    this.formData.endDate = result;
  }

  setReceiver(result) {
    this.formData.receiver = result.id;
    this.formData.receiverType = result.type;
  }

  handleSubmit() {
    const {
      title,
      content,
      startDate,
      endDate,
      receiver,
      receiverType
    } = this.formData;
    if (!title) {
      toast('请输入计划标题！');
      return;
    }
    if (!content) {
      toast('请输入计划内容！');
      return;
    }
    if (!startDate) {
      toast('请选择开始日期！');
      return;
    }
    if (!endDate) {
      toast('请选择截止日期！');
      return;
    }
    if (receiverType !== 3 && !receiver) {
      toast('请选择接收人或接收部门！');
      return;
    }
    if(receiverType === 2) {
      this.formData.receiverDepartment = receiver;
      delete this.formData.receiver;
    }
    showLoading('发布中');
    reqwest({
      url: hostname + '/api/plan/add',
      method: 'get',
      type: 'jsonp',
      data: { data: JSON.stringify(this.formData) }
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          toast('发布成功！');
          setTimeout(()=> {
            location.replace(`/swxq?id=${res.data._id}&type=plan`);
          }, 1000)
        } else {
          if (res.code === 103) {
            location.replace(
              `/login?redirectURL=${encodeURIComponent(location.href)}`
            );
          }
          toast(res.message);
        }
      })
      .fail(err => {
        hideLoading();
        toast('网路忙，请稍后再试~');
      });
  }

  handleUploadImg(imgs) {
    this.formData.imgs = imgs;
  }

  render() {
    let links = [
      {
        url: '/gzjh',
        name: '返回',
        className: 'back'
      },
      {
        url: 'javascript:void(0)',
        text: '发布',
        className: 'btn',
        onClick: this.handleSubmit
      }
    ];

    let holderHtml = (
      <div className="form-wrap">
        <Receiver onChange={this.setReceiver} />
        <DatePicker label="开始时间" required={true} onChange={this.setStartDate} />
        <DatePicker label="截止时间" required={true} onChange={this.setEndDate} />
        <Input
          label="计划标题"
          placeholder="请输入计划标题..."
          required={true}
          onChange={this.setTitle}
        />
        <Textarea
          label="计划详情"
          required={true}
          placeholder="请输入计划详情"
          size="large"
          onChange={this.setContent}
        />
        <UploadImg onChange={this.handleUploadImg} />
        <Tappable onTap={this.handleSubmit}>
          <div className="submit">发布</div>
        </Tappable>
      </div>
    );
    return (
      <div className="wrap">
        <Header data={{ title: '发布工作计划', links: links }} />
        <div id="page_main">
          {holderHtml}
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
