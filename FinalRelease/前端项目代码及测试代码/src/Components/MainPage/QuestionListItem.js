import React from "react";
import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';
import {Card, Avatar, message, Button} from 'antd';
import {LikeFilled, LikeOutlined} from '@ant-design/icons';
import {apiUrl} from "../../UrlConfig";
import {getRequest} from "../../Utils/Ajax";

import {history} from "../../Utils/History";

const {Meta} = Card;


class QuestionListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: null,
            user: null,
            tags: '',
            like: false,
            likeNum: 0,
            expertField:'',
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
            tags: tags,
            likeNum: this.props.question.likeNum,
        });

        let urlUser = apiUrl + '/user/get-one';
        let UserJson = {
            id: this.props.question.userId
        };
        getRequest(urlUser, UserJson)
            .then((data) => {

                if (data.status === 0) {
                    this.setState({
                        user: data.data.user,
                    })
                } else {
                    message.error(data.msg);

                }
            });

        let urlRelate = apiUrl + '/relateToQuestion';
        let relateJson = {
            userId: localStorage.getItem('userId'),
            questionId: this.props.question.questionId,
        };
        getRequest(urlRelate, relateJson)
            .then((data) => {

                if (data.status === 0) {
                    this.setState({
                        like: data.data.like,

                    })
                } else {
                    message.error(data.msg);

                }
            })


        let url = apiUrl + '/getExpertBadge';
        let getJson = {
            userId: this.props.question.userId
        };
        let callback = data => {
            if (data.status === 0) {
                if (data.data !== null)
                    this.setState({expertField: data.data.field});
            }
        };
        getRequest(url, getJson, callback)
            .then((data) => {
                callback(data);
            });

    };

    GoDetailQuestion = () => {
        history.push({pathname: '/QuestionDetailPage', state: {questionId: this.state.question.questionId}});
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


                if (data.status === 0) {
                    this.setState({
                        like: !this.state.like,
                        likeNum: (this.state.like) ? this.state.likeNum - 1 : this.state.likeNum + 1,
                    })
                } else {
                    message.error(data.msg);

                }
            })

    };
    GotoPersonPage = () => {
        history.push({pathname: '/PersonPage', state: {userId: this.state.question.userId}})
    };

    render() {
        const  reactNode = () => <span className='style'>{this.state.user === null ? '获取中' : this.state.user.nickname} &nbsp;&nbsp; {this.state.expertField!=='' && <div className="status" style={{color:"orange",fontSize:"14px"}}>{"★"+this.state.expertField}</div>}</span>;

        return (
            <li className="article-entry standard">
                <Card style={{width: 350, marginTop: 6}} bordered={false}>
                    <Meta
                        onClick={this.GotoPersonPage}
                        avatar={
                            <Avatar
                                src={this.state.user === null || this.state.user.avatar === '' ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" : this.state.user.avatar}/>
                        }
                        title={reactNode()}
                    />
                    {(this.state.question === null) ?
                        <div/>
                        :
                        <span
                            onClick={this.GoDetailQuestion}
                            className="article-meta">{this.state.question.createTime.year}-{this.state.question.createTime.month}-{this.state.question.createTime.date} {this.state.question.createTime.hours}:{this.state.question.createTime.minutes}
                            <a title="View all posts in Server &amp; Database"
                               style={{
                                   color: "red",
                                   fontSize: '5px'
                               }}> &nbsp;&nbsp;{this.state.tags}

                            </a>
                            <p style={{color: 'black'}}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.question.header}
                            </p>
                    </span>
                    }
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
                </Card>
            </li>
        )
    }
}

export default QuestionListItem;
