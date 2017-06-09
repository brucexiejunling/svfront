'use strict'
import { Component } from 'react';
import {Button, Form, FormControl, Switch, Modal} from 'rctui'
import deepEqual from '../../common/utils/deepEqual'
import PureRender from '../../common/mixin/pureRender'
import config from '../../common/config.js'

class Feeds extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            feeds: props.data || []
        }
        this.addOne = this.addOne.bind(this)
        this.removeOne = this.removeOne.bind(this)
        this.saveFeeds = this.saveFeeds.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if(!deepEqual(nextProps.data, this.state.feeds)) {
            this.state.feeds = nextProps.data
        }
    }

    toggle(active) {
        console.log(active)
    }

    addOne() {
        let feeds = [];
        Array.prototype.push.apply(feeds, this.state.feeds) //使用了pureRender的原因，因此这里必须克隆，而不是直接修改，不然是不会更新的
        feeds.push('')
        this.setState({
            feeds: feeds
        })
    }

    removeOne() {
        if(this.state.feeds.length === 1) {
            Modal.confirm('删除之后，前台页面将不会展示最新文章动态', ()=> {
                this.setState({
                    feeds: []
                })
                setTimeout(()=> {
                    this.saveFeeds()
                }, 0);
            }, '确认删除？')
        } else {
            let feeds = [];
            Array.prototype.push.apply(feeds, this.state.feeds) //使用了pureRender的原因，因此这里必须克隆，而不是直接修改，不然是不会更新的
            feeds.pop();
            this.setState({
                feeds: feeds
            })
        }
    }

    saveFeeds(data) {
        let feeds = []
        this.state.feeds.forEach((item, idx)=> {
            let url = data[`url${idx}`];
            if(url === undefined) {
                url = item.url
            }
            if(url) {
                let id = this.parseId(url)
                feeds.push(id)
            }
        })
        this.props.onSave && this.props.onSave(feeds);
    }

    parseId(url) {
        let r = new RegExp(name + "=([^\\s=&]+)");
        let matches = url.match(r);
        if(matches && matches.length > 1) {
            return matches[1];
        } else {
            return '';
        }
    }

    render () {
        let frames = [];
        let feeds = this.state.feeds || [];
        feeds.forEach((item, idx)=> {
            let url = item ? `${location.hostname}/wzxq?id=${item}` : ''
            frames.push(
                <div className="frame" key={idx}>
                    <div className="inputs">
                        <FormControl grid={1 / 2} name={"url" + idx}  label="文章链接：" placeholder="请输入有效的文章链接" type="url" value={url} />
                    </div>
                </div>
            )
        });
        return (
            <div className='feeds'>
                <div className="title">说明：您可以从各个栏目下面复制一些文章链接，填入此处，在首页将会展示最新的文章动态</div>
                <div className="main">
                    {frames.length < 10 ? <Button status='primary' onClick={this.addOne}>添加一篇文章</Button> : null}
                    {frames.length > 0 ? <Button status='danger' onClick={this.removeOne}>删除一篇文章</Button> : null}
                    <Form buttons={frames.length > 0 ? {submit: "保存"} : {}} layout='aligned' onSubmit={this.saveFeeds}>
                        {frames.length > 0 ? frames : null}
                    </Form>
                </div>
            </div>
        )
    }
}

export default PureRender(true)(Feeds)
