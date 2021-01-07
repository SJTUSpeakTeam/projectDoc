import React from "react";
import Title from "antd/lib/typography/Title";
import {Button, Col, DatePicker, Form, Input, InputNumber, Row, Select} from 'antd';
import UserForm from "./UserForm";

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
        limits:null,
    };
    layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    filters=null;
    onFinish = values => {

        this.filters={
            date: values["createTime"],
            name: values["name"],
            email: values["email"],
            gender: values["gender"],
            userType: values["userType"]
        };
        this.setState({});
    };
    toggleAge=()=>{
        let t=!this.state.ageRange;
        let ageContent;
        if(t===false)ageContent=<Form.Item name="age" noStyle><InputNumber min={0} max={150}/></Form.Item>;
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
                    <Form layout={this.layout} name="nest-messages" onFinish={this.onFinish}>
                        <div style={{height:"230px"}}>
                            <Row>
                                <Col span={8}>
                                    <div style={{marginRight:"20px"}}>
                                        <div style={{width:"70%"}}>
                                            <Form.Item name='name' label="姓名">
                                                <Input placeholder="空缺以搜索全部" maxLength={"20"} bordered={false} allowClear/>
                                            </Form.Item>
                                            <Form.Item name='email' label="邮箱" rules={[{ type: 'email' }]}>
                                                <Input placeholder="空缺以搜索全部" maxLength={"50"} bordered={false} allowClear/>
                                        </Form.Item>
                                        </div>
                                        <div style={{width:"80%"}}>
                                            <Form.Item name='createTime' label="创建时间不早于">
                                                <DatePicker />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{width:"50%"}}>
                                        <Form.Item name="gender" label="性别" rules={[{ required: false }]}>
                                            <Select placeholder="空缺以搜索全部性别">
                                                <Option value="male">男</Option>
                                                <Option value="female">女</Option>
                                                <Option value="other">隐藏</Option>
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div style={{width:"100%"}}>
                                        <Form.Item name="userType" label="用户类型" required={true} initialValue={"normalUsers"}>
                                            <Select allowClear>
                                                <Option value="normalUsers">正常用户</Option>
                                                <Option value="bannedUsers">已封禁用户</Option>
                                                <Option value="admins">管理员</Option>
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{width:"70%"}}>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Form.Item wrapperCol={{wrapperCol:16, offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{width:"90%"}}>
                        <UserForm limits={this.filters}/>
                    </div>

                </div>
            </div>
        );
    }
}
export default AllUsersContent;
