'use strict';
import { Component } from 'react';
import Card from '../../common/issueCard/index.js';
import './index.less';
class List extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {data, type} = this.props;
    let list = [];
    data.forEach((item, idx) => {
      if(item.isMy) {
        list.push(<Card key={idx} data={item} type={this.props.type} mode='write' deletable={true} />);
      } else {
        list.push(<Card key={idx} data={item} type={this.props.type} mode='write' />);
      }
    });
    return (
      <div className="list">
        {list}
      </div>
    );
  }
}

module.exports = List;
