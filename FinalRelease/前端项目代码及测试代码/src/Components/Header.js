import React from "react";


import '../Css/Header.css';

import '../Css/bootstrap5152.css?ver=1.0';
import '../Css/responsive5152.css?ver=1.0';
import '../Css/main5152.css?ver=1.0';

import PostSpeak from "./PostSpeak";
import {Link} from "react-router-dom";
import {history} from "../Utils/History";


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            personPageRoute:"/PersonPage/"+localStorage.getItem('userId'),
        }
    }

    GoPersonPage=()=>{
        history.replace({pathname: '/PersonPage', state: {userId: localStorage.getItem('userId')}});
    };

    GoCommunity=(value)=>{
        history.push({pathname: '/Community', state: {theme:value,search:''}});
    };


    render() {
        return(
            <div className="header-wrapper">
                <header>
                    <div className="container">


                        <div className="logo-container">


                            <span className="tag-line" ><div style={{fontSize:16}}>交大说说</div></span>
                        </div>



                        <nav className="main-nav">
                            <div className="menu-top-menu-container">
                                <ul id="menu-top-menu" className="clearfix">
                                    <li className={history.location.pathname==="/MainPage"?"current-menu-item":""}>
                                        {<a href=""><Link to="/MainPage">主页</Link></a>}</li>
                                    <li className={history.location.pathname==="/Community"?"current-menu-item":""}>
                                        <a href=""><div onClick={()=>this.GoCommunity('')}>社区</div></a></li>
                                    {localStorage.getItem("userType")!=="1"?<li className={history.location.pathname==="/PersonPage"?"current-menu-item":""}>
                                        <a href="#" onClick={this.GoPersonPage}>个人主页</a></li>:null}

                                    {localStorage.getItem("userType")==="1"? <li className={history.location.pathname==="/Admin"?"current-menu-item":""}>
                                        {<a href=""><Link to="/Admin">管理员页面</Link></a>}</li>:null}
                                    {localStorage.getItem("userType")!=="1"?<li style={{marginLeft:'50px',marginBottom:'20px',paddingBottom:'20px'}}><div href="" ><PostSpeak/></div></li>:<div/>}
                                </ul>
                            </div>
                        </nav>


                    </div>
                </header>
            </div>
        )
    }
}

export default Header;
