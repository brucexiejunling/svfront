'use strict'
import { Component } from 'react';
import './index.less';

class ToTop extends Component {
    constructor (props) {
        super(props);
    }

    componentDidMount() {
        let topEl = document.createElement('div');
        topEl.setAttribute('id', 'top');
        document.body.insertBefore(topEl, document.getElementById('page_holder'));
    }

    render () {
        return (
            <div className="to-top">
                <a href="#top"></a>
            </div>
        )
    }
}

module.exports = ToTop;
