'use strict'
import { Component } from 'react';
import Card from '../card/index.js';
import './index.less';
class Feeds extends Component {
    render () {
        let data = this.props.data;
        let list = [];
        data.forEach((item, idx)=> {
            list.push(<Card key={idx} data={item}/>)
        })
        return (
            <div className="feeds">
                {list}
            </div>
        )
    }
}

module.exports = Feeds;
