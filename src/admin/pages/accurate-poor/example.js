'use strict'
import { Component } from 'react';
import {Table, Lazyload, Button, Select, Modal, Input, Pagination} from 'rctui'
import reqwest from 'reqwest';
import config from '../../common/config.js'

const page = {name: 'jzfp', text: '精准扶贫'}, tab = {name: 'example', text: '先进事例'}, PAGE_SIZE = 10 ;
export default class Example extends Component {
    constructor(props) {
        super(props)
        this.state = {
            articles: [],
            currentOffset: 0,
            currentPage: 1,
            total: 0
        }
        this.getOnePageArticle = this.getOnePageArticle.bind(this)
        this.goCreateArticlePage = this.goCreateArticlePage.bind(this)
        this.deleteArticle = this.deleteArticle.bind(this)
    }

    componentWillMount() {
        const offset = this.state.currentOffset
        reqwest({
            url: config.hostname + '/api/article/get',
            method: 'get',
            type: 'jsonp',
            data: {
                page: JSON.stringify(page),
                tab: JSON.stringify(tab),
                offset: offset,
                pageSize: PAGE_SIZE
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                const data = res.data;
                this.setState({
                    articles: data.data || [],
                    total: data.total
                })
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧～')
        });
    }

    getOnePageArticle(pageIndex) {
        const offset = PAGE_SIZE * (pageIndex - 1)
        reqwest({
            url: config.hostname + '/api/article/get',
            method: 'get',
            type: 'jsonp',
            data: {
                page: JSON.stringify(page),
                tab: JSON.stringify(tab),
                offset: offset,
                pageSize: PAGE_SIZE
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                const data = res.data;
                this.setState({
                    articles: data.data || [],
                    total: data.total,
                    currentOffset: offset,
                    currentPage: pageIndex
                })
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧～')
        });
    }

    goCreateArticlePage(aid) {
        const pageText = encodeURI(page.text), tabText = encodeURI(tab.text)
        let url = `/admin/bjwz?pageName=${page.name}&pageText=${pageText}&tabName=${tab.name}&tabText=${tabText}`
        if(this.props.types && this.props.types[0]) {
            const defaultType = this.props.types[0]
            url += `&typeName=${defaultType.name}&typeText=` + encodeURI(defaultType.text)
        }
        if(aid) {
            url += `&id=${aid}}`
        }
        let win = window.open('_blank')
        win.location = url
    }

    deleteArticle(aid) {
        reqwest({
            url: config.hostname + '/api/article/remove',
            method: 'post',
            type: 'json',
            data: {
                id: aid
            }
        }).then((res)=> {
            if(res.code && res.data) {
                this.removeLocalArticle(aid)
                Modal.alert('已成功删除！')
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧～')
        });
    }

    removeLocalArticle(aid) {
        let articles = []
        Array.prototype.push.apply(articles, this.state.articles)
        articles.forEach((item, idx)=> {
            if(item._id === aid) {
                articles.splice(idx, 1)
                this.setState({articles: articles})
                return false;
            }
        })
    }

    render() {
        let articles = this.state.articles;
        articles.forEach((item)=> {
            item.directory = item.page.text + '/' + item.tab.text
            if(item.type && item.type.text) {
                item.directory += `/${item.type.text}`
            }
        })
        return (
            <div className='example'>
                <div className="title">说明：文章管理，以下是《先进事例》栏目下面的所有文章，您可以在这里管理这些文章</div>
                <div className="add-btn"><Button status="primary" onClick={()=> this.goCreateArticlePage()}>新增文章</Button></div>
                <div className="table">
                    <Table ref="table"
                           bordered={true}
                           striped={true}
                           data={this.state.articles}
                           columns={[
                          { name: 'title', header: '文章标题'},
                          { name: 'keywords',  header: '关键字', width: 100},
                          { name: 'directory',  header: '所属目录'},
                          { name: 'url',  header: '链接'},
                          { name: 'date', sort: true, header: '创建日期'},
                          { name: 'tools', header: '操作', width: 100,
                            content: (d) => {
                              const pageText = encodeURI(d.page.text), tabText = encodeURI(d.tab.text);
                              let editUrl = `${location.protocol}//${location.host}/admin/bjwz?id=${d._id}&pageName=${d.page.name}&pageText=${pageText}&tabName=${d.tab.name}&tabText=${tabText}`
                              if(d.type && d.type.name) {
                                 const typeText = encodeURI(d.type.text)
                                 editUrl += `&typeName=${d.type.name}&typeText=${typeText}`
                              }
                              return (
                                <span className="operations">
                                    <a href={editUrl} target='_blank' style={{cursor: 'pointer', color: '#0075e4', 'margin-right': '10px'}}>编辑</a>
                                    <a style={{color: '#0075e4', cursor: 'pointer'}} onClick={() => {
                                      Modal.confirm(`确定删除<<${d.title}>>吗？删除之后无法恢复!`, () => {
                                         this.deleteArticle(d._id)
                                      }, '确认删除？')
                                    }}>删除</a>
                                </span>
                              )
                            }
                          }
                        ]} />
                    <div className="pagination">
                        {
                            this.state.total > PAGE_SIZE ?
                                <Pagination
                                    page={this.state.currentPage}          // 当前页码，默认为 1
                                    size={PAGE_SIZE}          // 每页显示条数，默认为 20
                                    total={this.state.total}         // 总条目数，默认为 0
                                    onChange={(pageIndex)=> this.getOnePageArticle(pageIndex)}
                                    /> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

