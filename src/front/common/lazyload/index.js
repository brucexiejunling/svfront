import React, { Component, PropTypes } from 'react'
import { addLazyload, removeLazyload } from '../utils/lazyload'

export default class Lazyload extends Component {
    constructor (props) {
        super(props)
        this.simpleMode = !this.props.onContentVisible && !this.props.onContentHidden;
        this.state = {
            isRender: false
        }
    }

    componentDidMount () {
        this._lazyId = addLazyload(this, {offsetBottom: 200})
    }

    componentWillUnmount () {
        removeLazyload(this._lazyId)
    }

    onContentVisible (direction) {
        this.props.onContentVisible && this.props.onContentVisible(direction);
        this.setState({ isRender: true })
    }

    onContentHidden(direction) {
        this.props.onContentHidden && this.props.onContentHidden(direction);
    }

    render () {
        const { isRender } = this.state
        const { children, placeholder, height } = this.props
        let style = {minHeight: height || 1}

        let innerHtml = null;
        if(!isRender && placeholder) {
            innerHtml = placeholder;
        } else if(isRender) {
            innerHtml = children;
        }

        return (
            <div className="lazyload" style={style}>{innerHtml}</div>
        )

    }
}
