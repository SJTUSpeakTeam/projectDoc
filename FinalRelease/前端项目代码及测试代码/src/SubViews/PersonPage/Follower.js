import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import UsersItem from "../../Components/PersonPage/UsersItem";
import {apiUrl} from "../../UrlConfig";
import {message} from "antd";
import {history} from "../../Utils/History";
import {getRequest, postRequest} from "../../Utils/Ajax";

class Follower extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            aimUserId:this.props.aimUserId,
            followerIds:[],
            followerUsers:[],
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
        let url = apiUrl + '/follow/list-follower';
        let getJson = {
            userId: this.state.aimUserId,
        };
        let callback = data => {
            if (data.status === 0) {

                this.state.followerIds=data.data.followIds;
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
            idArray : this.state.followerIds,
        };
        let callback = data => {
            if (data.status === 0) {
                this.setState({
                    followerUsers:data.data.userList,
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
                        <h1 className="title title--h1 first-title title__separate">粉丝</h1>
                    </div>

                    {this.state.followerIds.length>0?
                        <div className="news-grid">
                            {this.state.userItems}
                        </div>:
                        <p style={{fontSize:"20px",color:"gray",marginLeft:"43%"}}>暂无粉丝</p> }
                </div>
            </div>
        )
    }
}

export default Follower;


