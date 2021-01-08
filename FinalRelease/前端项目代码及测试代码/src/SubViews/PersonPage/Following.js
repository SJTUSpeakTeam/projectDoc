import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import UsersItem from "../../Components/PersonPage/UsersItem";
import {apiUrl} from "../../UrlConfig";
import {message} from "antd";
import {history} from "../../Utils/History";
import {getRequest, postRequest} from "../../Utils/Ajax";

class Following extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            aimUserId:this.props.aimUserId,
            followIds:[],
            followUsers:[],
            userItems:null
        }
    }

    UNSAFE_componentWillMount(){
        this.getFollowList();
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            aimUserId:nextProps.aimUserId,
        })
    }

    getFollowList = () =>{
        let url = apiUrl + '/follow/list-follow';
        let getJson = {
            userId: this.state.aimUserId,
        };
        let callback = data => {
            if (data.status === 0) {
                this.state.followIds=data.data.followIds;
                this.fetchUserById();
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

    };

    fetchUserById = () =>{
        let url = apiUrl + '/user/get-some';
        let postJson = {
            idArray : this.state.followIds,
        };
        let callback = data => {
            if (data.status === 0) {
                this.setState({
                    followUsers:data.data.userList,
                    userItems:data.data.userList.map(q => <UsersItem avatar={q.user.avatar} nickname={q.user.nickname}
                              gender={q.user.gender} age={q.user.age} mailAddr={q.userAuth.mailAddr} userId={q.user.userId}/>)
                });
            }
            if (data.status === -1) {
                message.error(data.msg);
            }
            if (data.status === 2) {
                message.error('登录失效');
                history.replace("/SignInPage")
            }
        };
        postRequest(url, postJson, callback)
            .then((data) => {
                callback(data);
            })

    };

    render() {
        return (
            <div className="col-12 col-md-12 col-lg-10">
                <div className="box box-content">
                    <div className="pb-2">
                        <h1 className="title title--h1 first-title title__separate">关注</h1>
                    </div>

                    {this.state.followIds.length>0?
                        <div className="news-grid">
                            {this.state.userItems}
                        </div>:
                        <p style={{fontSize:"20px",color:"gray",marginLeft:"40%"}}>暂未关注用户</p> }
                </div>
            </div>
        )
    }
}

export default Following;


