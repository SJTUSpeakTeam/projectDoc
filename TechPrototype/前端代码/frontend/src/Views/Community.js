import React from "react";
import Header from "../Components/Header";
import Search from '../Components/Community/Search'
import Content from "../Components/Community/Content";
import '../Css/Header.css';
import '../Css/bootstrap5152.css?ver=1.0';
import '../Css/responsive5152.css?ver=1.0';
import '../Css/main5152.css?ver=1.0';
import '../style.css';
import {List, message, Select} from 'antd';


import Foot from "../Components/Foot";
import {apiUrl} from "../UrlConfig";
import {getRequest, postRequest} from "../Utils/Ajax";

const {Option} = Select;

class Community extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newContent: 'active ember-view',
            mostReplyContent: 'ember-view',
            mostLikeContent: 'ember-view',
            hostContent: 'ember-view',
            theme: [],
            beginQuestionId: -1,
            search: '',
            getTheme: '',
            themeName: '所有主题',
            mostLike: false,
            hottest: false,
            mostReply: false,
            newest: true,
            question: [],
        };

    };

    UNSAFE_componentWillMount() {
        //let getTheme = this.props.location.state.theme;
        if (this.props.location.state === undefined)
            return

        let urlUser = apiUrl + '/getThemes';
        //console.log(this.props.location.state.theme);
        let themeJson = {};
        this.state.questionId = -1;
        this.state.question = [];


        this.state.getTheme = this.props.location.state.theme;
        this.state.themeName = (this.props.location.state.theme === '') ? '所有主题' : this.props.location.state.theme;


            getRequest(urlUser, themeJson)
                .then((data) => {
                    console.log(data);
                    if (data.status === 0) {
                        let theme = [];
                        theme.push({name: '所有主题'});
                        for (let i = 0; i < data.data.themes.length; i++)
                            theme.push(data.data.themes[i]);
                        this.setState({
                            theme: theme,
                            question: [],
                        })
                    } else {
                        message.error(data.msg);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        this.getQuestion();

    };

    getQuestion = () => {
        let questionUrl = apiUrl + '/getFilterQuestions';
        let questionJson = {
            beginQuestionId: this.state.beginQuestionId,
            search: this.state.search,
            theme: this.state.getTheme,
            mostLike: this.state.mostLike,
            hottest: this.state.hottest,
            mostReply: this.state.mostReply,
            newest: this.state.newest,
        };
        postRequest(questionUrl, questionJson)
            .then((data) => {
                console.log(data);
                if (data.status === 0) {
                    let result = [];
                    for (let i = 0; i < data.data.questions.length; i++) {
                        data.data.questions[i].createTime.year += 1900;
                        data.data.questions[i].createTime.month += 1;
                        data.data.questions[i].createTime.hours += 8;
                        result.push(data.data.questions[i]);
                    }
                    this.setState({
                        question: result
                    });
                } else {
                    message.error(data.msg);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    changeTheme = (value) => {
        this.state.getTheme = (value === "所有主题" ? '' : value);
        this.setState({
            getTheme: value,
        });
        this.getQuestion();

    };
    change = (value) => {
        this.setState({
            question: []
        });
        if (value === 1) {
            this.state.newContent = 'active ember-view';
            this.state.mostReplyContent = 'ember-view';
            this.state.mostLikeContent = 'ember-view';
            this.state.hostContent = 'ember-view';
            this.state.mostLike = false;
            this.state.hottest = false;
            this.state.mostReply = false;
            this.state.newest = true;

        }
        if (value === 2) {
            this.state.newContent = 'ember-view';
            this.state.mostReplyContent = 'active ember-view';
            this.state.mostLikeContent = 'ember-view';
            this.state.hostContent = 'ember-view';
            this.state.mostLike = false;
            this.state.hottest = false;
            this.state.mostReply = true;
            this.state.newest = false;

        }
        if (value === 3) {
            this.state.newContent = 'ember-view';
            this.state.mostReplyContent = 'ember-view';
            this.state.mostLikeContent = 'active ember-view';
            this.state.hostContent = 'ember-view';
            this.state.mostLike = true;
            this.state.hottest = false;
            this.state.mostReply = false;
            this.state.newest = false;
        }
        if (value === 4) {
            this.state.newContent = 'ember-view';
            this.state.mostReplyContent = 'ember-view';
            this.state.mostLikeContent = 'ember-view';
            this.state.hostContent = 'active ember-view';
            this.state.mostLike = false;
            this.state.hottest = true;
            this.state.mostReply = false;
            this.state.newest = false;

        }
        this.getQuestion();
    };
    onSearch = (value) => {
        this.setState({
            question: []
        });

        this.state.search = value;

        this.getQuestion();
    }

    render() {

        const theme = this.state.theme.map(d => <Option key={d.name}>{d.name}</Option>);

        const question = this.state.question.map(d => <div><Content question={d}/>
            <div> &nbsp;</div>
        </div>);
        return (
            <div>
                <Header/>
                <Search onsearch={this.onSearch}/>
                <div className="page-container">
                    <div className="container">
                        <div className="row">

                            <div className="span11 main-listing">
                                <div>
                                    <ul id="navigation-bar" className="nav nav-pills ember-view"
                                    >
                                        <li>
                                            <Select defaultValue={this.state.themeName}
                                                    onChange={this.changeTheme}
                                                    style={{
                                                        width: 120,
                                                        color: 'black',
                                                        backgroundColor: 'grey',
                                                        display: 'block',
                                                    }}>
                                                {theme}
                                            </Select>
                                        </li>

                                        <li title="有了新帖的活动主题" id="ember1014" className={this.state.newContent}
                                            style={{marginLeft: 30}} onClick={() => this.change(1)}>
                                            <a>
                                                最新
                                            </a>
                                        </li>
                                        <li title="归入各种类别的所有主题" id="ember1016" className={this.state.mostReplyContent}
                                            onClick={() => this.change(2)}>
                                            <a>
                                                最多回复
                                            </a>
                                        </li>
                                        <li title="在最近的一年，一月，一周或一天最活跃的主题" id="ember1018"
                                            className={this.state.mostLikeContent} onClick={() => this.change(3)}>
                                            <a>
                                                最多赞
                                            </a>
                                        </li>
                                        <li title="在最近的一年，一月，一周或一天最活跃的主题" id="ember1020"
                                            className={this.state.hostContent} onClick={() => this.change(4)}>
                                            <a>
                                                热门
                                            </a>
                                        </li>

                                    </ul>

                                </div>
                                &nbsp;
                                &nbsp;
                                {question}

                            </div>
                        </div>
                    </div>
                </div>
                <Foot/>
            </div>
        );
    }
}

export default Community;
