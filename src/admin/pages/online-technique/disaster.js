'use strict'
import { Component } from 'react';
import {Modal, Pagination} from 'rctui'
import reqwest from 'reqwest';
import Item from './item.js'
import config from '../../common/config.js'
const hostname = config.hostname
const page = 'njzx', tab = 'disaster', PAGE_SIZE = 5;
export default class Disaster extends Component {
    constructor(props) {
        super(props)
        this.state = {
            disasters: [],
            currentOffset: 0,
            currentPage: 1,
            total: 0
        }
    }

    componentWillMount() {
        const pageSize = PAGE_SIZE
        const offset = this.state.currentOffset
        reqwest({
            url: hostname + '/api/disaster/list',
            method: 'get',
            type: 'jsonp',
            data: {offset, pageSize}
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                const data = res.data;
                this.setState({
                    disasters: data.data || [],
                    total: data.total
                })
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧')
        });
    }

    getOnePageDisaster(pageIndex) {
        const pageSize = PAGE_SIZE, offset = PAGE_SIZE * (pageIndex - 1)
        reqwest({
            url: hostname + '/api/disaster/list',
            method: 'get',
            type: 'jsonp',
            data: {offset, pageSize}
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                const data = res.data;
                this.setState({
                    disasters: data.data || [],
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


    render() {
        const disasters = this.state.disasters || []
        let disasterList = []
        disasters.forEach((disaster, idx)=> {
            disasterList.push(<Item data={disaster} key={idx} />)
        })
        return (
            <div className='disaster'>
                <div className="title">说明：以下是村民们上报的病虫害信息</div>
                <div className="list">
                    {disasterList}
                    <div className="pagination">
                        {
                            this.state.total > PAGE_SIZE ?
                                <Pagination
                                    page={this.state.currentPage}          // 当前页码，默认为 1
                                    size={PAGE_SIZE}          // 每页显示条数，默认为 20
                                    total={this.state.total}         // 总条目数，默认为 0
                                    onChange={(pageIndex)=> this.getOnePageDisaster(pageIndex)}
                                    /> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

