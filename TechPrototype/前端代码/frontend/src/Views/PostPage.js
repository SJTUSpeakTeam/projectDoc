import React from "react";
import {Button, Input, Select, Row, Col, message} from 'antd';
import RichText from "../Components/RichText";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftjs from 'draftjs-to-html';
import {apiUrl} from "../UrlConfig";
import {history} from "../Utils/History";
import {getRequest, postRequest} from "../Utils/Ajax";
import debounce from 'lodash/debounce';
import Header from "../Components/Header";
import Foot from "../Components/Foot";

const {Option} = Select;

export class PostPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleTagSearch = debounce(this.handleTagSearch, 1000);
        this.state = {
            header: '',
            content: '',
            themeItems: [],
            theme: [],
            tagItems: [],
            tag: [],
            RichTextMinHeight: "500px",
        };
    }

    UNSAFE_componentWillMount() {
        this.handleThemesSearch();
        this.handleTagsSearch();
    }

    onHeaderChange = (e) => {
        this.setState({header: e.target.value,})
    }

    onEditorChange = (editorContent) => {
        //editorContent = '<html lang="en"><head><meta charset="UTF-8"><title></title></head><body>' + draftjs(editorContent) + '</body></html>'
        this.setState({
            content: draftjs(editorContent)
        });
    };//获取html富文本

    handleThemeSearch = (value) => {
        if (value === "")
            this.handleThemesSearch();
        else if (this.state.themeItems.indexOf(value) === -1)
            this.setState({
                tagItems: [],
            })
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
            if (returnData.status === 1) {
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
            });
    };

    handleThemeSelectChange = (value) => {
        this.setState({
            theme: value,
        });
    }

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
            if (returnData.status === 1) {
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
            });
    };

    handleTagSelectChange = (value) => {
        this.setState({
            tag: value,
        });
    }

    handlePost = () => {
        if (this.state.header === '' || this.state.content === '' || this.state.theme === [])
            return;
        let url = apiUrl + '/postQuestion';
        let postJson = {
            header: this.state.header,
            content: this.state.content,
            userId: 1,
            theme: this.state.theme,
            tags: this.state.tag
        }
        let callback = data => {
            console.log(data);
            if (data.status === 0) {
                this.setState({
                    header: '',
                    content: '',
                    theme: [],
                    tags: []
                })
            }
            if (data.status === 1) {
                message.error(data.errorMessage);
            }
            if (data.status === 2) {
                message.error('登录失效');
                history.replace("/SignInPage")
            }
        };
        postRequest(url, postJson, callback)
            .then((data) => {
                callback(data);
            });
    }

    render() {
        const themeOptions = this.state.themeItems.map(d => <Option key={d}>{d}</Option>);
        const tagOptions = this.state.tagItems.map(d => <Option key={d}>{d}</Option>);

        return (
            <div>
                <Header/>
                <div style={{marginBottom: '20px', width: "100%", marginLeft: "3%", marginTop: '3%'}}>
                    <Row>
                        <Col span={1} order={0}> </Col>
                        <Col span={8} order={1}>
                            <div style={{width: "100%"}}>
                                <Input placeholder="问题题目" value={this.state.title} style={{
                                    marginBottom: "5%",
                                    height: "50px", width: "100%", fontSize: "20px"
                                }} onChange={this.onHeaderChange}/>
                                <Select
                                    showSearch
                                    mode="multiple"
                                    style={{width: '100%', marginBottom: "5%", fontSize: "20px"}}
                                    placeholder="请选择标签"
                                    defaultValue={[]}
                                    value={this.state.tag}
                                    onSearch={this.handleTagSearch}
                                    onChange={this.handleTagSelectChange}
                                >
                                    {tagOptions}
                                </Select>
                                <Select
                                    showSearch
                                    style={{width: '100%', marginBottom: "5%", fontSize: "20px"}}
                                    placeholder="请选择主题"
                                    defaultValue={[]}
                                    value={this.state.theme}
                                    onSearch={this.handleThemeSearch}
                                    onChange={this.handleThemeSelectChange}
                                >
                                    {themeOptions}
                                </Select>

                            </div>
                        </Col>
                        <Col span={1} order={2}> </Col>
                        <Col span={12} order={3}>
                            <RichText editorContent={this.state.content} onEditorChange={this.onEditorChange}
                                      minHeight={this.state.RichTextMinHeight}
                                      style={{marginRight: "20%", marginLeft: 0, float: "right"}}/>
                        </Col>
                        <Col span={1} order={4}> </Col>
                    </Row>


                    <Button type="danger" shape="round" size={"large"} onClick={this.handlePost}
                            style={{float: "right", marginRight: "9%", marginTop: '3%'}}>发表</Button>


                </div>
                <Foot/>
            </div>
        );
    }
}

export default PostPage;

