import React from "react";
import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';
import {List} from "antd";

import '../MainPage/QuestionListItem'
import QuestionListItem from "./QuestionListItem";


class LatestQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newQuestion: null
        };
    }
    UNSAFE_componentWillMount() {
        this.state.newQuestion = this.props.newQuestion;

        this.setState({
            newQuestion: this.props.newQuestion
        })
    };



    render() {
        return(
            <section className="span4 articles-list">
                <h3 style={{marginLeft:110}}>最新提问</h3>
                <ul className="articles">
                    {(this.state.newQuestion.length === 0) ?
                        <div/> :
                        <List
                            itemLayout="vertical"
                            size="large"
                            split="false"
                            pagination={false}
                            dataSource={this.state.newQuestion}
                            renderItem={item => (
                                <QuestionListItem question={item}/>
                            )}
                        />
                    }
                </ul>
            </section>
        )
    }
}

export default LatestQuestions;
