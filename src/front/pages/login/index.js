import { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../../common/header/index.js'
import Footer from '../../common/footer/index.js'
import {getUriQuery} from '../../common/utils/url.js'
import Rem from '../../common/utils/rem.js'
import Input from '../../common/input/index.js'
import Captcha from '../../common/captcha/index.js'
import {toast} from '../../common/utils/toast'
import Tappable from 'react-tappable';
import {showLoading, hideLoading} from '../../common/utils/loading.js'
import reqwest from 'reqwest'
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
            captchaValid: false
        }
        this.handlePhoneInput = this.handlePhoneInput.bind(this)
        this.handlePasswordInput = this.handlePasswordInput.bind(this)
        this.handleCaptchaInput = this.handleCaptchaInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        Rem()
    }

    handlePhoneInput(result) {
       if(phoneRegx.test(result.value)) {
           this.setState({phone: result.value})
       } else {
           this.setState({phone: ''})
       }
    }

    handlePasswordInput(result) {
       if(passwordRegx.test(result.value)) {
           this.setState({password: result.value})
       } else {
           this.setState({password: result.value})
       }
    }

    handleCaptchaInput(result) {
        this.setState({captchaValid: result.valid})
    }

    handleSubmit() {
        if(!this.state.phone) {
            toast('请输入有效的手机号码!')
            return
        }
        if(!this.state.password) {
            toast('请输入由英文数字或下划线组成的16位密码!', 3000)
            return
        }
        if(!this.state.captchaValid) {
            toast('请完成验证码验证！')
            return
        }
        showLoading('登录中')
        reqwest({
            url: hostname + '/api/user/login',
            method: 'post',
            type: 'json',
            data: {
                account: this.state.phone,
                password: this.state.password
            }
        }).then((res)=> {
            hideLoading()
            if(res.code === 0 && res.data) {
                this.loginRedirect()
            } else {
                toast(res.message)
            }
        }).fail((err)=> {
            hideLoading()
            toast('网络忙，请稍后再试~')
        });
    }

    loginRedirect() {
        let redirectUrl = getUriQuery('redirectURL') ? decodeURIComponent(getUriQuery('redirectURL')) : '/grzx'
        window.location = redirectUrl
    }

    render() {
        const links = [{url: '/', name: '首页', className: 'home'}, {}]
        return (
            <div className="wrap">
                <Header data={{title: '登陆', links: links}}/>
                <div id="page_main">
                    <div className="form">
                        <Input label="手机" type="phone" placeholder="请输入您的手机号码" onChange={this.handlePhoneInput}/>
                        <Input label="密码" type="password" placeholder="请输入您的密码" onChange={this.handlePasswordInput}/>
                        <Captcha onChange={this.handleCaptchaInput} />
                        <Tappable onTap={this.handleSubmit}><button>登陆</button></Tappable>
                        <div className="register-link">
                            <a href="register">快速注册</a>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
