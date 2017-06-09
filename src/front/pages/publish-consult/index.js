'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Rem from '../../common/utils/rem.js';
import Header from '../../common/header/index.js';
import Footer from '../../common/footer/index.js'
import UploadImg from '../../common/uploadImg/index.js'
import Textarea from '../../common/textarea/index.js';
import Input from '../../common/input/index.js';
import Tappable from 'react-tappable'
import Select from '../../common/select/index.js'
import reqwest from 'reqwest'
import {toast} from '../../common/utils/toast'
import {showLoading, hideLoading} from '../../common/utils/loading.js'
import config from '../../common/config.js'
import './index.less';

const PAGE_SIZE = 10;
const hostname = config.hostname
class Index extends Component {
    constructor() {
        super()
        this.state = {
            isRealname: false,
            departments: [],
            imgs: [],
            showSuccessPage: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUploadImg = this.handleUploadImg.bind(this);
        this.setConsultArea = this.setConsultArea.bind(this)
        this.setConsultContent = this.setConsultContent.bind(this)
        this.setConsultTitle = this.setConsultTitle.bind(this)
    }

    componentWillMount() {
        Rem();
        const isRealname = document.getElementById('J_is_realname').value === 'true'
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

    setConsultArea(result) {
        if(result.valid) {
            this.setState({area: result.value})
        } else {
            this.setState({area: ''})
        }
    }

    setConsultTitle(result) {
        if(result.valid) {
            this.setState({title: result.value})
        } else {
            this.setState({title: ''})
        }
    }

    setConsultContent(result) {
        if(result.valid) {
            this.setState({content: result.value})
        } else {
            this.setState({content: ''})
        }
    }

    handleSubmit() {
        const {area, content, title, department, imgs} = this.state
        if(!department) {
            toast('请选择信访类型！')
            return
        }
        if(!area) {
            toast('请输入问题发生的详细地址！')
            return
        }
        if(!title) {
            toast('请输入详细信访标题！')
            return
        }
        if(!content) {
            toast('请输入详细信访内容！')
            return
        }
        showLoading('发布中')
        reqwest({
            url: hostname + '/api/consult/add',
            method: 'get',
            type: 'jsonp',
            data: {data: JSON.stringify({department, area, title, content, imgs})}
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
                url: '/zxxf',
                name: '返回',
                className: 'back'
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
            holderHtml.push(<div className="unrealname"><span>很抱歉，由于您没有完成实名认证，暂时无法使用"在线信访"功能，<a href="/smrz">马上去实名认证</a>吧！</span></div>)
        } else {
            if(showSuccessPage) {
                holderHtml.push(<div className="success-page"><span>亲，您的信访已提交发布，相关政府部门人员会及时处理，并且会以短信方式通知您进度，</span>您可以在<a
                    href="/grzx">个人中心-我的信访</a>查看您提交的信访~</div>)
            } else {
                holderHtml.push(
                    <div className="form-wrap">
                        <Select data={this.state.departments} id="_id" value="name" label='信访类型' required={true} onChange={(did)=> this.setState({department: did})}/>
                        <Textarea label='问题发生地' placeholder='请输入问题发生的详细地址...' required={true} onChange={this.setConsultArea}/>
                        <Input label='信访标题' required={true} placeholder='请输入信访标题...' onChange={this.setConsultTitle} />
                        <Textarea label='信访内容' required={true} placeholder='请输入信访内容...' size='large' onChange={this.setConsultContent} />
                        <UploadImg onChange={this.handleUploadImg} />
                        <Tappable onTap={this.handleSubmit}><div className="submit">发布</div></Tappable>
                    </div>
                )
            }
        }

        return (
            <div className="wrap">
                <Header data={{title: '发布信访', links: links}}/>
                <div id="page_main">
                    {holderHtml}
                </div>
                <Footer />
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
