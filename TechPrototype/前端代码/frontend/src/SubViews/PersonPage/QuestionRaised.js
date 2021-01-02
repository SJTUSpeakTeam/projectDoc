import React from "react";
import { List} from 'antd';
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import QuestionItem from "../../Components/PersonPage/QuestionItem";

class QuestionRaised extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            QuestionRaised:this.props.QuestionRaised,
                // questionId: integer
                // userId: integer
                // theme: string
                // header: string
                // content: string
                // createTime: date
                // likeNum: integer
                // favorNum: integer
                // visitNum: integer
                // answerNum: integer
                // status: short
                // tags: [string, ...]
            nickname:this.props.nickname,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            QuestionRaised:nextProps.QuestionRaised,
        })
    }

    render() {
        const questions = this.state.QuestionRaised.map(q => <QuestionItem header={q.header} author={this.state.nickname} theme={q.theme}/>);
        return (
            <div className="col-12 col-md-12 col-lg-10">
                <div className="box box-content">
                    <div className="pb-2">
                        <h1 className="title title--h1 first-title title__separate">提出的问题</h1>
                    </div>

                    <div className="news-grid">
                        {questions}
                    </div>
                </div>
            </div>
        )
    }
}

export default QuestionRaised;


