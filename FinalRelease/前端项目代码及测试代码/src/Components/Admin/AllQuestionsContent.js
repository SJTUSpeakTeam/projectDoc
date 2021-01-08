import React from "react";
import Title from "antd/lib/typography/Title";
import {Col,  Form, Input, Modal, Row, Select,  Table} from "antd";
import {Divider} from "@material-ui/core";
import CommentsForm from "./CommentsForm";
import {Option} from "antd/lib/mentions";
import {Button} from "antd";
import {apiUrl} from "../../UrlConfig";
import {getRequest, postRequest,putRequest,deleteRequest} from "../../Utils/Ajax";

class AllQuestionsContent extends React.Component{
    constructor(props) {
        super(props);
        this.setState({
            selectedRowKeys: [],
            subTitle:null,
            subContent:null,
        });
        this.tackleQuestionSelections(null);
    }
    currentPage=0;
    lastPageTops=[];
    limitations=null;
    selections=null;
    componentDidMount() {
        this.getThemes();
        this.questionsData=this.getQuestions(0);
    }

    getThemes=val=>{
        let url=apiUrl+'/getThemes';
        let callback =data=>{

            if(data.status === 0){
                let s = [];
                for (let i = 0; i < data.data.themes.length; i++) {
                    s.push(<Option key={data.data.themes[i].name}>{data.data.themes[i].name}</Option>);
                }
                this.setState({
                    types:s
                });
                return s;
            }
            if(data.status === -1){
                alert("操作失败");
                return;
            }
        };
        getRequest(url,{},callback)
            .then((data) => {
                callback(data);
            })
    };
    getQuestions=value=>{
        let url = apiUrl + '/getAdminQuestions';
        let getFilterQuestionJson=null;

        if(this.selections==null){
            getFilterQuestionJson = {
                beginQuestionId:-1
            };
        }else{
            getFilterQuestionJson = {
                beginQuestionId:-1,
                search:this.selections.keyword,
                theme:this.selections.theme,
            };
            if(this.selections.theme==null){
                getFilterQuestionJson.theme="";
            }
            if(this.selections.banType!=null){
                getFilterQuestionJson.ban=(this.selections.banType==='bannedQuests');
            }
            if(this.selections.delType!=null){
                getFilterQuestionJson.delete=(this.selections.delType==='deletedQuests');
            }
        }
        if(value===0||this.currentPage===0){}
        else if(value===2){
            let k=this.lastPageTops.pop();
            // alert("pop:"+k);
            k=this.lastPageTops.pop();
            // alert("pop:"+k);
            if(k==null){
                alert("没有上一页了");
            }
            getFilterQuestionJson.beginQuestionId=k+1;
        }
        else {
            let tmp=(this.questionsData[0].questionId<this.questionsData[this.questionsData.length-1].questionId?
                    this.questionsData[0].questionId:this.questionsData[this.questionsData.length-1].questionId
            );
            getFilterQuestionJson.beginQuestionId=tmp;

        }

        let callback = data => {

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
                        answerNum:data.data.questions[i].answerNum,
                        title: data.data.questions[i].header,
                        description: data.data.questions[i].content,
                        questionerId:data.data.questions[i].userId,
                        state:(data.data.questions[i].status===1?'正常':(data.data.questions[i].status===-1?'封禁中':'已删除')),
                    });
                }

                if(maxId!==-1){
                    this.lastPageTops.push(maxId);

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
        postRequest(url,JSON.parse(JSON.stringify(getFilterQuestionJson)),callback)
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
            title: '回答数',
            dataIndex: 'answerNum',
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
            render:() => {
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
        selectedRowKeys: [],
        subTitle:null,
        subContent:null,
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
    handleChange=value=> {

        this.setState({
            currentSelection:value
        })
    };
    onSelectChange = selectedRowKeys => {

        this.setState({ selectedRowKeys });
        this.tackleQuestionSelections(selectedRowKeys);
    };
    handleConfirm(type){
        let url=apiUrl;
        let json=null;
        let callback=data=>{

            if(data.status===-1){
                alert("操作失败");
            }
            else if(data.status===0){
                alert("操作成功");
                this.questionsData=this.getQuestions(0);
            }
        };
        if(type==="single"){

            json={
                questionId:this.questionsData[this.state.selectedRowKeys[0]].questionId
            };
            if (this.state.currentSelection==="banAll") {
                url+="/banQuestion";

                putRequest(url,json,callback).then((data)=>{
                    callback(data);
                })
            }else if(this.state.currentSelection==="unbanAll"){
                url+="/unbanQuestion";

                putRequest(url,json,callback).then((data)=>{
                    callback(data);
                })
            }else if(this.state.currentSelection==="deleteAll"){
                url+="/deleteQuestion";
                json={
                    questionId:this.questionsData[this.state.selectedRowKeys[0]].questionId,
                    userId:parseInt(localStorage.getItem("userId"))
                };

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
        let SRK=(selected==null?this.state.selectedRowKeys:selected);
        if(SRK!=null&&SRK.length===1){
            let QuestionID=SRK[0];
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
        else if(SRK==null||SRK.length===0){
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
    onFinish=value=>{

        this.selections=value;
        if(value!==this.limitations){
            this.lastPageTops=[];
            this.currentPage=0;
            this.questionsData=this.getQuestions(0);
        }
    };

    pageUp=()=>{

        if(this.currentPage===0){
            alert("没有上一页了");
            return;
        }
        this.currentPage--;
        this.getQuestions(2);
    };
    pageDown=()=>{

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
        let page = this.currentPage + 1;
        return(
            <div id="content" style={{overflow: "hidden",backgroundColor:"#EEEEEE",width:"85%",float:"right",paddingBottom:3000,marginBottom:-3000}}>
                <br/>
                <div style={{width:"90%",marginLeft:25}}>
                    <Title>全部问题</Title>
                    <Form layout={this.layout} name="questionsFilter" onFinish={this.onFinish}>
                        <div style={{height:"150px"}}>
                            <Row>
                                <Col span={8}>
                                    <div style={{marginRight:"20px"}}>
                                        <div style={{width:"70%"}}>
                                            <Form.Item name='keyword' label="关键字">
                                                <Input placeholder="空缺以搜索全部" maxLength={"100"} bordered={false} allowClear/>
                                            </Form.Item>
                                            <Form.Item name='theme' label="主题">
                                                <Select placeholder="空缺以搜索全部" allowClear>
                                                    {this.state.types}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{width:"120%"}}>
                                        <Form.Item name="banType" label="问题是否封禁">
                                            <Select allowClear>
                                                <Option value="unbannedQuests">全部</Option>
                                                <Option value="bannedQuests">已封禁</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="delType" label="问题是否删除">
                                            <Select allowClear>
                                                <Option value="undeletedQuests">全部</Option>
                                                <Option value="deletedQuests">已删除</Option>
                                            </Select>
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
