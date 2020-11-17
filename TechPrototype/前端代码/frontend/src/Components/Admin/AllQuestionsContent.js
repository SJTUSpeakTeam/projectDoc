import React from "react";
import Title from "antd/lib/typography/Title";
import {Modal, Select, Switch, Table} from "antd";
import {Divider} from "@material-ui/core";
import CommentsForm from "./CommentsForm";
import {Option} from "antd/es/mentions";
import {Button} from "antd";
import {apiUrl} from "../../UrlConfig";
import {getRequest, postRequest,putRequest,deleteRequest} from "../../Utils/Ajax";

class AllQuestionsContent extends React.Component{
    constructor(props) {
        super(props);
        this.setState({
            selectedRowKeys: [], // Check here to configure the default column
            subTitle:null,
            subContent:null,
        });
        this.tackleQuestionSelections(null);
    }
    currentPage=0;
    lastPageTops=[];
    componentDidMount() {
        this.questionsData=this.getQuestions(0);
    }

    getQuestions=value=>{
        let url = apiUrl + '/getNotDeletedQuestions';
        let getFilterQuestionJson=null;
        console.log("asking for page "+this.currentPage,"questionsData",this.questionsData);
        if(value===0||this.currentPage===0){
            getFilterQuestionJson = {
                beginQuestionId:-1,
            };
        }else if(value===2){
            let k=this.lastPageTops.pop();
            // alert("pop:"+k);
            k=this.lastPageTops.pop();
            // alert("pop:"+k);
            if(k==null){
                alert("没有上一页了");
            }
            getFilterQuestionJson = {
                beginQuestionId:k+1
            };
        }
        else {
            let tmp=(this.questionsData[0].questionId<this.questionsData[this.questionsData.length-1].questionId?
                    this.questionsData[0].questionId:this.questionsData[this.questionsData.length-1].questionId
            );
            getFilterQuestionJson = {
                beginQuestionId:tmp,
            };
            // this.lastPageTops.push(tmp);
            // alert("push");
        }

        let callback = data => {
            console.log(data);
            if(data.status === 0){
                if(data.data.questions.length===0&&this.currentPage!==0){
                    alert("没有下一页了");
                    this.currentPage--;
                    return;
                }
                let u=[];
                let maxId=-1;
                for (let i = 0; i < data.data.questions.length; i++) {
                    maxId=(maxId>data.data.questions[i].questionId?maxId:data.data.questions[i].questionId);
                    u.push({
                        key: i,
                        questionId:data.data.questions[i].questionId,
                        likeNum:data.data.questions[i].likeNum,
                        favorNum:data.data.questions[i].favorNum,
                        visitNum:data.data.questions[i].visitNum,
                        title: data.data.questions[i].header,
                        description: data.data.questions[i].content,
                        questionerId:data.data.questions[i].userId,
                        state:(data.data.questions[i].status===1?'正常':(data.data.questions[i].status===-1?'已删除':'封禁中')),
                    });
                }
                // if(value===2){
                //     alert("pop!"+this.lastPageTops.pop());
                // }
                if(maxId!==-1){
                    this.lastPageTops.push(maxId);
                    // alert("push "+maxId);
                }
                this.questionsData=u;
                if(value===0){
                    this.currentPage=0;
                }
                this.setState({});
                return u;
            }
            if(data.status === -1){
                alert("操作失败");
                return;
            }
        };
        getRequest(url,JSON.parse(JSON.stringify(getFilterQuestionJson)),callback)
            .then((data) => {
                callback(data);
            })
    };
    columns = [
        {
            title: '问题ID',
            dataIndex: 'questionId',
            width:100,
        },
        {
            title: '题目',
            dataIndex: 'title',
            width:150,
        },
        {
            title: '点赞数',
            dataIndex: 'likeNum',
            width:100,
        },
        {
            title: '喜爱数',
            dataIndex: 'favorNum',
            width:100,
        },
        {
            title: '浏览数',
            dataIndex: 'visitNum',
            width:100,
        },
        {
            title: '提问人ID',
            dataIndex: 'questionerId',
            width:100,
        },
        {
            title: '状态',
            dataIndex: 'state',
            width:100,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width:100,
            render:(text, record, index) => {
                return (
                    <div><a onClick={this.showModal}>历史</a><Divider type="vertical"/><a>问题页</a><Modal
                        title="Basic Modal"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <p>2020-10-2 开始封禁 时长：3天 原因：侮辱他人</p>
                        <p>2020-10-6 封禁结束</p>
                        <p>2020-10-15 开始封禁 时长：30天 原因：淫秽色情</p>
                    </Modal></div>
                );
            },
        },
    ];
    questionsData = [];
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        subTitle:null,
        subContent:null,
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
    handleChange=value=> {
        console.log(`selected ${value}`);
        this.setState({
            currentSelection:value
        })
    };
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
        this.tackleQuestionSelections(selectedRowKeys);
    };
    handleConfirm(type){
        let url=apiUrl;
        let json=null;
        let callback=data=>{
            console.log(data);
            if(data.status===-1){
                alert("操作失败");
            }
            else if(data.status===0){
                alert("操作成功");
                this.questionsData=this.getQuestions(0);
            }
        };
        if(type==="single"){
            console.log("questionData",this.questionsData);
            console.log("selectedRowKeys",this.state.selectedRowKeys);
            json={
                questionId:this.questionsData[this.state.selectedRowKeys[0]].questionId
            };
            if (this.state.currentSelection==="banAll") {
                url+="/banQuestion";
                console.log("ban!",json);
                putRequest(url,json,callback).then((data)=>{
                    callback(data);
                })
            }else if(this.state.currentSelection==="unbanAll"){
                url+="/unbanQuestion";
                console.log("unban!",json);
                putRequest(url,json,callback).then((data)=>{
                    callback(data);
                })
            }else if(this.state.currentSelection==="deleteAll"){
                url+="/deleteQuestion";
                json={
                    questionId:this.questionsData[this.state.selectedRowKeys[0]].questionId,
                    userId:parseInt(localStorage.getItem("userId"))
                };
                console.log("delete!",json);
                deleteRequest(url,json,callback).then((data)=>{
                    callback(data);
                })
            }else if(this.state.currentSelection==="doNothing"){
                alert("请选择操作");
                return;
            }else{
                alert("unknown operation.");
                return;
            }
        }else if(type==="multi"){
            alert("批量管理接口还没写好");
            return;
            if (this.state.currentSelection==="banAll") {

            }else if(this.state.currentSelection==="unbanAll"){

            }else if(this.state.currentSelection==="deleteAll"){

            }else if(this.state.currentSelection==="doNothing"){
                alert("请选择操作");
                return;
            }else{
                alert("unknown operation.");
                return;
            }
        }
    }


    tackleQuestionSelections(selected){
        var SRK=(selected==null?this.state.selectedRowKeys:selected);
        if(SRK!=null&&SRK.length==1){
            var QuestionID=SRK[0];
            this.setState({
                subTitle:"您选中了1个问题：",
                subContent:<div>
                    <p>
                        状态管理：
                        <Select style={{ width: 120 }} defaultValue={"doNothing"} onChange={this.handleChange}>
                            <Option value="banAll">封禁</Option>
                            <Option value="unbanAll">解禁</Option>
                            <Option value="deleteAll">删除</Option>
                            <Option value="doNothing">不更改</Option>
                        </Select>
                        <Button danger type="dashed" onClick={()=>this.handleConfirm("single")}>确认更改</Button>
                    </p>
                    <br/><br/><br/><br/>
                    <CommentsForm QuestionID={this.questionsData[QuestionID].questionId}/>
                </div>
            });
        }
        else if(SRK==null||SRK.length==0){
            this.setState({
                subTitle:"您尚未选择问题。",
                subContent:null
            });
        }
        else {
            this.setState({
                subTitle:"您选中了多个问题：",
                subContent:<div>
                    <h4>批量操作</h4>
                    <p>
                        状态管理：
                        <Select style={{ width: 120 }} defaultValue={"doNothing"} onChange={this.handleChange}>
                            <Option value="banAll">封禁全部</Option>
                            <Option value="unbanAll">解禁全部</Option>
                            <Option value="deleteAll">删除全部</Option>
                            <Option value="doNothing">不更改</Option>
                        </Select>
                        <Button danger type="dashed">确认更改</Button>
                    </p>
                    <br/><br/><br/><br/>
                </div>
            });
        }
    }

    pageUp=()=>{
        console.log("currentPage",this.currentPage);
        if(this.currentPage===0){
            alert("没有上一页了");
            return;
        }
        this.currentPage--;
        this.getQuestions(2);
    };
    pageDown=()=>{
        console.log("currentPage",this.currentPage);
        if(this.currentPage===0&&this.questionsData.length===0){
            alert("没有下一页了");
            return;
        }
        this.currentPage++;
        this.getQuestions(1);
    };
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
                {
                    key: 'odd',
                    text: 'Select Odd Row',
                    onSelect: changableRowKeys => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return false;
                            }
                            return true;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                },
                {
                    key: 'even',
                    text: 'Select Even Row',
                    onSelect: changableRowKeys => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return true;
                            }
                            return false;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                },
            ],
        };
        var page = this.currentPage + 1;
        return(
            <div id="content" style={{overflow: "hidden",backgroundColor:"#EEEEEE",width:"85%",float:"right",paddingBottom:3000,marginBottom:-3000}}>
                <br/>
                <div style={{width:"90%",marginLeft:25}}>
                    <Title>全部问题</Title>
                    <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.questionsData} pagination={false}/>
                    <div style={{textAlign:"center"}}>
                        <br/><br/>
                        <Button onClick={this.pageUp}>上一页</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第{page}页&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button onClick={this.pageDown}>下一页</Button>
                        <br/><br/>
                    </div>

                </div>
                <Divider variant={"middle"}/>
                <div style={{marginLeft:25,marginRight:35,width:"95%"}}>
                    <br/>
                    <Title>{this.state.subTitle}</Title>
                    <div>{this.state.subContent}</div>
                </div>
            </div>
        );
    }
}
export default AllQuestionsContent;