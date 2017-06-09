'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Footer from '../../common/footer/index.js'
import UploadImg from '../../common/uploadImg/index.js'
import Textarea from '../../common/textarea/index.js';
import Input from '../../common/input/index.js';
import Select from '../../common/select/index.js'
import reqwest from 'reqwest'
import {showLoading, hideLoading} from '../../common/utils/loading.js'
import {toast} from '../../common/utils/toast'
import './index.less';
import Tappable from 'react-tappable'
import config from '../../common/config.js'

const PAGE_SIZE = 10;
const hostname = config.hostname
class Index extends Component {
    constructor() {
        super()
        this.state = {
            isRealname: false,
            departments: [],
            showSuccessPage: false,
            imgs: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUploadImg = this.handleUploadImg.bind(this);
        this.setQuestionContent = this.setQuestionContent.bind(this)
        this.setQuestionTitle = this.setQuestionTitle.bind(this)
    }

    componentWillMount() {
        Rem();
        const jInput =  document.getElementById('J_is_realname')
        const isRealname = jInput ? jInput.value === 'true' : false
        this.setState({isRealname})
        if(isRealname) {
            this.initDepartments()
        }
    }

    initDepartments() {
        reqwest({
            url: hostname + '/api/department/all',
            method: 'get',
            type: 'jsonp'
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                this.setState({departments: res.data.data || []})
            } else {
                toast(res.message)
            }
        }).fail((err)=> {
            toast('网络忙，刷新试试吧～')
        });
    }

    setQuestionTitle(result) {
        if(result.valid) {
            this.setState({title: result.value})
        } else {
            this.setState({title: ''})
        }
    }

    setQuestionContent(result) {
        if(result.valid) {
            this.setState({content: result.value})
        } else {
            this.setState({content: ''})
        }
    }

    handleSubmit() {
        const {content, department, title, imgs} = this.state
        if(!department) {
            toast('请选择问题类型！')
            return
        }
        if(!title) {
            toast('请输入提问的标题！')
            return
        }
        if(!content) {
            toast('请输入详细问题内容！')
            return
        }
        showLoading('发布中')
        reqwest({
            url: hostname + '/api/question/add',
            method: 'post',
            type: 'jsonp',
            data: {data: JSON.stringify({department, content, title, imgs})}
        }).then((res)=> {
            hideLoading()
            if(res.code === 0 && res.data) {
                toast('发布成功！')
                window.scrollTo(0, 0)
                this.setState({showSuccessPage: true})
            } else {
                if(res.code === 103) {
                    location.replace(`/login?redirectURL=${encodeURIComponent(location.href)}`);
                }
                toast(res.message)
            }
        }).fail((err)=> {
            hideLoading()
            toast('网路忙，请稍后再试~')
        });
    }

    handleUploadImg(imgs) {
        this.state.imgs = imgs
    }

    render() {
        const {isRealname, showSuccessPage} = this.state;
        let links = [
            {
                url: '/',
                name: '首页',
                className: 'home'
            },
            {
                url: 'javascript:void(0)',
                text: isRealname && !showSuccessPage ? '完成' : '',
                className: isRealname && !showSuccessPage ? 'btn' : '',
                onClick: isRealname && !showSuccessPage ? this.handleSubmit : null
            }
        ]

        let holderHtml = []
        if(!isRealname) {
            holderHtml.push(<div className="unrealname"><span>很抱歉，由于您没有完成实名认证，暂时无法使用"民生答疑"功能，<a href="/smrz">马上去实名认证</a>吧！</span></div>)
        } else {
            if(showSuccessPage) {
                holderHtml.push(<div className="success-page"><span>亲，您的问题已提交成功，相关政府部门人员会及时处理，并且会以短信方式通知您进度，</span>您可以在<a
                    href="/grzx">个人中心-我的答疑</a>查看您提交的问题~</div>)
            } else {
                holderHtml.push(
                    <div className="form-wrap">
                        <Select data={this.state.departments} id="_id" value="name" label='问题类型' required={true} onChange={(did)=> this.setState({department: did})}/>
                        <Input label='标题' required={true}  placeholder='请输入提问的标题...' onChange={this.setQuestionTitle} />
                        <Textarea label='详细内容' required={true} placeholder='请输入详细问题内容...' size='large' onChange={this.setQuestionContent} />
                        <UploadImg onChange={this.handleUploadImg} />
                        <Tappable onTap={this.handleSubmit}><div className="submit">提交</div></Tappable>
                    </div>
                )
            }
        }

        return (
            <div className="wrap">
                <Header data={{title: '民生答疑', links: links}}/>
                <div id="page_main">
                    {holderHtml}
                </div>
                <Footer />
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
