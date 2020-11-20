import React from "react";
import {Button, Col, Divider, Row, Modal, Input, message} from "antd";


import {Link} from "react-router-dom";
import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';
import '../../Css/Main.css'

import {Skeleton, Switch, Card, Avatar} from 'antd';
import Foot from "../Foot";
import {apiUrl} from "../../UrlConfig";
import {getRequest, postRequest} from "../../Utils/Ajax";
import {LikeFilled, LikeOutlined} from "@ant-design/icons";
import CommentSpeak from "../CommentSpeak";

const {TextArea} = Input;
const {Meta} = Card;

class QuestionContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: this.props.question,
            tags: '',
            user: null,
            collect: false,
            like: false,
            likeNum:0,
        };
    }

    UNSAFE_componentWillMount() {
        let question = this.props.question;

        let tags = '';
        console.log(question);
        for (let i = 0; i < this.props.question.tags.length; i++) {
            tags += ' ' + " " + this.props.question.tags[i].content;

        }
        this.setState({
            question: question,
            tags: tags,
            likeNum:question.likeNum,
        });
        let urlUser = apiUrl + '/user/get-one';
        let UserJson = {
            id: this.props.question.userId
        };
        getRequest(urlUser, UserJson)
            .then((data) => {
                console.log(data);
                if (data.status === 0) {
                    this.setState({
                        user: data.data.user,
                    })
                } else {
                    message.error(data.msg);

                }
            })
            .catch((error) => {
                console.log(error);
            });
        let urlRelate = apiUrl + '/relateToQuestion';
        let relateJson = {
            userId: localStorage.getItem('userId'),
            questionId: this.props.question.questionId,
        };
        getRequest(urlRelate, relateJson)
            .then((data) => {
                console.log(data);
                if (data.status === 0) {
                    this.setState({
                        like: data.data.like,
                        collect:data.data.collect,
                    })
                } else {
                    message.error(data.msg);

                }
            })
            .catch((error) => {
                console.log(error);
            });
        this.getAnswer();

    };

    getAnswer = () => {

    };
    handlePost = (content) => {
        if (content === '')
            return;
        let url = apiUrl + '/postAnswer';
        console.log(localStorage.getItem('userId'));
        let postJson = {
            questionId: this.state.question.questionId,
            userId: parseInt(localStorage.getItem('userId')),
            content: content
        };
        let callback = data => {
            console.log(data);
            if (data.status === 0) {
                message.info("回复问题成功")
                window.location.reload();
            } else {
                message.error(data.msg);
            }

        };
        postRequest(url, postJson, callback)
            .then((data) => {
                callback(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    collectionQuestion = () => {
        let urlCollect = apiUrl + '/collectQuestion';
        let collectJson = {
            userId: localStorage.getItem('userId'),
            questionId: this.state.question.questionId,
            collect: !this.state.collect,
        };
        getRequest(urlCollect, collectJson)
            .then((data) => {
                console.log(data);
                if (data.status === 0) {
                    this.setState({
                        collect: !this.state.collect,
                    })
                } else {
                    message.error(data.msg);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    changeLike = () => {
        let urlLike = apiUrl + '/likeQuestion';
        let likeJson = {
            userId: localStorage.getItem('userId'),
            questionId: this.state.question.questionId,
            like: !this.state.like,
        };
        getRequest(urlLike, likeJson)
            .then((data) => {
                console.log(data);
                if (data.status === 0) {
                    this.setState({
                        like: !this.state.like,
                        likeNum: (this.state.like) ? this.state.likeNum - 1 : this.state.likeNum + 1,
                    })
                } else {
                    message.error(data.msg);

                }
            })
            .catch((error) => {
                console.log(error);
            });

    };
    render() {
        return (
            <div>

                <article className=" type-post format-standard hentry clearfix">


                    <h1 className="post-title" style={{fontSize: '35px'}}> {this.state.question.header}
                    </h1>
                    <div className="post-meta clearfix">
                        <div style={{fontSize: '15px', display: "inline-block"}}>
                            <Avatar
                                src={this.state.user === null || this.state.user.avatar === '' ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" : this.state.user.avatar}
                                width={'30px'}/>
                        </div>
                        {
                            (this.state.user === null) ? <div/> : <div
                                style={{
                                    fontSize: '17px',
                                    display: "inline-block",
                                    color: "red"
                                }}> &nbsp; &nbsp;&nbsp;{this.state.user.nickname}
                            </div>
                        }
                        {(this.state.collect) ?
                            <div
                                style={{
                                    fontSize: '15px',
                                    display: "inline-block",
                                    float: "right",
                                    marginRight: '20px'
                                }}>
                                <Button style={{backgroundColor: "#d3adf7"}} size="middle" shape="round"
                                        onClick={this.collectionQuestion}>
                                    取消收藏
                                </Button>
                            </div> :
                            <div
                                style={{
                                    fontSize: '15px',
                                    display: "inline-block",
                                    float: "right",
                                    marginRight: '20px'
                                }}>
                                <Button style={{backgroundColor: "#d3adf7"}} size="middle" shape="round"
                                        onClick={this.collectionQuestion}>
                                    收藏问题
                                </Button>
                            </div>
                        }


                        <div style={{fontSize: '15px', display: "inline-block", float: "right", marginRight: '40px'}}>
                            <CommentSpeak handlePost={this.handlePost}/>
                        </div>

                    </div>
                    <div className="post-meta clearfix">
                        <span className="date">{this.state.question.createTime.year}-{this.state.question.createTime.month}-{this.state.question.createTime.date}  {this.state.question.createTime.hours}:{this.state.question.createTime.minutes}</span>
                        <span className="category"><a
                            title="View all posts in Server &amp; Database">{this.state.tags}</a></span>
                        <span className="comments"><a
                            title="Comment on Integrating WordPress with Your Website">{this.state.question.answerNum} 回复</a></span>
                        <div style={{float: "right"}}>
                            <Button style={{marginRight: '30px'}} type="link" size={""}
                                    icon={(this.state.like) ? <LikeFilled/> : <LikeOutlined/>} onClick={this.changeLike}>
                                <div style={{
                                    fontSize: '18px',
                                    float: "right",
                                    marginLeft: '10px'
                                }}>{this.state.likeNum}</div>
                            </Button>

                        </div>


                        <div>&nbsp;</div>
                        <div>&nbsp;</div>

                        <div style={{fontSize:16}} dangerouslySetInnerHTML={{__html:this.state.question.content}}/>

                    </div>
                </article>

            </div>
        );
    }
}

export default QuestionContent;
