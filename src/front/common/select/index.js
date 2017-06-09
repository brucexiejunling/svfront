import {Component} from 'react'
import classnames from 'classnames'
import PureRender from '../mixin/pureRender.js';
import './index.less'

class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: '',
            valid: true,
        }
        this.selectOption =  this.selectOption.bind(this)
    }

    selectOption() {
        let value = this._select.value
        this.setState({selected: value, valid: !!value})
        value && this.props.onChange && this.props.onChange(value)
    }

    render () {
        const data = this.props.data || [];
        const id = this.props.id || 'id'
        const value = this.props.value || 'name'
        let options = []
        options.push(<option className="option" value=''>请选择</option>)
        data.forEach((item, idx)=> {
            options.push(<option className="option" key={idx} value={item[id]}>{item[value]}</option>)
        })

        let msgClass = classnames(
            'validate-msg',
            {
                invalid: !this.state.valid,
                valid: this.state.valid && this.state.selected && this.props.required
            }
        );
        return (
            <div className="select">
                {this.props.label ? <label>{this.props.required ? <span>*</span> : <span></span>}{this.props.label}：</label> : null}
                <div className='select-wrap'>
                    <span className="triangle"><span className="top"></span><span className="bottom"></span></span>
                    <select ref={(c)=> this._select=c} onFocus={this.selectOption} onChange={this.selectOption}>{options}</select>
                    <span className={msgClass}>{!this.state.valid ? 'x' : 'ok'}</span>
                </div>
            </div>
        );
    }
}

export default PureRender(true)(Select)
