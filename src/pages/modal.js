import * as React from "react"

class ModalTemplate extends React.Component {
    checkTab(){
        var tab_clicked = this.props.tab
        console.log(this.props.tab)
        if (tab_clicked == "Login"){
            return (<LoginModal/>)
        }
        else if (tab_clicked == "Calendar"){
            return (<CalendarModal/>)
        }
        else if (tab_clicked == "Create_Tasks"){
            return (<CreateTaskModal/>)
        }
        else if (tab_clicked == "Task_Templates"){
            return (<TaskTemplateModal/>)
        }
    }

    render() {
        const contentToRender = this.checkTab()
        return (
            <div className={"modal " + this.props.tab + "_modal_lg"} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.tab}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {contentToRender}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">Save changes</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class LoginModal extends React.Component {
    render(){
        return(
            <div>temporary</div>
        )
    }
}
class CalendarModal extends React.Component {
    render(){
        return(
            <div>temporary</div>
        )
    }
}
class CreateTaskModal extends React.Component {
    render(){
        return(
            <div>temporary</div>
        )
    }
}
class TaskTemplateModal extends React.Component {
    render(){
        return(
            <div>temporary</div>
        )
    }
}


export {ModalTemplate, LoginModal, CalendarModal, CreateTaskModal, TaskTemplateModal }