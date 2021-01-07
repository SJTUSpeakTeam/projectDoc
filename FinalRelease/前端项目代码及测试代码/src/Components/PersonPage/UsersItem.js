import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import {history} from "../../Utils/History";
import {Avatar} from "antd";


class UsersItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: this.props.avatar,
            nickname: this.props.nickname,
            gender:this.props.gender,
            age:this.props.age,
            mailAddr:this.props.mailAddr,
            userId:this.props.userId
        }
    }

    GoPersonPage=()=>{
        history.replace({pathname: '/PersonPage', state: {userId: this.state.userId}});
        window.location.reload();
    };

    render() {
        return (
            <article className="news-item box" >
                <div className="news-item__caption">
                    <Avatar
                        src={this.state.nickname === null || this.state.avatar === '' ?
                            "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" : this.state.avatar}
                    style={{float:"left"}}/>
                    <h3 className="title title--h3" style={{marginLeft:"15%"}}><a onClick={this.GoPersonPage}>{this.state.nickname}</a></h3>
                    <p style={{width:"10%",float:"left",fontSize:"15px"}}>{this.state.gender?"男":"女"}</p>
                    <p style={{width:"10%",float:"left",fontSize:"15px"}}>{this.state.age+"岁"}</p>
                    <p style={{float:"right",color:"#ff7a45"}}>{this.state.mailAddr}</p>
                </div>
            </article>
        )
    }

}

export default UsersItem;
