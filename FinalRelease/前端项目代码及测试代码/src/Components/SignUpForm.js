import React, {Component} from 'react';
import {Form, Input, message,} from 'antd';

import '../Css/antd.css';
import '../Css/signUp.css'
import {history} from "../Utils/History";
import {apiUrl} from "../UrlConfig";
import {postRequest} from "../Utils/Ajax";
import {getRequest} from "../Utils/Ajax";
import debounce from 'lodash/debounce';
import {

    passwordMinLength,
    passwordMaxLength,
    nicknameMaxLength,

} from "../ParConstraint";


import './signUp.css'

let checkEmailRepeat = () => {
};
let checkNicknameRepeat = () => {
};
const layout = {
    labelCol: {span: 6},
};

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            birthday: null,
            checkNickname: true,
        };
        checkEmailRepeat = debounce(this.checkEmail, 2000);
        checkNicknameRepeat = debounce(this.checkNickname, 1000);
    };

    checkNickname(rule, value, callback) {
        if (!value) {
            callback()
        }
        let back = (data) => {

            if (data.status !== 0) {
                callback(new Error('用户名重复，请重新输入'))
            } else
                callback()
        };
        let json = {
            value: value.toString()
        };
        let url = apiUrl + '/verify/nickname';
        getRequest(url, json, back)
            .then((data) => {
                back(data);
            })
    };

    checkEmail(rule, value, callback) {
        if (!value) {
            callback()
        }
        let back = (data) => {
            if (data.status !== 0) {
                callback(new Error('邮箱重复，请重新输入'))
            } else
                callback();
        };
        let json = {
            value: value.toString()
        };
        let url = apiUrl + '/verify/mailAddr';
        getRequest(url, json, back)
            .then((data) => {
                back(data);
            })
    }

    phoneChange = (e) => {
        this.setState({
            phoneNumber: e.target.value
        })
    };
    emailChange = (e) => {
        let reEml = /^[\w\-.]+@[a-z0-9]+(-[a-z0-9]+)?(\.[a-z0-9]+(-[a-z0-9]+)?)*\.[a-z]{2,4}$/i;
        if (reEml.test(e.target.value) === false) {
            this.setState({
                email: ''
            })
        } else {
            this.setState({
                email: e.target.value
            })
        }
    };
    passwordChange = (e) => {
        this.setState({
            password: e.target.value
        })
    };
    confirmPasswordChange = (e) => {
        this.setState({
            confirmPassword: e.target.value
        })
    };
    nickNameChange = (e) => {
        this.setState({
            nickName: e.target.value
        })
    };
    signUp = () => {
        if (this.state.nickName === ''
            || this.state.password === ''
            || this.state.confirmPassword === ''
            || this.state.email === ''
        )
            return;
        if (this.state.password !== this.state.confirmPassword)
            return;

        let url = apiUrl + '/registry';
        let registerJson = {
            mailAddr: this.state.email,
            phoneNum: this.state.phoneNumber,
            password: this.state.password,
            nickname: this.state.nickName,
        };
        let callback = data => {

            if (data.status === 0) {
                message.info("注册成功，请前往验证邮箱");
                history.push('/');
            } else {
                message.error(data.msg);

            }

        };
        postRequest(url, registerJson, callback)
            .then((data) => {
                callback(data);
            })

    };
    GotoSignIn = () => {
        history.push('/');
    };

    render() {
        return (
            <div style={{ display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection:'column',
                fontFamily: 'Montserrat',
                height: '100vh',
                margin: '-20px 0 50px',}}>
                <div className="container1 right-panel-active" id="container">
                    <div className="form1-container1  sign-up-container1" >
                        <Form onSubmit={this.signUp}

                              style={{
                                  backgroundColor: '#FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'column',
                                  padding: '0 50px',
                                  height: '100%',
                                  textAlign: 'center',
                              }}

                              className="signUp-form"
                              {...layout}
                              name="register"
                              initialValues={{remember: true}}


                        >
                            <Form.Item
                                name="nickname"
                                label="昵称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入你的昵称!',
                                    },
                                    () => ({
                                        validator(rule, value, callback) {
                                            if (value.length > nicknameMaxLength) {
                                                callback('昵称最大长度限制：' + nicknameMaxLength.toString());
                                            }
                                            checkNicknameRepeat(rule, value, callback)
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    style={{height: '35px', width: 150}}
                                    size={"large"}
                                    onChange={(e) => this.nickNameChange(e)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="邮箱"
                                rules={[
                                    {
                                        type: 'email',
                                        message: '输入的邮箱格式不正确!',
                                    },
                                    {
                                        required: true,
                                        message: '请输入你的邮箱!',
                                    },
                                    () => ({
                                        validator(rule, value, callback) {
                                            if (value.length > 35) {
                                                callback('邮箱最大长度限制：35');
                                            }
                                            checkEmailRepeat(rule, value, callback)
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    style={{height: '35px', width: 150}}
                                    onChange={(e) => this.emailChange(e)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="密码"
                                hasFeedback={false}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入你的密码!',
                                    },
                                    () => ({
                                        validator(rule, value) {
                                            if (value.length > passwordMaxLength) {
                                                return Promise.reject('密码最大长度限制：' + passwordMaxLength.toString());
                                            }
                                            if (value.length < passwordMinLength && value.length !== 0) {
                                                return Promise.reject('密码最小长度限制：' + passwordMinLength.toString());
                                            }

                                        },
                                    }),
                                ]}

                            >
                                <Input
                                    style={{height: '35px', width: 150}}
                                    type={'password'}

                                    onChange={(e) => this.passwordChange(e)}
                                />
                            </Form.Item>
                            <Form.Item
                                style={{marginLeft: 11}}
                                name="confirm"
                                wrapperCol={{span: 15}}
                                label="重复密码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                dependencies={['password']}
                                hasFeedback={false}
                                rules={[
                                    {
                                        required: true,
                                        message: '请确认你的密码！',
                                    },
                                    ({getFieldValue}) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('两次输入的密码不匹配!');
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    style={{height: '35px', width: 155}}
                                    type={'password'}
                                    size={"large"}
                                    onChange={(e) => this.confirmPasswordChange(e)}
                                />

                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="手机"
                            >
                                <Input
                                    style={{height: '35px',}}
                                    onChange={(e) => this.phoneChange(e)}
                                />
                            </Form.Item>

                            <Form.Item>
                                <button onClick={() => this.signUp()}>注册</button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="overlay-container1 ">
                        <div className="overlay1">
                            <div className="overlay-panel overlay-right" style={{color: '#FFFFFF', marginRight: '8%'}}>
                                <h1>欢迎回来！</h1>
                                <p>请您先登录的个人信息，进行操作。</p>
                                <button className="ghost" id="signIn" onClick={() => this.GotoSignIn()}>登录</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUpForm;
