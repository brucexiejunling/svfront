import React, { Component, PropTypes } from 'react';
import PureRender from '../mixin/pureRender.js';
import classnames from 'classnames';
import './index.less';

class Textarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || '',
      valid: true
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillReceiveProps(newProps) {
    let val = newProps.value || '';
    if (val === this.props.value || !val) {
      return;
    }
    this.setState({ valid: this.validate().valid });
  }

  handleFocus() {
    //this.setState({valid: this.validate().valid})
  }

  handleBlur() {
    let result = this.validate();
    this.setState(result);
    this.props.onChange && this.props.onChange(result);
  }

  handleChange() {
    let result = this.validate();
    this.setState(result);
    this.props.onChange && this.props.onChange(result);
  }

  validate() {
    let val = this.refs.input.value.trim();
    let valid = this.state.valid;
    let min = this.props.min || 0;
    if (this.props.required) {
      valid = val && val.length >= min;
    } else {
      valid = true;
    }
    return { valid: valid, value: val };
  }

  render() {
    let msgClass = classnames('validate-msg', {
      invalid: !this.state.valid,
      valid: this.state.valid && this.state.value && this.props.required
    });

    let textareaClass = this.props.size ? this.props.size : 'normal';
    return (
      <div className="textarea">
        {this.props.label
          ? <label>
              {this.props.required ? <span>*</span> : <span />}
              {this.props.label}
              ：
            </label>
          : null}
        <span className="textarea-wrap">
          <textarea
            className={textareaClass}
            type={this.props.type || 'text'}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
            value={this.state.value}
            ref="input"
          />
          <span className={msgClass}>{!this.state.valid ? 'x' : 'ok'}</span>
        </span>
      </div>
    );
  }
}

export default PureRender(false)(Textarea);
