import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"

//用法：
//<QuestionItem header={} author={} theme={} />

class QuestionItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            header: this.props.header,
            author: this.props.author,
            theme:this.props.theme,
        }
    }

    render() {
        return (
            <article className="news-item box">
                <div className="news-item__caption">
                    <h3 className="title title--h3">{this.state.header}</h3>
                    <p style={{width:"70%",float:"left",fontSize:"15px"}}>{this.state.author}</p>
                    <p style={{float:"right",color:"#ff7a45"}}>{this.state.theme}</p>
                </div>
            </article>
        )
    }

}

export default QuestionItem;