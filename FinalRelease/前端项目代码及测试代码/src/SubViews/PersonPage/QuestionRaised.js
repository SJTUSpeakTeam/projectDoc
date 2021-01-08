import React from "react";
import { message} from 'antd';
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import QuestionItem from "../../Components/PersonPage/QuestionItem";
import {apiUrl} from "../../UrlConfig";
import {history} from "../../Utils/History";
import {getRequest} from "../../Utils/Ajax";

class QuestionRaised extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            aimUserId:this.props.aimUserId,
            QuestionRaised:[],
            nickname:this.props.nickname
        }
    }

    UNSAFE_componentWillMount(){
        this.getQuestionRaised();
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            aimUserId:nextProps.aimUserId,
            nickname:nextProps.nickname,
        })
    }

    getQuestionRaised = ()=>{
        let url = apiUrl + '/getUserQuestions';
        let getJson = {
            beginQuestionId:-1,
            userId:this.state.aimUserId,
        };
        let callback = data => {
            if (data.status === 0) {
                this.setState({QuestionRaised:data.data.questions});
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
        this.getQuestionRaised();
        message.success("删除成功！");
    }

    render() {
        const questions = this.state.QuestionRaised.map(q => <QuestionItem header={q.header} author={this.state.nickname}
                           theme={q.theme} questionId={q.questionId} userId={q.userId} afterDeleteQuestion={this.afterDeleteQuestion}/>);
        return (
            <div className="col-12 col-md-12 col-lg-10">
                <div className="box box-content">
                    <div className="pb-2">
                        <h1 className="title title--h1 first-title title__separate">提出的问题</h1>
                    </div>

                    {this.state.QuestionRaised.length>0?
                        <div className="news-grid">
                            {questions}
                        </div>:
                        <p style={{fontSize:"20px",color:"gray",marginLeft:"40%"}}>暂未提出问题</p> }
                </div>
            </div>
        )
    }
}

export default QuestionRaised;


