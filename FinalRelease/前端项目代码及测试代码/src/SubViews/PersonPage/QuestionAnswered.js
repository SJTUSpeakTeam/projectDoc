import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import QuestionItem from "../../Components/PersonPage/QuestionItem";
import {apiUrl} from "../../UrlConfig";
import {message} from "antd";
import {history} from "../../Utils/History";
import {getRequest,postRequest} from "../../Utils/Ajax";

class QuestionAnswered extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            aimUserId:this.props.aimUserId,
            QuestionAnswered:[],

            questions:null
        }
    }

    UNSAFE_componentWillMount() {
        this.getQuestionAnswered();
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            aimUserId:nextProps.aimUserId,
        })
    }

    getQuestionAnswered = ()=>{
        let url = apiUrl + '/getUserAnswerQuestions';
        let getJson = {
            beginQuestionId:-1,
            userId:this.state.aimUserId,
        };
        let callback = data => {
            if (data.status === 0) {
                this.state.QuestionAnswered=data.data.questions;
                this.fetchNickname();
            }
            if (data.status === -1) {
                message.error(data.msg);
            }
            if (data.status === 2) {
                message.error('登录失效');
                history.replace("/SignInPage")
            }
        };
        getRequest(url, getJson, callback)
            .then((data) => {
                callback(data);
            })

    };

    afterDeleteQuestion = () =>{
        this.getQuestionAnswered();
        message.success("删除成功！");
    }

    fetchNickname = () =>{
        let url = apiUrl + '/user/get-some';
        let idArray = [];
        for (let k=0;k< this.state.QuestionAnswered.length;k++)
            idArray[k] = this.state.QuestionAnswered[k].userId;
        let postJson = {
            idArray : idArray,
        };
        let callback = data => {
            if (data.status === 0) {
                let QuestionAnswered = this.state.QuestionAnswered;
                for (let k in data.data.userList)
                    QuestionAnswered[k].nickname = data.data.userList[k].user.nickname;
                this.setState({
                    QuestionAnswered:QuestionAnswered,
                    questions:QuestionAnswered.map(q => <QuestionItem header={q.header} author={q.nickname}
                              theme={q.theme} questionId={q.questionId} userId={q.userId} afterDeleteQuestion={this.afterDeleteQuestion}/>)
                });
            }
            if (data.status === -1) {
                message.error(data.msg);
            }
            if (data.status === 2) {
                message.error('登录失效');
                history.replace("/SignInPage")
            }
        };
        postRequest(url, postJson, callback)
            .then((data) => {
                callback(data);
            })

    };

    render() {

        return (
            <div className="col-12 col-md-12 col-lg-10">
                <div className="box box-content">
                    <div className="pb-2">
                        <h1 className="title title--h1 first-title title__separate">参与的问题</h1>
                    </div>

                    {this.state.QuestionAnswered.length>0?
                        <div className="news-grid">
                            {this.state.questions}
                        </div>:
                        <p style={{fontSize:"20px",color:"gray",marginLeft:"40%"}}>暂未回答问题</p> }
                </div>
            </div>
        )
    }
}

export default QuestionAnswered;


