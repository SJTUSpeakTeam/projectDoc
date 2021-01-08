import React  from "react";
import {Table,  Select,  Button, Divider} from 'antd';
import Title from "antd/lib/typography/Title";



class BannedQuestionForm extends React.Component{

    columns = [
        {
            title: '问题Id',
            dataIndex: 'questionId',
            width: 100,
        },
        {
            title: '问题标题',
            dataIndex: 'title',
            width: 100,
        },
        {
            title: '发布用户名',
            dataIndex: 'author',
            width:150,
        },
        {
            title: '发布用户ID',
            dataIndex: 'authorId',
            width:150,
        },
        {
            title: '封禁日期',
            dataIndex: 'date',
            width:150,
        },
        {
            title: '封禁原因',
            dataIndex: 'reason',
            width:100,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width:100,
            render:() => {
                return <div><a>解封</a><Divider type={"vertical"} /><a>删除</a></div>;
            },
        },
    ];

    data = [];
    state = {
        selectedRowKeys: [],
        visible: false,
        selectedNumContext:null,
        allContext:null,
    };
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
    update(selectedRowKeys){

    }
    render() {
        const selectedRowKeys = this.state.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
                this.setState({
                    selectedRowKeys
                });
                this.update(selectedRowKeys);
            }
        };
        for (let i = 0; i < 100; i++) {
            this.data.push({
                key: (i),
                questionId:i,
                title:'who is John No.'+i,
                author: 'James No.'+i,
                date:'2020-10-11',
                authorId:'518030910163',
                reason:'政治'
            });
        }
        return (
            <div>
                <Button style={{float:"right",marginRight:0}}>刷新</Button>
                <br/>
                <Table
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={this.data}
                    onRow={(record) => ({
                        onClick: () => {
                            this.selectRow(record);
                        },
                    })}
                    pagination={{ pageSize: 50 }}
                    scroll={{ y: 240 }}
                />
                <br/>
                <Title style={{fontSize:20}}>{this.state.selectedNumContext}</Title>
                <br/>
                <div>
                    {this.state.allContext}
                </div>
            </div>
        );
    }
}
export default BannedQuestionForm;
