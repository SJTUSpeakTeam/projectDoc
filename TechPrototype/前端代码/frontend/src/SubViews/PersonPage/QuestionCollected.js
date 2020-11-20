import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import QuestionItem from "../../Components/PersonPage/QuestionItem";

class QuestionCollected extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            QuestionCollected:this.props.QuestionCollected,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            QuestionCollected:nextProps.QuestionCollected,
        })
    }

    render() {
        return (
            <div className="col-12 col-md-12 col-lg-10">
                <div className="box box-content">
                    <div className="pb-2">
                        <h1 className="title title--h1 first-title title__separate">收藏</h1>
                    </div>

                    <div className="news-grid">
                        <QuestionItem title={"c++从入门到精通"} author={"张淇"}/>
                        <QuestionItem title={"c++从入门到精通"} author={"张淇"}/>
                        <QuestionItem title={"c++从入门到精通"} author={"张淇"}/>
                        <QuestionItem title={"c++从入门到精通"} author={"张淇"}/>
                        <QuestionItem title={"c++从入门到精通"} author={"张淇"}/>
                        <QuestionItem title={"c++从入门到精通"} author={"张淇"}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default QuestionCollected;


