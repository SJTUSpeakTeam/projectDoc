import React from "react";
import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';

import '../MainPage/QuestionListItem'
import {apiUrl} from "../../UrlConfig";
import {getRequest} from "../../Utils/Ajax";
import {List, message} from "antd";
import {history} from "../../Utils/History";

class Classification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: [],
        };
    }

    UNSAFE_componentWillMount() {

        let urlUser = apiUrl + '/getThemes';
        let themeJson = {};
        getRequest(urlUser, themeJson)
            .then((data) => {

                if (data.status === 0) {
                    this.setState({
                        theme: data.data.themes
                    })
                } else {
                    message.error(data.msg);

                }
            });

    };
    GoCommunity=(value)=>{
        history.push({pathname: '/Community', state: {theme:value}});
    };
    render() {

        return (
            <section className="widget">
                <div className="quick-links-widget">
                    <h3 className="title">问题主题</h3>
                    <ul>
                        <List
                            itemLayout="vertical"
                            size="large"
                            split="false"
                            pagination={false}
                            dataSource={this.state.theme}
                            renderItem={item => (
                                <li onClick={()=>this.GoCommunity(item.name)}><a>{item.name}</a></li>
                            )}
                        />
                    </ul>
                </div>
            </section>
        )
    }
}

export default Classification;
