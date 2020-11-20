import React from "react";
import BannedUserForm from "./BannedUserForm";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import AdminForm from "./AdminForm";
class AdminsManagementContent extends React.Component{
    render() {
        return (
            <div id="content" style={{overflow: "hidden",backgroundColor:"#EEEEEE",width:"85%",float:"right",paddingBottom:3000,marginBottom:-3000}}>
                <br/>
                <div style={{marginLeft:"25px",width:"90%"}}>
                    <Title>高级选项：人员管理</Title>
                    <Paragraph>
                        高级选项需超级管理员权限。
                    </Paragraph>
                    <Paragraph>
                        超级管理员负责授予、取消授予用户管理员权限，合理分配管理员职能和权限。
                    </Paragraph>
                    <AdminForm/>
                </div>
            </div>
        );
    }
}
export default AdminsManagementContent;