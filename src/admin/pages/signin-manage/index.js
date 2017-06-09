'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Tab from '../../common/tab/index.js';
import { Modal, FormControl, Button, Grid } from 'rctui';
import reqwest from 'reqwest';
import config from '../../common/config.js';
import './index.less';

class Index extends Component {
  constructor(props) {
    super(props);
    this.data = {
      in: {
        hour: '09',
        min: '00'
      },
      out: {
        hour: '18',
        min: '00'
      }
    };
    this.handleSetSigninHour = this.handleSetSigninHour.bind(this);
    this.handleSetSigninMin = this.handleSetSigninMin.bind(this);
    this.handleSetSignoutHour = this.handleSetSignoutHour.bind(this);
    this.handleSetSignoutMin = this.handleSetSignoutMin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSetSigninHour(hour) {
    this.data.in.hour = hour;
  }

  handleSetSigninMin(min) {
    this.data.in.min = min;
  }

  handleSetSignoutHour(hour) {
    this.data.out.hour = hour;
  }

  handleSetSignoutMin(min) {
    this.data.out.min = min;
  }

  handleSubmit() {
    let signinTime = this.data.in.hour + ':' + this.data.in.min;
    let signoutTime = this.data.out.hour + ':' + this.data.out.min;
    reqwest({
      url: config.hostname + '/api/record/set',
      method: 'get',
      type: 'jsonp',
      data: {signinTime, signoutTime}
    })
      .then(res => {
        if (res.code === 0 && res.data) {
          Modal.alert(`您已成功设置签到时间: ${signinTime}, 签退时间: ${signoutTime}`);
        } else {
          Modal.alert(res.message);
        }
      })
      .fail(err => {
        Modal.alert('网络忙，刷新试试吧～');
      });
  }

  render() {
    return (
      <div className="wrap">
        <div className="title">考勤签到</div>
        <div className="desc-wrap">
          <div className="title">说明：请设置员工签到、签退时间</div>
          <div className="main">
            <div className="signin">
              <div className="title">签到时间</div>
              <Grid width={1 / 5}>
                <FormControl
                  layout="inline"
                  name="hour"
                  label="小时"
                  type="select"
                  data={[
                    '00',
                    '01',
                    '02',
                    '03',
                    '04',
                    '05',
                    '06',
                    '07',
                    '08',
                    '09',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23'
                  ]}
                  required
                  placeholder="请选择小时"
                  value={'09'}
                  onChange={this.handleSetSigninHour}
                />
              </Grid>
              <Grid width={1 / 5}>
                <FormControl
                  layout="inline"
                  name="min"
                  label="分钟"
                  type="select"
                  data={[
                    '00',
                    '05',
                    '10',
                    '15',
                    '20',
                    '25',
                    '30',
                    '35',
                    '40',
                    '45',
                    '50',
                    '55'
                  ]}
                  required
                  placeholder="请选择分钟"
                  value={'00'}
                  onChange={this.handleSetSigninMin}
                />
              </Grid>
            </div>
            <div className="signout">
                <div className="title">签退时间</div>
              <Grid width={1 / 5}>
                <FormControl
                  layout="inline"
                  name="hour"
                  label="小时"
                  type="select"
                  data={[
                    '00',
                    '01',
                    '02',
                    '03',
                    '04',
                    '05',
                    '06',
                    '07',
                    '08',
                    '09',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23'
                  ]}
                  required
                  placeholder="请选择小时"
                  value={'18'}
                  onChange={this.handleSetSignoutHour}
                />
              </Grid>
              <Grid width={1 / 5}>
                <FormControl
                  layout="inline"
                  name="min"
                  label="分钟"
                  type="select"
                  data={[
                    '00',
                    '05',
                    '10',
                    '15',
                    '20',
                    '25',
                    '30',
                    '35',
                    '40',
                    '45',
                    '50',
                    '55'
                  ]}
                  required
                  placeholder="请选择分钟"
                  value={'00'}
                  onChange={this.handleSetSignoutMin}
                />
              </Grid>
            </div>
      <div className="btn-row">
        <Button status="primary" onClick={this.handleSubmit}>保存设置</Button>
      </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('content_holder'));
