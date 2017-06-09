import { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../../common/header/index.js'
import {getUriQuery} from '../../common/utils/url.js'
import Rem from '../../common/utils/rem.js'
import Input from '../../common/input/index'
import Footer from '../../common/footer/index.js'
import Textarea from '../../common/textarea/index'
import Captcha from '../../common/captcha/index'
import MsgCaptcha from '../../common/msgCaptcha/index'
import {showLoading, hideLoading} from '../../common/utils/loading.js'
import {toast} from '../../common/utils/toast'
import reqwest from 'reqwest'
import Tappable from 'react-tappable'
import config from '../../common/config.js'
import './index.less'

const phoneRegx = /^1\d{10}$/
const hostname = config.hostname
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phone: '',
            name: '',
            age: '',
            gender: '',
            idNumber: '',
            address: '',
            captchaValid: false,
            messageCode: '',
            showSuccessPage: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleMsgCaptchaInput = this.handleMsgCaptchaInput.bind(this)
        this.handlePhoneInput = this.handlePhoneInput.bind(this)
        this.handleNameInput = this.handleNameInput.bind(this)
        this.handleAgeInput = this.handleAgeInput.bind(this)
        this.handleIdNumberInput = this.handleIdNumberInput.bind(this)
        this.handleAddressInput = this.handleAddressInput.bind(this)
        this.handleCaptchaInput = this.handleCaptchaInput.bind(this)
        this.handleRadioClick = this.handleRadioClick.bind(this)
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

    handleNameInput(result) {
        const name = result.value
        this.setState({name})
    }

    handleAgeInput(result) {
        const age = result.value
        this.setState({age})
    }

    handleIdNumberInput(result) {
        const idNumber = result.value
        this.setState({idNumber})
    }

    handleAddressInput(result) {
        const address = result.value
        this.setState({address})
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

    handleRadioClick() {
        if(this._maleRadio.checked)  {
            this.setState({gender: 'male'})
        } else if(this._femaleRadio.checked) {
            this.setState({gender: 'female'})
        }
    }

    handleSubmit() {
        const {name, gender, age, phone, idNumber, address, messageCode, captchaValid} = this.state
        if(!name) {
            toast('请输入您的真实姓名', 3000)
            return
        }
        if(!gender) {
            toast('请输入您的真实性别', 3000)
            return
        }
        if(!age) {
            toast('请输入您的真实年龄', 3000)
            return
        }
        if(!phone) {
            toast('请输入合法有效的手机号码!')
            return
        }
        if(!idNumber) {
            toast('请输入您的身份证号码', 3000)
            return
        }
        if(!address) {
            toast('请输入您的详细家庭住址', 3000)
            return
        }
        if(!captchaValid) {
            toast('请完成验证码的验证!')
            return
        }
        if(!messageCode) {
            toast('请输入6位数短信验证码!')
            return
        }
        let data = {name, gender, age, phone, address, idNumber}
        data.code = messageCode
        showLoading('提交中')
        reqwest({
            url: hostname + '/api/user/identify',
            method: 'post',
            type: 'json',
            data: data
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
                    toast('提交成功!')
                    window.scrollTo(0, 0)
                    this.setState({showSuccessPage: true})
                }
            } else {
                toast(res.message)
            }
        }).fail((err)=> {
            hideLoading()
            toast('网络忙，请稍后再试~')
        });
    }

    render() {
        const links = [{url: document.referrer ? document.referrer : '/', name: document.referrer ? '返回' : '首页', className: document.referrer ? 'back' : 'home'}, {}]
        let maleRadio = [this.state.gender === 'male' ? <input id="male" ref={(c)=> this._maleRadio = c} type="radio" name="gender" value="male" checked="checked"/> : <input id="male" ref={(c)=> this._maleRadio = c} type="radio" name="gender" value="male" />]
        let femaleRadio = [this.state.gender === 'female' ? <input id="female" ref={(c)=> this._femaleRadio = c} type="radio" name="gender" value="female" checked="checked"/> : <input id="female" ref={(c)=> this._femaleRadio = c} type="radio" name="gender" value="female" />]
        return (
            <div className="wrap">
                <Header data={{title: '实名认证', links: links}}/>
                <div id="page_main">
                    {!this.state.showSuccessPage ?
                        <div className="form">
                            <Input label="姓名" type="text" placeholder="请输入您的真实姓名" onChange={this.handleNameInput} />
                            <div className="row">
                                <label>性别：</label>
                            <span className="radio-wrap" onClick={this.handleRadioClick} onTouchEnd={this.handleRadioClick}>
                                <span className="radio"><label for="male">男</label>{maleRadio}</span>
                                <span className="radio"><label for="female">女</label>{femaleRadio}</span>
                            </span>
                            </div>
                            <Input label="年龄" type="text" placeholder="请输入您的真实年龄" onChange={this.handleAgeInput} />
                            <Input label="手机" type="phone" placeholder="请输入有效的手机号码" onChange={this.handlePhoneInput} />
                            <Input label="身份证" type="text" placeholder="请输入您的身份证号码" onChange={this.handleIdNumberInput}/>
                            <Textarea label="家庭住址" type="text" placeholder="请输入您的详细家庭住址" onChange={this.handleAddressInput}/>
                            <Captcha onChange={this.handleCaptchaInput} />
                            <MsgCaptcha onChange={this.handleMsgCaptchaInput} phone={this.state.phone} />
                            <Tappable onTap={this.handleSubmit}><button className="submit-btn">提交认证</button></Tappable>
                        </div> : <div className="submit-success"><span>您已成功提交实名认证，请等待工作人员审核～</span></div>
                    }
                </div>
                <Footer />
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('page_holder'));
