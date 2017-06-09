'use strict';
import { Component } from 'react';
import Card from './card.js';
class List extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let data = this.props.data;
    let type = this.props.type;
    let list = [];
    data.forEach((item, idx) => {
      list.push(<Card key={idx} data={item} type={type} />);
    });
    return (
      <div className="list">
        {list}
      </div>
    );
  }
}

module.exports = List;