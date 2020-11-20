import React from "react";
import '../Css/Header.css';
import '../Css/bootstrap5152.css?ver=1.0';
import '../Css/responsive5152.css?ver=1.0';
import '../Css/main5152.css?ver=1.0';


import {Input, message} from 'antd';
import {Link} from "react-router-dom";
import {history} from "../Utils/History";
import debounce from 'lodash/debounce';
import {apiUrl} from "../UrlConfig";
import {getRequest} from "../Utils/Ajax";

const {Search} = Input;

class Foot extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <footer id="footer-wrapper">
                <div id="footer" className="container">
                    <div className="row">
                        <div className="span1">
                        </div>
                        <div className="span3">
                            <section className="widget">
                                <h3 className="title">开发者</h3>
                                <div className="textwidget">
                                    <p> 交大说说开发组</p>
                                    <p> spill your heart</p>

                                </div>
                            </section>
                        </div>

                        <div className="span3">
                            <section className="widget"><h3 className="title" style={{marginLeft:30}}>联系我们</h3>
                                <ul>
                                    <li><a href="#" title="Lorem ipsum dolor sit amet,">电话：021-123456789</a></li>
                                    <li><a href="#" title="Lorem ipsum dolor sit amet,">邮箱：123456@stju.edu.cn</a></li>
                                </ul>
                            </section>
                        </div>
                        <div className="span1">
                        </div>

                        <div className="span3">
                            <section className="widget">
                                <h3 className="title">最近更新时间</h3>
                                <div id="twitter_update_list">
                                    <ul>
                                        <li style={{marginLeft:1}}>2020-10-17 9:00:00</li>
                                    </ul>
                                </div>

                            </section>
                        </div>


                    </div>
                </div>
            </footer>
        )
    }
}

export default Foot;
