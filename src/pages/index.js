import * as React from "react"
import {ModalTemplate, LoginModal, CalendarModal, CreateTaskModal, TaskTemplateModal } from "./modal"

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";


import "../styles/style.css"

class CalendarFunctionBar extends React.Component {
  constructor(props) {
      super(props)
      this.onClickHandler = this.onClickHandler.bind(this)
  }

  onClickHandler(e) {
      var data = this.props
      if (e.target.id == "prevMonth") {
          data.month == 0 ?
              data.getMonthCB(data.year - 1, 11, data.day) :
              data.getMonthCB(data.year, data.month - 1, data.day)
      }
      else {
          data.month == 11 ?
              data.getMonthCB(data.year + 1, 0, data.day) :
              data.getMonthCB(data.year, data.month + 1, data.day)
      }
  }

  render() {
      var months = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
      var monthName = months[this.props.month]
      return (
          <div id="calendar_month" className="current-month">
              <button onClick={this.onClickHandler} style={{ left: "34%" }} id="prevMonth" className="calendarButton" >&#60;&nbsp;</button>
              <strong id="calendarHeader">{monthName + " " + this.props.year}</strong>
              <button onClick={this.onClickHandler} style={{ left: "63%" }} id="nextMonth" className="calendarButton" > &nbsp;&#62;</button>
          </div>
      )
  }
}

class CalendarContents extends React.Component {
  constructor(props) {
      super(props)
      this.state = { dateSelected: -1 }
      this.selectDateHandler = this.selectDateHandler.bind(this)
  }

  static getDerivedStateFromProps(props, cur_state) {
      if (cur_state.dateSelected == -1 && "monthStartWeekDay" in props) {
          return {
              dateSelected: props.day + props.monthStartWeekDay - 1
          }
      }
      return null
  }

  selectDateHandler(day, id) {
      this.setState({
          dateSelected: id
      })
  }


  render() {
      const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
      const weekdayHeaders = weekdays.map((day, i) => (
          <div key={"weekday_" + i}>{day}</div>
      ))
      return (
          <div className="calendar">
              <div className="calendar__header">
                  {weekdayHeaders}
              </div>
              <CalendarCells {...this.props} {...this.state} selectNewDateCB={this.selectDateHandler} />
          </div>
      )
  }
}


class CalendarCells extends React.Component {
  constructor(props) {
      super(props)
      this.state = { data: [] }
      this.onDropHandler = this.onDropHandler.bind(this)
  }

  onDropHandler(e) {
      e.preventDefault()
      console.log(this.props)
      console.log(e.target.id)
  }
  onDragOver(e) {
      e.preventDefault()

  }
  drawCalendarTable() {
      let range = n => [...Array(n).keys()]
      let dayCell = range(this.props.dayInMonth)
      if (this.props.monthStartWeekDay >= 0) {
          let frontEmptyCell = new Array(this.props.monthStartWeekDay).fill(-1)
          dayCell = frontEmptyCell.concat(dayCell)
      }
      if (dayCell.length % 7 != 0) { //empty cell after last day of month
          let backEmptyCell = new Array(7 - dayCell.length % 7).fill(-1)
          dayCell = dayCell.concat(backEmptyCell)
      }

      return dayCell.map((day, i) => (
          <div onClick={() => this.props.selectNewDateCB(day, i)}
              onDrop={this.onDropHandler}
              onDragOver={this.onDragOver}
              key={"day_" + i} id={"day_" + (day == -1 ? " " : day + 1)}
              className={"calendar__day day" + (i == this.props.dateSelected ? " selected" : "")}>
              <p>{day == -1 ? " " : day + 1}</p>
          </div>
      ))
  }

  render() {
      const dayCells = this.drawCalendarTable()
      return (
          <div className="calendar__week">
              {dayCells}
          </div>)
  }
}

class SideBar extends React.Component {
  constructor(props) {
      super(props)
      this.state = { currentTab: "main" }
      this.SIDEBAR_CONTENT = ["Login", "Calendar", "Create Tasks", "Task Templates"]
  }
  tabsOnclickHandler(e) {
      console.log(e.target.id)
  }
  render() {

      const sidebarTabs = this.SIDEBAR_CONTENT.map((tab, i) => (
          <div>
              <ModalTemplate key={"modal_" + i} tab={tab.replace(" ", "_")} />
              <div
                  key={i}
                  id={tab.replace(" ", "_")}
                  className="tabs"
                  onClick={this.tabsOnclickHandler}
                  data-toggle="modal"
                  data-target={"." + tab.replace(" ", "_") + "_modal_lg"}
              > {tab}
              </div>
          </div>
      ))

      return (
          <div className="sidebar">
              <div className="avatar">
                  <div className="avatar__img">
                      <img src="https://picsum.photos/70" alt="avatar" ></img>
                  </div>
              </div>
              <div className="avatar__name">Guest</div>
              {sidebarTabs}
          </div>
      )
  }
}

class Calendar extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          data: [],
      };
      this.getMonthDetail = this.getMonthDetail.bind(this)
  }

  componentDidMount() { //Initial render
      var date = new Date()
      this.getMonthDetail(date.getFullYear(), date.getMonth(), date.getDate())
  }

  getMonthDetail(year, month, day) {
      this.setState({
          year: year,
          month: month,
          day: day,
          monthStartWeekDay: new Date(`${year}-${month + 1}-01`).getDay() - 1,
          dayInMonth: new Date(year, month, 0).getDate()
      })
  }

  render() {
      return (
          <div className="container-fluid">
              <div className="row">
                  <div className="col-lg-2">
                      <SideBar />
                  </div>
                  <div className="col-lg-9">
                      <CalendarFunctionBar {...this.state} getMonthCB={this.getMonthDetail} />
                      <CalendarContents {...this.state} />
                  </div>
                  <div className="col-lg-1">
                  </div>
            </div>
          </div>
      )

  }
}


export default Calendar
