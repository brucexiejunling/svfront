'use strict'
import { Component } from 'react';
import {Button, Form, FormControl, Modal} from 'rctui'
import {nextUid} from '../../common/utils/string'
import {deepEqual} from '../../common/utils/object'
import PureRender from '../../common/mixin/pureRender.js'
import './types.less'

class Types extends Component {
    constructor(props) {
        super(props)
        this.state = {
            types: props.data || []
        }
        this.addOne = this.addOne.bind(this)
        this.deleteOne = this.deleteOne.bind(this)
        this.save = this.save.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if(!deepEqual(nextProps.data, this.state.types)) {
            this.state.types = nextProps.data;
        }
    }

    addOne() {
        let types = []
        Array.prototype.push.apply(types, this.state.types)
        types.push({name: nextUid(), text: ''})
        this.setState({types})
    }

    deleteOne(name) {
        let types = []
        Array.prototype.push.apply(types, this.state.types)
        Modal.confirm('确定删除该分类吗？删除之后将不可恢复', ()=> {
            if(types.length === 1) {
                this.setState({types: []})
                this.save({})
            } else {
                types.forEach((type, idx)=> {
                    if(type.name === name) {
                        types.splice(idx, 1)
                        return false
                    }
                })
                this.setState({types})
            }
        },'确定删除')
    }

    save(data) {
        const types = this.state.types
        let typeData = []
        Object.keys(data).forEach((key, idx)=> {
           typeData.push({name: types[idx].name, text: data[key]})
        })
        this.setState({types: typeData})
        this.props.onSubmit && this.props.onSubmit(typeData)
    }

    render () {
        let items = []
        let data = {}
        this.state.types.forEach((item, idx)=> {
            data["type" + idx] = item.text
            items.push(<div className="item" key={idx}>
                <FormControl grid={1/1} name={"type" + idx} type="text" required={true} />
                <span className="delete" onClick={()=> this.deleteOne(item.name)}>-</span>
            </div>)
        })
        return (
            <div className='types'>
                <div className="add">
                    <Button status="primary" onClick={this.addOne}>添加分类</Button>
                    <span>提示：增删操作，需点击保存才会生效</span>
                </div>
                <Form button={items.length > 0 ? {submit: "保存"} : {}} layout='stacked' onSubmit={this.save} data={data}>
                    {items}
                </Form>
            </div>
        )
    }
}

export default PureRender(true)(Types)