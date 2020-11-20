import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"

//用法
// <Information profile={}/>

class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            profile : this.props.profile
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            profile:nextProps.profile,
        })
    }

    render() {
        return (
            <div className="col-12 col-md-12 col-lg-10">
                <div className="box box-content">
                    <div className="pb-0 pb-sm-2">
                        <h1 className="title title--h1 first-title title__separate">个人信息</h1>
                        <p style={{fontSize:"25px"}}>{this.state.profile}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Information;


