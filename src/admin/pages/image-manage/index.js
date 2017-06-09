import { Component } from 'react';
import {Modal, Pagination} from 'rctui'
import ReactDOM from 'react-dom';
import reqwest from 'reqwest'
import UploadImg from '../../common/uploadImg/index.js';
import './index.less'
import config from '../../common/config.js'

const hostname = config.hostname
const PAGE_SIZE = 20;
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgs: [],
            currentOffset: 0,
            currentPage: 1,
            total: 0,
            offset: 0
        }
        this.getOnePageImgs = this.getOnePageImgs.bind(this)
        this.handleImgChange = this.handleImgChange.bind(this)
    }

    componentWillMount() {
        const pageSize = PAGE_SIZE
        const offset = this.state.offset
        reqwest({
            url: hostname + '/api/file/list?type=image&env=admin',
            method: 'get',
            type: 'jsonp',
            data: {pageSize, offset}
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                const data = res.data;
                this.setState({
                    imgs: data.data || [],
                    total: data.total
                })
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧～')
        });
    }

    getOnePageImgs(pageIndex) {
        const pageSize = PAGE_SIZE, offset = PAGE_SIZE * (pageIndex - 1)
        reqwest({
            url: hostname + '/api/file/list?type=image&env=admin',
            method: 'get',
            type: 'jsonp',
            data: {offset, pageSize}
        }).then((res)=> {
            if (res.code === 0 && res.data) {
                const data = res.data;
                this.setState({
                    imgs: data.data || [],
                    total: data.total,
                    currentOffset: offset,
                    currentPage: pageIndex
                })
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，请稍后再试～')
        });
    }

    handleImgChange(imgs) {

    }

    render() {
        return (
            <div className="wrap">
                <div className="title">说明：以下是您上传的所有图片，您可以在这里管理这些图片，上传图片请保证大小在200kb以下，您可以在<a target="_blank" href="https://tinypng.com">https://tinypng.com</a>对图片进行压缩处理，这将大大加快访问速度！</div>
                <div className="list">
                    <UploadImg imgs={this.state.imgs} onChange={this.handleImgChange} max={50} />
                    <div className="pagination">
                        {
                            this.state.total > PAGE_SIZE ?
                                <Pagination
                                    page={this.state.currentPage}          // 当前页码，默认为 1
                                    size={PAGE_SIZE}          // 每页显示条数，默认为 20
                                    total={this.state.total}         // 总条目数，默认为 0
                                    onChange={(pageIndex)=> this.getOnePageImgs(pageIndex)}
                                    /> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
