import React from "react";
import "../../assets/styles/style.css"
import "../../assets/demo/style-demo.css"
import UploadImage from "../../Components/UploadImage";
import {Input, Select, Button, Row, Col, message} from 'antd';
import {postRequest} from "../../Utils/Ajax";
import {apiUrl} from "../../UrlConfig";
import {history} from "../../Utils/History";

const { TextArea } = Input;
const { Option } = Select;

class EditInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar:this.props.avatar,
            nickname:this.props.nickname,
            age:this.props.age,
            gender:this.props.gender,
            mailAddr:this.props.mailAddr,
            phoneNum:this.props.phoneNum,
            profile:this.props.profile,
            editAvatar:false,
            editNickname:false,
            editAge:false,
            editGender:false,
            editMailAddr:false,
            editPhoneNum:false,
            editProfile:false,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            avatar:nextProps.avatar,
            nickname:nextProps.nickname,
            age:nextProps.age,
            gender:nextProps.gender,
            mailAddr:nextProps.mailAddr,
            phoneNum:nextProps.phoneNum,
            profile:nextProps.profile,
        })
    }

    avatarChange = (value) =>{this.setState({avatar:value,editAvatar:true});};
    nicknameChange = (e)=>{this.setState({nickname:e.target.value,editNickname:true});};
    ageChange = (value)=>{this.setState({age:value,editAge:true});};
    genderChange = (value)=>{this.setState({gender:value,editGender:true});};
    mailAddrChange = (e)=>{this.setState({mailAddr:e.target.value,editMailAddr:true});};
    phoneNumChange = (e)=>{this.setState({phoneNum:e.target.value,editPhoneNum:true});};
    profileChange = (e)=>{this.setState({profile:e.target.value,editProfile:true});};

    handleSave = () =>{
        let url = apiUrl + '/user/modify-info';
        let postJson = {
            userId:localStorage.getItem("userId"),
            avatar:this.state.editAvatar?this.state.avatar:null,
            nickname:this.state.editNickname?this.state.nickname:null,
            age:this.state.editAge?this.state.age:null,
            gender:this.state.editGender?this.state.gender:null,
            mailAddr:this.state.editMailAddr?this.state.mailAddr:null,
            phoneNum:this.state.editPhoneNum?this.state.phoneNum:null,
            profile:this.state.editProfile?this.state.profile:null,
        };
        let callback = data => {
            if (data.status === 0) {
                message.info("保存成功");
                this.props.editInformation(
                    this.state.avatar,
                    this.state.nickname,
                    this.state.age,
                    this.state.gender,
                    this.state.mailAddr,
                    this.state.phoneNum,
                    this.state.profile)
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
        const ages = [];
        for (let i = 0; i <= 100; i++) {
            ages.push(<Option key={i}>{i}</Option>);
        }
        return (
            <div className="col-12 col-md-12 col-lg-10">
                <div className="box box-content">
                    <Row>
                        <Col span={20} order={0}>
                            <div className="pb-2" >
                                <h1 className="title title--h1 first-title title__separate" >编辑</h1>
                            </div>
                        </Col>
                        <Col span={4} order={1}>
                            <Button style={{backgroundColor:"#ff7875",color:"white",float:"right"}} onClick={this.handleSave}>保存</Button>
                        </Col>
                    </Row>


                    <div className="row">
                        <div className="col-12">
                            <div style={{width:"100%",height:"200px"}}>
                                <div style={{width:"50%",float:"left"}}>
                                    <h2 className="title title--h3" style={{float:"left"}}>头像</h2>
                                    <UploadImage style={{marginLeft:0}} img={this.state.avatar} avatarChange={this.avatarChange}/>
                                </div>

                                <div style={{width:"50%",float:"right"}}>
                                    <h2 className="title title--h3"  style={{float:"left"}}>昵称</h2>
                                    <br/><br/>
                                    <Input value={this.state.nickname} allowClear onChange={this.nicknameChange}
                                           placeholder={"昵称"} style={{width:"200px"}}/>
                                    <div>
                                        <div style={{float:"left"}}>
                                        <h2 className="title title--h3" style={{marginTop:"20px",float:"left"}}>性别</h2>
                                        <br/><br/>
                                        <Select value={this.state.gender?"男":"女"} style={{width:120}} onChange={this.genderChange}>
                                            <Option value={true}>男</Option>
                                            <Option value={false}>女</Option>
                                        </Select>
                                        </div>

                                        <div style={{float:"left",marginLeft:"10%"}}>
                                        <h2 className="title title--h3" style={{marginTop:"20px",float:"left"}}>年龄</h2>
                                        <br/><br/>
                                        <Select value={this.state.age} style={{width:120}} onChange={this.ageChange}>
                                            {ages}
                                        </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{width:"100%",marginTop:"20px"}}>
                                <div style={{width:"50%",float:"left"}}>
                                    <h2 className="title title--h3" style={{marginTop:"20px",float:"left"}}>邮箱</h2>
                                    <br/><br/><br/>
                                    <Input value={this.state.mailAddr} allowClear onChange={this.mailAddrChange}
                                           placeholder={"邮箱"} style={{width:"200px"}}/>
                                </div>

                                <div style={{width:"50%",float:"right"}}>
                                    <h2 className="title title--h3" style={{marginTop:"20px",float:"left"}}>联系方式</h2>
                                    <br/><br/><br/>
                                    <Input value={this.state.phoneNum} allowClear onChange={this.phoneNumChange}
                                           placeholder={"联系方式"} style={{width:"200px"}}/>
                                </div>
                            </div>

                            <div style={{width:"100%"}}>
                                <div style={{width:"100%",float:"left"}}>
                                    <h2 className="title title--h3" style={{marginTop:"20px",float:"left"}}>个人简介</h2>
                                    <TextArea rows={4} value={this.state.profile} allowClear onChange={this.profileChange}
                                           placeholder={"个人简介"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditInformation;


