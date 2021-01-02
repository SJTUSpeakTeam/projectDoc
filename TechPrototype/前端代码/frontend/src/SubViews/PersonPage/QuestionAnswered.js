import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import QuestionItem from "../../Components/PersonPage/QuestionItem";

class QuestionAnswered extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            QuestionAnswered:this.props.QuestionAnswered,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            QuestionAnswered:nextProps.QuestionAnswered,
        })
    }

    render() {
        return (
            <div className="col-12 col-md-12 col-lg-10">
                <div className="box box-content">
                    <div className="pb-2">
                        <h1 className="title title--h1 first-title title__separate">参与的问题</h1>
                    </div>

                    <div className="news-grid">
                        <QuestionItem title={"三角形内角和为多少？"} author={"许正霖"}/>
                        <QuestionItem title={"三角形内角和为多少？"} author={"许正霖"}/>
                        <QuestionItem title={"三角形内角和为多少？"} author={"许正霖"}/>
                        <QuestionItem title={"三角形内角和为多少？"} author={"许正霖"}/>
                        <QuestionItem title={"三角形内角和为多少？"} author={"许正霖"}/>
                        <QuestionItem title={"三角形内角和为多少？"} author={"许正霖"}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default QuestionAnswered;


