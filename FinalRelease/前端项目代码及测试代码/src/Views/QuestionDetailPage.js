import React from "react";
import Header from "../Components/Header";
// import Search from '../Components/Community/Search'
import {message, List, Button} from "antd";

import QuestionContent from "../Components/QusetionDetail/QusetionContent";
import QuestionReply from "../Components/QusetionDetail/QuestionReply";

import '../Css/Header.css';
import '../Css/bootstrap5152.css?ver=1.0';
import '../Css/responsive5152.css?ver=1.0';
import '../Css/main5152.css?ver=1.0';
import '../style.css';
import '../Css/Main.css'



import Foot from "../Components/Foot";
import Classification from "../Components/MainPage/Classification";
import PersonCard from "../Components/MainPage/PersonCard";
import {apiUrl} from "../UrlConfig";
import {getRequest} from "../Utils/Ajax";
// import {history} from "../Utils/History";
import SearchBar from "../Components/MainPage/SearchBar";


class QuestionDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: null,
            beginAnswerId:-1,
            questionAnswer:[],
        };
    }

    UNSAFE_componentWillMount() {
        let questionId = this.props.location.state.questionId;

        let urlQuestion = apiUrl + '/getQuestion';

        let questionJson = {
            questionId: questionId,
        };

        getRequest(urlQuestion, questionJson)
            .then((data) => {

                if (data.status === 0) {
                    data.data.createTime.year+=1900;
                    data.data.createTime.month+=1;
                    data.data.createTime.hours+=8;
                    this.setState({
                        question: data.data,
                    })

                } else {
                    message.error(data.msg);

                }
            });
         this.getAnswer();
    }
    getAnswer=()=>{
        let questionId = this.props.location.state.questionId;
        let urlAnswer = apiUrl + '/getAnswerByQuestion';
        let answerJson = {
            beginAnswerId: this.state.beginAnswerId,
            questionId: questionId,
        };
        getRequest(urlAnswer, answerJson)
            .then((data) => {

                if (data.status === 0) {
                    let result = [];
                    for (let i = 0; i < this.state.questionAnswer.length; i++) {
                        result.push(this.state.questionAnswer[i]);
                    }
                    for (let i = 0; i < data.data.answer.length; i++) {
                        data.data.answer[i].createTime.year+=1900;
                        data.data.answer[i].createTime.month+=1;
                        data.data.answer[i].createTime.hours+=8;
                        result.push(data.data.answer[i]);
                    }
                    this.setState({
                        questionAnswer: result,
                        beginAnswerId: data.data.answer.length === 10 ? data.data.answer[9].answerId : -2
                    })
                } else {
                    message.error(data.msg);
                }
            })

    };
    render() {
        return (
            <div>
                <Header/>
                <SearchBar type={"1"}/>

                <div className="page-container">
                    <div className="container">
                        <div className="row">

                            <div className="span8 page-content">

                                {(this.state.question === null) ? <div/> :
                                    <QuestionContent question={this.state.question}/>}
                                {(this.state.questionAnswer.length===0) ? <div/> :
                                    <List
                                        itemLayout="vertical"
                                        size="large"
                                        split="false"
                                        pagination={false}
                                        dataSource={this.state.questionAnswer}
                                        renderItem={item => (
                                            <QuestionReply answer={item}/>
                                        )}
                                    />
                                }
                                {
                                    (this.state.beginAnswerId === -2) ? null :
                                        <Button type="link" onClick={() => this.getAnswer()}
                                                style={{marginLeft: '43%'}} size={"large"} >
                                            查看更多回答
                                        </Button>
                                }
                            </div>
                            <aside className="span3 page-content" style={{marginTop: 10}}>
                                <Classification/>
                                <PersonCard/>
                            </aside>
                        </div>
                    </div>
                </div>
                <Foot/>
            </div>
        );
    }
}

export default QuestionDetailPage;
