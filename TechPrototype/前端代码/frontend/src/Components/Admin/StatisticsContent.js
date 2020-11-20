import React from "react";
import Sidebar from "./Sidebar";
import Title from "antd/lib/typography/Title";
import Canvas from "./Canvas";
import {Divider} from "@material-ui/core";
import HitsSections from "./HitsSections";

class StatisticsContent extends React.Component{
    constructor() {
        super();
        console.log("here!");
    }
    render() {
        return(
                <div id="content" style={{overflow: "hidden",backgroundColor:"#EEEEEE",width:"85%",float:"right",paddingBottom:3000,marginBottom:-3000}}>
                    <br/>
                    <div style={{width:"90%",marginLeft:25}}>
                        <Title>近期活跃度</Title>
                        <Canvas data={{
                            xdata: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                            ydata: {
                                ydata1:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                                ydata2:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                                ydata3:[2.9, 8.9, 3.0, 16.4, 18.7, 50.7, 185.6, 132.2, 28.7, 8.8, 7.0, 12.3],
                            }
                        }}/>
                    </div>
                    <Divider variant={"middle"}/>
                    <div style={{marginLeft:25,marginRight:35,width:"95%"}}>
                        <br/>
                        <Title>分区热度</Title>
                        <HitsSections></HitsSections>
                    </div>
                </div>
        );
    }
}
export default StatisticsContent;