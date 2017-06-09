import { Component } from 'react';
import Tappable from 'react-tappable'

export default class Image extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {url, onDelete, id} = this.props
        return (
            <div className="image">
                <img src={url} alt=""/>
                <Tappable onTap={()=>onDelete && onDelete(id)}><span className="delete-btn">x</span></Tappable>
            </div>
        )
    }
}
