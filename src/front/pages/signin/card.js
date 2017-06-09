'use strict';
import { Component } from 'react';
import Tappable from 'react-tappable';
import PureRender from '../../common/mixin/pureRender.js';
import Lazyload from '../../common/lazyload/index.js';
import { toast } from '../../common/utils/toast';
import reqwest from 'reqwest';
import config from '../../common/config';

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = this.props.data || {};
    const type = this.props.type;
    const minHeight = `${100 / (375 / 10)}rem`;
    return (
      <div className="card">
        <Lazyload height={minHeight}>
          <a href={data.url}>
            <div className="date">{data.date}</div>
            <div className="signin">
              <div className="time">签到时间：{data.signinTime}</div>
              <div className="signinCount count">{data.signinCount}人已签到</div>
              <div className="unsigninCount count red">{data.unsigninCount}人未签到</div>
            </div>
            <div className="signout">
              <div className="time">签退时间：{data.signoutTime}</div>
              <div className="signoutCount count">{data.signoutCount}人已签退</div>
              <div className="unsignoutCount count red">{data.unsignoutCount}人未签退</div>
            </div>
            <div className="foot"><span className="total">{type === 'department' ? '部门' : '全体'}共{data.totalMembers}人</span> <span className="all">查看详情<span>&gt;</span></span></div>
          </a>
        </Lazyload>
      </div>
    );
  }
}

export default PureRender(true)(Card);
