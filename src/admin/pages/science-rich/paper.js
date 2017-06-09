'use strict'
import { Component } from 'react';
import {Input, Button, Modal} from 'rctui'
import reqwest from 'reqwest';

const page = 'kjzf', tab = 'paper';
const regx = new RegExp(
    '^' +
        // protocol identifier
    '(?:(?:https?|ftp)://)?' + // ** mod: make scheme optional
        // user:pass authentication
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
        // IP address exclusion
        // private & local networks
        // '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +   // ** mod: allow local networks
        // '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +  // ** mod: allow local networks
        // '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +  // ** mod: allow local networks
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
        // host name
    '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
        // domain name
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
        // TLD identifier
    '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
    ')' +
        // port number
    '(?::\\d{2,5})?' +
        // resource path
    '(?:/\\S*)?' +
    '$', 'i'
)
export default class Paper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initUrl: this.props.url,
            url: this.props.url
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        nextProps.url !== this.state.initUrl && this.setState({initUrl: nextProps.url, url: nextProps.url})
    }
    handleInputChange(value) {
        this.setState({url: value})
    }
    handleSubmit() {
        const url = this.state.url
        if(url === this.state.initUrl) {
            return
        }
        if(!regx.test(url)) {
            Modal.alert('请输入有效的链接！', '错误提示')
            return
        }
        this.props.onSaveUrl && this.props.onSaveUrl(url)
    }
    render() {
        return(
            <div className="paper">
                <div className="title">请填写当地报社链接:</div>
                <Input
                    type="url"
                    placeholder="请填写有效的链接地址"
                    onChange={this.handleInputChange}
                    size="large"
                    value={this.state.initUrl}
                    grid={2/3}
                    required
                    />
                <Button status="primary" onClick={this.handleSubmit}>保存</Button>
            </div>
        )
    }
}
