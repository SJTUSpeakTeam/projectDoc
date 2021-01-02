import React from "react";
import BannedUserForm from "./BannedUserForm";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";

class BannedUserContent extends React.Component{
    render() {
        return (
            <div id="content" style={{overflow: "hidden",backgroundColor:"#EEEEEE",width:"85%",float:"right",paddingBottom:3000,marginBottom:-3000}}>
                <br/>
                <div style={{marginLeft:"25px",width:"90%"}}>
                    <Title>评估待封禁的用户</Title>
                    <Paragraph>
                        这里的用户是系统评估得到的待封禁的用户，系统已经封禁疑似违规的用户，封禁时长根据累犯情况设定3日、7日、30日、永久四个等级。
                    </Paragraph>
                    <Paragraph>
                        管理员需要评估每个用户的封禁情况，解封系统误封的正常用户，封禁系统漏掉的违规用户，并给与适当的封禁等级。
                    </Paragraph>
                    <BannedUserForm/>
                </div>
            </div>
        );
    }
}
export default BannedUserContent;