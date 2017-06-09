'use strict'
import { Component } from 'react';
import Slider from 'react-slick';
import './index.less';

class Slide extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        let data = this.props.data;
        let settings = {
            customPaging: function() {
                return <i></i>;
            },
            dots: true,
            infinite: true,
            autoplay: true,
            arrows: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        let els = [];
        data.forEach((item, idx)=> {
            els.push(<div className="item" key={idx}>
                <a href={item.url ? item.url : 'javascript:void(0)'}>
                    <img src={item.img}/>
                </a>
            </div>);
        });
        return (
            <div className={"slider count" + data.length}>
                {
                    data.length > 1 ?
                        <Slider {...settings}>
                            {els}
                        </Slider> : <div>{els}</div>
                }
            </div>
        );
    }
}

module.exports = Slide;
