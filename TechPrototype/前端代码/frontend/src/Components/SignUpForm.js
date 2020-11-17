import React, {Component} from 'react';
import {Form, Input, Button, message,} from 'antd';
import {Link} from "react-router-dom";
import '../Css/antd.css';
import '../Css/signUp.css'
import {history} from "../Utils/History";
import {apiUrl} from "../UrlConfig";
import {postRequest} from "../Utils/Ajax";
import {getRequest} from "../Utils/Ajax";
import debounce from 'lodash/debounce';
import {
    emailMaxLength,
    passwordMinLength,
    passwordMaxLength,
    nicknameMaxLength,
    phoneMaxLength
} from "../ParConstraint";


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
            console.log(data)
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
        if (this.state.email.length > emailMaxLength
            || this.state.nickName.length > nicknameMaxLength
            || this.state.password.length > passwordMaxLength
            || this.state.password.length < passwordMinLength
            || this.state.phoneNumber.length > phoneMaxLength)
            return;
        let url = apiUrl + '/registry';
        let registerJson = {
            mailAddr: this.state.email,
            phoneNum: this.state.phoneNumber,
            password: this.state.password,
            nickname: this.state.nickName,
        };
        let callback = data => {
            console.log(data);
            if (data.status === 0) {
                history.push('/');
            }
            else  {
                message.error(data.msg);

            }

        };
        postRequest(url, registerJson, callback)
            .then((data) => {
                callback(data);
            })

    };

    render() {
        return (
            <Form onSubmit={this.signUp}
                  className="signUp-form"
                  {...layout}
                  name="basic"
                  initialValues={{remember: true}}
            >
                <Form.Item
                    name="nickname"
                    label="昵称"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的昵称!',
                            whitespace: true,
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
                        style={{height: '35px'}}
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
                                if (value.length > emailMaxLength) {
                                    callback('邮箱最大长度限制：' + emailMaxLength.toString());
                                }
                                checkEmailRepeat(rule, value, callback)
                            },
                        }),
                    ]}
                >
                    <Input
                        style={{height: '35px'}}
                        onChange={(e) => this.emailChange(e)}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
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
                                return Promise.resolve();
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input
                        style={{height: '35px'}}
                        type={'password'}
                        onChange={(e) => this.passwordChange(e)}
                    />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="重复密码"
                    dependencies={['password']}
                    hasFeedback
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
                        style={{height: '35px'}}
                        type={'password'}
                        onChange={(e) => this.confirmPasswordChange(e)}
                    />

                </Form.Item>
                <Form.Item
                    name="phone"
                    label="手机"
                >
                    <Input
                        style={{height: '35px'}}
                        onChange={(e) => this.phoneChange(e)}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={this.signUp} htmlType="submit" className="signUp-form-button"
                            value="large">
                        注册
                    </Button>
                    <div className="login-form-register" style={{color: 'blue', marginLeft: '43%', marginTop: '3%',}}>
                        <Link to="/" style={{color: 'blue'}}>返回登录</Link></div>
                </Form.Item>
            </Form>
        );
    }
}

export default SignUpForm;
