import React from "react";


import {Button, message} from "antd";

import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';
import '../../Css/Main.css'

import {Avatar} from 'antd';

import {apiUrl} from "../../UrlConfig";
import {getRequest,deleteRequest} from "../../Utils/Ajax";


class QuestionReply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: this.props.answer,

            user: null,
            like: false,
            likeNum: 0,
            expertField:'',
        };
    }
    deleteReply=()=>{
        let urlUser = apiUrl + '/deleteAnswer';
        let UserJson = {
            answerId: this.state.answer.answerId,
            userId :this.state.user.userId
        };
        deleteRequest(urlUser, UserJson)
            .then((data) => {

                if (data.status === 0) {
                    window.location.reload();
                } else {
                    message.error(data.msg);

                }
            })
    };

    UNSAFE_componentWillMount() {
        this.setState({
            answer: this.props.answer,
        });
        let urlUser = apiUrl + '/user/get-one';
        let UserJson = {
            id: this.props.answer.userId
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
        let url = apiUrl + '/getExpertBadge';
        let getJson = {
            userId: this.props.answer.userId
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

    }

    render() {
        return (
            <div>

                <article className=" type-post format-standard hentry clearfix">
                    <div className="post-meta clearfix">
                        <div className="topic-avatar">
                            <a className="trigger-user-card main-avatar"
                               data-user-card="dusk"
                               aria-hidden="true">
                                <Avatar
                                    src={(this.state.user === null || this.state.user.avatar === '') ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" : this.state.user.avatar}
                                    width={'20px'}/>
                            </a>
                            <div className="poster-avatar-extra">

                            </div>
                        </div>
                        {(this.state.user === null) ? <div/> :
                            <div className="topic-body clearfix">
                                <div className="topic-meta-data">
                                    <div className="names trigger-user-card"
                                         style={{marginTop: '5px'}}><span
                                        className="first full-name"><div style={{fontSize: 15}}
                                                                         data-user-card="dusk">{this.state.user.nickname} &nbsp;&nbsp; {this.state.expertField!=='' && <div className="status" style={{color:"orange",fontSize:"14px"}}>{"★"+this.state.expertField}</div>}</div></span>
                                    </div>

                                    <div className="post-infos">
                                        <div className="post-info post-date">
                                            <a className="post-date" data-post-number="10"><span
                                                title="2020年11月4日 17:18" data-time="1604481501716"
                                                data-format="tiny"
                                                className="relative-date">{this.state.answer.createTime.year}-{this.state.answer.createTime.month}-{this.state.answer.createTime.date} {this.state.answer.createTime.hours}:{this.state.answer.createTime.minutes}</span></a>
                                        </div>
                                    </div>
                                    <div>
                                        &nbsp;&nbsp;&nbsp;
                                    </div>
                                    {(this.state.user!==null&&this.state.user.userId.toString()===localStorage.getItem('userId'))?<div>
                                        <Button size="small" shape="round" style={{backgroundColor: "#d3adf7"}} onClick={()=>this.deleteReply()}>删除</Button>
                                    </div>:null}
                                </div>
                                <div className="regular contents">
                                    <div className="cooked">
                                        <aside className="quote no-group" data-username="wangyutiao"
                                               data-post="1" data-topic="7928">
                                        </aside>
                                        <div style={{fontSize: 14}}
                                             dangerouslySetInnerHTML={{__html: this.state.answer.content}}/>

                                    </div>
                                </div>
                                <div className="topic-body clearfix">

                                </div>
                            </div>
                        }
                    </div>
                </article>

            </div>
        );
    }
}

export default QuestionReply;
