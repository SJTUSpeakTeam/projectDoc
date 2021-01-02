import React from "react";
import BannedUserForm from "./BannedUserForm";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import AdminForm from "./AdminForm";
import ThemeForm from "./ThemeForm";
class ThemesManagementContent extends React.Component{
    render() {
        return (
            <div id="content" style={{overflow: "hidden",backgroundColor:"#EEEEEE",width:"85%",float:"right",paddingBottom:3000,marginBottom:-3000}}>
                <br/>
                <div style={{marginLeft:"25px",width:"90%"}}>
                    <Title>高级选项：主题管理</Title>
                    <Paragraph>
                        高级选项需超级管理员权限。
                    </Paragraph>
                    <Paragraph>
                        超级管理员需要管理分区主题，适时添加新的主题。
                    </Paragraph>
                    <ThemeForm/>
                </div>
            </div>
        );
    }
}
export default ThemesManagementContent;