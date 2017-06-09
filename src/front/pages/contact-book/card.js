'use strict'
import { Component } from 'react';
import './card.less';
import PureRender from '../../common/mixin/pureRender.js';
import Lazyload from '../../common/lazyload/index.js';

class Card extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        let data = this.props.data;
        let minHeight = `${100/(375/10)}rem`;
        return (
                <div className="card">
                    <Lazyload height={minHeight}>
                    <a href={data.url ? data.url : 'javascript:void(0)'}>
                        <div className="name">姓名：{data.name}</div>
                        <div className="gender">性别：{data.gender}</div>
                        <div className="age">年龄：{data.age}</div>
                        <div className="phone">电话：{data.phone}</div>
                        <div className="address">地址：{data.address}</div>
                        <div className="department">部门：{data.department ? data.department.name : ''}</div>
                        <div className="position">职位：{data.position}</div>
                    </a>
                    </Lazyload>
                </div>
        )
    }
}

export default PureRender(true)(Card)
