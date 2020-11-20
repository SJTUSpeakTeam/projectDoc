import React, {Component} from 'react';
import {Form, Input, Button, Modal} from 'antd';
import {Link} from "react-router-dom";
import Icon from '@ant-design/icons';
import '../Css/antd.css';
import '../Css/login.css';
import {history} from "../Utils/History";
import {apiUrl} from "../UrlConfig";
import {postRequest} from "../Utils/Ajax";

class SignInForm extends Component {
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
        if (this.state.username === '' || this.state.password === '')
            return;
        let url = apiUrl + '/login';
        let userJson = {
            mailAddr: this.state.username,
            password: this.state.password
        };
        let callback = data => {
            if(data.status === 0){
                localStorage.setItem("avatar",data.data.avatar);
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

    render() {
        return (

            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item
                    label="登录邮箱"
                    name="username"
                    rules={[{required: true, message: '请输入您的登录邮箱'}]}
                >
                    <Input
                        size={"small"}
                        prefix={<Icon style={{color: 'rgba(0,0,0,.25)', height: '20px'}}/>}
                        placeholder="登录邮箱"
                        onChange={(e) => this.userNameChange(e)}
                    />
                </Form.Item>
                <Form.Item
                    label="登录密码"
                    name="password"
                    rules={[{required: true, message: '请输入您的登录密码'}]}
                >
                    <Input
                        size={"small"}
                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)', height: '20px'}}/>}
                        type="password"
                        placeholder="密码"
                        onChange={(e) => this.passwordChange(e)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.handleSubmit} htmlType="submit" className="login-form-button"
                            value="large">
                        登录
                    </Button>
                    <Modal
                        title="登录提示"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleOk}
                        okText={"我知道了"}
                        cancelText={"取消"}
                    >
                        <p>{this.state.content}</p>
                    </Modal>
                    <div>
                        &nbsp;
                    </div>

                    <div className="login-form-register" style={{color:'blue',marginLeft:'40%', }}><Link to="/SignUp" style={{color:'blue'}}>注册新账户</Link></div>
                </Form.Item>
            </Form>
        );
    }
}

export default SignInForm;
