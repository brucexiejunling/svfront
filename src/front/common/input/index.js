import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import PureRender from '../mixin/pureRender.js'
import './index.less'

let regs = {
    'email': /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
    'url': /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    'number': /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    'text': /^[\w\d_@\.\u4e00-\u9fa5]+$/,
    //'date': /^(\d{4})-(\d{2})-(\d{2})$/,
    'chinese': /^[\u4e00-\u9fa5]+$/,
    'alpha': /^[a-z ._-]+$/i,
    'alphanum': /^[a-z0-9_]+$/i,
    'password': /^[\x00-\xff]+$/,
    'integer': /^[-+]?[0-9]+$/,
    'tel': /^[\d\s ().-]+$/,
    'phone': /^1\d{10}$/,
    'hex': /^#[0-9a-f]{6}?$/i,
    'rgb': new RegExp("^rgb\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*\\)$"),
    'rgba': new RegExp("^rgba\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*((0.[1-9]*)|[01])\\s*\\)$"),
    'hsv': new RegExp("^hsv\\(\\s*(0|[1-9]\\d?|[12]\\d\\d|3[0-5]\\d)\\s*,\\s*((0|[1-9]\\d?|100)%)\\s*,\\s*((0|[1-9]\\d?|100)%)\\s*\\)$")
};

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || '',
            valid: true
        }
        this.handleFocus = this.handleFocus.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }

    componentWillReceiveProps(newProps) {
        let val = newProps.value || '';
        if(val === this.props.value || !val) {return;}
        this.setState({valid: this.validate().valid})
    }


    handleFocus() {
        //this.setState({valid: this.validate().valid})
    }

    handleBlur() {
        let result = this.validate()
        this.setState(result)
        this.props.onChange && this.props.onChange(result);
    }

    handleChange() {
        let result = this.validate()
        this.setState(result)
        this.props.onChange && this.props.onChange(result);
    }

    validate() {
        let val = this.refs.input.value.trim();
        let valid = this.state.valid;
        if(this.props.needValidate) {
            if(!regs[this.props.type].test(val)) {
                valid = false;
            } else {
                valid = true;
            }
        }
        return {value: val, valid: valid}
    }

    render () {
        let msgClass = classnames(
            'validate-msg',
            {
                invalid: !this.state.valid,
                valid: this.state.valid && this.state.value && this.props.needValidate
            }
        );

        let inputClass = this.props.size ? this.props.size : 'middle';
        let style = this.props.inline ? {display: 'inline'} : null;
        return (
            <div className="input" style={style}>
                <label>{this.props.required ? <span>*</span> : <span></span>}{this.props.label}：</label>
                <span className="input-wrap">
                    <input className={inputClass} type={this.props.type || "text"} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} placeholder={this.props.placeholder} value={this.state.value} ref="input"/>
                    <span className={msgClass}>{!this.state.valid ? 'x' : 'ok'}</span>
                </span>
            </div>
        );
    }
}

export default PureRender(false)(Input)
