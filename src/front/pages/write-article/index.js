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
      cover: '',
      imgs: [],
      showAuthorInfo: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUploadImg = this.handleUploadImg.bind(this);
    this.handleUploadCoverImg = this.handleUploadCoverImg.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
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

   htmlEncode(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  handleSubmit() {
    let {
      title,
      content,
      cover,
      imgs,
      showAuthorInfo
    } = this.formData;
    if (!title) {
      toast('请输入文章标题！');
      return;
    }
    if (!content) {
      toast('请输入文章内容！');
      return;
    }
    let imgEl = '';
    imgs.forEach((img)=> {
      imgEl += `<img src="${img}" />`;
    });
    
    content = htmlEncode(content);

    let desc = content.substr(0, 50);
    content = `<p>${content}</p><div>${imgEl}</div>`;

    const page = {name: 'xxzx', text: '乡贤在线'};
    const tab = {}, keywords = [];

    showLoading('发布中');
    reqwest({
      url: hostname + '/api/article/add',
      method: 'get',
      type: 'jsonp',
      data: { data: JSON.stringify({title, desc, cover, content, showAuthorInfo, page, tab, keywords}) }
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          toast('发布成功！');
          setTimeout(()=> {
            location.replace(`/wzxq?id=${res.data._id}`);
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

  handleUploadCoverImg(imgs) {
    this.formData.cover = imgs[0];
  }

  handleCheckboxClick(e) {
    this.formData.showAuthorInfo = e.target.checked;
  }

  render() {
    let links = [
      {
        url: '/xxzx',
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
        <UploadImg onChange={this.handleUploadCoverImg} label="文章封面图片" max={1} />
        <Input
          label="文章标题"
          placeholder="请输入文章标题..."
          required={true}
          onChange={this.setTitle}
        />
        <Textarea
          label="文章详情"
          required={true}
          placeholder="请输入文章详情"
          size="large"
          onChange={this.setContent}
        />
        <UploadImg onChange={this.handleUploadImg} label="文章插图" />
        <div className="checkbox" style={{paddingLeft: '30px', fontSize: '16px'}}>
          <input type="checkbox" id="checkbox" onClick={this.handleCheckboxClick}/>
          <label htmlFor="checkbox">文章中显示企业信息</label>
        </div>
        <Tappable onTap={this.handleSubmit}>
          <div className="submit">发表</div>
        </Tappable>
      </div>
    );
    return (
      <div className="wrap">
        <Header data={{ title: '写文章', links: links }} />
        <div id="page_main">
          {holderHtml}
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
