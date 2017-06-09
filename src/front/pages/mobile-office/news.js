'use strict';
import { Component } from 'react';
import './index.less';
class News extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { notices, plans, questions, consults, disasters } = this.props.data;
    let noticeList = [],
      planList = [],
      questionList = [],
      consultList = [],
      disasterList = [];
    notices.forEach((item, idx) => {
      noticeList.push(
        <div className="item" key={+new Date()}>
          <a href={'/swxq?type=notice&mode=write&id=' + item._id}>
            <span className="title">{item.title}</span>
            <span className="right">
              <span className="date">{item.date}</span>
              <span className="tag">未读</span>
            </span>
          </a>
        </div>
      );
    });
    plans.forEach((item, idx) => {
      planList.push(
        <div className="item" key={idx + notices.length}>
          <a href={'/swxq?type=plan&mode=write&id=' + item._id}>
            <span className="title">{item.title}</span>
            <span className="right">
              <span className="date">{item.date}</span>
              <span className="tag">未处理</span>
            </span>
          </a>
        </div>
      );
    });

    consults.forEach((item, idx) => {
      consultList.push(
        <div className="item" key={idx + notices.length + plans.length}>
          <a href={'/swxq?type=consult&mode=write&id=' + item._id}>
            <span className="title">{item.title}</span>
            <span className="right">
              <span className="date">{item.date}</span>
              <span className="tag">未处理</span>
            </span>
          </a>
        </div>
      );
    });

    questions.forEach((item, idx) => {
      questionList.push(
        <div
          className="item"
          key={idx + notices.length + plans.length + consults.length}
        >
          <a href={'/swxq?type=question&mode=write&id=' + item._id}>
            <span className="title">{item.title}</span>
            <span className="right">
              <span className="date">{item.date}</span>
              <span className="tag">未处理</span>
            </span>
          </a>
        </div>
      );
    });

    disasters.forEach((item, idx) => {
      disasterList.push(
        <div
          className="item"
          key={
            idx +
              notices.length +
              plans.length +
              consults.length +
              questions.length
          }
        >
          <a href={'/swxq?type=disaster&mode=write&id=' + item._id}>
            <span className="title">{item.title}</span>
            <span className="right">
              <span className="date">{item.date}</span>
              <span className="tag">未处理</span>
            </span>
          </a>
        </div>
      );
    });

    return (
      <div className="list">
        <div className="notices">
          <div className="title">通知公告</div>
          <div className="main">
            {noticeList.length > 0
              ? <div>{ noticeList }</div>
              : <div className="no-data">恭喜您，暂无待处理事务~</div>}
          </div>
        </div>
        <div className="plans">
          <div className="title">工作计划</div>
          <div className="main">
            {planList.length > 0
              ? <div>{ planList }</div>
              : <div className="no-data">恭喜您，暂无待处理事务~</div>}
          </div>
        </div>
        <div className="consult">
          <div className="title">在线信访</div>
          <div className="main">
            {consultList.length > 0
              ? <div>{ consultList }</div>
              : <div className="no-data">恭喜您，暂无待处理事务~</div>}
          </div>
        </div>
        <div className="questions">
          <div className="title">民生答疑</div>
          <div className="main">
            {questionList.length > 0
              ? <div>{ questionList }</div>
              : <div className="no-data">恭喜您，暂无待处理事务~</div>}
          </div>
        </div>
        <div className="disasters">
          <div className="title">病虫害上报</div>
          <div className="main">
            {disasterList.length > 0
              ? <div>{ disasterList }</div>
              : <div className="no-data">恭喜您，暂无待处理事务~</div>}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = News;
