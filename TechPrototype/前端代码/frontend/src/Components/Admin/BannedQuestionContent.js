import React from "react";
import BannedQuestionForm from "./BannedQuestionForm";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";

class BannedQuestionContent extends React.Component{
    render() {
        return (
            <div id="content" style={{overflow: "hidden",backgroundColor:"#EEEEEE",width:"85%",float:"right",paddingBottom:3000,marginBottom:-3000}}>
                <br/>
                <div style={{marginLeft:"25px",width:"90%"}}>
                    <Title>评估待封禁的问题</Title>
                    <Paragraph>
                        这里的问题是系统评估得到的待封禁的问题，系统已经封禁疑似违规的问题。
                    </Paragraph>
                    <Paragraph>
                        管理员需要评估每个问题的封禁情况，解封系统误封的正常问题，封禁系统漏掉的违规问题。
                    </Paragraph>
                    <BannedQuestionForm/>
                </div>
            </div>
        );
    }
}
export default BannedQuestionContent;