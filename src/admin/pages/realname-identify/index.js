import { Component } from 'react';
import {Button, Modal, Form, FormControl, Input} from 'rctui'
import ReactDOM from 'react-dom';
import reqwest from 'reqwest'
import Item from './item.js'
import './index.less'
import config from '../../common/config.js'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
        this.passIdentify = this.passIdentify.bind(this)
        this.rejectIdentify = this.rejectIdentify.bind(this)
    }

    componentWillMount() {
        reqwest({
            url: config.hostname + '/api/user/list',
            method: 'get',
            type: 'jsonp',
            data: {
                realnameStatus: 1
            }
        }).then((res)=> {
            if(res.data && res.code === 0) {
                this.setState({
                    data: res.data.data || []
                })
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧～')
        });
    }

    passIdentify(userId) {
        reqwest({
            url: config.hostname + '/api/user/pass',
            method: 'post',
            type: 'json',
            data: {
                userId
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                Modal.alert('已通过')
                this.removeItem(userId)
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，请重试～')
        });
    }

    rejectIdentify(userId, reason) {
        reqwest({
            url: config.hostname + '/api/user/reject',
            method: 'post',
            type: 'json',
            data: {
                userId,
                reason
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                Modal.alert('已拒绝')
                this.removeItem(userId)
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，请重试～')
        });
    }

    removeItem(userId) {
        let users = []
        Array.prototype.push.apply(users, this.state.data)
        users.forEach((item, idx)=> {
            if(item._id === userId) {
                users.splice(idx, 1)
                return false
            }
        })
        this.setState({data: users})
    }

    render() {
        let items = []
        this.state.data.forEach((item, idx)=>{
            items.push(<Item data={item} key={idx} onPass={this.passIdentify} onReject={this.rejectIdentify} />)
        })
        return (
            <div className="wrap">
                <div className="title">说明：以下是用户提交的实名认证申请，您可以在这里进行审核，决定该用户是否通过实名认证</div>
                <div className="list">
                    {items}
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
