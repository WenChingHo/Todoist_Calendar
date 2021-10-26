import * as React from "react"
import ReactModal from 'react-modal'




ReactModal.setAppElement('#___gatsby')

class ReactModalTemplate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.MODALLIST = this.updateModalList()
    }

    static getDerivedStateFromProps(props, cur_state) {
        if (cur_state.APIToken !== props.APIToken) {
            return {
                APIToken: props.APIToken
            }
        }
        return null
    }

    updateModalList = () =>{
        this.MODALLIST = [
            <LoginModal {...this.state} {...this.props.state} APITokenCB={this.props.APITokenCB} />,
            <CaldendarModal />,
            <CreateTaskModal />,
            <TaskModal />
        ]
    }

    render() {
        this.updateModalList()
        const contentToLoad = this.MODALLIST[parseInt(this.props.state.currentTab)]
        return (
            <ReactModal
                id={this.props.state.tabName}
                style={contentToLoad}
                isOpen={this.props.state.isModalOpen}
                onRequestClose={this.props.CB}
                preventScroll={true}
            >
                <div onClick={this.props.CB} id="modalClose" aria-hidden="true">&times;</div>
                <div>{contentToLoad}</div>
            </ReactModal>

        )
    }
}

class LoginUserList extends React.Component {
    constructor(props) {
        super(props)
        this.UNWANTED_ENTRIES = ["graphiql:operationName", "ally-supports-cache"]
    }

    onChangeHandler = (e) => {
        var APItoken = localStorage.getItem(e.target.value)
        this.props.APITokenCB(APItoken)
    }
    render() {
        var entries = Object.entries(localStorage).map(([key, _], i) => (
            !this.UNWANTED_ENTRIES.includes(key) && <option key={i} value={key}>{key}</option>
        ))

        console.log("user",this.props.username)
        return (
            <select value={this.props.username} onChange={this.onChangeHandler} name="users" id="users">
                <option key="-1" value="Guest">Guest</option>
                {entries}
            </select>
        )
    }
}

class LoginModal extends React.Component {
    render() {
        return (
            <div>
                <p className="modalTitles">Connect to Todoist</p>
                <hr />
                <p className="smallIndent">Currently Connected As:</p>
                <div className="avatar">
                    <div className="avatar__img">
                        <img src="https://picsum.photos/70" alt="avatar" ></img>
                    </div>
                </div><br />

                <div id="loginUsername" >
                    <LoginUserList {...this.props} APITokenCB={this.props.APITokenCB}/>
                    <div className="smallIndent"> {this.props.APIToken === 0 ? "" : this.props.APIToken}</div>
                </div><br /><br />

                <label htmlFor="APIToken">Enter your Todoist API token to add new user:</label><br />
                <input type="text" id="APIToken" name="APIToken" /><br /><br />
                <button onClick={() => this.props.APITokenCB(document.getElementById("APIToken").value)}>submit</button>

            </div>

        )


    }
}
class CaldendarModal extends React.Component {
    render() {
        return (<p>CaldendarModal</p>)

    }
}
class CreateTaskModal extends React.Component {
    render() {
        return (<p>CreateTaskModal</p>)


    }
}
class TaskModal extends React.Component {
    render() {
        return (<p>TaskModal</p>)
    }
}
export default ReactModalTemplate
