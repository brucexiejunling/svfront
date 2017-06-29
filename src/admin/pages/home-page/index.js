'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Tab from '../../common/tab/index.js';
import { Modal, Textarea, Button } from 'rctui';
import Banner from './banner.js';
import Feeds from './Feeds.js';
import Article from './article.js';
import classnames from 'classnames';
import reqwest from 'reqwest';
import config from '../../common/config.js';
import './index.less';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banners: [],
      feeds: [],
      desc: ''
    };
    this.saveBanners = this.saveBanners.bind(this);
    this.saveFeeds = this.saveFeeds.bind(this);
    this.saveDesc = this.saveDesc.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
  }

  componentWillMount() {
    reqwest({
      url: config.hostname + '/api/page/get',
      method: 'get',
      type: 'jsonp',
      data: {
        name: 'home'
      }
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          let data = res.data;
          this.setState({
            banners: data.banners,
            feeds: data.feeds,
            desc: data.desc
          });
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('网络忙，刷新试试吧～');
      });
  }

  handleTextareaChange(value) {
    this.setState({ desc: value });
  }

  saveDesc() {
    reqwest({
      url: config.hostname + '/api/page/save',
      method: 'post',
      type: 'json',
      data: {
        name: 'home',
        data: JSON.stringify({ desc: this.state.desc })
      }
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          Modal.alert('保存成功！');
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('保存失败，请重试~');
      });
  }

  saveBanners(banners) {
    reqwest({
      url: config.hostname + '/api/page/save',
      method: 'post',
      type: 'json',
      data: {
        name: 'home',
        data: JSON.stringify({ banners })
      }
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          Modal.alert('保存成功！');
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('网络忙，刷新试试吧～');
      });
  }

  saveFeeds(feeds) {
    reqwest({
      url: config.hostname + '/api/page/save',
      method: 'post',
      type: 'json',
      data: {
        name: 'home',
        data: JSON.stringify({ feeds })
      }
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          Modal.alert('保存成功！');
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('网络忙，刷新试试吧～');
      });
  }

  render() {
    return (
      <div className="wrap">
        <div className="desc-part">
          <div className="title">政府简介</div>
          <div className="desc-wrap">
            <div className="title">说明：您可以编辑政府相关信息介绍，将会在网站首页简介一栏展示</div>
            <div className="main">
              <Textarea
                grid={3 / 4}
                placeholder="请输入简介，200字以内..."
                value={this.state.desc}
                onChange={this.handleTextareaChange}
              />
              <div className="btn-row">
                <Button status="primary" onClick={this.saveDesc}>保存</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="banner-part">
          <div className="title">幻灯片管理</div>
          <div className="banner-wrap">
            <Banner data={this.state.banners} onSave={this.saveBanners} />
          </div>
        </div>
        <div className="article-part">
          <div className="title">文章管理</div>
          <div className="article-wrap">
            <Article />
          </div>
        </div>
        {/*<div className="feeds-part">
                    <div className="title">最新动态</div>
                    <div className="feeds-wrap">
                        <Feeds data={this.state.feeds} onSave={this.saveFeeds} />
                    </div>
                </div>*/}
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
