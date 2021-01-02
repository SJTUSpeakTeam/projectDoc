import React ,{useState} from "react";
import {Table, Radio, Divider, Space} from 'antd';
import { Modal, Button } from 'antd';
import TimeScale from "echarts/src/scale/Time";
import Title from "antd/lib/typography/Title";
import { Input, Col, Row, Select, InputNumber, DatePicker, AutoComplete, Cascader } from 'antd';
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import moment from 'moment';
import {apiUrl} from "../../UrlConfig";
import {history} from "../../Utils/History";
import {getRequest,postRequest} from "../../Utils/Ajax";
import {parseDate} from "echarts/src/util/number";
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
class UserForm extends React.Component{
    constructor() {
        super();
        // this.usersData=[];
        // this.usersData=this.getUsers(0);
    }
    columns = [
        {
            title: '用户Id',
            dataIndex: 'key',
            width: 100,
        },{
            title: '用户名',
            dataIndex: 'name',
            width:150,
            render: text => <a href="#">{text}</a>,
        }, {
            title: '注册日期',
            dataIndex: 'regDate',
            width:150,
        }, {
            title: '邮箱',
            dataIndex: 'email',
            width:200,
        },
        {
            title: '电话',
            dataIndex: 'phone',
            width:150,
        },
        {
            title: '权限',
            dataIndex: 'authority',
            width:100,
        },
        {
            title: '状态',
            dataIndex: 'state',
            width:100,
        },
        {
            title: '查看',
            dataIndex: '',
            key: 'x',
            render: () => <div><a onClick={this.showModal}>历史</a><Divider type="vertical"/><a>个人主页</a><Modal
                title="Basic Modal"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <p>2020-10-2 开始封禁 时长：3天 原因：侮辱他人</p>
                <p>2020-10-6 封禁结束</p>
                <p>2020-10-15 开始封禁 时长：30天 原因：淫秽色情</p>
            </Modal></div>,
            width:150,
        }];
    usersData=[];
    state={
        selectedRowKeys: [],
        visible: false,
        selectedNumContext:null,
        allContext:null,
        banExtendDate:Date.now()
    };
    getUsers=page=>{
        let url = apiUrl + '/user/get-all';
        let getUsersJson = {
            page:page
        };
        let callback = data => {
            console.log(data);
            if(data.status === 0){
                let u=[];
                for (let i = 0; i < data.data.userList.length; i++) {
                    var date=data.data.userList[i].user.createTime;
                    u.push({
                        key: data.data.userList[i].user.userId,
                        name:data.data.userList[i].user.nickname,
                        regDate: (parseInt(date.year)+1900)+"-"+(date.month)+"-"+(date.date),
                        email: data.data.userList[i].userAuth.mailAddr,
                        phone:data.data.userList[i].user.phoneNum,
                        authority:(data.data.userList[i].userAuth.userType===1?"管理员":"普通用户"),
                        state:((data.data.userList[i].userAuth.userType!==0)?'正常':'封禁中'),
                    });
                }
                this.usersData=u;
                this.setState({});
                return u;
            }
            if(data.status === -1){
                alert("操作失败");
                return;
            }
        };
        getRequest(url,getUsersJson,callback)
            .then((data) => {
                callback(data);
            })
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleChange(value) {
        console.log(`selected ${value}`);
    };
    //执行操作
    tackle=(operation)=>{
        let url=apiUrl;
        let banUserJson = {
            idArray: []
        };
        if(operation==='unsure') operation=this.state.banSelection;
        if(operation==='BanAll'){
            console.log("I'm going to ban all "+JSON.stringify(this.state.selectedRowKeys));
            url+='/user/ban';
        }else if(operation==='BanLift'){
            console.log("I'm going to ban lift "+JSON.stringify(this.state.selectedRowKeys));
            url+='/user/lift-ban';
        }else if(operation==='BanExtend'){
            console.log("I'm going to ban extend "+JSON.stringify(this.state.selectedRowKeys)+"to date "+this.state.banExtendDate);
            console.log("this function is undone.お疲れ様です～");
            return;
        }else if(operation==='NoOperation'){
            console.log("I'm going to do nothing.");
            alert("请选择操作");
        }
        else{
            console.log("unknown operation");
            alert("unknown operation");
            return;
        }
        for(let i=0;i<this.state.selectedRowKeys.length;i++){
            banUserJson.idArray.push(parseInt(this.state.selectedRowKeys[i]));
        }
        let callback = data => {
            console.log(data);
            if(data.status === 0){
                for(let i=0;i<this.state.selectedRowKeys.length;i++){
                    this.usersData[this.state.selectedRowKeys[i]-1].state=((this.usersData[this.state.selectedRowKeys[i]-1].state==='正常')?'封禁中':'正常');
                }
                this.setState({});
                alert("操作成功");
                return;
            }
            if(data.status === -1){
                alert("操作失败");
                return;
            }
        };
        postRequest(url,JSON.parse(JSON.stringify(banUserJson)),callback)
            .then((data) => {
                callback(data);
            })
    };
    //处理操作
    handleBans=value=>{
        this.setState({
            banSelection:value
        });
        this.tackle(value);
    };
    setBanSelection=value=>{
        this.setState({
            banSelection:value
        })
    };
    //处理封禁时间延长
    setDateExtends=moment=>{
        this.setState({
            banExtendDate:moment
        })
    };
    //单个封禁选择框
    OperationBanSelection=<Select id={"select"} defaultValue="NoOperation" onSelect={(value)=> this.setBanSelection(value)} style={{ width: 200 }} size={"large"}>
        <Option value="NoOperation">请选择时间</Option>
        {/*<Option value="Option2">封禁3天</Option>*/}
        {/*<Option value="Option2">封禁7天</Option>*/}
        {/*<Option value="Option2">封禁30天</Option>*/}
        <Option value="BanAll">封禁永久</Option>
    </Select>;
    //批量操作选择框
    BatchOperationSelection=<p>
        <Input.Group compact style={{display:"inline"}}>
            <Select id={"select"} defaultValue={"NoOperation"} onSelect={(value)=> this.setBanSelection(value)}>
                <Option value="NoOperation">请选择操作</Option>
                <Option value="BanLift">一律设为解封</Option>
                {/*<Option value="Option2">一律封禁3天</Option>*/}
                {/*<Option value="Option2">一律封禁7天</Option>*/}
                {/*<Option value="Option2">一律封禁30天</Option>*/}
                <Option value="BanAll">一律封禁永久</Option>
            </Select>
        </Input.Group>
        <Button danger={true} style={{display:"inline"}} onClick={()=>this.tackle("unsure")}>确认修改</Button>
    </p>;
    //单项封禁原因选择框
    ReasonSelection=<Select
        size={"middle"}
        mode="multiple"
        style={{ width: '200px' }}
        placeholder="选择至少1条原因"
        onChange={this.handleChange}
        optionLabelProp="label"
    >
        <Option value="ero" label="色情信息">
            <div className="demo-option-label-item">エロティック</div>
        </Option>
        <Option value="fake" label="不实信息">
            <div className="demo-option-label-item">噓つき</div>
        </Option>
        <Option value="irrelevant" label="无关信息">
            <div className="demo-option-label-item">広告、関係ないコンテンツ</div>
        </Option>
        <Option value="hostile" label="恶意信息">
            <div className="demo-option-label-item">敵意があるコンテンツ</div>
        </Option>
        <Option value="other" label="其他原因">
            <div className="demo-option-label-item">他の理由</div>
        </Option>
    </Select>;
    update(selectedRowKeys){
        // console.log(selectedRowKeys);
        //选择0人
        if(selectedRowKeys.length===0) this.setState({
            selectedNumContext:null,
            allContext:null,
            operationContext:null,
        });
        //选择多人
        else if(selectedRowKeys.length>1) {
            this.setState({
                selectedNumContext:"您选择了"+selectedRowKeys.length+"位用户：",
                banSelection:"NoOperation",
                operationContext:this.BatchOperationSelection,
                allContext:null
            });
        }
        //选择1人
        else {
            this.setState({
                selectedNumContext:"您选择了用户"+this.usersData[selectedRowKeys[0]-1].name+" (ID:"+this.usersData[selectedRowKeys[0]-1].key+")",
            });
            //此人已封禁
            if(this.usersData[selectedRowKeys[0]-1].state==="封禁中"){
                this.setState({
                    allContext:<div><Paragraph>该用户已被封禁，封禁日期：<Text>2020-10-15</Text>，封禁时长：<Text>永久</Text>，预计结束日期：<Text>无</Text></Paragraph></div>,
                    operationContext:<div>
                        <Paragraph>操作</Paragraph>
                        <Space direction={"vertical"}>
                            <p>
                                延长封禁至&nbsp;&nbsp;
                                <DatePicker defaultValue={moment(new Date(), dateFormat)} format={dateFormat} onChange={(moment)=> this.setDateExtends(moment)}/>
                                &nbsp;&nbsp;{this.ReasonSelection}&nbsp;&nbsp;
                                <Button onClick={()=>this.tackle("BanExtend")}>确认</Button>
                            </p>
                            <Button onClick={()=>this.handleBans("BanLift")}>解禁</Button>
                            <Button onClick={()=>this.handleBans("BanAll")}>永久封禁</Button>
                        </Space>
                        <br/>
                        <br/>
                    </div>,
                })
            }
            //此人未封禁
            else{
                this.setState({
                    allContext:<div><Paragraph>该用户未被封禁</Paragraph></div>,
                    operationContext:
                        <div>
                            <Paragraph>操作</Paragraph>
                            <Space direction={"vertical"}>
                                <p>
                                    设置封禁时长：&nbsp;&nbsp;{this.OperationBanSelection}&nbsp;&nbsp;{this.ReasonSelection}&nbsp;&nbsp;
                                    <Button onClick={()=>this.tackle("BanAll")}>确认</Button>
                                </p>
                                <p><a>查看管理历史</a></p>
                                <p><a>查看用户主页</a></p>
                            </Space>
                            <br/>
                            <br/>
                        </div>,
                });
            }
        }
    }
    selectRow = (record) => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        console.log(selectedRowKeys);
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
            selectedRowKeys.push(record.key);
        }
        this.setState({ selectedRowKeys });
        // alert(JSON.stringify(this.data[selectedRowKeys[0]-1]));
        this.update(selectedRowKeys);
        // alert("here");
    };

    componentDidMount() {
        this.usersData=this.getUsers(0);
    }

    render() {
        const selectedRowKeys = this.state.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys
                });
                this.update(selectedRowKeys);
            }
        };
        // this.usersData=[];
        // this.usersData=this.getUsers(0);
        // for (let i = 0; i < 100; i++) {
        //     this.usersData.push({
        //         key: (i+5),
        //         name: 'James No.'+i,
        //         regDate:'2020-10-11',
        //         authority:'普通用户',
        //         phone:'123456798',
        //         email:'asad@asjda.sds',
        //         state:'正常',
        //     });
        // }
        // console.log(this.usersData);
        return (
            <div>
                <Table
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={this.usersData}
                    onRow={(record) => ({
                        onClick: () => {
                            this.selectRow(record);
                        },
                    })}
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: 240 }}
                />
                <br/>
                <Title style={{fontSize:20}}>{this.state.selectedNumContext}</Title>
                <br/>
                <div>
                    {this.state.allContext}
                </div>
                <Space direction={"horizontal"}>
                    {this.state.operationContext}
                </Space>
            </div>
        );
    }
}
export default UserForm;