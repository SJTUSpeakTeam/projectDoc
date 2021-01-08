import React from "react";
import {Table,  Space, Divider, Input, Select,Button,Form} from 'antd';

import {Option} from "antd/lib/mentions";
import Paragraph from "antd/lib/typography/Paragraph";
import {apiUrl} from "../../UrlConfig";
import {deleteRequest, getRequest, postRequest} from "../../Utils/Ajax";

class SensitiveWordsForm extends React.Component{
    columns = [
        {
            title: '敏感词ID',
            dataIndex: 'sensitiveWordId',
            key: 'sensitiveWordId',
        },
        {
            title: '敏感词内容',
            dataIndex: 'wordContent',
            key: 'wordContent',
        },

        {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime',
        },
        {
            title: '命中数（简介）',
            key: 'profileBanNum',
            dataIndex: 'profileBanNum',
        },
        {
            title: '命中数（用户）',
            key: 'userBanNum',
            dataIndex: 'userBanNum',
        },
        {
            title: '命中数（问题）',
            key: 'questionBanNum',
            dataIndex: 'questionBanNum',
        },
        {
            title: '命中数（回答）',
            key: 'answerBanNum',
            dataIndex: 'answerBanNum',
        },
        {
            title: '命中数（评论）',
            key: 'commentBanNum',
            dataIndex: 'commentBanNum',
        },
        {
            title: '操作',
            key: 'action',
            render:(text)=>(
                    <div>
                        <a onClick={()=>this.handleDelSensitiveWords(text)}>删除</a>
                        <Divider type={"vertical"}/>
                        <a>清零</a>
                    </div>
                )

        },
    ];

    data = [
        {
            key:1,
            wordId: '1',
            wordContent: '敏感词',
            type: '套娃',
            intensity: 0.9,
            hits: 154,
        },
        {
            key:2,
            wordId: '2',
            wordContent: 'nmsl',
            type: '恶意',
            intensity: 0.9,
            hits: 131,
        },    {
            key:3,
            wordId: '3',
            wordContent: '襄阳独立',
            type: '政治',
            intensity: 0.7,
            hits: 152,
        },
    ];
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.data=this.getAllWords();
    }

    getAllWords=()=>{
        let url=apiUrl+"/getSensitiveWords";
        let callback=data=>{

            let u=[];
            if(data.status===-1){
                alert("获取敏感词库失败");
                return;
            }else if(data.status===0){
                // alert("获取敏感词库成功");
                for(let i=0;i<data.data.sensitiveWord.length;i++){
                    let t=data.data.sensitiveWord[i];
                    u.push({
                        key:i,
                        sensitiveWordId: t.sensitiveWordId,
                        wordContent: t.wordContent,
                        createTime: (t.createTime.year+1900)+"-"+(t.createTime.month)+"-"+(t.createTime.date),
                        profileBanNum: t.profileBanNum,
                        userBanNum: t.userBanNum,
                        questionBanNum: t.questionBanNum,
                        answerBanNum: t.answerBanNum,
                        commentBanNum: t.commentBanNum,
                    })
                }
            }
            this.data=u;
            this.onSelectChange(null);
            return u;
        };
        getRequest(url,{},callback)
            .then((data)=>{
                callback(data);
            })
    };

    handleAddSensitiveWords=(value)=>{
        let url=apiUrl+"/postSensitiveWord";
        let json={
            name:value
        };
        let callback=data=>{

            if(data.status===-1){
                alert("添加敏感词失败");
                return;
            }else if(data.status===0){
                alert("添加敏感词成功");
                this.data=this.getAllWords();
            }
        };
        postRequest(url,json,callback)
            .then((data)=>{
                callback(data);
            })
    };

    handleDelSensitiveWords=(value)=>{

        let url=apiUrl+"/deleteSensitiveWord";
        let json={
            sensitiveWordId:value.sensitiveWordId
        };
        let callback=data=>{

            if(data.status===-1){
                alert("删除敏感词失败");
                return;
            }else if(data.status===0){
                alert("删除敏感词成功");
                this.data=this.getAllWords();
            }
        };
        deleteRequest(url,json,callback)
            .then((data)=>{
                callback(data);
            })
    };

    state = {
        selectedRowKeys: [],
    };
    onFinish = values => {
        this.handleAddSensitiveWords(values.content);
    };
    onSelectChange  (selectedRowKeys ) {
        if(selectedRowKeys==null||selectedRowKeys.length===0){
            this.setState({
                selectedRowKeys:[],
                context:<div>
                    <h3>您还未选择任何1项。</h3>
                    <p><Paragraph>新增敏感词:</Paragraph>
                        <Space direction={"vertical"}>
                            <p>
                                <Form onFinish={(value)=>this.onFinish(value)}>
                                    <Form.Item label={"内容"} name={"content"}>
                                        <div style={{"width":300}}>
                                            <Input type={"text"} placeHolder={"违禁词内容"} allowClear/>
                                        </div>
                                    </Form.Item>
                                    <Form.Item label={"类型"} name={"type"}>
                                        <Select style={{ width: '200px' }}>
                                            <Option value={"政治"}>政治</Option>
                                            <Option value={"恶意"}>恶意</Option>
                                            <Option value={"淫秽色情"}>淫秽色情</Option>
                                            <Option value={"下流"}>下流</Option>
                                            <Option value={"其他"}>其他</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button htmlType="submit">确认添加</Button>
                                    </Form.Item>
                                </Form>
                            </p>
                        </Space>
                    </p>
                </div>,
            })
        }
        else if(selectedRowKeys.length===1){
            let curr=(this.data[selectedRowKeys[0]].wordContent);
            this.setState({
                selectedRowKeys:selectedRowKeys,
                context:<div>
                    <h3>您选择了1项。</h3>
                    <p><Paragraph>编辑敏感词:</Paragraph>
                        <Space direction={"vertical"}>
                            <p>
                                <Form>
                                    <Form.Item label={"内容"}>
                                        <div style={{"width":300}}><Input type={"text"} placeHolder={"违禁词内容"} defaultValue={curr} allowClear/></div>
                                    </Form.Item>
                                    <Form.Item label={"类型"}>
                                        <Select
                                            style={{ width: '200px' }}
                                            // defaultValue={this.data[selectedRowKeys[0]].type}
                                        >
                                            <Option value={"政治"}>政治</Option>
                                            <Option value={"恶意"}>恶意</Option>
                                            <Option value={"淫秽色情"}>淫秽色情</Option>
                                            <Option value={"下流"}>下流</Option>
                                            <Option value={"其他"}>其他</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button>确认修改</Button>
                                    </Form.Item>
                                </Form>
                            </p>
                        </Space>
                    </p>
                </div>,
            })
        }
        else {
            this.setState({
                selectedRowKeys:selectedRowKeys,
                context:<div>
                    <h3>您选择了多项。</h3>
                </div>
            })
        }
    };

    selectRow = (record) => {

        let selectedRowKeys = this.state.selectedRowKeys;

        if(selectedRowKeys==null){

            selectedRowKeys=[];
        }
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
            selectedRowKeys.push(record.key);
        }

        this.setState({
            selectedRowKeys:selectedRowKeys,
        });
        this.onSelectChange(selectedRowKeys);
    };

    render() {
        const selectedRowKeys=this.state.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {

                if(selectedRowKeys==null) selectedRowKeys=[];
                this.setState({
                    selectedRowKeys
                });
                this.onSelectChange(selectedRowKeys);
            }
        };
        return (
            <div>
                <Table
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={this.data} />
                <div>
                    {this.state.context}
                </div>
            </div>
        );
    }
}
export default SensitiveWordsForm;
