'use strict'
import { Component } from 'react';
import './index.less';

export default class Footer extends Component {
    constructor (props) {
        super(props)
    }

    componentDidMount() {
        let mainEl = document.getElementById('page_main');
        if(mainEl) {
            const winHeight = window.innerHeight || document.documentElement.clientHeight;
            const winWidth = window.innerWidth || document.documentElement.clientWidth;
            mainEl.style.minHeight = `${winHeight - 100/(375/winWidth)}px`;
        }
    }

    render () {
        return (
            <div className="footer" id="footer">
                <div className="operation">
                    <span>运营：</span><span>江西子墨文化创意有限公司</span>
                </div>
            </div>
        )
    }
}
