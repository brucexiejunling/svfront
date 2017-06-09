import { Component } from 'react';
import { Button, Modal, Textarea} from 'rctui'

export default class Item extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,
            reason: ''
        }
        this.pass = this.pass.bind(this)
        this.fail = this.fail.bind(this)
        this.handleTextareaChange = this.handleTextareaChange.bind(this)
    }

    pass(id) {
        this.props.onPass && this.props.onPass(id, this.state.reason)
    }

    fail(id) {
        if(!this.state.reason) {
            return false
        } else {
            this.props.onReject && this.props.onReject(id, this.state.reason)
            this.state.reason = ''
            return true
        }
    }

    handleTextareaChange(value) {
        this.state.reason = value
    }

    render() {
        let data = this.props.data
        let genderTxt = '未知'
        if(data.gender === 'male') {
            genderTxt = '男'
        } else if(data.gender === 'female') {
            genderTxt = '女'
        }
        return (
            <div className="item">
                <div className="row">
                    <span className="label">姓名：</span>
                    <span className="name">{data.name}</span>
                </div>
                <div className="row">
                    <span className="label">性别：</span>
                    <span className="name">{genderTxt}</span>
                </div>
                <div className="row">
                    <span className="label">年龄：</span>
                    <span className="name">{data.age}</span>
                </div>
                <div className="row">
                    <span className="label">家庭住址：</span>
                    <span className="name">{data.address}</span>
                </div>
                <div className="row">
                    <span className="label">身份证号码：</span>
                    <span className="name">{data.idNumber}</span>
                </div>
                <div className="operation">
                    <div className="pass" onClick={()=> {
                        Modal.confirm('请仔细核对用户信息是否真实，确定通过"' + data.name + '"的实名认证吗!', ()=> {
                           this.pass(data._id)
                        }, '确定通过？')
                    }}>通过</div>
                    <div className="fail" onClick={()=> {
                        this.setState({modalIsOpen: true})
                    }}>拒绝</div>
                </div>
                <Modal width={500} header="实名审核不通过"
                       isOpen={this.state.modalIsOpen}
                       onClose={() => this.setState({ modalIsOpen: false })}
                       clickaway
                       buttons={{
                        '保存': ()=> {return this.fail(data._id)},
                        '取消': true
                      }}>
                    <div className="create-form">
                           <Textarea rows={3} placeholder={`请输入拒绝"${data.name}"通过认证的原因`} required onChange={this.handleTextareaChange} />
                    </div>
                </Modal>
            </div>
        )
    }
}

