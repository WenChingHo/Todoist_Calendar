import * as React from "react"
import SideBar from "./sidebar";
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

    onClickHandler = (e) => {
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
        this.state = {
            cellIndexSelected: -1,
            dateSelected: -1
        }
    }

    selectDateHandler = (day, id) => {
        this.setState((prevState) => ({
            cellIndexSelected: prevState.cellIndexSelected === id ? -99 : id,
            dateSelected: prevState.dateSelected === day ? -99 : day,
            tasks: "",
            completed: ""
        }))
    }

    static getDerivedStateFromProps(props, cur_state) {
        //Sort the tasks/completed task chronologically
        if (props.tasks !== cur_state.tasks) {
            for (const [key, _] of Object.entries(props.tasks)) {
                props.tasks[key] = props.tasks[key].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
            }
            for (const [key, _] of Object.entries(props.completed)) {
                props.completed[key] = props.completed[key].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
            }
            return ({
                tasks: props.tasks,
                completed: props.completed
            })
        }
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
                    tasks={this.state.tasks}
                    completed={this.state.completed}
                    cellIndexSelected={this.state.cellIndexSelected}
                    selectNewDateCB={this.selectDateHandler}
                />
                <TaskTimeline
                    tasks={this.state.tasks}
                    completed={this.state.completed}
                    dateSelected={this.state.dateSelected}
                    month={this.props.month}
                    user={this.props.username}
                />
            </div>
        )
    }
}


class TaskTimeline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {

        let selectedCell = document.getElementById(`day_${this.props.dateSelected}`)
        let position;

        if (selectedCell) {
            position = selectedCell && selectedCell.getBoundingClientRect()
        }
        var todayTask = this.props.tasks[this.props.dateSelected]
        var todayComplete = this.props.completed[this.props.dateSelected]
        return (
            <div style={selectedCell && this.props.user !== "Guest" ? { //Show when selected and if not "Guest"
                left: position.x + position.width / 2 >= document.body.clientWidth - 600 ? position.x - position.width / 2 - 300 : position.x + position.width / 2,
                bottom: position.y
            } : { display: "none" }} className="timeline">
                <div className="box">
                    <div className="container">
                        <div className="lines">
                            {todayComplete && todayComplete.map((task, i) => <DrawLines id={i} task={task} type={"complete"} />)}
                            {todayTask && todayTask.map((task, i) => <DrawLines id={i} task={task} />)}
                            <div style={{ background: "white", border: "1px solid grey" }} className="dot"></div>
                        </div>
                        <div className="cards">
                            <DrawCards tasks={todayComplete} type="complete" />
                            <DrawCards tasks={todayTask}  type="task"/>
                            <div className="card">
                                <h4>Add Task?</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function DrawCards(props) {
    return (
        props.tasks ?
            props.tasks.map((task, i) => {
                return (
                    <div key={i} className="card">
                        <i className="float fa fa-trash-o"></i>
                        <i className={"float fa " + (props.type==="complete"? "fa-undo" :"fa-check")}></i>
                        <h4>{task.content}</h4>
                        <p>{task.description}</p>
                    </div>
                )
            }) : ""
    )
}
function DrawLines(props) {
    console.log(props)
    return (
        <div key={props.id}>
            <div className={props.type === "complete" ? "cdot dot" : "dot"}></div>
            <p className="floatingTime">{props.task["due"].slice(11, 16)}</p>
            <div className="line"></div>
        </div>
    )
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

    onClickHandler(day, i) {
        day = this.props.dayInMonth === -1 ? day : day + 1
        this.props.selectNewDateCB(day, i)
    }
    drawCalendarTable() {
        let range = n => [...Array(n).keys()]
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
                className={"calendar__day day" + (i === this.props.cellIndexSelected ? " selected" : "")}>
                <p>{day === -1 ? " " : day + 1}</p>
                <DottedTasks day={day + 1} tasks={this.props.tasks[day + 1]} completed={this.props.completed[day + 1]} />
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


class DottedTasks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            left: 0,
            top: 0,
            selectedTodo: -1,
            selectedCompleted: -1
        }
    }

    onMouseEnterHandler = (e, i) => {
        var classname = e.target.className
        console.log(e.nativeEvent.clientX)
        this.setState({
            top: e.target.offsetTop,
            left: e.nativeEvent.clientX,
            selectedTodo: classname[0] === "t" ? i : -1,
            selectedCompleted: classname[0] === "c" ? i : -1
        })
    }
    onMouseLeaveHandler = (e) => {
        this.setState({
            selectedTodo: -1,
            selectedCompleted: -1
        })
    }
    render() {
        console.log(this.props.completed)
        return (
            <div>
                <div className="taskDots">
                    {this.props.completed ? this.props.completed.map((task, i) => {
                        return (
                            <div
                                onMouseEnter={(e) => this.onMouseEnterHandler(e, i)}
                                onMouseLeave={this.onMouseLeaveHandler}
                                className={"completedDots " + this.props.day + "DotDay"}>●
                                <div
                                    key={i}
                                    style={{ top: this.state.top + 30, left: this.state.left }}
                                    className={"todoDotsDescription" + (this.state.selectedCompleted === i ? " show" : "")}>
                                    <p class="dotTitle">{task.content}</p>
                                    <p>{"Finished on: " + task["due"].slice(11, 16)}</p>
                                </div>
                            </div>
                        )
                    }) : <div className="completedDots"></div>}
                </div>
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
                                    className={"todoDotsDescription" + (this.state.selectedTodo === i ? " show" : "")}>
                                    <p class="dotTitle">{task.content}</p>
                                    <p>{task["due"].slice(11, 16) || "No scheduled Time"}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

class Calendar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            APIToken: document.cookie || 0,
            username: "Guest",
            tasks: "",
            completed: ""
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
            dayInMonth: new Date(year, month, 0).getDate(),
        })
        this.state.APIToken && this.fetchMonthlyData(this.state.APIToken, month, year)
    }

    fetchMonthlyData = (APItoken, month, year) => {
        this.setState({
            dataLoaded: false
        })
        return fetch(`http://127.0.0.1:5000/connect?api=${APItoken}&month=${month}&year=${year}`) //Else connect via APItoken
            .then(res => res.json())
            .then((res) => {
                localStorage.setItem(res.user.full_name, APItoken)
                document.cookie = APItoken
                this.setState({
                    APIToken: APItoken,
                    username: res.user.full_name,
                    tasks: this.memoizeTasks(res.tasks) || [],
                    completed: this.memoizeTasks(res.completed) || [],
                    dataLoaded: true
                })
            })
    }
    memoizeTasks = (tasks) => {
        var tasksTable = {}

        for (var i of tasks) {
            var date = i["due"].slice(8, 10)
            date = date.replace(/^0+/, '')
            tasksTable[date] === undefined ?
                tasksTable[date] = [i] : tasksTable[date].push(i)
        }
        return tasksTable
    }

    updateAPIToken = (APItoken) => {
        !APItoken ? (() => {
            this.setState({  //Logout to guest
                APIToken: 0,
                username: "Guest",
                tasks: "",
                completed: "",
                dataLoaded: false,
            })
            alert("You're now browsing as Guest")
        })(this)
            :
            this.fetchMonthlyData(APItoken, this.state.month, this.state.year)
                .then(() => alert(`Welcome, ${this.state.username}! The connection was successful`))
                .catch(err => alert(err, "Something went wrong.\nPlease Check if your API key was correct"))
    }

    render() {
        return (
            <html>
                <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                </head>
                <div className="container-fluid">

                    <div className="row">
                        <div className="col-lg-2">
                            <SideBar APITokenCB={this.updateAPIToken} {...this.state} />
                        </div>
                        <div className="col-lg-9">
                            {
                                this.state.dataLoaded || this.state.username === "Guest" ?
                                    <div>
                                        <CalendarFunctionBar {...this.state} getMonthCB={this.getMonthDetail} />
                                        <CalendarContents {...this.state} />
                                    </div> :
                                    <div>loading</div>
                            }
                        </div>
                        <div className="col-lg-1">
                        </div>
                    </div>
                </div>
            </html>
        )
    }
}


class App extends React.Component {
    render() {
        return (
            <Calendar />
        )
    }
}



export default App
