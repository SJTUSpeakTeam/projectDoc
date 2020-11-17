import React from "react";
import {Button,message,Drawer, Space} from 'antd';
import RichText from "./RichText";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftjs from 'draftjs-to-html';
import {apiUrl} from "../UrlConfig";
import {history} from "../Utils/History";
import {getRequest,postRequest} from "../Utils/Ajax";

export class CommentSpeak extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            visible: false,
            RichTextMinHeight:"400px",
        };
    }

    showDrawer = () => {
        this.setState({visible: true});
    };

    onClose = () => {
        this.setState({visible: false});
    };

    onEditorChange = (editorContent) => {
        console.log(draftjs(editorContent))
        //editorContent = '<html lang="en"><head><meta charset="UTF-8"><title></title></head><body>' + draftjs(editorContent) + '</body></html>'
        this.setState({
            content: draftjs(editorContent)
        });
    };//获取html富文本

    handlePost = () =>{
        this.props.handlePost(this.state.content);
        /*if ( this.state.content === '' )
            return;
        let url = apiUrl + '/postAnswer';
        let postJson = {
             //questionId: integer,
            // userId: integer,
            content: this.state.content
        }
        let callback = data => {
            console.log(data);
            if (data.status === 0) {
                message.info("发帖成功")
                // this.setState({
                //     header: '',
                //     content:'',
                //     theme: [],
                //     tag: []
                // })
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
            .catch((error)=>{
                console.log(error);
            });*/
    }


    render() {
        return (
            <div>
                <Space>
                    <Button style={{backgroundColor:"#d3adf7"}} onClick={this.showDrawer} size="middle" shape="round">
                        回复问题
                    </Button>
                </Space>
                <Drawer
                    // title="Basic Drawer"
                    height={"500px"}
                    placement="bottom"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <RichText editorContent={this.state.content} onEditorChange={this.onEditorChange}
                              minHeight={this.state.RichTextMinHeight}/>
                    <Button type="danger" size="large" shape="round" style={{float:"right"}} onClick={this.handlePost}>发表</Button>
                </Drawer>
            </div>
        );
    }


}

export default CommentSpeak;

