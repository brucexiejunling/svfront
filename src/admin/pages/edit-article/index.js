'use strict'
import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Button, Form, FormControl, Cascade, Modal} from 'rctui'
import classnames from 'classnames';
import {getUriQuery} from '../../common/utils/url'
import reqwest from 'reqwest';
import './index.less';
import config from '../../common/config.js'

const articleId = getUriQuery('id')
const title = getUriQuery('title')
const pageName = getUriQuery('pageName')
const pageText = decodeURI(getUriQuery('pageText'))
const tabName = getUriQuery('tabName')
const tabText = decodeURI(getUriQuery('tabText'))
const typeName = getUriQuery('typeName')
const typeText = decodeURI(getUriQuery('typeText'))
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: title,
            cover: '',
            desc: '',
            keywords: [],
            page: {name: pageName, text: pageText},
            tab: {name: tabName, text: tabText},
            type: {name: typeName, text: typeText},
            content: '',
            directory: [`${pageName}/${pageText}`, `${tabName}/${tabText}`, `${typeName}/${typeText}`]
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePageTabTypeChange = this.handlePageTabTypeChange.bind(this)
    }

    componentDidMount() {
        this.editor = window.UE.getEditor('editor', {
            initialFrameHeight: 500
        });
        if(articleId) {
            this.getArticleData(articleId)
        }
        this.getAllPages((data)=> {
            this.setState({
                directoryData: this.formatDirectory(data)
            });
        });
    }

    getArticleData(id) {
        reqwest({
            url: config.hostname + '/api/article/get',
            method: 'get',
            type: 'jsonp',
            data: {
                id: id
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                const data = res.data
                const {title, desc, keywords, page, tab, type, content, cover} = data;
                this.editor.ready(()=> {
                    this.editor.setContent(content);
                })
                this.setState({title, desc, keywords, page, tab, type, content, cover});
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧')
        });
    }

    getAllPages(callback) {
        reqwest({
            url: config.hostname + '/api/page/all',
            method: 'get',
            type: 'jsonp'
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                callback && callback(res.data.data || [])
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，刷新试试吧')
        })
    }

    formatDirectory(pages) {
        let directoryData = []
        pages.forEach((page)=> {
           let pageItem = {
               name: page.name,
               text: page.text
           }
           if(page.tabs) {
               pageItem.children = []
               page.tabs.forEach((tab)=> {
                   let tabItem = {
                       name: tab.name,
                       text: tab.text
                   }
                   if(page.types && page.types[tab.name]) {
                       tabItem.children = []
                       page.types[tab.name].forEach((type)=> {
                           let typeItem = {
                               name: type.name,
                               text: type.text
                           }
                           tabItem.children.push(typeItem)
                       })
                   }
                   pageItem.children.push(tabItem)
               })
           }
            directoryData.push(pageItem)
        })
        return directoryData
    }

    handlePageTabTypeChange(data, b) {
        this.state.directory = data
    }

    parseObj(str) {
        const r = /^([^\/]+)\/([^\/]+)$/;
        const matches = r.exec(str)
        if(matches && matches.length === 3) {
            return {name: matches[1], text: matches[2]}
        } else {
            return null
        }
    }

    handleSubmit(data) {
        let directory = this.state.directory;
        const page = this.parseObj(directory[0]), tab = this.parseObj(directory[1]), type = this.parseObj(directory[2])
        if(!page && !tab) {
            Modal.alert('请选择文章所属 页面/栏目/分类!', '未选择文章所属目录')
            return;
        }

        const content = this.editor.getContent(), contentTxt = this.editor.getContentTxt()
        if(!content || content.trim().length < 10) {
            Modal.alert('请完成文章内容的编辑!', '文章内容不完整')
            return;
        }
        delete data.directory
        if(data.title === undefined) {
            data.title = this.state.title
        }
        if(data.keywords === undefined) {
            data.keywords = this.state.keywords.join(' ')
        }
        if(data.cover === undefined) {
            data.cover = this.state.cover
        }
        data.page = page || {};
        data.tab = tab || {};
        data.type = type || {}
        data.keywords = data.keywords.split(/\s+/)
        data.content = content;
        if(!data.desc || !data.desc.trim()) {
            data.desc = contentTxt.substr(0, 50)
        }
        if(articleId) {
            this.saveArticle(articleId, data)
        } else {
            this.addArticle(data)
        }
    }

    saveArticle(id, data) {
        reqwest({
            url: config.hostname + '/api/article/save',
            method: 'post',
            type: 'json',
            data: {
                id: id,
                data: JSON.stringify(data)
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                alert('已成功保存文章!')
                window.close()
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，请重试～')
        })
    }

    addArticle(data) {
        reqwest({
            url: config.hostname + '/api/article/add',
            method: 'post',
            type: 'json',
            data: {
                data: JSON.stringify(data)
            }
        }).then((res)=> {
            if(res.code === 0 && res.data) {
                alert('已成功发布文章!')
                window.close()
            } else {
                Modal.alert(res.message)
            }
        }).fail((err)=> {
            Modal.alert('网络忙，请重试！')
        })
    }

    render () {
        return (
            <div className="wrap">
                <div className="title">
                    注意：
                    <div>1. 封面图片尺寸必须为700*350或350*175，大小控制在200KB以内；您可以在<a target="_blank" href="https://tinypng.com">https://tinypng.com</a>对图片进行压缩处理，这将大大加快访问速度！</div>
                    <div>2. 文章中的图片大小也必须控制在200KB以内；</div>
                    <div>3. 暂时不支持在文章中上传视频（也不建议使用上传，会对服务器造成很大压力），支持插入视频，请您先把视频上传到优酷，然后在"分享给朋友"一栏点击复制通用代码，回到这边插入视频，粘贴即可。</div>
                </div>
                <div className="form">
                    <Form button="发布文章" layout='aligned' onSubmit={this.handleSubmit}>
                        <FormControl grid={1/2} label="文章标题" name="title" type="text" value={this.state.title} placeholder="请输入文章标题" min={1} max={30} required={true} />
                        <FormControl grid={2/3} label="封面图(700x350)" name="cover" type="url" value={this.state.cover} placeholder="请填入有效的图片链接, 填写后会在页面展示缩略图" />
                        <FormControl grid={1/1} label="文章摘要" name="desc" type="text" value={this.state.desc} placeholder="请输入文章摘要，不填写将会截取文章正文前50字" max={50} />
                        <FormControl grid={1/2} label="关键字" name="keywords" value={this.state.keywords.join(' ')} placeholder="多个关键字以空格隔开，最多5个" required={true} type="text" />
                        <FormControl grid={1/2} label="所属 页面/栏目/分类" required={true}>
                            {this.state.directoryData ?
                                <Cascade name="directory" required={true} grid={1/3}
                                         data={this.state.directoryData}          // 格式和tree相同
                                         hastily={true}        // 如果hastily为true，点击父节点也会触发onChange事件
                                         value={this.state.directory}
                                         maxLevel={3}    // 最多展示多少级选项
                                         optionTpl="{text}"    // 选项模板，默认为 {text}
                                         resultTpl="{text}"    // 选中项显示模板，如果不填使用 optionTpl
                                         valueTpl="{name}/{text}"
                                         onChange={this.handlePageTabTypeChange} /> : null
                            }
                        </FormControl>
                    </Form>
                </div>
                <div className="editor" id="editor"></div>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
