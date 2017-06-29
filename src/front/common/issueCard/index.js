'use strict';
import { Component } from 'react';
import './index.less';
import PureRender from '../mixin/pureRender.js';
import Lazyload from '../lazyload/index.js';
import { toast } from '../utils/toast';
import Tappable from 'react-tappable';
import reqwest from 'reqwest';
import config from '../config';

class IssueCard extends Component {
  constructor(props) {
    super(props);
    this.deleteIssue = this.deleteIssue.bind(this);
  }

  deleteIssue() {
    if (confirm('撤消后不可恢复，确认撤消吗？')) {
      reqwest({
        url: `${config.hostname}/api/${this.props.type}/save`,
        method: 'post',
        type: 'jsonp',
        data: { id: this.props.data._id, data: JSON.stringify({status: -1}) }
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            toast('已成功撤消!');
            setTimeout(()=> location.reload(), 2000);
          } else {
            toast(res.message);
          }
        })
        .fail(err => {
          toast('网络忙，刷新试试吧～');
        });
    }
  }

  render() {
    const { data, type, mode, deletable } = this.props;
    let minHeight = data.cover
      ? `${286 / (375 / 10)}rem`
      : `${100 / (375 / 10)}rem`;
    const statusTxts = ['未处理', '处理中', '已处理'];
    let statusEl = null;
    if (type !== 'diary') {
      if (statusTxts[data.status]) {
        statusEl = (
          <div className="status">
            处理状态: <span>{statusTxts[data.status]}</span>
          </div>
        );
      } else if (data.handlers) {
        statusEl = (
          <div className="handlers">
            <span>
              {data.handlers.length}人已{type === 'notice' ? '读' : '处理'}
            </span>
          </div>
        );
      }
    }
    return (
      <div className="issue-card">
        <Lazyload height={minHeight}>
          <a href={`/swxq?id=${data._id}&type=${type}&mode=${mode}`}>
            <div className="title">
              {data.title ? data.title : data.content.substr(0, 10)}
            </div>
            {data.content &&
              <div className="desc">{data.content.substr(0, 30)}</div>}
            {data.date && <div className="date">{data.date}</div>}
            {statusEl}
            {type === 'diary' &&
              data.publisher &&
              <div className="author">
                发表者：
                <span className="publisher">{data.publisher.name}(</span>
                <span className="publisher">{data.publisherDep.name}-</span>
                <span className="publisher">{data.publisher.position})</span>
              </div>}
            {deletable &&
              <div
                className="operation"
                style={{
                  lineHeight: '20px',
                  height: '20px',
                  marginTop: '-20px',
                  paddingBottom: '10px',
                  paddingRight: '20px',
                  textAlign: 'right'
                }}
              >
                <Tappable onTap={this.deleteIssue}>
                  <a href="javascript:void" style={{ color: '#c40000' }}>撤消</a>
                </Tappable>
              </div>}
          </a>
        </Lazyload>
      </div>
    );
  }
}

export default PureRender(true)(IssueCard);
