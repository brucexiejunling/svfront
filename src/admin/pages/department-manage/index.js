import { Component } from 'react';
import {Button, Modal, Form, FormControl, Input} from 'rctui'
import ReactDOM from 'react-dom';
import reqwest from 'reqwest'
import config from '../../common/config.js'
import Item from './item.js'
import './index.less'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createModalIsOpen: false,
            editModalIsOpen: false,
            data: [],
            editData: {}
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.editItem = this.editItem.bind(this)
        this.removeItem = this.removeItem.bind(this)
    }

    componentWillMount() {
        reqwest({
            url: config.hostname + '/api/department/all',
            method: 'get',
            type: 'jsonp',
            data: {}
        }).then((res)=> {
            if(res.code === 0 && res.data) {
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

    editItem(itemId) {
        let items = [], toEdit={};
        Array.prototype.push.apply(items, this.state.data)
        items.forEach((item, idx)=> {
            if(item._id === itemId)  {
                toEdit = item
                return false
            }
        })
        let editData = {
            id: toEdit._id,
            name: toEdit.name,
            desc: toEdit.desc,
            office: toEdit.office,
            name1: toEdit.incharges[0].name,
            spell1: toEdit.incharges[0].spell,
            phone1: toEdit.incharges[0].phone,
            position1: toEdit.incharges[0].position
        }
        if(toEdit.incharges[1]) {
            editData.name2 =  toEdit.incharges[1].name || ''
            editData.spell2 =  toEdit.incharges[1].spell || ''
            editData.phone2 =  toEdit.incharges[1].phone || ''
            editData.position2 =  toEdit.incharges[1].position || ''
        }
        this.setState({
            editData: editData,
            editModalIsOpen: true
        })
    }

    removeItem(itemId) {
        let items = [];
        Array.prototype.push.apply(items, this.state.data)
        items.forEach((item, idx)=> {
            if(item._id === itemId)  {
                items.splice(idx, 1)
                return false
            }
        })
        reqwest({
            url: config.hostname + '/api/department/remove',
            method: 'post',
            type: 'json',
            data: {id: itemId}
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                this.setState({data: items})
                Modal.alert('已删除该部门！')
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('删除失败，请重试！！')
        });
    }

    handleSubmit(data) {
        const {name, desc, office} = data
        let incharges = [{
            name: data.name1,
            spell: data.spell1,
            phone: data.phone1,
            position: data.position1
        }]
        if(data.name2 && data.spell2 && data.phone2) {
            incharges.push({
                name: data.name2,
                spell: data.spell2,
                phone: data.phone2,
                position: data.position2
            })
        }
        reqwest({
            url: config.hostname + '/api/department/add',
            method: 'post',
            type: 'json',
            data: {
                data: JSON.stringify({name, desc, office, incharges})
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                let items = [];
                Array.prototype.push.apply(items, this.state.data)
                items.push({name, desc, office, incharges})
                this.setState({data: items, createModalIsOpen: false})
                Modal.alert('添加成功!')
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('添加失败，请重试！')
        });
    }

    handleSave(data) {
        const {name, desc, office} = data
        let incharges = [{
            name: data.name1,
            spell: data.spell1,
            phone: data.phone1,
            position: data.position1
        }]
        if(data.name2 && data.spell2 && data.phone2) {
            incharges.push({
                name: data.name2,
                spell: data.spell2,
                phone: data.phone2,
                position: data.position2
            })
        }
        reqwest({
            url: config.hostname + '/api/department/save',
            method: 'post',
            type: 'json',
            data: {
                id: data.id,
                data: JSON.stringify({name, desc, office, incharges})
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                let items = [];
                Array.prototype.push.apply(items, this.state.data)
                items.forEach((item, idx)=> {
                    if(item._id === data.id) {
                        items[idx] = {name, desc, office, incharges}
                        return false
                    }
                })
                this.setState({data: items, editModalIsOpen: false})
                Modal.alert('成功修改部门信息!')
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('修改失败，请重试！')
        });
    }

    render() {
        let departments = []
        let items = []
        this.state.data.forEach((item, idx)=>{
            items.push(<Item data={item} key={idx} onEditItem={this.editItem} onRemoveItem={this.removeItem}/>)
        })
        return (
            <div className="wrap">
                <div className="title">说明：以下是所有的部门信息，在这里您可以对这些部门进行管理</div>
                <div className="add-btn"><Button status="primary" onClick={()=> this.setState({createModalIsOpen: true})}>新增部门</Button></div>
                <div className="list">
                    {items}
                </div>
                <Modal width={700} header="新增部门"
                       isOpen={this.state.createModalIsOpen}
                       onClose={() => this.setState({ createModalIsOpen: false })}
                       clickaway
                       buttons={{
                        '保存': 'submit',
                        '取消': true
                      }}>
                    <div className="create-form">
                        <Form data={{}} onSubmit={this.handleSubmit} layout="inline">
                            <FormControl name="name" grid={1/2} required label="部门名称" placeholder='请填写部门名称' type="text" />
                            <FormControl name="desc" grid={7/8} required label="部门简介" placeholder='请填写部门简介，30字以内' max={30} type="text" />
                            <FormControl name="office" grid={1/2} label="部门办公室" placeholder='请填写部门所在办公室' type="text" />
                            <div className="incharges">
                                <div className="">
                                    <div className="title">部门负责人1(至少需要填写一位负责人)：</div>
                                    <FormControl name="name1" grid={1/2} required label="姓名" placeholder='请填写负责人姓名' type="text" />
                                    <FormControl name="spell1" grid={1/2} required label="中文拼音" placeholder='请填写负责人姓名拼音' type="text" />
                                    <FormControl name="phone1" grid={1/2} required  label="联系方式" placeholder='请填写负责人联系方式' type="text" />
                                    <FormControl name="position1" grid={1/2} required  label="职位" placeholder='请填写负责人职位' type="text" />
                                </div>
                                <div className="">
                                    <div className="title">部门负责人2：</div>
                                    <FormControl name="name2" grid={1/2} label="姓名" placeholder='请填写负责人姓名' type="text" />
                                    <FormControl name="spell2" grid={1/2} label="中文拼音" placeholder='请填写负责人姓名拼音' type="text" />
                                    <FormControl name="phone2" grid={1/2}  label="联系方式" placeholder='请填写负责人联系方式' type="text" />
                                    <FormControl name="position2" grid={1/2}  label="职位" placeholder='请填写负责人职位' type="text" />
                                </div>
                            </div>
                        </Form>
                    </div>
                </Modal>
                <Modal width={700} header="修改部门信息"
                       isOpen={this.state.editModalIsOpen}
                       onClose={() => this.setState({ editModalIsOpen: false })}
                       clickaway
                       buttons={{
                        '保存': 'submit',
                        '取消': true
                      }}>
                    <div className="create-form">
                        {this.state.editModalIsOpen ?
                            <Form data={this.state.editData} onSubmit={this.handleSave} layout="inline">
                                <FormControl name="id" type="hidden" />
                                <FormControl name="name" grid={1/2} required label="部门名称" placeholder='请填写部门名称' type="text" />
                                <FormControl name="desc" grid={7/8} required label="部门简介" placeholder='请填写部门简介，30字以内' max={30} type="text" />
                                <FormControl name="office" grid={1/2} label="部门办公室" placeholder='请填写部门所在办公室' type="text" />
                                <div className="incharges">
                                    <div className="">
                                        <div className="title">部门负责人1</div>
                                        <FormControl name="name1" grid={1/2} required label="姓名" placeholder='请填写负责人姓名' type="text" />
                                        <FormControl name="spell1" grid={1/2} required label="中文拼音" placeholder='请填写负责人姓名拼音' type="text" />
                                        <FormControl name="phone1" grid={1/2} required  label="联系方式" placeholder='请填写负责人联系方式' type="text" />
                                        <FormControl name="position1" grid={1/2} required  label="职位" placeholder='请填写负责人职位' type="text" />
                                    </div>
                                    <div className="">
                                        <div className="title">部门负责人2：</div>
                                        <FormControl name="name2" grid={1/2} label="姓名" placeholder='请填写负责人姓名' type="text" />
                                        <FormControl name="spell2" grid={1/2} label="中文拼音" placeholder='请填写负责人姓名拼音' type="text" />
                                        <FormControl name="phone2" grid={1/2}  label="联系方式" placeholder='请填写负责人联系方式' type="text" />
                                        <FormControl name="position2" grid={1/2}  label="职位" placeholder='请填写负责人职位' type="text" />
                                    </div>
                                </div>
                            </Form> : null
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
