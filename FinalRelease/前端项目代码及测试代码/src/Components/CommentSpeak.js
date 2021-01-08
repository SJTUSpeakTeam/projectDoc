import React from "react";
import {Button,Drawer, Space} from 'antd';
import RichText from "./RichText";
import {editorContent} from "./RichText"
export class CommentSpeak extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
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

    handlePost = () =>{
        this.props.handlePost(editorContent);
        window.location.reload();
    };


    render() {
        return (
            <div>
                <Space>
                    <Button style={{backgroundColor:"#d3adf7"}} onClick={this.showDrawer} size="middle" shape="round">
                        回复问题
                    </Button>
                </Space>
                <Drawer

                    height={"500px"}
                    placement="bottom"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <RichText/><br/>
                    <Button type="danger" size="large" shape="round" style={{float:"right"}} onClick={this.handlePost}>发表</Button>
                </Drawer>
            </div>
        );
    }


}

export default CommentSpeak;

