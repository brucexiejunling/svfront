import React, { Component, PropTypes } from 'react';
import Input from '../input/index.js'
import {toast} from '../../common/utils/toast'
import reqwest from 'reqwest'
import './index.less'
import Tappable from 'react-tappable'
import config from '../config.js'
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: props.phone,
            btnText: '获取验证码',
            btnCls: 'get-btn',
            btnIsDisabled: false,
            countDown: 60
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.getCaptchaCode = this.getCaptchaCode.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.phone !== this.props.phone) {
            this.state.phone = nextProps.phone
        }
    }

    handleInputChange(result) {
        const valid = /^\d{6}$/.test(result.value)
        const value = result.value;
        this.props.onChange && this.props.onChange({valid, value})
    }

    getCaptchaCode() {
        if(!this.state.phone) {
            toast('请输入您的手机号码～')
            return
        }
        if(this.state.btnIsDisabled) {return}
        reqwest({
            url: config.hostname + '/api/message/captcha',
            method: 'get',
            type: 'jsonp',
            data: {
                phone: this.state.phone,
                action: this.props.action || ''
            }
        }).then((res)=> {
            if(res.code !== 0) {
                toast(res.message)
            } else {
                this.setState({
                    btnCls: 'get-btn disabled',
                    btnText: `${this.state.countDown}s后重新获取`,
                    btnIsDisabled: true
                })
                this.countDown()
            }
        }).fail((err)=> {
            console.log('err', err)
        });
    }

    countDown() {
        let lastTime = +new Date(), currentTime;
        let interval = setInterval(()=> {
            currentTime = +new Date()
            if(currentTime - lastTime >= 1000) {
                lastTime = currentTime
                let state = this.state
                if(state.countDown <= 1) {
                    state.btnText = '获取验证码'
                    state.btnCls = 'get-btn'
                    state.btnIsDisabled = false
                    state.countDown = 60
                    clearInterval(interval)
                } else {
                    state.btnText = `${--state.countDown}s后重新获取`;
                }
                this.setState(state)
            }
        }, 200)
    }

    render () {
        return (
            <div className="msg-captcha">
                <Input label='短信验证码' size='small' inline={true} required={true} onChange={this.handleInputChange}/>
                <Tappable onTap={this.getCaptchaCode}><button className={this.state.btnCls}>{this.state.btnText}</button></Tappable>
            </div>
        );
    }
}