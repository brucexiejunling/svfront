'use strict'

import { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css';
import Lazylist from '../src/front/common/lazylist/index.js'

class Demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [1,2,3,4,5,6,7,8,9,10]
        }
    }

    loadMoreData() {
        let data = this.state.data;
        Array.prototype.push.apply(data, [1,2,3,4,5,6,7,8,9,10]);
        this.setState({data: data});
    }

  render () {
      let data = this.state.data;
      let items = [];
      data.forEach((item, idx)=> {
         items.push(<div key={idx} style={{height: '100px', border: 'solid 1px', width: '80%', margin: '10px auto'}}>{item}</div>)
      })
    return (
        <div>
            <Lazylist onScrollEnd={this.loadMoreData.bind(this)}>
                {items}
            </Lazylist>
        </div>
    )
  }
}

ReactDOM.render(<Demo />, document.getElementById('page_holder'))
