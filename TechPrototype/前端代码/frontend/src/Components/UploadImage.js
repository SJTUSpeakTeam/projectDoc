import React from "react";
import "../Css/antd.css";
import "../Css/Person.css";
import { Modal, Upload,  message, Button} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import ImgCrop from 'antd-img-crop';
import {imageUploadCallBack} from "../Utils/Tool"

//用法：
//<UploadImage img={} avatarChange={}/>

class UploadImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalText: '本地上传',
            visible: false,
            confirmLoading: false,
            img: this.props.img,
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps,nextContext) {
        this.setState({
            img:nextProps.img
        });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    beforeUpload=(file)=>{
        return new Promise((resolve, reject) => {
            let testmsg=file.name.substring(file.name.lastIndexOf('.')+1);
            const extension = testmsg === 'jpg' ||  testmsg === 'JPG' ||  testmsg === 'png' ||  testmsg === 'PNG';
            const isLt10M = file.size < 10 * 1024 * 1024;
            if(!extension || !isLt10M  ) {
                if(!extension) {
                    message.error('上传的必须是图片');
                    reject();//必须加上return false; 才能阻止
                }
                if(!isLt10M) {
                    message.error('上传头像不能超过10M' );
                    reject();//必须加上return false; 才能阻止
                }
            }
            else resolve();
            return extension ;
        })
    };

    MyUpLoad = (option) =>{
        // let images=this.state.images;
        // let temp=[];
        // temp.push(option.file.uid);
        //
        //
        // const formData = new FormData();
        // formData.append("files[]", option.file);
        // const reader = new FileReader();
        // reader.readAsDataURL(option.file);
        // reader.onloadend = (e)=> {
        //     if (e && e.target && e.target.result) {
        //         option.onSuccess();
        //         temp.push(e.target.result);
        //         images.push(temp);
        //         this.setState({
        //             images:images,
        //         });
        //     }
        // };
        imageUploadCallBack(option.file)
            .then(r =>{
                this.props.avatarChange(r.data.link)
            });
    };


    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="lmlblog-member-avatar" style={{marginLeft:"10%",marginTop:"10%"}}>
                <img
                    src={(this.state.img===""||this.state.img===null||this.state.img===undefined)?
                        require("../images/Default_avatar.jpg"):this.state.img} alt="图片"
                    onClick={this.showModal}
                />
                <i className="lmlblog-verify lmlblog-verify-a" title="vip"/>
                <Modal
                    title="上传头像"
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button type={"primary"} key="back" onClick={this.handleCancel}>
                            确定
                        </Button>,
                    ]}
                >
                    <p>{ModalText}</p>
                    <ImgCrop rotate>
                        <Upload
                            beforeUpload={this.beforeUpload}
                            customRequest={this.MyUpLoad}
                            listType="picture-card"
                            showUploadList={false}
                        >
                            {this.state.img !== "" ? <img src={this.state.img} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </ImgCrop>
                </Modal>
            </div>
        );
    }
}
export default UploadImage;
