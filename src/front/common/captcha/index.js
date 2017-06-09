import React, { Component, PropTypes } from 'react';
import Captcha from '../utils/captcha.js'
import classnames from 'classnames'
import Input from '../input/index.js'
import './index.less'

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: true,
            value: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    componentDidMount() {
        this.Code = new Captcha(this._codeImg);
    }

    handleInputChange(result) {
        const {value} = result
        const valid = this.Code.verify(value);
        this.setState({valid: valid, value: value});
        this.props.onChange && this.props.onChange({valid, value})
    }

    render () {
        let msgClass = classnames(
            'validate-msg',
            {
                invalid: !this.state.valid,
                valid: this.state.valid && this.state.value && this.props.required
            }
        );
        return (
            <div className="captcha">
                <Input label='验证码' size='small' inline={true} required={true} onChange={this.handleInputChange}/>
                <span className="code-img" ref={(c)=> this._codeImg = c}></span>
                <span className={msgClass}>{!this.state.valid ? 'x' : 'ok'}</span>
            </div>
        );
    }
}