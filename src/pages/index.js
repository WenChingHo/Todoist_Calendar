import * as React from "react"
import ReactModalTemplate from "./modal"


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@popperjs/core/dist/umd/popper.min.js";
import "../../node_modules/bootstrap/js/dist/modal.js"

import "../styles/style.css"


class CalendarFunctionBar extends React.Component {
    constructor(props) {
        super(props)
    }

    onClickHandle = (e) => {
        var data = this.props
        if (e.target.id === "prevMonth") {
            data.month === 0 ?
                data.getMonthCB(data.year - 1, 11, data.day) :
                data.getMonthCB(data.year, data.month - 1, data.day)
        }
        else {
            data.month === 11 ?
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
                <button onClick={this.onClickHandler} style={{ left: "40%" }} id="prevMonth" className="calendarButton" >&#60;&nbsp;</button>
                <strong id="calendarHeader">{monthName + " " + this.props.year}</strong>
                <button onClick={this.onClickHandler} style={{ left: "65%" }} id="nextMonth" className="calendarButton" > &nbsp;&#62;</button>
            </div>
        )
    }
}

class CalendarContents extends React.Component {
    constructor(props) {
        super(props)
        this.state = { dateSelected: -1 }

    }

    static getDerivedStateFromProps(props, cur_state) {
        if (cur_state.dateSelected === -1 && "monthStartWeekDay" in props) {
            return {
                dateSelected: props.day + props.monthStartWeekDay - 1
            }
        }
        return null
    }

    selectDateHandler = (day, id) => {
        this.setState((prevState) => ({
            dateSelected: prevState.dateSelected === id ? -99 : id
        }))
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
                <CalendarCells
                    dayInMonth={this.props.dayInMonth}
                    monthStartWeekDay={this.props.monthStartWeekDay}
                    tasks={this.props.tasks}
                    dateSelected={this.state.dateSelected}
                    selectNewDateCB={this.selectDateHandler}
                />
            </div>
        )
    }
}


class CalendarCells extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            tasks: []
        }
    }

    static getDerivedStateFromProps(props, cur_state) {
        if (cur_state.tasks !== props.tasks) {
            return {
                tasks: props.tasks
            }
        }
        return null
    }
    onDropHandler = (e) => {
        e.preventDefault()
        console.log(this.props)
        console.log(e.target.id)
    }
    onDragOver(e) {
        e.preventDefault()

    }
    presentTasks = () => {
        var tasks = this.state.tasks
        var tasksTable = {}

        for (var i of tasks) {
            var date = i.due.slice(8, 10)

            tasksTable[date] === undefined ?
                tasksTable[date] = [i] : tasksTable[date].push(i)
        }
        return tasksTable
    }
    onClickHandler(day, i) {
        this.props.selectNewDateCB(day, i)
    }
    drawCalendarTable() {
        let range = n => [...Array(n).keys()]
        let tasks = this.presentTasks()
        let dayCell = range(this.props.dayInMonth)

        if (this.props.monthStartWeekDay >= 0) {
            let frontEmptyCell = new Array(this.props.monthStartWeekDay).fill(-1)
            dayCell = frontEmptyCell.concat(dayCell)
        }
        if (dayCell.length % 7 !== 0) { //empty cell after last day of month
            let backEmptyCell = new Array(7 - dayCell.length % 7).fill(-1)
            dayCell = dayCell.concat(backEmptyCell)
        }

        return dayCell.map((day, i) => (
            <div onClick={() => this.onClickHandler(day, i)}
                onDrop={this.onDropHandler}
                onDragOver={this.onDragOver}
                key={"day_" + i}
                id={"day_" + (day === -1 ? " " : day + 1)}
                className={"calendar__day day" + (i === this.props.dateSelected ? " selected" : "")}>
                <p>{day === -1 ? " " : day + 1}</p>
                <DottedTasks day={day + 1} tasks={tasks[day + 1]} />
                <div
                    style={{ display: i === this.props.dateSelected ? "block" : "none" }}
                    className="detailedTaskDiv">
                    {tasks[day + 1] !== undefined ? tasks[day + 1].map((task, i) => {
                        return (
                            <div>
                                <input type="checkbox" key={i}></input>
                                <label for="vehicle1">{task.content}</label><br></br>
                            </div>
                        )
                    }) : ""
                    }
                </div>
            </div>
        ))
    }

    render() {
        this.presentTasks()
        const dayCells = this.drawCalendarTable()
        return (
            <div className="calendar__week">
                {dayCells}
            </div>)
    }
}


class DottedTasks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            left: 0,
            top: 0,
            selected: -1
        }
    }

    onMouseEnterHandler = (e, i) => {
        this.setState({
            top: e.target.offsetTop,
            left: e.nativeEvent.clientX,
            selected: i
        })
    }
    onMouseLeaveHandler = (e) => {
        this.setState({
            selected: -1
        })
    }
    render() {
        return (
            <div className="taskDots">
                {this.props.tasks && this.props.tasks.map((task, i) => {
                    return (
                        <div
                            onMouseEnter={(e) => this.onMouseEnterHandler(e, i)}
                            onMouseLeave={this.onMouseLeaveHandler}
                            className={"todoDots " + this.props.day + "DotDay"}>●
                            <div
                                key={i}
                                style={{ top: this.state.top + 30, left: this.state.left }}
                                className={"todoDotsDescription" + (this.state.selected === i ? " show" : "")}>
                                <p>{task.content}</p>
                                <p>{task.due}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTab: 0,
            isModalOpen: false,
            tabName: "Login",
            username: "Guest"
        }
        this.SIDEBAR_CONTENT = ["Login", "Calendar", "Create Tasks", "Task Templates"]
        this.tabsOnclickHandler = this.tabsOnclickHandler.bind(this)
    }
    tabsOnclickHandler(e) {
        this.setState({
            isModalOpen: true,
            currentTab: e.target.id,
            tabName: e.target.outerText.replace(" ", "_")
        })
    }
    static getDerivedStateFromProps(props, cur_state) {
        if (cur_state.username !== props.username) {
            return {
                username: props.username
            }
        }
        return null
    }

    handleModalClose = event => {
        // console.log('handleModalOpen: ', event);
        this.setState({
            isModalOpen: false,
        })
    }

    render() {
        const sidebarTabs = this.SIDEBAR_CONTENT.map((tab, i) => (
            <div key={i}>
                <div
                    id={i + "_tab"}
                    className="tabs"
                    onClick={this.tabsOnclickHandler}
                > {tab}
                </div>
            </div>
        ))

        return (
            <div className="sidebar">
                <ReactModalTemplate {...this.props} state={this.state} CB={this.handleModalClose} APITokenCB={this.props.APITokenCB} />

                <div className="avatar">
                    <div className="avatar__img">
                        <img src="https://picsum.photos/70" alt="avatar" ></img>
                    </div>
                </div>
                <div className="avatar__name">{this.state.username}</div>
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
            APIToken: 0,
            username: "Guest",
            tasks: ""
        };
        this.getMonthDetail = this.getMonthDetail.bind(this)
        this.updateAPIToken = this.updateAPIToken.bind(this)

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
            dayInMonth: new Date(year, month, 0).getDate(),
        })
    }

    updateAPIToken(APItoken) {
        !APItoken ? (function (newthis) {
            newthis.setState({  //Logout to guest
                APIToken: 0,
                username: "Guest",
                tasks: ""
            })
            alert("You're now browsing as Guest")
        })(this)
            :
            fetch(`http://127.0.0.1:5000/connect?api=${APItoken}&month=${this.state.month}`) //Else connect via APItoken
                .then(res => res.json())
                .then((res) => {
                    alert(`Welcome, ${res.user.full_name}! The connection was successful`)
                    localStorage.setItem(res.user.full_name, APItoken)
                    this.setState({
                        APIToken: APItoken,
                        username: res.user.full_name,
                        tasks: res.tasks
                    })
                })
                .catch(err => alert("Something went wrong.\nPlease Check if your API key was correct"))
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-2">
                        <SideBar APITokenCB={this.updateAPIToken} {...this.state} />
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
