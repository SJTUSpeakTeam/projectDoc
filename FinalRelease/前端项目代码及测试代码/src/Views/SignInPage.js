import React from "react";


import Icon from "@ant-design/icons";
import {Input,  Modal} from "antd";
import './signIn.css'
import {apiUrl} from "../UrlConfig";
import {history} from "../Utils/History";
import {postRequest} from "../Utils/Ajax";

class SignInPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            visible: false,
            content: null,
        };
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
    };
    userNameChange = (e) => {

        this.setState({
            username: e.target.value
        })
    };
    passwordChange = (e) => {

        this.setState({
            password: e.target.value
        })
    };
    handleSubmit = () => {

        if (this.state.username === '' || this.state.password === '') {
            this.setState({
                visible: true,
                content:'输入用户名及密码',
            });
            return;
        }
        let url = apiUrl + '/login';
        let userJson = {
            mailAddr: this.state.username,
            password: this.state.password
        };

        let callback = data => {
       console.log(data.data)
            if (data.status === 0) {
                localStorage.setItem("avatar", data.data.avatar);
                localStorage.setItem("gender", data.data.gender);
                localStorage.setItem("mailAddr", data.data.mailAddr);
                localStorage.setItem("nickname", data.data.nickname);
                localStorage.setItem("userId", data.data.userId);
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("email", data.data.email);
                localStorage.setItem("userType", data.data.userType);
                history.replace('/MainPage');
                return;
            }

            this.setState({
                visible: true,
                content: data.msg,
            });


        };
        postRequest(url, userJson, callback)
            .then((data) => {
                callback(data);
            })
    };
    GotoSignUp = () => {
        history.push('/SignUpPage');
    };

    render() {
        return (
            <div className=" body1" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                fontFamily: 'Montserrat',
                height: '100vh',
                margin: '-20px 0 50px',
            }}>
                <div className="container1 body1" id="container">
                    <div className="form-container1 sign-in-container1">
                        <form style={{
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            padding: '0 50px',
                            height: '100%',
                            textAlign: 'center',
                        }}>
                            <h1>登录</h1>

                            <span/>
                            <br/>
                            <Input
                                size={"small"}
                                prefix={<Icon style={{color: 'rgba(0,0,0,.25)', height: '20px'}}/>}
                                placeholder="登录邮箱"
                                onChange={(e) => this.userNameChange(e)}
                            />
                            <br/>
                            <Input
                                size={"small"}
                                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)', height: '20px'}}/>}
                                type="password"
                                placeholder="密码"
                                onChange={(e) => this.passwordChange(e)}
                            />
                            <br/>
                            <button  type="button" onClick={this.handleSubmit}>登录</button>
                            <Modal
                                title="登录提示"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleOk}
                                okText={"我知道了"}
                                cancelText={"取消"}

                            >
                                <p style={{color: 'black'}}>{this.state.content}</p>
                            </Modal>
                        </form>
                    </div>
                    <div className="overlay-container1" style={{color: 'red'}}>
                        <div className="overlay1">
                            <div className="overlay-panel overlay-right">
                                <h1>你好朋友！</h1>
                                <p>输入您的个人信息注册成为会员。</p>
                                <button className="ghost" id="signUp" onClick={() => this.GotoSignUp()}>注册</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignInPage;

