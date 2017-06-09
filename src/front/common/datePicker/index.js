import { Component } from 'react';
import classnames from 'classnames';
import PureRender from '../mixin/pureRender.js';
import './index.less';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 2017,
      month: 1,
      day: 1
    };
    this.selectYear = this.selectYear.bind(this);
    this.selectMonth = this.selectMonth.bind(this);
    this.selectDay = this.selectDay.bind(this);
    this.formatDateStr = this.formatDateStr.bind(this);
  }

  selectYear() {
    let value = this._year.value;
    this.setState({ year: value });
    const {month, day} = this.state;
    value && this.props.onChange && this.props.onChange(this.formatDateStr(value, month, day));
  }

  selectMonth() {
    let value = this._month.value;
    this.setState({ month: value });
    const {year, day} = this.state;
    value && this.props.onChange && this.props.onChange(this.formatDateStr(year, value, day));
  }

  selectDay() {
    let value = this._day.value;
    this.setState({ day: value });
    const {year, month} = this.state;
    value && this.props.onChange && this.props.onChange(this.formatDateStr(year, month, value));
  }

  formatDateStr(y, m, d) {
    m = m >= 10 ? m : `0${m}`;
    d = d >= 10 ? d : `0${d}`;
    return `${y}-${m}-${d}`
  }

  render() {
    let years = [];
    for (let i = 1; i <= 10; i++) {
      years.push(<option key={i} value={2016 + i}>{2016 + i}</option>);
    }

    let months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(<option key={i} value={i}>{i}</option>);
    }

    let days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(<option key={i} value={i}>{i}</option>);
    }

    return (
      <div className="date-picker">
        {this.props.label
          ? <label>
              {this.props.required ? <span>*</span> : <span />}
              {this.props.label}
              ：
            </label>
          : null}
        <div className="select-wrap">
          <span className="select-item year">
            <select
              ref={c => this._year = c}
              onFocus={this.selectYear}
              onChange={this.selectYear}
            >
              {years}
            </select>
            <span>年</span>
          </span>
          <span className="select-item month">
            <select
              ref={c => this._month = c}
              onFocus={this.selectMonth}
              onChange={this.selectMonth}
            >
              {months}
            </select>
            <span>月</span>
          </span>
          <span className="select-item day">
            <select
              ref={c => this._day = c}
              onFocus={this.selectDay}
              onChange={this.selectDay}
            >
              {days}
            </select>
            <span>日</span>
          </span>
        </div>
      </div>
    );
  }
}

export default PureRender(true)(DatePicker);
