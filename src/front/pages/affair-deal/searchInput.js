'use strict'
import { Component } from 'react';
import PureRender from '../../common/mixin/pureRender.js'
import './searchInput.less';
import Tappable from 'react-tappable'

class SearchInput extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: this.props.defaultValue
        }
        this.handleInput = this.handleInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleClear = this.handleClear.bind(this)
    }

    componentWillReceiveProps(nextProps) {
       if(!nextProps.defaultValue) {
           this.setState({value: ''});
       }
    }

    handleInput() {
       this.setState({
           value: this._input.value
       })
    }

    handleSubmit() {
        if(this.state.value) {
            this.props.onSearch && this.props.onSearch(this.state.value);
        }
    }

    handleClear() {
        this.setState({value: ''});
        this.props.onClear && this.props.onClear();
    }

    render () {
        let btnCls = this.state.value ? 'delete' : 'delete hidden';
        return (
            <div className="search-input">
                <input type="text" ref={(c)=> this._input = c} placeholder={this.props.placeholder} onChange={this.handleInput} value={this.state.value}/>
                <Tappable onTap={this.handleClear}><button className={btnCls}>x</button></Tappable>
                <Tappable onTap={this.handleSubmit}><button className="search"></button></Tappable>
            </div>
        )
    }
}

export default PureRender(false)(SearchInput)

