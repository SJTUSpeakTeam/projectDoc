import React from "react";
import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';
import {apiUrl} from "../../UrlConfig";
import {getRequest} from "../../Utils/Ajax";
import {Avatar, message} from "antd";

import {Button, Col, Divider, Row, Modal, Input,Image} from "antd";

import {CommentOutlined, LikeFilled, LikeOutlined, ShareAltOutlined} from "@ant-design/icons";
import {history} from "../../Utils/History";

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: this.props.question,
            user: [],
            like: false,
            likeNum: 0,
            tags:'',
        };
    }

    UNSAFE_componentWillMount() {
        this.state.question = this.props.question;
        let tags = '';
        for (let i = 0; i < this.props.question.tags.length; i++) {
            tags += ' ' + " " + this.props.question.tags[i].content;

        }
        this.setState({
            question: this.props.question,
            likeNum: this.props.question.likeNum,
            tags:tags
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
        }
        getRequest(urlRelate, relateJson)
            .then((data) => {
                console.log(data);
                if (data.status === 0) {
                    this.setState({
                        like: data.data.like
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
    GoDetailQuestion = () => {
        history.push({pathname: '/QuestionDetailPage', state: {questionId: this.state.question.questionId}});
    };

    render() {
        return (
            <article className="format-standard type-post hentry clearfix">

                <header className="clearfix">

                    <h3 className="post-title">
                        <Avatar
                            src={this.state.user === null || this.state.user.avatar === '' ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" : this.state.user.avatar} style={{width:25,height:25}}/>
                        <a style={{marginLeft: 10, marginTop: 100,fontSize:'30'}} onClick={this.GoDetailQuestion}>{this.state.question.header}</a>
                    </h3>

                    <div className="post-meta clearfix">
                        <span style={{color: "red"}}>{this.state.user.nickname}</span>
                        <span className="date" onClick={this.GoDetailQuestion}>{this.state.question.createTime.year}-{this.state.question.createTime.month}-{this.state.question.createTime.date}  {this.state.question.createTime.hours}:{this.state.question.createTime.minutes}</span>
                        <span className="category" onClick={this.GoDetailQuestion}><a
                                                      title="View all posts in Server &amp; Database">{this.state.tags}</a></span>
                        <span className="comments" onClick={this.GoDetailQuestion}><a
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
                    </div>

                </header>
                <p onClick={this.GoDetailQuestion}>
                    <div dangerouslySetInnerHTML={{__html:this.state.question.content}}/>
                </p>

            </article>
        )
    }
}

export default Content;
