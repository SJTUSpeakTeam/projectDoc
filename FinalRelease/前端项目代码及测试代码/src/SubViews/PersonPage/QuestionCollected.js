import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import QuestionItem from "../../Components/PersonPage/QuestionItem";
import {apiUrl} from "../../UrlConfig";
import {message} from "antd";
import {history} from "../../Utils/History";
import {getRequest, postRequest} from "../../Utils/Ajax";

class QuestionCollected extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            aimUserId:this.props.aimUserId,
            QuestionCollected:[],

            questions:null
        }
    }

    UNSAFE_componentWillMount() {
        this.getQuestionCollected();
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            aimUserId:nextProps.aimUserId,
        })
    }

    getQuestionCollected = ()=>{
        let url = apiUrl + '/getUserCollectQuestions';
        let getJson = {
            beginQuestionId:-1,
            userId:this.state.aimUserId,
        };
        let callback = data => {
            if (data.status === 0) {
                this.state.QuestionCollected=data.data.questions;
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
        this.getQuestionCollected();
        message.success("删除成功！");
    }

    fetchNickname = () =>{
        let url = apiUrl + '/user/get-some';
        let idArray = [];
        for (let k=0;k< this.state.QuestionCollected.length;k++)
            idArray[k] = this.state.QuestionCollected[k].userId;
        let postJson = {
            idArray : idArray,
        };
        let callback = data => {
            if (data.status === 0) {
                let QuestionCollected = this.state.QuestionCollected;
                for (let k in data.data.userList)
                    QuestionCollected[k].nickname = data.data.userList[k].user.nickname;
                this.setState({
                    QuestionCollected:QuestionCollected,
                    questions:QuestionCollected.map(q => <QuestionItem header={q.header} author={q.nickname}
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
                        <h1 className="title title--h1 first-title title__separate">收藏</h1>
                    </div>

                    {this.state.QuestionCollected.length>0?
                    <div className="news-grid">
                        {this.state.questions}
                    </div>:
                    <p style={{fontSize:"20px",color:"gray",marginLeft:"43%"}}>暂无收藏</p> }
                </div>
            </div>
        )
    }
}

export default QuestionCollected;


