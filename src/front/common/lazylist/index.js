'use strict'
import { Component } from 'react';
import Lazyload from '../lazyload/index.js';

class Lazylist extends Component {
    constructor (props) {
        super(props);
        this.state = {
            enterView: false
        }
    }

    componentWillUpdate() {
        this.state.enterView = false;
    }

    handleEnterView(direction) {
        if(direction === 'toTop' && !this.state.enterView ) {
            this.state.enterView = true;
            this.props.onScrollEnd && this.props.onScrollEnd();
        }
    }

    handleLeaveView(direction) {
        console.log('hidden', direction);
    }

    render () {
        return (
            <div className="lazylist">
                {this.props.children}
                <Lazyload onContentVisible={this.handleEnterView.bind(this)} onContentHidden={this.handleLeaveView.bind(this)}></Lazyload>
            </div>
        )
    }
}

module.exports = Lazylist;
