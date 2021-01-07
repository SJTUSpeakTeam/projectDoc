import React from "react";
import {Button, message,  Space, Select, Input, Row, Col, Modal} from 'antd';
import RichText from "./RichText";
import {editorContent} from "./RichText" //从RichText import问题内容
import {apiUrl} from "../UrlConfig";
import {history} from "../Utils/History";
import {getRequest,postRequest} from "../Utils/Ajax";
import debounce from "lodash/debounce";

const {Option} = Select;

export class PostSpeak extends React.Component{
    constructor(props) {
        super(props);
        this.handleTagSearch = debounce(this.handleTagSearch, 1000);
        this.state = {
            header: '',
            themeItems: [],
            theme: [],
            tagItems: [],
            tag: [],
            visible: false,
            RichTextMinHeight:"500px",
        };
    }

    showDrawer = () => {
        this.setState({visible: true});
    };

    onClose = () => {
        this.setState({visible: false});
    };

    UNSAFE_componentWillMount() {
        this.handleThemesSearch();
        this.handleTagsSearch();
    }

    onHeaderChange = (e) => {
        this.setState({header: e.target.value,})
    };

    handleThemeSearch = (value) => {
        if (value === "")
            this.handleThemesSearch();
        else if (this.state.themeItems.indexOf(value) === -1)
            this.setState({
                tagItems: [],
            });
        else {
            let result = [];
            result.push(value);
            this.setState({
                tagItems: result
            })
        }
    };

    handleThemesSearch = () => {
        let url = apiUrl + '/getThemes';
        let callback = returnData => {
            if (returnData.status === 0) {
                let temp = [];
                for (let i = 0; i < returnData.data.themes.length; i++)
                    temp.push(returnData.data.themes[i].name);
                let result = temp;
                this.setState({
                    themeItems: result,
                })
            }
            if (returnData.status === -1) {
                message.error(returnData.errorMessage);
            }
            if (returnData.status === 2) {
                message.error('登录失效');
                history.replace("/SignInPage")
            }
        };
        getRequest(url, {}, callback)
            .then((data) => {
                callback(data);
            })

    };

    handleThemeSelectChange = (value) => {
        this.setState({
            theme: value,
        });
    };

    handleTagSearch = (value) => {
        if (value === "")
            this.handleTagsSearch();
        else {
            let result = [];
            result.push(value);
            this.setState({
                tagItems: result
            })
        }

    };

    handleTagsSearch = () => {
        let url = apiUrl + '/getTags';
        let callback = returnData => {
            if (returnData.status === 0) {
                let result = returnData.data.tags;
                this.setState({
                    tagItems: result,
                })
            }
            if (returnData.status === -1) {
                message.error(returnData.msg);
            }
            if (returnData.status === 2) {
                message.error('登录失效');
                history.replace("/SignInPage")
            }
        };
        getRequest(url, {}, callback)
            .then((data) => {
                callback(data);
            })

    };

    handleTagSelectChange = (value) => {
        this.setState({
            tag: value,
        });
    };

    handlePost = () =>{
        if (this.state.header === '')
        {
            message.error("请输入问题题目！");
            return;
        }
        // else if (editorContent === '')
        // {
        //     message.error("请输入问题内容！");
        //     return;
        // }
        else if (this.state.theme === [])
        {
            message.error("请选择问题主题！");
            return;
        }
        let url = apiUrl + '/postQuestion';
        let postJson = {
            header: this.state.header,
            content: editorContent,
            userId: parseInt(localStorage.getItem('userId')),
            theme: this.state.theme,
            tags: this.state.tag
        };
        let callback = data => {
            if (data.status === 0) {
                message.info("发帖成功");
                this.setState({
                    header: '',
                    theme: [],
                    tag: [],
                    visible: false,
                });
                window.location.reload();
            }
            if (data.status === 1) {
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
        const themeOptions = this.state.themeItems.map(d => <Option key={d}>{d}</Option>);
        const tagOptions = this.state.tagItems.map(d => <Option key={d}>{d}</Option>);

        return (
            <div>
                <Space>
                    <Button style={{backgroundColor:"#d3adf7"}} onClick={this.showDrawer} size="middle" shape="round">
                        发表问题
                    </Button>
                </Space>
                <Modal

                    width={"1000px"}
                    height={"700px"}

                    closable={false}
                    onCancel={this.onClose}
                    visible={this.state.visible}
                    footer={null}
                >
                    <Row>
                        <Col span={13} order={1}>
                            <Input placeholder="问题题目" value={this.state.header} style={{
                                height: "33px", fontSize: "20px"}} onChange={this.onHeaderChange}/>
                        </Col>
                        <Col span={1} order={2}> </Col>
                        <Col span={5} order={3}>
                            <Select
                                showSearch
                                mode="multiple"
                                style={{width: '100%', fontSize: "20px",minHeight:"30px",marginBottom:"5%"}}
                                placeholder="请选择标签"
                                value={this.state.tag}
                                onSearch={this.handleTagSearch}
                                onChange={this.handleTagSelectChange}
                            >
                                {tagOptions}
                            </Select>
                        </Col>
                        <Col span={1} order={4}> </Col>
                        <Col span={4} order={5}>
                            <Select
                                showSearch
                                style={{width: '100%', fontSize: "20px"}}
                                placeholder="请选择主题"
                                value={this.state.theme}
                                onSearch={this.handleThemeSearch}
                                onChange={this.handleThemeSelectChange}
                            >
                                {themeOptions}
                            </Select>
                        </Col>
                    </Row>
                    <RichText />
                    <Button size="large" shape="round" onClick={this.handlePost} style={{float:"right",marginTop:"1%",marginBottom:"10%",
                        backgroundColor:'#91d5ff',fontWeight: "bold"}}>发表</Button>
                    <br/><br/>
                </Modal>
            </div>
        );
    }


}

export default PostSpeak;

