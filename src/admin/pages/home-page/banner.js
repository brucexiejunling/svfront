'use strict'
import { Component } from 'react';
import {Button, Form, FormControl, Switch, Modal} from 'rctui'
import deepEqual from '../../common/utils/deepEqual'
import PureRender from '../../common/mixin/pureRender'

class Banner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            banners: props.data || []
        }
        this.addOne = this.addOne.bind(this)
        this.removeOne = this.removeOne.bind(this)
        this.saveBanners = this.saveBanners.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if(!deepEqual(nextProps.data, this.state.banners)) {
            this.state.banners = nextProps.data
        }
    }

    toggle(active) {
        console.log(active)
    }

    addOne() {
        let banners = [];
        Array.prototype.push.apply(banners, this.state.banners) //使用了pureRender的原因，因此这里必须克隆，而不是直接修改，不然是不会更新的
        banners.push({img: '', url: ''})
        this.setState({
            banners: banners
        })
    }

    removeOne() {
        if(this.state.banners.length === 1) {
            Modal.confirm('删除之后，前台页面将不会展示幻灯片', ()=> {
                this.setState({
                    banners: []
                })
                setTimeout(()=> {
                    this.saveBanners()
                }, 0);
            }, '确认删除？')
        } else {
            let banners = [];
            Array.prototype.push.apply(banners, this.state.banners) //使用了pureRender的原因，因此这里必须克隆，而不是直接修改，不然是不会更新的
            banners.pop();
            this.setState({
                banners: banners
            })
        }
    }

    saveBanners(data) {
        let banners = []
        this.state.banners.forEach((item, idx)=> {
            let img = data[`img${idx}`], url = data[`url${idx}`];
            if(img === undefined) {
                img = item.img
            }
            if(url === undefined) {
                url = item.url
            }
            if(img) {
                banners.push({img, url})
            }
        })
        this.props.onSave && this.props.onSave(banners);
    }

    render () {
        let frames = [];
        this.state.banners.forEach((item, idx)=> {
            frames.push(
                <div className="frame" key={idx}>
                    <div className="title">第{idx+1}帧：</div>
                    <div className="inputs">
                        <FormControl grid={1 / 2} name={"img" + idx}  label="图片链接：" placeholder="请输入有效的图片链接" type="url" value={item.img} />
                        <FormControl grid={1 / 2} name={"url" + idx}  label="点击链接：" placeholder="请输入有效的链接" type="url" value={item.url} />
                    </div>
                </div>
            )
        });
        return (
            <div className='banner'>
                <div className="title">说明：填写图片和点击链接，在前台页面上将会以幻灯片形式展示, 最多可添加10帧</div>
                <div className="main">
                    {frames.length < 10 ? <Button status='primary' onClick={this.addOne}>添加一帧</Button> : null}
                    {frames.length > 0 ? <Button status='danger' onClick={this.removeOne}>删除一帧</Button> : null}
                    <Form buttons={frames.length > 0 ? {submit: "保存"} : {}} layout='aligned' onSubmit={this.saveBanners}>
                        {frames.length > 0 ? frames : null}
                    </Form>
                </div>
            </div>
        )
    }
}

export default PureRender(true)(Banner)
