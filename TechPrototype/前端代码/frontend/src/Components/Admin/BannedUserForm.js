import React ,{useState} from "react";
import {Table, Switch, Input, Select, Space, DatePicker, Button} from 'antd';
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import Title from "antd/lib/typography/Title";
import {SwipeableDrawer} from "@material-ui/core";
const { Option } = Select;

class BannedUserForm extends React.Component{

    columns = [
        {
            title: 'Id',
            dataIndex: 'key',
            width: 100,
        },{
            title: '用户名',
            dataIndex: 'name',
            width:150,
            render: text => <a href="#">{text}</a>,
        },
        {
            title: '权限',
            dataIndex: 'authority',
            width:100,
        },
        {
            title: '封禁时长',
            dataIndex: 'duration',
            width:100,
        },
        {
            title: '起始日期',
            dataIndex: 'dateFrom',
            width:150,
        },
        {
            title: '截止日期',
            dataIndex: 'dateTo',
            width:150,
        },
        {
            title: '封禁原因',
            dataIndex: 'reason',
            width:100,
        },
        {
            title: '封禁',
            width:50,
            render:(text, record, index) => {
                return (
                    <Switch defaultChecked={this.data[index].state=='封禁中'} onChange={this.onSwitch(index)}></Switch>
                );
            },
        },];

    data = [{
        key: '1',
        name: 'John Brown',
        age: 32,
        email: 'cdasf@afa.com',
        regDate:'2020-10-10',
        JAccount:'518030910237',
        authority:'普通用户',
        state:'封禁中',
        dateFrom:'2020-10-17',
        duration:'3日',
        dateTo:'2020-10-21',
        reason:"人身攻击或侮辱",
    }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        email: 'LondonNo@1Lak.com',
        regDate:'2020-10-11',
        JAccount:'518030910163',
        authority:'普通用户',
        state:'正常',
        dateFrom:null,
        duration:null,
        dateTo:null,
        reason:"人身攻击或侮辱",
    }, {
        key: '3',
        name: 'Joe Black',
        age: 32,
        email: 'Sido@Lakark.com',
        regDate:'2020-10-12',
        JAccount:'518030910235',
        authority:'管理员',
        state:'封禁中',
        dateFrom:'2020-10-14',
        duration:'7日',
        dateTo:'2020-10-22',
        reason:"人身攻击或侮辱",
    }, {
        key: '4',
        name: 'Disabled User',
        age: 99,
        email: 'Siasdad@sadrk.com',
        regDate:'2020-10-14',
        JAccount:'-',
        authority:'超级管理员',
        state:'封禁中',
        dateFrom:'2020-10-18',
        duration:'3日',
        dateTo:'2020-10-22',
        reason:"人身攻击或侮辱",
    }];
    state = {
        selectedRowKeys: [],
        visible: false,
        selectedNumContext:null,
        allContext:null,
    };
    onSwitch(num){

    }
    selectRow = (record) => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
            selectedRowKeys.push(record.key);
        }
        this.setState({ selectedRowKeys });
    };
    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };
    update(selectedRowKeys){
        // alert(JSON.stringify(selectedRowKeys));
        if(selectedRowKeys.length==0) this.setState({
            selectedNumContext:null,
            allContext:null,
            operationContext:null,
        });
        else if(selectedRowKeys.length>1) {
            this.setState({
                selectedNumContext:"您选择了"+selectedRowKeys.length+"位用户：",
                operationContext:<Input.Group compact>
                    <Select defaultValue="Option1">
                        <Option value="Option1">一律设为解封</Option>
                        <Option value="Option2">一律封禁3天</Option>
                        <Option value="Option2">一律封禁7天</Option>
                        <Option value="Option2">一律封禁30天</Option>
                        <Option value="Option2">一律封禁永久</Option>
                    </Select>
                </Input.Group>,
                allContext:null
            });
        }
        else {
            this.setState({
                selectedNumContext:"您选择了用户"+this.data[selectedRowKeys[0]-1].name+" (ID:"+this.data[selectedRowKeys[0]-1].key+")",
            });
            if(this.data[selectedRowKeys[0]-1].duration!=null){
                this.setState({
                    allContext:<div>
                        <Paragraph>
                            该用户已被封禁，封禁日期：
                            <Text>
                                {this.data[selectedRowKeys[0]-1].dateFrom}
                            </Text>
                            ，封禁时长：
                            <Text>
                                {this.data[selectedRowKeys[0]-1].duration}
                            </Text>
                            ，预计结束日期：
                            <Text>
                                {this.data[selectedRowKeys[0]-1].dateTo}
                            </Text>
                        </Paragraph>
                    </div>,
                    operationContext:<div>
                        <Paragraph>操作</Paragraph>
                        <Space direction={"vertical"}>
                            <p>
                                延长封禁至&nbsp;&nbsp;

                                &nbsp;&nbsp;
                                <Select
                                    size={"middle"}
                                    mode="multiple"
                                    style={{ width: '200px' }}
                                    placeholder="选择至少1条原因"
                                    onChange={this.handleChange}
                                    optionLabelProp="label"
                                >
                                    <Option value="ero" label="色情信息">
                                        <div className="demo-option-label-item">
                                            エロティック
                                        </div>
                                    </Option>
                                    <Option value="fake" label="不实信息">
                                        <div className="demo-option-label-item">
                                            噓つき
                                        </div>
                                    </Option>
                                    <Option value="irrelevant" label="无关信息">
                                        <div className="demo-option-label-item">
                                            広告、関係ないコンテンツ
                                        </div>
                                    </Option>
                                    <Option value="hostile" label="恶意信息">
                                        <div className="demo-option-label-item">
                                            敵意があるコンテンツ
                                        </div>
                                    </Option>
                                    <Option value="other" label="其他原因">
                                        <div className="demo-option-label-item">
                                            他の理由
                                        </div>
                                    </Option>
                                </Select>
                                &nbsp;&nbsp;
                                <Button>确认</Button>
                            </p>
                            <Button>解禁</Button>
                            <Button>永久封禁</Button>
                        </Space>
                        <br/>
                        <br/>
                    </div>,
                })
            }
            else{
                this.setState({
                    allContext:<div>
                        <Paragraph>
                            该用户未被封禁
                        </Paragraph>
                    </div>,
                    operationContext:
                        <div>
                            <Paragraph>操作</Paragraph>
                            <Space direction={"vertical"}>
                                <p>
                                    设置封禁时长：&nbsp;&nbsp;
                                    <Select defaultValue="" style={{ width: 200 }} size={"large"}>
                                        <Option value="Option2">封禁3天</Option>
                                        <Option value="Option2">封禁7天</Option>
                                        <Option value="Option2">封禁30天</Option>
                                        <Option value="Option2">封禁永久</Option>
                                    </Select>
                                    &nbsp;&nbsp;
                                    <Select
                                        size={"middle"}
                                        mode="multiple"
                                        style={{ width: '200px' }}
                                        placeholder="选择至少1条原因"
                                        onChange={this.handleChange}
                                        optionLabelProp="label"
                                    >
                                        <Option value="ero" label="色情信息">
                                            <div className="demo-option-label-item">
                                                淫秽色情
                                            </div>
                                        </Option>
                                        <Option value="fake" label="不实信息">
                                            <div className="demo-option-label-item">
                                                虚假信息
                                            </div>
                                        </Option>
                                        <Option value="irrelevant" label="无关信息">
                                            <div className="demo-option-label-item">
                                                无关内容或广告
                                            </div>
                                        </Option>
                                        <Option value="hostile" label="恶意信息">
                                            <div className="demo-option-label-item">
                                                人身攻击或侮辱
                                            </div>
                                        </Option>
                                        <Option value="other" label="其他原因">
                                            <div className="demo-option-label-item">
                                                其他原因
                                            </div>
                                        </Option>
                                    </Select>
                                    &nbsp;&nbsp;
                                    <Button>确认</Button>
                                </p>
                                <p>
                                    <a>查看管理历史</a>
                                </p>
                                <p>
                                    <a>查看用户主页</a>
                                </p>
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
        // alert(JSON.stringify(this.data[selectedRowKeys[0]-1]));
        this.update(selectedRowKeys);
        // alert("here");
    };
    render() {
        const selectedRowKeys = this.state.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys
                });
                // alert(JSON.stringify(selectedRows));
                this.update(selectedRowKeys);
            }
        };

        for (let i = 0; i < 100; i+=2) {
            this.data.push({
                key: (i+5),
                name: 'James No.'+i,
                age: 15+i%50,
                email: 'LondonNo@1Lak.com',
                regDate:'2020-10-11',
                JAccount:'518030910163',
                authority:'普通用户',
                state:'正常',
                dateFrom:null,
                duration:null,
                dateTo:null,
                estimate:(i%90)/100,
            });
        }
        for (let i = 1; i < 100; i+=2) {
            this.data.push({
                key: i+5,
                name: 'James No.'+i,
                age: 15+i%50,
                email: 'LondonNo@1Lak.com',
                regDate:'2020-10-11',
                JAccount:'518030910163',
                authority:'普通用户',
                state:'封禁中',
                dateFrom:'2020-10-18',
                duration:'7日',
                dateTo:'2020-10-26',
                estimate:(i%10)/100+0.9,
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
                <Space direction={"horizontal"}>
                    {this.state.operationContext}
                </Space>
            </div>
        );
    }
}
export default BannedUserForm;