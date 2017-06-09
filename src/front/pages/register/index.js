import { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../../common/header/index.js'
import {getUriQuery} from '../../common/utils/url.js'
import Rem from '../../common/utils/rem.js'
import Input from '../../common/input/index'
import Captcha from '../../common/captcha/index'
import MsgCaptcha from '../../common/msgCaptcha/index'
import {toast} from '../../common/utils/toast'
import {showLoading, hideLoading} from '../../common/utils/loading.js'
import reqwest from 'reqwest'
import Footer from '../../common/footer/index.js'
import Tappable from 'react-tappable'
import config from '../../common/config.js'
import './index.less'

const phoneRegx = /^1\d{10}$/
const passwordRegx = /^[_0-9a-zA-Z]{6,16}$/
const hostname = config.hostname
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phone: '',
            password: '',
            captchaValid: false,
            messageCode: '',
            showSuccessPage: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleMsgCaptchaInput = this.handleMsgCaptchaInput.bind(this)
        this.handlePasswordInput = this.handlePasswordInput.bind(this)
        this.handlePhoneInput = this.handlePhoneInput.bind(this)
        this.handleCaptchaInput = this.handleCaptchaInput.bind(this)
    }

    componentDidMount() {
        Rem()
    }

    handlePhoneInput(result) {
        const phone = result.value
        if(phoneRegx.test(phone)) {
            this.setState({phone})
        } else {
            this.setState({phone: ''})
        }
    }

    handlePasswordInput(result) {
        const password = result.value
        if(passwordRegx.test(password)) {
            this.setState({password})
        } else {
            this.setState({password: ''})
        }
    }

    handleCaptchaInput(result) {
        this.setState({captchaValid: result.valid})
    }

    handleMsgCaptchaInput(result) {
        if(result.valid) {
            this.setState({messageCode: result.value})
        } else {
            this.setState({messageCode: ''})
        }
    }

    handleSubmit() {
        const state = this.state
        if(!state.phone) {
            toast('请输入合法有效的手机号码!')
            return
        }
        if(!state.password) {
            toast('请输入6到16位英文数字或下划线组成的密码!', 3000)
            return
        }
        if(!state.captchaValid) {
            toast('请完成验证码的验证!')
            return
        }
        if(!state.messageCode) {
            toast('请输入6位数短信验证码!')
            return
        }
        showLoading('注册中')
        reqwest({
            url: hostname + '/api/user/register',
            method: 'post',
            type: 'json',
            data: {
                phone: this.state.phone,
                password: this.state.password,
                code: this.state.messageCode
            }
        }).then((res)=> {
            hideLoading()
            if(res.code === 0 && res.data) {
                if(res.data.valid === false) {
                   if(res.data.errCode === 'INVALID' || res.data.errCode === 'INCORRECT') {
                       toast('短信验证码有误, 请重新输入~', 3000)
                   } else {
                       toast('短信验证码已失效, 请重新获取~', 3000)
                   }
                } else {
                    toast('注册成功！')
                    window.scrollTo(0,0)
                    this.setState({showSuccessPage: true})
                }
            } else {
                toast(res.message)
            }
        }).fail((err)=> {
            hideLoading
            toast('网络忙，请稍后再试~')
        });
    }

    render() {
        const links = [{url: '/', name: '首页', className: 'home'}, {}]
        return (
            <div className="wrap">
                <Header data={{title: '注册', links: links}}/>
                <div id="page_main">
                    {!this.state.showSuccessPage ?
                        <div className="form">
                            <Input label="手机" type="phone" placeholder="请输入有效的手机号码" onChange={this.handlePhoneInput} />
                            <Input label="密码" type="password" placeholder="6到16位英文数字或下划线" onChange={this.handlePasswordInput}/>
                            <Captcha onChange={this.handleCaptchaInput} />
                            <MsgCaptcha onChange={this.handleMsgCaptchaInput} phone={this.state.phone} action="register" />
                            <Tappable onTap={this.handleSubmit}><button className="submit-btn">注册</button></Tappable>
                            <div className="login-link">
                                <a href="login">已有账号? 马上登陆</a>
                            </div>
                        </div> : <div className="register-success"><span>恭喜您注册成功！<a href="/login">马上去登陆吧</a></span></div>
                    }
                </div>
                <Footer />
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
