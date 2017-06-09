'use strict';
import { Component } from 'react';
import './index.less';
import PureRender from '../mixin/pureRender.js';
import Lazyload from '../lazyload/index.js';

class IssueCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, type, mode } = this.props;
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
            <span>{data.handlers.length}人已{type === 'notice' ? '读' : '处理'}</span>
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
            {data.content ? <div className="desc">{data.content.substr(0, 30)}</div> : null}
            {data.date ? <div className="date">{data.date}</div> : null}
            {statusEl}
            {type === 'diary' && data.publisher
              ? <div className="author">发表者：
                  <span className="publisher">{data.publisher.name}(</span>
                  <span className="publisher">{data.publisherDep.name}-</span>
                  <span className="publisher">{data.publisher.position})</span>
                </div>
              : null}
          </a>
        </Lazyload>
      </div>
    );
  }
}

export default PureRender(true)(IssueCard);
