import React from "react";
import {Card, message} from 'antd';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState} from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftjs from 'draftjs-to-html';
import {postRequestWithoutJson} from "../Utils/Ajax";
import {imageUploadCallBack} from "../Utils/Tool";
import {apiUrl} from "../UrlConfig";
import {history} from "../Utils/History";

// 用法：
// <RichText editorContent={this.state.content} onEditorChange={this.onEditorChange} minHeight={this.state.RichTextMinHeight}/>

export class RichText extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            editorContent: this.props.editorContent,
            minHeight:this.props.minHeight,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps,nextContext){
        this.setState({
            editorContent:nextProps.editorContent,
        })
    }

    onEditorStateChange = (editorState) => {
        console.log(editorState);
        this.setState({
            editorState:editorState
        });
    };

    render(){
        return (
            <Card style={{minHeight:this.state.minHeight}}>
                <Editor
                    editorState={this.state.editorState}
                    toolbarClassName="home-toolbar"
                    wrapperClassName="home-wrapper"
                    editorClassName="home-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{ //Editor富文本组件功能控制
                        history: { inDropdown: true },
                        inline: { inDropdown: false },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        image: {
                            urlEnabled: true,
                            uploadEnabled: true,
                            alignmentEnabled: true,   // 是否显示排列按钮 相当于text-align
                            uploadCallback: imageUploadCallBack,  //图片的处理 （但是仅限于本地上传的，url方式不经过此函数）
                            previewImage: true,
                            inputAccept: 'image/*',
                            alt: {present: false, mandatory: false}
                        }
                    }}
                    onContentStateChange={this.props.onEditorChange}
                    placeholder="问题内容" //输入框中默认内容
                    spellCheck
                    localization={{ locale: 'zh', translations: { 'generic.add': '添加' } }}
                />
            </Card>
        );
    }
}

export default RichText;

