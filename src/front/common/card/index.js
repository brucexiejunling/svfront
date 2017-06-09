'use strict';
import { Component } from 'react';
import './index.less';
import Tappable from 'react-tappable';
import PureRender from '../mixin/pureRender.js';
import Lazyload from '../lazyload/index.js';
import { toast } from '../utils/toast';
import reqwest from 'reqwest';
import config from '../config';

class Card extends Component {
  constructor(props) {
    super(props);
    this.toggleArticle = this.toggleArticle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.state = {
      isTop: this.props.data.toTop
    };
  }

  toggleArticle() {
    if (this.state.isTop) {
      reqwest({
        url: `${config.hostname}/api/article/save`,
        method: 'get',
        type: 'jsonp',
        data: {
          id: this.props.data._id,
          data: JSON.stringify({ toTop: false })
        }
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            toast('取消置顶成功!');
            this.setState({isTop: false})
          } else {
            toast(res.message);
          }
        })
        .fail(err => {
          toast('网络忙，刷新试试吧～');
        });
    } else {
      reqwest({
        url: `${config.hostname}/api/article/top`,
        method: 'get',
        type: 'jsonp',
        data: {
          id: this.props.data._id,
          page: JSON.stringify({ name: 'xxzx', text: '乡贤在线' })
        }
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            toast('置顶成功!');
            this.setState({isTop: true})
          } else {
            toast(res.message);
          }
        })
        .fail(err => {
          toast('网络忙，刷新试试吧～');
        });
    }
  }

  deleteArticle() {
    if (confirm('确认删除该文章吗？')) {
      reqwest({
        url: `${config.hostname}/api/article/remove`,
        method: 'get',
        type: 'jsonp',
        data: { id: this.props.data._id }
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            toast('删除成功!');
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
    let data = this.props.data;
    let minHeight = data.cover
      ? `${286 / (375 / 10)}rem`
      : `${100 / (375 / 10)}rem`;
    return (
      <div className="card">
        <Lazyload height={minHeight}>
          <a href={data.url}>
            <div className="title">{data.title}</div>
            {data.date ? <div className="date">{data.date}</div> : null}
            {data.cover
              ? <div className="banner">
                  <img src={data.cover} />
                </div>
              : null}
            <div className="desc">{data.desc}</div>
            <div className="all">查看全文<span>&gt;</span></div>
            {this.props.isAuthor
              ? <div className="operation">
                  <Tappable onTap={this.toggleArticle}>
                    <a href="javascript:void(0)">
                      {this.state.isTop ? '取消置顶' : '置顶'}
                    </a>
                  </Tappable>
                  <Tappable onTap={this.deleteArticle}>
                    <a href="javascript:void">删除</a>
                  </Tappable>
                </div>
              : null}
          </a>
        </Lazyload>
      </div>
    );
  }
}

export default PureRender(true)(Card);
