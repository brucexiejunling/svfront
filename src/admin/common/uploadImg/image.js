import { Component } from 'react';
import {Button, Modal} from 'rctui'
import Clipboard from 'clipboard';

export default class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            copyBtnCls: 'J_copy_url_btn' + (+new Date())
        };
        this.copyUrl = this.copyUrl.bind(this)
    }

    copyUrl(url) {
        if(!this.clipboard) {
            this.clipboard = new Clipboard('.' + this.state.copyBtnCls);
            this.clipboard.on('success', ()=> {
                Modal.alert('复制成功，在使用的地方直接粘贴即可！')
            });
            this.clipboard.on('error', ()=> {
                Modal.alert('复制失败，请您手动复制一下：' + url);
            });
        }
    }

    render() {
        const {url, onDelete, id} = this.props
        return (
            <div className="image">
                <div className="img">
                    <img src={url} alt=""/>
                </div>
                <div className="opts">
                    <Button status="danger" size="small" onClick={()=>{
                        Modal.confirm('是否确定删除该图片？删除后无法恢复！', ()=> {onDelete && onDelete(id)}, '删除图片？')
                    }}>删除图片</Button>
                    <Button className={this.state.copyBtnCls} data-clipboard-text={url} status="primary" size="small" onClick={this.copyUrl(url)}>复制链接</Button>
                </div>
            </div>
        )
    }
}
