import React from "react";
import Header from "../Components/Header";
import SearchBar from "../Components/MainPage/SearchBar";
import FeaturedQuestions from "../Components/MainPage/FeaturedQuestions";
import LatestQuestions from "../Components/MainPage/LatestQuestions";
import Classification from "../Components/MainPage/Classification";
import PersonCard from "../Components/MainPage/PersonCard";
import '../Css/Header.css';
import '../Css/bootstrap5152.css?ver=1.0';
import '../Css/responsive5152.css?ver=1.0';
import '../Css/main5152.css?ver=1.0';
import '../style.css';
import Foot from "../Components/Foot";
import {apiUrl} from "../UrlConfig";

import {message} from 'antd';

import {getRequest} from "../Utils/Ajax";

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newQuestion: [],
            hotQuestion: [],
        };
    }

    UNSAFE_componentWillMount() {
        this.getMainQuestion();
    }

    getMainQuestion = () => {
        let urlNew = apiUrl + '/getNewQuestions';
        let urlHot = apiUrl + '/getHotQuestions';
        let newJson = {};
        let that = this;
        getRequest(urlNew, newJson)
            .then((data) => {

                this.state.newQuestion = data.data.questions;
                for (let i = 0; i < data.data.questions.length; i++) {
                    data.data.questions[i].createTime.year+=1900;
                    data.data.questions[i].createTime.month+=1;
                    data.data.questions[i].createTime.hours+=8;

                }
                if (data.status === 0) {
                    that.setState({
                        newQuestion: data.data.questions
                    })
                } else {
                    message.error(data.msg);

                }
            });

        getRequest(urlHot, newJson)
            .then((data) => {

                this.state.hotQuestion = data.data.questions;
                for (let i = 0; i < data.data.questions.length; i++) {
                    data.data.questions[i].createTime.year+=1900;
                    data.data.questions[i].createTime.month+=1;
                    data.data.questions[i].createTime.hours+=8;
                }
                if (data.status === 0) {
                    that.setState({
                        hotQuestion: data.data.questions
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
                <SearchBar type={0}/>
                <div className="page-container">
                    <div className="container">
                        <div className="row">
                            <div className="span8 page-content">
                                <div className="row separator">

                                    {(this.state.newQuestion.length === 0) ?
                                        <div/> :
                                        <LatestQuestions newQuestion={this.state.newQuestion}/>
                                    }
                                    {(this.state.hotQuestion.length === 0) ?
                                        <div/> :
                                        <FeaturedQuestions hotQuestion={this.state.hotQuestion}/>
                                    }
                                </div>
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

export default MainPage;
