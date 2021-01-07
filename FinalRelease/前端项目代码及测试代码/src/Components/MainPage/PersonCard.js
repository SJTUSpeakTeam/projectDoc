import React from "react";
import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';

import '../MainPage/QuestionListItem'

class PersonCard extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        return(
            <section className="widget" style={{marginTop:10}}>
                <div className="quick-links-widget">
                    <h3 className="title">个人情况</h3>

                        <div className="ProfileSideCreator-analytics">
                            <div className="ProfileSideCreator-readCountItem">
                                <div className="ProfileSideCreator-readCountTitle">昨日被阅读数</div>
                                <div className="ProfileSideCreator-readCountNumber">0</div>
                                <div className="css-u2c28s">
                                    <div className="ProfileSideCreator-countDeltaText css-1086365">较前日</div>
                                    <div className="css-1gqd0v0">--</div>
                                </div>
                            </div>
                            <div className="ProfileSideCreator-readCountItem">
                                <div className="ProfileSideCreator-readCountTitle">昨日获赞同数</div>
                                <div className="ProfileSideCreator-readCountNumber">0</div>
                                <div className="css-u2c28s">
                                    <div className="ProfileSideCreator-countDeltaText css-1086365">较前日</div>
                                    <div className="css-1gqd0v0">--</div>
                                </div>
                            </div>
                        </div>
                </div>
            </section>
        )
    }
}

export default PersonCard;
