import { Component } from 'react';
import { Button, Modal} from 'rctui'

export default class Item extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const data = this.props.data;
        const user = data.user || {}
        let imgs = []
        if(data.imgs && data.imgs.length > 0) {
            data.imgs.forEach((img, idx)=> {
                imgs.push(<img src={img} />)
            })
        }
        return (
            <div className="item">
                <div className="date">{data.date}</div>
                <div className="person-info group">
                    <div className="title">村民信息</div>
                    <div className="row-inline">
                        <span className="label">姓名：</span>
                        <span className="name">{user.name}</span>
                    </div>
                    <div className="row-inline">
                        <span className="label">性别：</span>
                        <span className="name">{user.gender}</span>
                    </div>
                    <div className="row-inline">
                        <span className="label">年龄：</span>
                        <span className="name">{user.age}</span>
                    </div>
                    <div className="row-inline">
                        <span className="label">手机：</span>
                        <span className="name">{user.phone}</span>
                    </div>
                    <div className="row-inline">
                        <span className="label">身份证号码：</span>
                        <span className="name">{user.idNumber}</span>
                    </div>
                    <div className="row">
                        <span className="label">家庭住址：</span>
                        <span className="name">{user.address}</span>
                    </div>
                </div>
                <div className="consult-info group">
                    <div className="title">病虫害信息</div>
                    <div className="row">
                        <span className="label">病虫害发送生地：</span>
                        <span className="name">{data.area}</span>
                    </div>
                    <div className="row">
                        <span className="label">病虫害内容：</span>
                        <span className="name">{data.content}</span>
                    </div>
                    <div className="row">
                        <span className="label">相关图片：</span>
                        <div className="imgs">{imgs}</div>
                    </div>
                </div>
                <div className="result-info group">
                    <div className="title">处理状态</div>
                    <div className="row">
                        <span className="label">进度：</span>
                        <span className="name">{data.status}</span>
                    </div>
                    <div className="row">
                        <span className="label">结果：</span>
                        <span className="name">{data.result}</span>
                    </div>
                </div>
            </div>
        )
    }
}

