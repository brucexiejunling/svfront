import { Component } from 'react';
import FileUpload from 'react-fileupload';
import config from '../../common/config.js'
import Image from './image.js'
import reqwest from 'reqwest'
import './index.less'
import {Modal} from 'rctui'

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

    componentWillReceiveProps(nextProps) {
        const imgs = nextProps.imgs, total = imgs.length, max = nextProps.max || 6;
        this.setState({imgs, total, max})
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
                url: hostname + '/api/file/delete?type=image&env=admin',
                method: 'post',
                type: 'json',
                data: {url: pic[0].url}
            }).then(()=> {}).fail(()=> {});
        }
    }

    render() {
        let options = {
            baseUrl: hostname + '/api/file/upload?type=image&env=admin',
            dataType : 'json',
            chooseAndUpload: true,
            accept: 'image/*',
            uploading : (res)=> {
            },
            uploadSuccess : (res)=> {
                if(res.data && res.code === 0) {
                    let total = this.state.total;
                    if(total++ > this.state.max) {return}
                    let imgs = []
                    Array.prototype.push.apply(imgs, this.state.imgs)
                    imgs.push({url: res.data.url})
                    this.props.onChange && this.props.onChange(imgs)
                    this.setState({imgs, total})
                    Modal.alert('上传成功！')
                } else {
                    Modal.alert(res.message)
                }
            },
            uploadError : (err)=> {
                Modal.alert('上传失败！请重试～')
            },
            uploadFail : (res)=>{
                Modal.alert('上传失败！请重试～')
            }
        };

        let Imgs = []
        this.state.imgs.forEach((img, idx)=> {
            Imgs.push(<Image url={img.url} id={idx} onDelete={this.removeImg} />)
        })
        return (
            <div className="upload-img">
                <div className="uploader">
                    {
                        this.state.total < this.state.max ?
                            <FileUpload options={options}>
                                <button ref="chooseAndUpload" className="upload-btn"></button>
                            </FileUpload> : null
                    }
                    {Imgs}
                </div>
            </div>
        )
    }
}
