import React  from "react";
import {Table,  Divider, Space} from 'antd';
import { Modal, Button } from 'antd';

import Title from "antd/lib/typography/Title";
import { Input,  Select,  DatePicker } from 'antd';
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import moment from 'moment';
import {apiUrl} from "../../UrlConfig";

import {getRequest,postRequest} from "../../Utils/Ajax";
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
class UserForm extends React.Component{
    constructor() {
        super();
        this.usersData=[];

    }
    columns = [
        {
            title: '用户Id',
            dataIndex: 'userId',
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
    getUsersByLimits=page=>{
        alert(page);

        let url=apiUrl+"/user/get-key";
        let json=this.currentLimitations;
        if(json.userType==='normalUsers'){
            json.userType=2;
        }
        else if(json.userType==='bannedUsers'){
            json.userType=0;
        }
        else if(json.userType==='admins'){
            json.userType=1;
        }
        else if(json.userType<3&&json.userType>-1){}
        else{

            return;
        }
        json.pageNum=this.currentPage;
        let callback = data =>{
            if(data.status === 0){
                if(data.data.userList.length===0) {
                    if(this.currentPage===0){
                        alert("没有内容");
                        this.usersData=[];
                    }
                    else{
                        alert("没有下一页了");
                        this.currentPage--;
                    }
                    return;
                }
                let u=[];
                for (let i = 0; i < data.data.userList.length; i++) {
                    var date=data.data.userList[i].user.createTime;
                    u.push({
                        userId:data.data.userList[i].user.userId,
                        key: i,
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
        postRequest(url,json,callback)
            .then((data) => {
                callback(data);
            })
    };
    currentLimitations=null;
    componentWillReceiveProps(nextProps, nextContext) {

        this.currentPage=0;
        let filters={
            userType:nextProps.limits.userType,
            ageFrom:-1,
            ageTo:999,
            pageNum:0,
        };
        if(nextProps.limits.name!=null){
            filters.nickname=nextProps.limits.name;
        }
        if(nextProps.limits.gender!=null){
            filters.gender=(nextProps.limits.gender==="male");
        }
        if(nextProps.limits.email!=null){
            filters.mailAddr=nextProps.limits.email;
        }
        this.currentLimitations=filters;

        this.getUsers(0);
    }

    getUsers=page=>{

        if(this.currentLimitations!=null){
            this.getUsersByLimits(page);
            return;
        }
        let url = apiUrl + '/user/get-all';
        let getUsersJson = {
            page:page
        };
        let callback = data => {

            if(data.status === 0){
                if(data.data.userList.length===0) {
                    if(this.currentPage===0){
                        alert("没有内容");
                        this.usersData=[];
                    }
                    else{
                        alert("没有下一页了");
                        this.currentPage--;
                    }
                    return;
                }
                let u=[];
                for (let i = 0; i < data.data.userList.length; i++) {
                    var date=data.data.userList[i].user.createTime;
                    u.push({
                        userId:data.data.userList[i].user.userId,
                        key: i,
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

        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {

        this.setState({
            visible: false,
        });
    };
    handleChange(value) {

    };
    //执行操作
    tackle=(operation)=>{
        let url=apiUrl;
        let banUserJson = {
            idArray: []
        };
        if(operation==='unsure') operation=this.state.banSelection;
        if(operation==='BanAll'){

            url+='/user/ban';
        }else if(operation==='BanLift'){
            url+='/user/lift-ban';
        }else if(operation==='BanExtend'){
           return;
        }else if(operation==='NoOperation'){

            alert("请选择操作");
        }
        else{

            alert("unknown operation");
            return;
        }
        for(let i=0;i<this.state.selectedRowKeys.length;i++){
            banUserJson.idArray.push(parseInt(this.usersData[this.state.selectedRowKeys[i]].userId));
        }
        let callback = data => {

            if(data.status === 0){
                for(let i=0;i<this.state.selectedRowKeys.length;i++){
                    this.usersData[this.state.selectedRowKeys[i]].state=((this.usersData[this.state.selectedRowKeys[i]].state==='正常')?'封禁中':'正常');
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

    setDateExtends=moment=>{
        this.setState({
            banExtendDate:moment
        })
    };

    OperationBanSelection=<Select id={"select"} defaultValue="NoOperation" onSelect={(value)=> this.setBanSelection(value)} style={{ width: 200 }} size={"large"}>
        <Option value="NoOperation">请选择时间</Option>

        <Option value="BanAll">封禁永久</Option>
    </Select>;

    BatchOperationSelection=<p>
        <Input.Group compact style={{display:"inline"}}>
            <Select id={"select"} defaultValue={"NoOperation"} onSelect={(value)=> this.setBanSelection(value)}>
                <Option value="NoOperation">请选择操作</Option>
                <Option value="BanLift">一律设为解封</Option>

                <Option value="BanAll">一律封禁永久</Option>
            </Select>
        </Input.Group>
        <Button danger={true} style={{display:"inline"}} onClick={()=>this.tackle("unsure")}>确认修改</Button>
    </p>;

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

        if(selectedRowKeys.length===0) this.setState({
            selectedNumContext:null,
            allContext:null,
            operationContext:null,
            banSelection:null
        });

        else if(selectedRowKeys.length>1) {
            this.setState({
                selectedNumContext:"您选择了"+selectedRowKeys.length+"位用户：",
                banSelection:"NoOperation",
                operationContext:this.BatchOperationSelection,
                allContext:null
            });
        }

        else {

            this.setState({
                selectedNumContext:"您选择了用户"+this.usersData[selectedRowKeys[0]].name+" (ID:"+this.usersData[selectedRowKeys[0]].userId+")",
                banSelection:"NoOperation",
            });
            //此人已封禁
            if(this.usersData[selectedRowKeys[0]].state==="封禁中"){
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

        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
            selectedRowKeys.push(record.key);
        }
        this.setState({ selectedRowKeys });

        this.update(selectedRowKeys);

    };
    currentPage=0;
    componentDidMount() {
        this.usersData=this.getUsers(0);
    }
    pageUp=()=>{

        if(this.currentPage===0){
            alert("没有上一页了");
            return;
        }
        this.currentPage--;
        this.getUsers(this.currentPage);
    };
    pageDown=()=>{

        if(this.currentPage===0&&(this.usersData==null||this.usersData.length===0)){
            alert("没有下一页了");
            return;
        }
        this.currentPage++;
        this.getUsers(this.currentPage);
    };
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
        let page = this.currentPage + 1;
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
                    pagination={false}
                    scroll={{ y: 240 }}
                />
                <div style={{textAlign:"center"}}>
                    <br/><br/>
                    <Button onClick={this.pageUp}>上一页</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第{page}页&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button onClick={this.pageDown}>下一页</Button>
                    <br/><br/>
                </div>
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
