import React  from "react";
import {Table, Form, Divider, Space, List} from 'antd';
import { Modal, Button } from 'antd';

import Title from "antd/lib/typography/Title";
import { Input, Select,  DatePicker,  Tag } from 'antd';
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import moment from 'moment';
// import {number} from "echarts/src/export";
import {number} from 'echarts';
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
class AdminForm extends React.Component{
    constructor(props) {
        super(props);
        this.setState({
            selectedRowKeys: [],
            visible: false,
            selectedNumContext:null,
            allContext:null,
            sectionText:null,
        });
        this.update([]);
    }
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
            title: 'JAccount',
            dataIndex: 'JAccount',
            width:150,
        },
        {
            title: '状态',
            dataIndex: 'state',
            width:100,
        },
        {
            title: '负责分区',
            key: 'tags',
            width:200,
            dataIndex: 'tags',
            render: tags => (
                <span>
        {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
                color = 'volcano';
            }
            return (
                <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                </Tag>
            );
        })}
      </span>
            ),
        },
        {
            title: '查看',
            dataIndex: '',
            key: 'x',
            render: () => <div><a onClick={this.showModal}>历史</a><Divider type="vertical"/><a>主页</a><Modal
                title="Basic Modal"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <p>2020-10-2 开始封禁 时长：3天 原因：侮辱他人</p>
                <p>2020-10-6 封禁结束</p>
                <p>2020-10-15 开始封禁 时长：30天 原因：淫秽色情</p>
            </Modal></div>,
            width:100,
        }
    ];

    data = [{
        key: '1',
        name: 'John Brown',
        JAccount:'518030910237',
        state:'正常',
        tags: ['化学', '物理'],
    }, {
        key: '2',
        name: 'Jim Green',
        JAccount:'518030910163',
        state:'封禁中',
        tags: ['医学', '建筑'],
        banFrom:'2020-10-18',
        banTo:'2020-10-22',
        banDuration:'3日',
    }, {
        key: '3',
        name: 'Joe Black',
        JAccount:'518030910235',
        state:'正常',
        tags: ['IT'],
    }, {
        key: '4',
        name: 'Disabled User',
        JAccount:'-',
        state:'正常',
        tags: ['全部'],
    }];
    state = {
        selectedRowKeys: [],
        visible: false,
        selectedNumContext:null,
        allContext:null,
        sectionText:null,
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
    testuse(e){
        this.setState({
            visible:false,
        });
        if(e===1){
            this.columns=null;
        }else{
            this.columns=[];
        }
    }
    handleChange(value) {
    }
    options = [];
    update(selectedRowKeys){

        if(selectedRowKeys.length===0) this.setState({
            selectedNumContext:"新增管理员",
            allContext:
            <div>
                请输入用户ID：
                <input type={number}/>
                请选择分区：
                <Select
                    mode="multiple"
                    style={{ width: 300 }}
                    placeholder="不能为空"
                    onChange={this.handleChange}
                >
                    <Option value={"化学"}>化学</Option>
                    <Option value={"物理"}>物理</Option>
                    <Option value={"医学"}>医学</Option>
                    <Option value={"建筑"}>建筑</Option>
                    <Option value={"IT"}>IT</Option>
                    <Option value={"语言"}>语言</Option>
                    <Option value={"机械"}>机械</Option>
                </Select>
                <button>确认</button>
            </div>
            ,
            operationContext:null,
        });
        else if(selectedRowKeys.length>1) {
            this.setState({
                selectedNumContext:"您选择了"+selectedRowKeys.length+"位用户：",
                operationContext:null,
                allContext:<div>
                        <Paragraph>
                            <Paragraph style={{fontSize:15}}>操作</Paragraph>
                            可将管理员全部设置分区：
                            <Select
                                mode="multiple"
                                style={{ width: 300 }}
                                placeholder="请选择分区"
                                onChange={this.handleChange}
                            >
                                <Option value={"化学"}>化学</Option>
                                <Option value={"物理"}>物理</Option>
                                <Option value={"医学"}>医学</Option>
                                <Option value={"建筑"}>建筑</Option>
                                <Option value={"IT"}>IT</Option>
                                <Option value={"语言"}>语言</Option>
                                <Option value={"机械"}>机械</Option>
                            </Select>
                            &nbsp;&nbsp;
                            <Button>确认修改</Button>
                        </Paragraph>
                    <Paragraph>
                        <Input.Group compact>
                            <Select defaultValue="Option1">
                                <Option value="Option1">一律设为解封</Option>
                                <Option value="Option2">一律封禁3天</Option>
                                <Option value="Option2">一律封禁7天</Option>
                                <Option value="Option2">一律封禁30天</Option>
                                <Option value="Option2">一律封禁永久</Option>
                            </Select>
                            <Button>确认修改</Button>
                        </Input.Group>
                    </Paragraph>
                    <Paragraph><Button danger>剥夺管理员权限</Button></Paragraph>
                    </div>,
            });
        }
        else {
            this.setState({
                selectedNumContext:"您选择了用户"+this.data[selectedRowKeys[0]-1].name+" (ID:"+this.data[selectedRowKeys[0]-1].key+")",
            });
            let tags=this.data[selectedRowKeys[0]-1].tags;
            let selectDefaultValues=tags;
            if(tags.length===1&&tags[0]==='全部'){
                selectDefaultValues=["化学","物理","医学","建筑","IT","语言","机械"];
            }
            if(this.data[selectedRowKeys[0]-1].state==="封禁中"){
                this.setState({
                    allContext:<div>
                        <Paragraph>
                            该管理员已被封禁，封禁日期：
                            <Text>
                                {this.data[selectedRowKeys[0]-1].banFrom}
                            </Text>
                            ，封禁时长：
                            <Text>
                                {this.data[selectedRowKeys[0]-1].banDuration}

                            </Text>
                            ，预计结束日期：
                            <Text>
                                {this.data[selectedRowKeys[0]-1].banTo}
                            </Text>
                        </Paragraph>
                    </div>,
                    operationContext:<div>
                        <Paragraph style={{fontSize:15}}>操作</Paragraph>
                        <Space direction={"vertical"}>
                            <Paragraph>
                                该管理员负责以下分区：
                                <Select
                                    mode="multiple"
                                    style={{ width: 300 }}
                                    placeholder="请选择分区"
                                    defaultValue={selectDefaultValues}
                                    onChange={this.handleChange}
                                >
                                    <Option value={"化学"}>化学</Option>
                                    <Option value={"物理"}>物理</Option>
                                    <Option value={"医学"}>医学</Option>
                                    <Option value={"建筑"}>建筑</Option>
                                    <Option value={"IT"}>IT</Option>
                                    <Option value={"语言"}>语言</Option>
                                    <Option value={"机械"}>机械</Option>
                                </Select>
                                &nbsp;&nbsp;
                                <Button>确认修改</Button>
                            </Paragraph>
                            <p>
                                延长封禁至&nbsp;&nbsp;
                                <DatePicker defaultValue={moment(new Date(), dateFormat)} format={dateFormat} />
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
                            <Button danger>剥夺管理员权限</Button>
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
                            该管理员未被封禁
                        </Paragraph>
                    </div>,
                    operationContext:
                        <div>
                            <Paragraph style={{fontSize:15}}>操作</Paragraph>
                            <Paragraph>
                                该管理员负责以下分区：
                                <Select
                                    mode="multiple"
                                    style={{ width: 300 }}
                                    placeholder="请选择分区"
                                    defaultValue={selectDefaultValues}
                                    onChange={this.handleChange}
                                >
                                    <Option value={"化学"}>化学</Option>
                                    <Option value={"物理"}>物理</Option>
                                    <Option value={"医学"}>医学</Option>
                                    <Option value={"建筑"}>建筑</Option>
                                    <Option value={"IT"}>IT</Option>
                                    <Option value={"语言"}>语言</Option>
                                    <Option value={"机械"}>机械</Option>
                                </Select>
                                &nbsp;&nbsp;
                                <Button>确认修改</Button>
                            </Paragraph>
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
                                <p>
                                    <a>查看管理历史</a>
                                </p>
                                <p>
                                    <a>查看用户主页</a>
                                </p>
                                <p><Button danger>剥夺管理员权限</Button></p>
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

        return (
            <div>
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
export default AdminForm;
