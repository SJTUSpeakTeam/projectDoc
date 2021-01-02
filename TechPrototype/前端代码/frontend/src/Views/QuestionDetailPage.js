import React from "react";
import Header from "../Components/Header";
import Search from '../Components/Community/Search'
import Content from "../Components/Community/Content";
import {Button, Col, Divider, Row, Modal, Input, message, List} from "antd";

import {CommentOutlined, LikeFilled, LikeOutlined, ShareAltOutlined} from "@ant-design/icons";
import QuestionContent from "../Components/QusetionDetail/QusetionContent";
import QuestionReply from "../Components/QusetionDetail/QuestionReply";
import {Link} from "react-router-dom";
import '../Css/Header.css';
import '../Css/bootstrap5152.css?ver=1.0';
import '../Css/responsive5152.css?ver=1.0';
import '../Css/main5152.css?ver=1.0';
import '../style.css';
import '../Css/Main.css'
import CommentSpeak from "../Components/CommentSpeak";
import {Skeleton, Switch, Card, Avatar} from 'antd';


import Foot from "../Components/Foot";
import Classification from "../Components/MainPage/Classification";
import PersonCard from "../Components/MainPage/PersonCard";
import {apiUrl} from "../UrlConfig";
import {getRequest} from "../Utils/Ajax";
import QuestionListItem from "../Components/MainPage/QuestionListItem";

const {TextArea} = Input;
const {Meta} = Card;

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
                console.log(data);
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
            })
            .catch((error) => {
                console.log(error);
            });
        let urlAnswer = apiUrl + '/getAnswerByQuestion';
        let answerJson = {
            beginAnswerId: this.state.beginAnswerId,
            questionId: questionId,
        };
        getRequest(urlAnswer, answerJson)
            .then((data) => {
                console.log(data);
                if (data.status === 0) {
                    for (let i = 0; i < data.data.answer.length; i++) {
                        data.data.answer[i].createTime.year+=1900;
                        data.data.answer[i].createTime.month+=1;
                        data.data.answer[i].createTime.hours+=8;
                    }
                    this.setState({
                        questionAnswer: data.data.answer,
                    })
                } else {
                    message.error(data.msg);
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }

    render() {
        return (
            <div>
                <Header/>
                <Search/>

                <div className="page-container">
                    <div className="container">
                        <div className="row">

                            <div className="span8 page-content">

                                {(this.state.question === null) ? <div/> :
                                    <QuestionContent question={this.state.question}/>}

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
