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
        // alert(JSON.stringify(this.props));
        // alert(JSON.stringify(this.state));
        // alert(this.state.currentPage);
        // alert(e);
        if(this.state.currentPage!=e) {
            this.setState({
                currentPage: e,
            });
            console.log(e);
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
                // case 4:
                //     this.setState({content: <Title>44444444</Title>});
                //     break;
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
                    this.setState({content:<ThemesManagementContent/>})
                default:
                    break;
            }
        }
    };

    render() {
        return (
            <div id="container" style={{width:"100%"}}>
                <div id="header" style={{backgroundColor:"#FFA500",width:"100%"}}>
                    <Header></Header>
                </div>
                <div id="content" style={{overflow: "hidden"}}>
                    <div id="menu" style={{backgroundColor:"#001529",height:"auto",width:"15%",float:"left",paddingBottom:3000,marginBottom:-3000}}>
                        <Sidebar onRef={this.onRef} alertChange={this.alertChange}/>
                    </div>
                    {this.state.content}
                </div>

            </div>








            // <div className={"row"}>
            //     <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            //         <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">交大说说</a>
            //         <button className="navbar-toggler position-absolute d-md-none collapsed" type="button"
            //                 data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu"
            //                 aria-expanded="false" aria-label="Toggle navigation">
            //             <span className="navbar-toggler-icon"></span>
            //         </button>
            //         <input className="form-control form-control-dark w-100" type="text" placeholder="Search"
            //                aria-label="Search" />
            //             <ul className="navbar-nav px-3">
            //                 <li className="nav-item text-nowrap">
            //                     <a className="nav-link" href="#">Sign out</a>
            //                 </li>
            //             </ul>
            //     </nav>
            //             <Sidebar/>
            //             <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            //                 <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            //                     <h1 className="h2">统计</h1>
            //                     <div className="btn-toolbar mb-2 mb-md-0">
            //                         <div className="btn-group mr-2">
            //                             <Canvas data={{
            //                                 xdata: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            //                                 ydata: {
            //                                     ydata1:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            //                                     ydata2:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            //                                 }
            //                             }}/>
            //                         </div>
            //                     </div>
            //                 </div>
            //                 <HitsSections/>
            //             </main>
            // </div>
        );
    }
}

export default Admin;
