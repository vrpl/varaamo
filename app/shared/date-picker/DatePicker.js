import classnames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import constants from 'constants/AppConstants';

export default class DatePicker extends Component {
  static propTypes = {
    dateFormat: PropTypes.string,
    dayPickerClassName: PropTypes.string,
    formControl: PropTypes.bool,
    icon: PropTypes.string,
    inputClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  state = {
    showOverlay: false,
  };

  componentWillUnmount() {
    clearTimeout(this.clickTimeout);
  }

  input = null;
  clickedInside = false;
  clickTimeout = null;

  handleContainerMouseDown = () => {
    this.clickedInside = true;
    // The input's onBlur method is called from a queue right after onMouseDown event.
    // setTimeout adds another callback in the queue, but is called later than onBlur event
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false;
    }, 0);
  };

  handleInputFocus = () => {
    this.setState({
      showOverlay: true,
    });
  };

  handleInputBlur = () => {
    const showOverlay = this.clickedInside;

    this.setState({
      showOverlay,
    });

    // Force input's focus if blur event was caused by clicking on the calendar
    if (showOverlay) {
      this.input.focus();
    }
  };

  handleDayClick = (day) => {
    this.setState({
      showOverlay: false,
    });
    this.props.onChange(moment(day).format(constants.DATE_FORMAT));
    this.input.blur();
  };

  render() {
    const pickerDateFormat = this.props.dateFormat || 'L';
    function formatDate(date) {
      return moment(date, constants.DATE_FORMAT).format(pickerDateFormat);
    }
    let selectedDay = null;
    if (this.props.value) {
      const [year, month, dayNumber] = this.props.value.split('-');
      selectedDay = new Date();
      selectedDay.setFullYear(year, month - 1, dayNumber);
    }
    return (
      <div
        className={classnames('date-picker', { 'form-control': this.props.formControl })}
        onMouseDown={this.handleContainerMouseDown}
      >
        <input
          className={this.props.inputClassName}
          onBlur={this.handleInputBlur}
          onFocus={this.handleInputFocus}
          placeholder="DD/MM/YYYY"
          readOnly
          ref={(el) => {
            this.input = el;
          }}
          type="text"
          value={formatDate(this.props.value)}
        />
        {this.props.icon &&
          <Glyphicon className="date-picker-glyphicon" glyph={this.props.icon} />
        }
        {this.state.showOverlay &&
          <div className="date-picker-wrapper">
            <div className="date-picker-overlay">
              <DayPicker
                className={this.props.dayPickerClassName}
                initialMonth={selectedDay}
                localeUtils={MomentLocaleUtils}
                onDayClick={this.handleDayClick}
                selectedDays={selectedDay}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}
