import React from "react";
import Title from "antd/lib/typography/Title";
import {Divider} from "@material-ui/core";
import Canvas from "../Components/Admin/Canvas";
import HitsSections from "../Components/Admin/HitsSections";
import Sidebar from "../Components/Admin/Sidebar";
import Header from "../Components/Header";
import {history} from "../Utils/History";
import StatisticsContent from "../Components/Admin/StatisticsContent";
import BannedUserContent from "../Components/Admin/BannedUserContent";
import AllUsersContent from "../Components/Admin/AllUsersContent";
import AllQuestionsContent from "../Components/Admin/AllQuestionsContent";
import SensitiveWordsContent from "../Components/Admin/SensitiveWordsContent";
import BannedQuestionContent from "../Components/Admin/BannedQuestionContent";
import AdminsManagementContent from "../Components/Admin/AdminsManagementContent";
import ThemesManagementContent from "../Components/Admin/ThemesManagementContent";
// import '../style.css'
class Admin extends React.Component {
    constructor(props) {
        super(props);
        if(parseInt(localStorage.getItem("userType"))!==1){
            alert("you are inaccessible to visit this page.");
            history.replace('/MainPage');
        }
        this.setState({
            currentPage:1,
            content:<StatisticsContent/>,
        });
    };
    state = {
        currentPage:1,
        content:<StatisticsContent/>,
    };

    alertChange = (e) => {

        if(this.state.currentPage!==e) {

            switch (e) {
                case 1:
                    this.setState({content: <StatisticsContent/>});
                    break;
                case 2:
                    this.setState({content: <AllQuestionsContent/>});
                    break;
                case 3:
                    this.setState({content: <BannedQuestionContent/>});
                    break;

                case 5:
                    this.setState({content: <Title>5555555555</Title>});
                    break;
                case 6:
                    this.setState({content: <SensitiveWordsContent/>});
                    break;
                case 7:
                    this.setState({content:<AllUsersContent/>});
                    break;
                case 8:
                    this.setState({content: <BannedUserContent/>});
                    break;
                case 9:
                    this.setState({content:<AdminsManagementContent/>});
                    break;
                case 10:
                    this.setState({content:<ThemesManagementContent/>});
                    break;
                default:
                    return;
            }
            this.setState({
                currentPage: e,
            });
        }
    };

    render() {
        return (
            <div id="container" style={{width:"100%"}}>
                <div id="header" style={{backgroundColor:"#FFA500",width:"100%"}}>
                    <Header/>
                </div>
                <div id="content" style={{overflow: "hidden"}}>
                    <div id="menu" style={{backgroundColor:"#001529",height:"auto",width:"15%",float:"left",paddingBottom:3000,marginBottom:-3000}}>
                        <Sidebar onRef={this.onRef} alertChange={this.alertChange}/>
                    </div>
                    {this.state.content}
                </div>

            </div>

        );
    }
}

export default Admin;
