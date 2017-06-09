import { Component } from 'react';
import { Button, Modal} from 'rctui'

export default class Item extends Component {
    constructor(props) {
        super(props)
        this.remove = this.remove.bind(this)
        this.edit = this.edit.bind(this)
    }

    edit(id) {
        this.props.onEditItem && this.props.onEditItem(id)
    }

    remove(id) {
        this.props.onRemoveItem && this.props.onRemoveItem(id)
    }

    render() {
        let data = this.props.data
        let incharges = []
        if(data.incharges) {
            data.incharges.forEach((item, idx)=> {
                incharges.push(<div>
                    <span className="pair"><span className="label">姓名：</span><span className="name">{item.name}</span></span>
                    <span className="pair"><span className="label">拼音：</span><span className="spell">{item.spell}</span></span>
                    <span className="pair"><span className="label">联系方式：</span><span className="phone">{item.phone}</span></span>
                    <span className="pair"><span className="label">职位：</span><span className="position">{item.position}</span></span>
                </div>)
            })
        }
        return (
            <div className="item">
                <div className="row">
                    <span className="label">部门名称：</span>
                    <span className="name">{data.name}</span>
                </div>
                <div className="row">
                    <span className="label">部门简介：</span>
                    <span className="name">{data.desc}</span>
                </div>
                <div className="row">
                    <span className="label">部门办公室：</span>
                    <span className="name">{data.office}</span>
                </div>
                <div className="row">
                    <span className="label">部门负责人：</span>
                    <div className="incharges">
                        {incharges}
                    </div>
                </div>
                <div className="operation">
                    <div className="edit" onClick={()=> this.edit(data._id)}>编辑</div>
                    <div className="delete" onClick={()=> {
                        Modal.confirm('确定删除该部门？删除之后将无法恢复!', ()=> {
                           this.remove(data._id)
                        }, '确定删除')
                    }}>删除</div>
                </div>
            </div>
        )
    }
}

