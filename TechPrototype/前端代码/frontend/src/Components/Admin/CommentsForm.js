import React from "react";
import {Button, Divider, Switch, Table} from 'antd';
import {apiUrl} from "../../UrlConfig";
import {getRequest} from "../../Utils/Ajax";

class CommentsForm extends React.Component
{
    constructor(props) {
        super(props);
        this.setState({
            selectedRowKeys:[],
        });
    }
    replysData=[];
    currentPage=0;
    componentDidMount() {
        alert(this.props.QuestionID);
        this.replysData=this.getReplys(0);
    }
    getReplys=(value)=>{
        let url=apiUrl+"/getAnswerByQuestion";
        let json=null;
        if(value===0||this.currentPage===0){
            json = {
                questionId:this.props.QuestionID,
                beginAnswerId:-1,
            };
        }
        else {
            json = {
                questionId:this.props.QuestionID,
                beginAnswerId:
                    (this.replysData[0].answerId<this.replysData[this.replysData.length-1].answerId?
                            this.replysData[0].answerId:this.replysData[this.replysData.length-1].answerId
                    ),
            };
        }
        let callback = data => {
            console.log(data);
            if(data.status === 0){
                if(data.data.answer.length===0&&this.currentPage!==0){
                    alert("没有下一页了");
                    this.currentPage--;
                    return;
                }
                let u=[];
                for (let i = 0; i < data.data.answer.length; i++) {
                    let date=data.data.answer[i].createTime;
                    u.push({
                        key: i,
                        answerId:data.data.answer[i].answerId,
                        likeNum:data.data.answer[i].likeNum,
                        favorNum:data.data.answer[i].favorNum,
                        visitNum:data.data.answer[i].visitNum,
                        title: data.data.answer[i].header,
                        description: data.data.answer[i].content,
                        questionerId:data.data.answer[i].userId,
                        createTime:(date.year+1900)+"-"+data.month+"-"+date.date,
                        // state:(data.data.answers[i].status===1?'正常':(data.data.answers[i].status===-1?'已删除':'封禁中')),
                    });
                }
                this.replysData=u;
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
        getRequest(url,json,callback)
            .then((data) => {
                callback(data);
            })
    };
    columns = [
        {
            title: '评论ID',
            dataIndex: 'answerId',
            width:100,
        },
        {
            title: '回复人ID',
            dataIndex: 'userId',
            width:100,
        },
        {
            title: '内容',
            dataIndex: 'content',
            width:200,
        },
        {
            title: '点赞数',
            dataIndex: 'likeNum',
            width:50,
        },
        {
            title: '喜爱数',
            dataIndex: 'favorNum',
            width:50,
        },
        {
            title: '浏览数',
            dataIndex: 'visitNum',
            width:50,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width:100,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width:100,
            render:(text, record, index) => {return(
                <div><a onClick={()=>this.handleDeleteAnswer(text,record,index)}>删除</a></div>
            )
            },
        },
    ];

    handleDeleteAnswer=(text,record,index)=>{
        console.log(text,record,index);
    };

    state = {
        selectedRowKeys: [], // Check here to configure the default column
    };

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });

    };
    pageUp=()=>{
        console.log("currentPage",this.currentPage);
        if(this.currentPage===0){
            alert("没有上一页了");
            return;
        }
        this.currentPage--;
        this.getReplys(1);
    };
    pageDown=()=>{
        console.log("currentPage",this.currentPage);
        if(this.currentPage===0&&this.replysData.length===0){
            alert("没有下一页了");
            return;
        }
        this.currentPage++;
        this.getReplys(1);
    };
    render() {
        // alert(JSON.stringify(this.props.QuestionID));
        const title="问题（ID：" +this.props.QuestionID+
            "）的回复管理";
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange:this.onSelectChange,
        };
        var page = this.currentPage + 1;
        return (
            <div>
                <h2>{title}</h2>
                <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.replysData} />
                <div style={{textAlign:"center"}}>
                    <br/><br/>
                    <Button onClick={this.pageUp}>上一页</Button>第{page}页<Button onClick={this.pageDown}>下一页</Button>
                    <br/><br/>
                </div>
            </div>
        );
    }
}
export default CommentsForm;