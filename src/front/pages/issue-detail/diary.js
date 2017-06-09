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
export default class Diary extends Component {
  constructor(props) {
    super(props);
    this.formData = {};
  }

  componentWillMount() {
    Rem();
  }

  render() {
    let data = this.props.data;
    data.publisher = data.publisher || {};
    data.department = data.publisherDep || {};
    let imgEls = [];
    if(data.imgs && data.imgs.length > 0) {
      data.imgs.forEach((item, idx)=> {
        imgEls.push(<img src={item} alt=""/>);
      })
    }
    return (
      <div class="issue-detail">
        <div className="display-wrap">
          <div className="title"><span className="label">日志标题：</span><span>{data.title}</span></div>
          <div className="author-name"><span className="label">发表者：</span><span>{data.publisher.name}({data.department.name}-{data.publisher.position})</span></div>
          <div className="date"><span className="label">发布日期：</span><span>{data.date}</span></div>
          <div className="content"><span className="label">日志详情：</span><span>{data.content}</span></div>
          {imgEls.length > 0 ? 
          <div className="imgs">
            <span className="label">相关图片：</span>
            <div className="imgs-wrap">
              {imgEls}
            </div>
          </div> : null
          }
        </div>
      </div>
    )
  }
}