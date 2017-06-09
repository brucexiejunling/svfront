'use strict';
import { Component } from 'react';
import Card from '../../common/card/index.js';
import './index.less';
class List extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {data, type} = this.props;
    let list = [];
    data.forEach((item, idx) => {
      list.push(<Card key={idx} data={item} isAuthor={type === 'my'}/>);
    });
    return (
      <div className="list">
        {list}
      </div>
    );
  }
}

module.exports = List;
