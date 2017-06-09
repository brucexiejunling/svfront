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
import { getUriQuery } from '../../common/utils/url.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';

const hostname = config.hostname;
export default class Notice extends Component {
  constructor(props) {
    super(props);
    this.readNotice = this.readNotice.bind(this);
  }

  componentWillMount() {
    Rem();
    this.readNotice();
  }

  readNotice() {
    reqwest({
      url: `${hostname}/api/notice/read`,
      method: 'get',
      type: 'jsonp',
      data: { id: getUriQuery('id') }
    })
      .then(res => {})
      .fail(err => {});
  }

  render() {
    let data = this.props.data;
    data.publisher = data.publisher || {};
    let imgEls = [], resultImgEls = [];
    if (data.imgs && data.imgs.length > 0) {
      data.imgs.forEach((item, idx) => {
        imgEls.push(<img src={item} alt="" />);
      });
    }

    let receiver = '全体人员';
    if (data.receiverType === 1) {
      receiver = data.receiver.name;
    } else if (data.receiverType === 2) {
      receiver = data.receiverDepartment.name;
    }

    data.handlers = data.handlers || [];
    let handlers = data.handlers.map(item => {
      return item.name;
    });

    let unhandlers = data.unhandlers || [];
    unhandlers = unhandlers.map(item => {
      return item.name;
    });

    return (
      <div class="issue-detail">
        <div className="display-wrap">
          <div className="title">
            <span className="label">通知标题：</span><span>{data.title}</span>
          </div>
          <div className="author-name">
            <span className="label">发布人：</span>
            <span>{data.publisher.name}</span>
          </div>
          <div className="date">
            <span className="label">发布日期：</span><span>{data.date}</span>
          </div>
          <div className="content">
            <span className="label">通知详情：</span><span>{data.content}</span>
          </div>
          {imgEls.length > 0
            ? <div className="imgs">
                <span className="label">相关图片：</span>
                <div className="imgs-wrap">
                  {imgEls}
                </div>
              </div>
            : null}
          <div className="child">
            <div className="receiver">
              <span className="label">接收人：</span><span>{receiver}</span>
            </div>
            <div className="handlers">
              <span className="label">已读：</span>
              <span>{handlers.length > 0 ? handlers.join('、') : '暂无'}</span>
            </div>
            <div className="unhandlers">
              <span className="label">未读：</span>
              <span>{unhandlers.length > 0 ? unhandlers.join('、') : '无'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
