import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import {history} from "../../Utils/History";
import {Button, message} from "antd";
import {deleteRequest} from "../../Utils/Ajax";
import {apiUrl} from "../../UrlConfig";

class QuestionItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            header: this.props.header,
            author: this.props.author,
            theme:this.props.theme,
            questionId:this.props.questionId,
            userId:this.props.userId,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            header: nextProps.header,
            author: nextProps.author,
            theme:nextProps.theme,
            questionId:nextProps.questionId,
            userId:nextProps.userId,
        })
    }

    GoDetailQuestion = () => {
        history.replace({pathname: '/QuestionDetailPage', state: {questionId: this.state.questionId}});
    };

    GoPersonPage=()=>{

        history.replace({pathname: '/PersonPage', state: {userId: this.state.userId}});
        window.location.reload();
    };

    deleteQuestion = () =>{
        let url = apiUrl + '/deleteQuestion';
        let deleteJson = {
            questionId: this.state.questionId,
            userId: this.state.userId,
        };
        let callback = data => {
            if (data.status === 0) {
                this.props.afterDeleteQuestion();
            }
            if (data.status === -1) {
                message.error(data.msg);
            }
            if (data.status === 2) {
                message.error('登录失效');
                history.replace("/SignInPage")
            }
        };
        deleteRequest(url, deleteJson, callback)
            .then((data) => {
                callback(data);
            })
    }

    render() {
        return (
            <article className="news-item box" >
                <div className="news-item__caption">
                    <h3 className="title title--h3" style={{float:"left",width:"70%"}}><a onClick={this.GoDetailQuestion}>{this.state.header}</a></h3>
                    {this.state.userId === localStorage.getItem("userId")-'0' &&
                        <Button type="link" style={{color:"black",float:"right",marginRight:"0"}}
                                onClick={this.deleteQuestion}>删除 </Button> }
                    <p style={{width:"70%",float:"left",fontSize:"15px"}}><a onClick={this.GoPersonPage}>{this.state.author}</a></p>
                    <p style={{float:"right",color:"#ff7a45"}}>{this.state.theme}</p>
                </div>
            </article>
        )
    }

}

export default QuestionItem;
