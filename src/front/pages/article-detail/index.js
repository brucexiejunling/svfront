import { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../../common/header/index.js';
import Textarea from '../../common/textarea/index.js';
import { getUriQuery } from '../../common/utils/url.js';
import Rem from '../../common/utils/rem.js';
import { showLoading, hideLoading } from '../../common/utils/loading.js';
import TopBtn from '../../common/2top/index.js';
import Tappable from 'react-tappable';
import { toast } from '../../common/utils/toast.js';
import reqwest from 'reqwest';
import Footer from '../../common/footer/index.js';
import config from '../../common/config.js';
import './index.less';

const hostname = config.hostname;
const articleId = getUriQuery('id');
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {},
      comment: ''
    };
    this.handleComment = this.handleComment.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentWillMount() {
    this.getArticle(articleId, data => {
      this.setState({ article: data });
    });
  }

  componentDidMount() {
    Rem();
  }

  getArticle(id, callback) {
    showLoading();
    reqwest({
      url: hostname + '/api/article/get',
      method: 'get',
      type: 'jsonp',
      data: { id }
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          callback && callback(res.data);
        } else {
          toast(res.message);
        }
      })
      .fail(err => {
        hideLoading();
        toast('加载文章数据失败，刷新试试吧～');
      });
  }

  handleInput(val) {
    this.state.comment = val.value;
  }

  handleComment() {
    if (!this.state.comment) {
      return;
    }
    reqwest({
      url: hostname + '/api/article/comment',
      method: 'get',
      type: 'jsonp',
      data: { id: articleId, content: this.state.comment }
    })
      .then(res => {
        hideLoading();
        if (res.code === 0 && res.data) {
          toast('评论成功！');
          setTimeout(
            () => {
              this.getArticle(articleId, data => {
                this.setState({ article: data });
              });
            },
            1000
          );
        } else {
          toast(res.message);
        }
      })
      .fail(err => {
        hideLoading();
        toast('评论失败，请稍后再试！');
      });
  }

  render() {
    let keywordsEl = [];
    const article = this.state.article;
    const keywords = article.keywords || [];
    keywords.forEach((kw, idx) => {
      keywordsEl.push(<span className="keyword" key={idx}>{kw}</span>);
    });

    const links = [
      {
        url: document.referrer ? document.referrer : '/',
        name: document.referrer ? '返回' : '首页',
        className: document.referrer ? 'back' : 'home'
      },
      {}
    ];
    let comments = [];
    let bgs = [
      '#00c09b',
      '623db1',
      '#666',
      '#b9a5e4',
      '#de477a',
      '#0d8ea9',
      '#bbb30f',
      '#de8447',
      '#de477a',
      '#7385d4'
    ];
    if (article.comments) {
      article.comments.forEach((item, idx) => {
        comments.push(
          <div className="item" key={idx}>
            <span
              className="name"
              style={{ background: bgs[parseInt(Math.random() * 10)] }}
            >
              {item.user.name}
            </span>
            <span className="content">{item.content}</span>
            <div className="time">{item.time}</div>
          </div>
        );
      });
    }
    return (
      <div className="wrap">
        <Header data={{ title: '文章详情', links: links }} />
        <div className="main" id="page_main">
          <div className="detail">
            <div className="title">{article.title}</div>
            {keywordsEl.length > 0
              ? <div className="keywords">{keywordsEl}</div>
              : null}
            {article.date ? <div className="date">{article.date}</div> : null}
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            {article.showAuthorInfo && article.author
              ? <div className="author-info">
                  <div className="name">作者：{article.author.name}</div>
                  <div className="position">职位：{article.author.position}</div>
                  <div className="company">企业：{article.author.company}</div>
                </div>
              : null}
          </div>
          {article.author
            ? <div className="comment-part">
                <div className="comment-input">
                  <Textarea
                    placeholder="说说你的想法吧！"
                    onChange={this.handleInput}
                  />
                  <Tappable onTap={this.handleComment}>
                    <div className="comment-btn">评论</div>
                  </Tappable>
                </div>
                <div className="comment-list">
                  {comments}
                </div>
              </div>
            : null}
        </div>
        <Footer />
        <TopBtn />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
