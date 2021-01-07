import React from "react";
import "../assets/styles/style.css"
import "../assets/demo/style-demo.css"
import Information from "../SubViews/PersonPage/Information";
import QuestionAnswered from "../SubViews/PersonPage/QuestionAnswered";
import QuestionRaised from "../SubViews/PersonPage/QuestionRaised";
import QuestionCollected from "../SubViews/PersonPage/QuestionCollected";
import EditInformation from "../SubViews/PersonPage/EditInformation";
import Following from "../SubViews/PersonPage/Following";
import Follower from "../SubViews/PersonPage/Follower";
import Header from "../Components/Header";
import Foot from "../Components/Foot";
import {apiUrl} from "../UrlConfig";
import {message,Button} from "antd";
import {CrownTwoTone} from '@ant-design/icons';
import {history} from "../Utils/History";
import {postRequest, getRequest} from "../Utils/Ajax";

class PersonPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aimUserId: '',
            page: 0,//0-个人信息，1-参与的问题，2-发布的问题，3-收藏，4-编辑, 5-关注, 6-粉丝
            user: {},
            userAuth: {},
            regularUser: {},
            adminUser: {},
            expertField:'',
        }
    }

    UNSAFE_componentWillMount() {
        if (this.props.location.state===undefined)
            this.state.aimUserId=localStorage.getItem("lastPersonPage");
        else
        {
            this.state.aimUserId=this.props.location.state.userId;
            localStorage.setItem("lastPersonPage",this.props.location.state.userId);
        }
        this.fetchUser();
        this.getExpertBadge();
    }

    pageChange = (value) => {
        this.setState({page:value});
    };

    fetchUser = () =>{
        let url = apiUrl + '/user/get-some';
        let idArray = [];
        idArray[0] = this.state.aimUserId;
        let postJson = {
            checkFollow : true,
            userId : localStorage.getItem('userId'),
            idArray : idArray,
        };
        let callback = data => {
            if (data.status === 0) {
                this.setState({
                    user:data.data.userList[0].user,
                    userAuth:data.data.userList[0].userAuth,
                    regularUser:data.data.userList[0].regularUser,
                    adminUser:data.data.userList[0].adminUser,
                })
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
            });
    };

    getExpertBadge = () =>{
        let url = apiUrl + '/getExpertBadge';
        let getJson = {
            userId : this.state.aimUserId,
        };
        let callback = data => {
            if (data.status === 0) {
                if (data.data !== null)
                    this.setState({expertField:data.data.field});
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
            });
    }

    editInformation = (avatar, nickname,age,gender, mailAddr, phoneNum, profile) =>{
        let user = this.state.user;
        let userAuth = this.state.userAuth;
        let regularUser = this.state.regularUser;
        user.avatar = avatar;
        user.nickname = nickname;
        user.age = age;
        user.gender = gender;
        userAuth.mailAddr = mailAddr;
        user.phoneNum = phoneNum;
        regularUser.profile = profile;
        this.setState({
            user:user,
            userAuth:userAuth,
            regularUser:regularUser,
        })
    };

    handleFollow = () =>{
        let url = (this.state.user.isFollow===false) ? apiUrl + '/follow/follow' : apiUrl + '/follow/remove';
        let followIds = [];
        followIds[0] = this.state.aimUserId;
        let postJson = {
            userId: localStorage.getItem("userId"),
            followIds: followIds,
        };
        let callback = data => {
            if (data.status === 0) {
                this.fetchUser();
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
            <div>
                <main className="main" >
                    <div className="header-image">
                        <Header/>
                        <div className="js-parallax"
                             style={{backgroundImage: "url(" + require('../images/main-bg.jpg') + ""}}/>
                    </div>

                    <div className="container gutter-top">
                        <header className="header box">
                            <div className="header__left">
                                <div>
                                    <div className="header__photo">
                                        <img className="header__photo-img" src={this.state.user.avatar}
                                             alt={this.state.user.nickname}/>
                                    </div>
                                    {this.state.aimUserId !== localStorage.getItem("userId") && this.state.user.isFollow &&
                                        <Button style={{marginLeft:"18%",marginTop:"5%",backgroundColor:"#faad14",color:"white"}}
                                            shape={"round"} onClick={this.handleFollow}>取消关注</Button>
                                    }
                                    {this.state.aimUserId !== localStorage.getItem("userId") && !this.state.user.isFollow &&
                                    <Button style={{marginLeft:"28%",marginTop:"5%",backgroundColor:"#faad14",color:"white"}}
                                            shape={"round"} onClick={this.handleFollow}>关注</Button>
                                    }
                                </div>
                                <div className="header__base-info">
                                    <h4 className="title titl--h4" style={{fontSize:"30px"}}>{this.state.user.nickname}
                                        {this.state.expertField!=='' && <CrownTwoTone style={{fontSize:"20px",width:"40px"}}/>}</h4>
                                    <div className="status" >{this.state.user.gender?"男":"女"}</div>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <div className="status" >{this.state.user.age+"岁"}</div>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {this.state.expertField!=='' && <div className="status" style={{color:"orange",fontSize:"16px"}}>{"★"+this.state.expertField}</div>}
                                    <br/>
                                    {/*<div className="status" style={{fontSize:"20px"}}>{this.state.regularUser.profile}</div>*/}
                                    <ul className="header__social" style={{marginLeft: 0}}>
                                        <li><a href="https://www.facebook.com"><i className="font-icon icon-facebook1"/></a>
                                        </li>
                                        <li><a href="https://www.twitter.com"><i
                                            className="font-icon icon-twitter1"/></a></li>
                                        <li><a href="https://www.instagram.com"><i
                                            className="font-icon icon-instagram1"/></a></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="header__right">
                                <ul className="header__contact">
                                    <li><span className="overhead">邮箱</span>{this.state.userAuth.mailAddr}</li>
                                    <li><span className="overhead">联系方式</span>{this.state.user.phoneNum}</li>
                                </ul>
                                <ul className="header__contact">
                                    <li><span className="overhead">提问</span>{this.state.regularUser.questionNum}</li>
                                    <li><span className="overhead">回答</span>{this.state.regularUser.answerNum}</li>
                                </ul>
                                <ul className="header__contact">
                                    <li><span className="overhead" ><a>关注</a></span>
                                        <a onClick={() => this.pageChange(5)}>{this.state.regularUser.followNum}</a></li>
                                    <li><span className="overhead" ><a>粉丝</a></span>
                                        <a onClick={() => this.pageChange(6)}>{this.state.regularUser.fansNum}</a></li>
                                </ul>
                            </div>
                        </header>

                        <div className="row sticky-parent">
                            <aside className="col-12 col-md-12 col-lg-2">
                                <div className="sidebar box sticky-column">
                                    <ul className="nav">
                                        <li className="nav__item">
                                            <a className={this.state.page === 0 ? "active" : ""}
                                               onClick={() => this.pageChange(0)}>
                                                <i className="icon-user-check"
                                                   style={{marginLeft: "35%", paddingTop: "25%", paddingBottom: "5%"}}/><br/>个人信息</a>
                                        </li>
                                        <li className="nav__item">
                                            <a className={this.state.page === 1 ? "active" : ""}
                                               onClick={() => this.pageChange(1)}>
                                                <i className="icon-file-text"
                                                   style={{marginLeft: "30%", paddingTop: "25%", paddingBottom: "5%"}}/><br/>回答的问题</a>
                                        </li>
                                        <li className="nav__item">
                                            <a className={this.state.page === 2 ? "active" : ""}
                                               onClick={() => this.pageChange(2)}>
                                                <i className="icon-cast"
                                                   style={{marginLeft: "30%", paddingTop: "25%", paddingBottom: "5%"}}/><br/>发表的问题</a>
                                        </li>
                                        <li className="nav__item">
                                            <a className={this.state.page === 3 ? "active" : ""}
                                               onClick={() => this.pageChange(3)}>
                                                <i className="icon-book-open"
                                                   style={{marginLeft: "32%", paddingTop: "25%", paddingBottom: "5%"}}/><br/>收藏</a>
                                        </li>
                                        {this.state.aimUserId === localStorage.getItem("userId") &&
                                        <li className="nav__item">
                                            <a className={this.state.page === 4 ? "active" : ""}
                                               onClick={() => this.pageChange(4)}>
                                                <i className="icon-box"
                                                   style={{marginLeft: "32%", paddingTop: "25%", paddingBottom: "5%"}}/><br/>编辑</a>
                                        </li>}
                                    </ul>
                                </div>
                            </aside>

                            {this.state.page === 0 && <Information profile={this.state.regularUser.profile}/>}
                            {this.state.page === 1 && <QuestionAnswered aimUserId={this.state.aimUserId}/>}
                            {this.state.page === 2 && <QuestionRaised aimUserId={this.state.aimUserId} nickname={this.state.user.nickname}/>}
                            {this.state.page === 3 && <QuestionCollected aimUserId={this.state.aimUserId}/>}
                            {this.state.page === 4 && this.state.aimUserId === localStorage.getItem("userId") &&
                                <EditInformation avatar={this.state.user.avatar}
                                    nickname={this.state.user.nickname}
                                    age={this.state.user.age}
                                    gender={this.state.user.gender}
                                    mailAddr={this.state.userAuth.mailAddr}
                                    phoneNum={this.state.user.phoneNum}
                                    profile={this.state.regularUser.profile}
                                    editInformation={this.editInformation}/>}
                            {this.state.page === 5 && <Following aimUserId={this.state.aimUserId}/>}
                            {this.state.page === 6 && <Follower aimUserId={this.state.aimUserId}/>}
                        </div>

                    </div>
                    <footer className="footer">© SJTU Spill Your Heart</footer>
                </main>
                <Foot/>
            </div>
        )
    }
}

export default PersonPage;
