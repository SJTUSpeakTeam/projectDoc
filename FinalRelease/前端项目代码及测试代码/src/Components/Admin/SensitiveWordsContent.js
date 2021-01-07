import React from "react";

import Title from "antd/lib/typography/Title";

import {Divider} from "@material-ui/core";
import Paragraph from "antd/lib/typography/Paragraph";
import SensitiveWordsForm from "./SensitiveWordsForm";

class SensitiveWordsContent extends React.Component{
    render() {
        return(
            <div id="content" style={{overflow: "hidden",backgroundColor:"#EEEEEE",width:"85%",float:"right",paddingBottom:3000,marginBottom:-3000}}>
                <br/>
                <div style={{width:"90%",marginLeft:25}}>
                    <Title>敏感词库管理</Title>
                    <Paragraph>
                        管理员需及时添加涉及血腥、暴力、政治、色情等新的敏感词到敏感词库，并定期维护监测敏感词库。
                    </Paragraph>
                    <SensitiveWordsForm/>
                </div>
                <Divider variant={"middle"}/>
                <div style={{marginLeft:25,marginRight:35,width:"95%"}}>
                    <br/>
                </div>
            </div>
        );
    }
}
export default SensitiveWordsContent;
