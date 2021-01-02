import React from "react";
import Title from "antd/lib/typography/Title";
import {Form, Input, InputNumber, Button, Select, DatePicker} from 'antd';
import UserForm from "./UserForm";
import { Row, Col } from 'antd';

const { Option } = Select;

class AllUsersContent extends React.Component{
    constructor(props) {
        super(props);
        this.setState({
            ageRange:false,
            ageContext:<Form.Item name="input-number" noStyle><InputNumber min={0} max={150}/></Form.Item>,
        })
    }
    state = {
        ageRange:false,
        ageContext:<Form.Item name="input-number" noStyle><InputNumber min={0} max={150}/></Form.Item>,
    };
    layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    validateMessages = {
        required: '${label} 是必填项！',
        types: {
            email: '${label} 不是合法邮箱！',
            number: '${label} 不是合法数值！',
        },
        number: {
            range: '${label} 必须在 ${min} 和 ${max} 之间！',
        },
    };
    onFinish = values => {
        console.log(values);
    };
    toggleAge=()=>{
        var t=!this.state.ageRange;
        var ageContent;
        if(t==false)ageContent=<Form.Item name="input-number" noStyle><InputNumber min={0} max={150}/></Form.Item>;
        else ageContent=<Form.Item name="input-number" noStyle><InputNumber  min={0} max={150} defaultValue={0} />&nbsp;&nbsp;~&nbsp;&nbsp;<InputNumber min={0} max={150} defaultValue={150}/></Form.Item>;
        this.setState({
            ageRange:!this.state.ageRange,
            ageContext:ageContent
        });
    };
    render() {
        return(
            <div id="content" style={{overflow: "hidden",backgroundColor:"#EEEEEE",width:"85%",float:"right",paddingBottom:3000,marginBottom:-3000}}>
                <br/>
                <div style={{width:"100%",marginLeft:25}}>
                    <Title>用户检索</Title>
                    <Form layout={this.layout} name="nest-messages" onFinish={this.onFinish} validateMessages={this.validateMessages} initialValues={{'input-number': 3,}}>
                        <div style={{height:"230px"}}>
                            <Row>
                                <Col span={8}>
                                    <div style={{marginRight:"20px"}}>
                                        <Form.Item name='name' label="姓名" rules={[{ required: false }]}>
                                            <div style={{width:"70%"}}>
                                                <Input placeholder="空缺以搜索全部" maxLength={"20"} bordered={false} allowClear/>
                                            </div>
                                        </Form.Item>
                                        <Form.Item name='email' label="邮箱" rules={[{ type: 'email' }]}>
                                            <div style={{width:"70%"}}>
                                                <Input placeholder="空缺以搜索全部" maxLength={"50"} bordered={false} allowClear/>
                                            </div>
                                        </Form.Item>
                                        <Form.Item name='createTime' label="创建时间不早于" required={false}>
                                            <div style={{width:"80%"}}>
                                                <DatePicker />
                                            </div>
                                        </Form.Item>
                                        {/*<Form.Item name={['user', 'age']} label="年龄">*/}
                                        {/*    <div style={{width:"70%"}}>*/}
                                        {/*        <Checkbox onClick={this.toggleAge} defaultChecked={false}>范围</Checkbox>*/}
                                        {/*        &nbsp;&nbsp;&nbsp;&nbsp;*/}
                                        {/*        {this.state.ageContext}*/}
                                        {/*    </div>*/}
                                        {/*</Form.Item>*/}
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div>
                                        <Form.Item name="gender" label="性别" rules={[{ required: false }]}>
                                            <div style={{width:"50%"}}>
                                                <Select
                                                    placeholder="空缺以搜索全部性别"
                                                    allowClear
                                                >
                                                    <Option value="male">男</Option>
                                                    <Option value="female">女</Option>
                                                    <Option value="other">隐藏</Option>
                                                </Select>
                                            </div>
                                        </Form.Item>
                                        <Form.Item name="userType" label="用户类型" required={true}>
                                            <div style={{width:"90%"}}>
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    defaultValue={["normalUsers","bannedUsers","admins"]}
                                                >
                                                    <Option value="normalUsers">正常用户</Option>
                                                    <Option value="bannedUsers">已封禁用户</Option>
                                                    <Option value="admins">管理员</Option>
                                                </Select>
                                            </div>
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col span={8}></Col>
                            </Row>
                        </div>
                        <Form.Item wrapperCol={{wrapperCol:16, offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{width:"90%"}}>
                        <UserForm/>
                    </div>

                </div>
            </div>
        );
    }
}
export default AllUsersContent;