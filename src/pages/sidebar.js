import * as React from "react"
import ReactModalTemplate from "./modal"

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


export default SideBar