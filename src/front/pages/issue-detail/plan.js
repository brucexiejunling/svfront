'use strict';
import { Component } from 'react';
import Header from '../../common/header/index.js';
import Rem from '../../common/utils/rem.js';
import Footer from '../../common/footer/index.js';
import reqwest from 'reqwest';
import UploadImg from '../../common/uploadImg/index.js';
import config from '../../common/config.js';
import Select from '../../common/select/index.js';
import Textarea from '../../common/textarea/index.js';
import { toast } from '../../common/utils/toast.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';

const hostname = config.hostname;
export default class Plan extends Component {
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
    this.formData.imgs = imgs;
  }

  updateStatus(result) {
    this.formData.status = result;
  }

  setResult(result) {
    if (result.valid) {
      this.formData.result = result.value;
    } else {
      this.formData.result = '';
    }
  }

  handleSubmit() {
    if (!this.formData.result) {
      toast('请输入计划总结！');
      return;
    }
    // this.formData.handlers = this.props.data.handlers || [];
    showLoading();
    reqwest({
      url: `${hostname}/api/plan/reply`,
      method: 'get',
      type: 'jsonp',
      data: { id: this.props.data._id, data: JSON.stringify(this.formData) }
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
    const statusOpts = [
      { status: 0, statusTxt: '未处理' },
      { status: 1, statusTxt: '处理中' },
      { status: 2, statusTxt: '已处理' }
    ];
    const statusTxts = ['未处理', '处理中', '已处理'];
    let imgEls = [], resultImgEls = [];
    if (data.imgs && data.imgs.length > 0) {
      data.imgs.forEach((item, idx) => {
        imgEls.push(<img src={item} alt="" />);
      });
    }
    if (data.resultImgs && data.resultImgs.length > 0) {
      data.resultImgs.forEach((item, idx) => {
        resultImgEls.push(<img src={item} alt="" />);
      });
    }

    let receiver = '全体人员';
    if (data.receiverType === 1) {
      receiver = data.receiver.name;
    } else if (data.receiverType === 2) {
      receiver = data.receiverDepartment.name;
    }

    let handlers = data.handlers || [];
    handlers = handlers.map(item => {
      return item.username;
    });

    let unhandlers = data.unhandlers || [];
    unhandlers = unhandlers.map(item => {
      return item.name;
    });

    let handleResults = [];
    if (data.handlers && data.handlers.length > 0) {
      data.handlers.forEach((item, idx) => {
        let resultImgEls = [];
        if (item.imgs && item.imgs.length > 0) {
          item.imgs.forEach((url, idx) => {
            resultImgEls.push(<img src={url} alt="" />);
          });
        }
        handleResults.push(
          <div className="item">
            <div className="name">{item.user.name}</div>
            <div className="result">{item.result}</div>
            <div className="result-img">{resultImgEls}</div>
          </div>
        );
      });
    }
    return (
      <div class="issue-detail">
        <div className="display-wrap">
          <div className="title">
            <span className="label">计划标题：</span><span>{data.title}</span>
          </div>
          <div className="author-name">
            <span className="label">发布人：</span>
            <span>{data.publisher.name}</span>
          </div>
          <div className="date">
            <span className="label">发布日期：</span><span>{data.date}</span>
          </div>
          <div className="content">
            <span className="label">计划详情：</span><span>{data.content}</span>
          </div>
          {imgEls.length > 0 &&
            <div className="imgs">
              <span className="label">相关图片：</span>
              <div className="imgs-wrap">
                {imgEls}
              </div>
            </div>}
          <div className="date">
            <span className="label">计划日期：</span>
            <span>{data.startDate} 至 {data.endDate}</span>
          </div>
          <div className="child">
            {statusTxts[data.status] &&
              <div className="status">
                <span className="label">处理状态：</span>
                <span>{statusTxts[data.status]}</span>
              </div>}
            {data.result &&
              <div className="result">
                <span className="label">计划总结：</span>{data.result}
              </div>}
            {resultImgEls.length > 0 &&
              <div className="imgs">
                <span className="label">结果图片：</span>
                <div className="imgs-wrap">
                  {resultImgEls}
                </div>
              </div>}
          </div>
          {data.isMy &&
            <div className="child">
              <div className="receiver">
                <span className="label">接收人：</span><span>{receiver}</span>
              </div>
              <div className="unhandlers">
                <span className="label">未处理人员：</span>
                <span>
                  {unhandlers.length > 0 ? unhandlers.join('、') : '无'}
                </span>
              </div>
              <div className="handlers">
                <span className="label">已处理人员：</span>
                <span>{handlers.length > 0 ? handlers.join('、') : '暂无'}</span>
              </div>
              {handlers.length > 0 &&
                <div className="handle-results">
                  <div className="title">各人员处理结果</div>
                  <div className="list">
                    {handleResults}
                  </div>
                </div>}
            </div>}
        </div>
        {this.props.mode === 'write' &&
          <div className="deal-wrap">
            <div className="status">
              <Select
                data={statusOpts}
                label="更新状态"
                id="status"
                value="statusTxt"
                required={false}
                onChange={this.updateStatus}
              />
            </div>
            <div className="comment">
              <Textarea
                label="计划总结"
                placeholder="输入对于此次计划的总结..."
                required={true}
                onChange={this.setResult}
              />
            </div>
            <div className="pic">
              <UploadImg onChange={this.handleUploadImg} />
            </div>
            <div className="submit">
              <button onClick={this.handleSubmit}>保存</button>
            </div>
          </div>}
      </div>
    );
  }
}
