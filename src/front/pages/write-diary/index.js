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
      imgs: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUploadImg = this.handleUploadImg.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setContent = this.setContent.bind(this);
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


  handleSubmit() {
    const {
      title,
      content
    } = this.formData;
    if (!title) {
      toast('请输入日志标题！');
      return;
    }
    if (!content) {
      toast('请输入日志内容！');
      return;
    }
    showLoading('发布中');
    reqwest({
      url: hostname + '/api/diary/add',
      method: 'get',
      type: 'jsonp',
      data: { data: JSON.stringify(this.formData) }
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          toast('发布成功！');
          setTimeout(()=> {
            location.replace(`/swxq?id=${res.data._id}&type=diary`);
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
        url: '/gzrz',
        name: '返回',
        className: 'back'
      },
      {
        url: 'javascript:void(0)',
        text: '发表',
        className: 'btn',
        onClick: this.handleSubmit
      }
    ];

    let holderHtml = (
      <div className="form-wrap">
        <Input
          label="日志标题"
          placeholder="请输入日志标题..."
          required={true}
          onChange={this.setTitle}
        />
        <Textarea
          label="日志详情"
          required={true}
          placeholder="请输入日志详情"
          size="large"
          onChange={this.setContent}
        />
        <UploadImg onChange={this.handleUploadImg} />
        <Tappable onTap={this.handleSubmit}>
          <div className="submit">发表</div>
        </Tappable>
      </div>
    );
    return (
      <div className="wrap">
        <Header data={{ title: '写日志', links: links }} />
        <div id="page_main">
          {holderHtml}
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
