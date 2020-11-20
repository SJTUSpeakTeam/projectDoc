import React from "react";
import "../assets/styles/style.css"
import "../assets/demo/style-demo.css"
import Information from "../SubViews/PersonPage/Information";
import QuestionAnswered from "../SubViews/PersonPage/QuestionAnswered";
import QuestionRaised from "../SubViews/PersonPage/QuestionRaised";
import QuestionCollected from "../SubViews/PersonPage/QuestionCollected";
import EditInformation from "../SubViews/PersonPage/EditInformation";
import Header from "../Components/Header";
import Foot from "../Components/Foot";
import {apiUrl} from "../UrlConfig";
import {message} from "antd";
import {history} from "../Utils/History";
import {postRequest,getRequest} from "../Utils/Ajax";

class PersonPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aimUserId: '',
            page: 0,//0-个人信息，1-参与的问题，2-发布的问题，3-收藏，4-编辑
            user: {},
                // "avatar": UrlString,
                // "createTime": DateTime,
                // "gender": true,
                // "nickname": "KONY",
                // "phoneNum": "17317790037",
            userAuth: {},
                // "mailAddr": "lhy159840@sjtu.edu.cn",
                // "userType": 2,
                // "humanStatus": "正常用户" // 用人能看懂的语言描述用户状态
            regularUser: {},   // 普通用户返回该值，管理员用户返回 adminUser
                // "answerNum": 0,
                // "commentNum": 0,
                // "fansNum": 0,
                // "followNum": 0,
                // "liftingTime": DateTime,
                // "profile": "这个用户很懒，还没有描述过自己~",
                // "questionNum": 0,
                // "status": 2,
                // "visitNum": 0
            adminUser: {}, // 管理员返回该值，普通用户返回 regularUser
                // "contentBanNum": 0,
                // "senWordNum": 0,
                // "userBanNum": 0,
            QuestionRaised:[],
            QuestionCollected:[],
            QuestionAnswered:[],
        }
    }

    UNSAFE_componentWillMount() {
        if (this.props.location.state===undefined)
        {
            console.log("undefined")
            history.replace("/MainPage");
        }
        else
        {
            this.state.aimUserId=this.props.location.state.userId;
            this.fetchUser();
        }

    }

    pageChange = (value) => {
        this.state.page = value;
        switch (value)
        {
            case 0://个人信息
                this.fetchUser();
                break;
            case 1://参与的问题
                this.setState({});
                break;
            case 2://发布的问题
                this.getQuestionRaised();
                break;
            case 3://收藏
                this.setState({});
                break;
            case 4://编辑
                this.setState({});
                break;
            default:break;
        }
    };

    fetchUser = () =>{
        let url = apiUrl + '/user/get-one';
        let getJson = {
            id : this.state.aimUserId,
        }
        let callback = data => {
            if (data.status === 0) {
                this.setState({
                    user:data.data.user,
                    userAuth:data.data.userAuth,
                    regularUser:data.data.regularUser,
                    adminUser:data.data.adminUser,
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
        getRequest(url, getJson, callback)
            .then((data) => {
                callback(data);
            })
            .catch((error)=>{
                console.log(error);
            });
    }

    getQuestionRaised = ()=>{
        let url = apiUrl + '/getUserQuestions';
        let getJson = {
            beginQuestionId:-1,
            userId:this.state.aimUserId,
        }
        let callback = data => {
            console.log(data)
            if (data.status === 0) {
                this.setState({QuestionRaised:data.data.questions})
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
            .catch((error)=>{
                console.log(error);
            });
    }

    getQuestionCollected = ()=>{
        let url = apiUrl + '/collectQuestion';
        let getJson = {
            beginQuestionId:-1,
            userId:this.state.aimUserId,
        }
        let callback = data => {
            console.log(data)
            if (data.status === 0) {
                this.setState({QuestionRaised:data.data.questions})
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
            .catch((error)=>{
                console.log(error);
            });
    }

    editInformation = (avatar, nickname,gender, mailAddr, phoneNum, profile) =>{
        let user = this.state.user;
        let userAuth = this.state.userAuth;
        let regularUser = this.state.regularUser;
        user.avatar = avatar;
        user.nickname = nickname;
        user.gender = gender;
        userAuth.mailAddr = mailAddr;
        user.phoneNum = phoneNum;
        regularUser.profile = profile;
        this.setState({
            user:user,
            userAuth:userAuth,
            regularUser:regularUser,
        })
    }


    render() {
        return (
            <div>
                <main className="main" >
                    <div className="header-image">
                        <Header/>
                        <div className="js-parallax"
                             style={{backgroundImage: "url(" + require('../assets/img/image_header.jpg') + ""}}/>
                    </div>

                    <div className="container gutter-top">
                        <header className="header box">
                            <div className="header__left">
                                <div className="header__photo">
                                    <img className="header__photo-img" src={this.state.user.avatar}
                                         alt={this.state.user.nickname}/>
                                </div>
                                <div className="header__base-info">
                                    <h4 className="title titl--h4" style={{fontSize:"28px"}}>{this.state.user.nickname}</h4>
                                    <div className="status" >{this.state.user.gender?"男":"女"}</div>
                                    <br/>
                                    <div className="status" style={{fontSize:"20px"}}>{this.state.regularUser.profile}</div>
                                    {/*<ul className="header__social" style={{marginLeft: 0}}>*/}
                                    {/*    <li><a href="https://www.facebook.com"><i className="font-icon icon-facebook1"/></a>*/}
                                    {/*    </li>*/}
                                    {/*    <li><a href="https://www.twitter.com"><i*/}
                                    {/*        className="font-icon icon-twitter1"/></a></li>*/}
                                    {/*    <li><a href="https://www.instagram.com"><i*/}
                                    {/*        className="font-icon icon-instagram1"/></a></li>*/}
                                    {/*</ul>*/}
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
                                    <li><span className="overhead">关注</span>{this.state.regularUser.followNum}</li>
                                    <li><span className="overhead">粉丝</span>{this.state.regularUser.fansNum}</li>
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
                                        <li className="nav__item">
                                            <a className={this.state.page === 4 ? "active" : ""}
                                               onClick={() => this.pageChange(4)}>
                                                <i className="icon-box"
                                                   style={{marginLeft: "32%", paddingTop: "25%", paddingBottom: "5%"}}/><br/>编辑</a>
                                        </li>
                                    </ul>
                                </div>
                            </aside>

                            {this.state.page === 0 && <Information profile={this.state.regularUser.profile}/>}
                            {this.state.page === 1 && <QuestionAnswered QuestionAnswered={this.state.QuestionAnswered}/>}
                            {this.state.page === 2 && <QuestionRaised
                                QuestionRaised={this.state.QuestionRaised} nickname={this.state.user.nickname}/>}
                            {this.state.page === 3 && <QuestionCollected QuestionCollected={this.state.QuestionCollected}/>}
                            {this.state.page === 4 && this.state.aimUserId === localStorage.getItem("userId") &&
                            <EditInformation avatar={this.state.user.avatar}
                                nickname={this.state.user.nickname}
                                gender={this.state.user.gender}
                                mailAddr={this.state.userAuth.mailAddr}
                                phoneNum={this.state.user.phoneNum}
                                profile={this.state.regularUser.profile}
                                editInformation={this.editInformation}/>}
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
