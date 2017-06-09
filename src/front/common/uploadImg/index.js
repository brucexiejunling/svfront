import { Component } from 'react';
import FileUpload from 'react-fileupload';
import config from '../../common/config.js'
import {toast} from '../../common/utils/toast.js'
import reqwest from 'reqwest'
import {showLoading, hideLoading} from '../../common/utils/loading.js'
import Image from './image.js'
import './index.less'

const hostname = config.hostname
export default class UploadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgs: props.imgs || [],
            total: props.imgs ? props.imgs.length : 0,
            max: props.max || 6
        }
        this.removeImg = this.removeImg.bind(this)
    }

    removeImg(idx) {
        let total = this.state.total;
        if(total-- <= 0) {return}
        let imgs = []
        Array.prototype.push.apply(imgs, this.state.imgs)
        const pic = imgs.splice(idx, 1)
        this.props.onChange && this.props.onChange(imgs)
        this.setState({imgs, total})

        if(pic && pic[0]) {
            reqwest({
                url: hostname + '/api/file/delete?type=image&env=front',
                method: 'post',
                type: 'json',
                data: {url: pic[0]}
            }).then(()=> {}).fail(()=> {});
        }
    }

    render() {
        let options = {
            baseUrl: hostname + '/api/file/upload?type=image&env=front',
            dataType : 'json',
            chooseAndUpload: true,
            accept: 'image/*',
            uploading : (res)=> {
                showLoading('上传中')
            },
            uploadSuccess : (res)=> {
                hideLoading()
                if(res.data && res.code === 0) {
                    let total = this.state.total;
                    if(total++ > this.state.max) {return}
                    let imgs = []
                    Array.prototype.push.apply(imgs, this.state.imgs)
                    imgs.push(res.data.url)
                    this.props.onChange && this.props.onChange(imgs)
                    this.setState({imgs, total})
                    toast('已上传~', 1000)
                }
            },
            uploadError : (err)=> {
                hideLoading()
                toast('上传失败, 请重试~')
            },
            uploadFail : (res)=>{
                hideLoading()
                toast('上传失败, 请重试~')
            }
        };

        let Imgs = []
        this.state.imgs.forEach((img, idx)=> {
            Imgs.push(<Image url={img} id={idx} onDelete={this.removeImg} />)
        })
        return (
            <div className="upload-img">
                <div className="label">{this.props.required ? <span>*</span> : <span></span>}{this.props.label || '上传图片'}(最多{this.state.max}张)：</div>
                <div className="uploader">
                    {Imgs}
                    {
                        this.state.total < this.state.max ?
                            <FileUpload options={options}>
                                <button ref="chooseAndUpload" className="upload-btn"></button>
                            </FileUpload> : null
                    }
                </div>
            </div>
        )
    }
}
