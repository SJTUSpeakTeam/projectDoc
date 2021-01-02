import React from "react";
import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';
import {Skeleton, Switch, Card, Avatar, message, Button} from 'antd';
import {EditOutlined, EllipsisOutlined, LikeFilled, LikeOutlined, SettingOutlined} from '@ant-design/icons';
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

                console.log(data)
                if (data.status === 0) {
                    this.setState({
                        like: data.data.like,

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
    }
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

    }

    render() {
        return (
            <li className="article-entry standard">
                <Card style={{width: 350, marginTop: 6}} bordered={false}>
                    <Meta
                        onClick={this.GoDetailQuestion}
                        avatar={
                            <Avatar
                                src={this.state.user === null || this.state.user.avatar === '' ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" : this.state.user.avatar}/>
                        }
                        title={this.state.question.header}

                    />
                    {(this.state.question === null) ?
                        <div/>
                        :
                        <span
                            className="article-meta">{this.state.question.createTime.year}-{this.state.question.createTime.month}-{this.state.question.createTime.date}  {this.state.question.createTime.hours}:{this.state.question.createTime.minutes}
                            <a title="View all posts in Server &amp; Database"
                               style={{
                                   color: "red",
                                   fontSize: '5px'
                               }}> &nbsp;&nbsp;{this.state.tags}
                        </a>
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
