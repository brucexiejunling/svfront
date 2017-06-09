'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal, Pagination} from 'rctui'
import reqwest from 'reqwest';
import Item from './item.js'
import './index.less'
import config from '../../common/config.js'

const hostname = config.hostname
const PAGE_SIZE = 5;
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: [],
            currentOffset: 0,
            currentPage: 1,
            total: 0
        }
    }

    componentWillMount() {
        const pageSize = PAGE_SIZE
        const offset = this.state.currentOffset
        reqwest({
            url: hostname + '/api/question/list',
            method: 'get',
            type: 'jsonp',
            data: {offset, pageSize}
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                const data = res.data;
                this.setState({
                    questions: data.data || [],
                    total: data.total
                })
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧')
        });
    }

    getOnePageQuestion(pageIndex) {
        const pageSize = PAGE_SIZE, offset = PAGE_SIZE * (pageIndex - 1)
        reqwest({
            url: hostname + '/api/question/list',
            method: 'get',
            type: 'jsonp',
            data: {offset, pageSize}
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                const data = res.data;
                this.setState({
                    questions: data.data || [],
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
        const questions = this.state.questions || []
        let questionList = []
        questions.forEach((question, idx)=> {
            questionList.push(<Item data={question} key={idx} />)
        })
        return (
            <div className='wrap'>
                <div className="title">说明：以下是村民们提交的民生答疑</div>
                <div className="list">
                    {questionList}
                    <div className="pagination">
                        {
                            this.state.total > PAGE_SIZE ?
                                <Pagination
                                    page={this.state.currentPage}          // 当前页码，默认为 1
                                    size={PAGE_SIZE}          // 每页显示条数，默认为 20
                                    total={this.state.total}         // 总条目数，默认为 0
                                    onChange={(pageIndex)=> this.getOnePageQuestion(pageIndex)}
                                    /> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));

