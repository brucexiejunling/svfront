'use strict';
import { Component } from 'react';
import Card from '../../common/issueCard/index.js';
import './index.less';
class List extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let data = this.props.data;
    let list = [];
    data.forEach((item, idx) => {
      list.push(<Card key={idx} data={item} type="disaster" mode='read' deletable={true} />);
    });
    return (
      <div className="list">
        {list}
      </div>
    );
  }
}

module.exports = List;