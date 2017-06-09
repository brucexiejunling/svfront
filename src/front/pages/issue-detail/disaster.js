'use strict';
import { Component } from 'react';
import Header from '../../common/header/index.js'
import Rem from '../../common/utils/rem.js'
import Footer from '../../common/footer/index.js'
import reqwest from 'reqwest';
import UploadImg from '../../common/uploadImg/index.js'
import config from '../../common/config.js'
import Select from '../../common/select/index.js';
import Textarea from '../../common/textarea/index.js';
import {toast} from '../../common/utils/toast.js'
import { showLoading, hideLoading } from '../../common/utils/loading.js';

const hostname = config.hostname;
export default class Disaster extends Component {
  constructor(props) {
    super(props);
    this.formData = {};
    this.handleUploadImg = this.handleUploadImg.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.setResult = this.setResult.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    Rem();
  }

  handleUploadImg(imgs) {
    this.formData.resultImgs = imgs;
  }

  updateStatus(result) {
    this.formData.status = result;
  }

  setResult(result) {
    if(result.valid) {
      this.formData.result = result.value;
    } else {
      this.formData.result = '';
    }
  }

  handleSubmit() {
    if(!this.formData.result) {
      toast('请输入处理结论！');
      return;
    }
    showLoading();
    reqwest({
      url: `${hostname}/api/disaster/reply`,
      method: 'get',
      type: 'jsonp',
      data: {id: this.props.data._id, data: JSON.stringify(this.formData)}
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          toast('已成功提交处理！');
        } else {
          toast(res.message);
        }
      })
      .fail(err => {
        hideLoading();
        toast('网络忙，刷新试试吧～');
      });
  }

  render() {
    let data = this.props.data;
    data.publisher = data.publisher || {};
    data.department = data.department || {};
    const statusOpts = [
      {status: 0, statusTxt: '未处理'},
      {status: 1, statusTxt: '处理中'},
      {status: 2, statusTxt: '已处理'}
    ];
    const statusTxts = ['未处理', '处理中', '已处理'];
    let imgEls = [], resultImgEls = [];
    if(data.imgs && data.imgs.length > 0) {
      data.imgs.forEach((item, idx)=> {
        imgEls.push(<img src={item} alt=""/>);
      })
    }
    if(data.resultImgs && data.resultImgs.length > 0) {
      data.resultImgs.forEach((item, idx)=> {
        resultImgEls.push(<img src={item} alt=""/>);
      })
    }
    return (
      <div class="issue-detail">
        <div className="display-wrap">
          <div className="title"><span className="label">标题：</span><span>{data.title}</span></div>
          <div className="author-name"><span className="label">发布人姓名：</span><span>{data.publisher.name}</span></div>
          <div className="author-phone"><span className="label">发布人电话：</span><span>{data.publisher.phone}</span></div>
          <div className="author-address"><span className="label">发布人住址：</span><span>{data.publisher.address}</span></div>
          <div className="date"><span className="label">发布日期：</span><span>{data.date}</span></div>
          <div className="area"><span className="label">病虫害发生地：</span><span>{data.area}</span></div>
          <div className="content"><span className="label">病虫害详情：</span><span>{data.content}</span></div>
          {imgEls.length > 0 ? 

          <div className="imgs">
            <span className="label">相关图片：</span>
            <div className="imgs-wrap">
              {imgEls}
            </div>
          </div> : null
          }
          <div className="department"><span className="label">处理部门：</span>{data.department.name}</div>
          <div className="status"><span className="label">处理状态：</span><span>{statusTxts[data.status]}</span></div>
          {
            data.modifier ? 
            <div className="modifier"><span className="label">处理人</span>{data.modifier ? data.modifier.name : ''}</div> : null
          }
          {
            data.result ? 
            <div className="result"><span className="label">处理结果：</span>{data.result}</div> : null
          }
          {resultImgEls.length > 0 ? 
          <div className="imgs">
            <span className="label">结果图片：</span>
            <div className="imgs-wrap">
              {resultImgEls}
            </div>
          </div> : null
          }
        </div>
        {this.props.mode === 'write' ? 
        <div className="deal-wrap">
          <div className="status">
            <Select data={statusOpts} label="更新状态" id="status" value="statusTxt" required={false} onChange={this.updateStatus} />
          </div>
          <div className="comment">
            <Textarea label="处理结论" placeholder="输入对于该问题的处理答复" required={true} onChange={this.setResult} />
          </div>
          <div className="pic">
              <UploadImg onChange={this.handleUploadImg} />
          </div>
          <div className="submit"><button onClick={this.handleSubmit}>提交处理</button></div>
        </div> : null
        }
      </div>
    )
  }
}