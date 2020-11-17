import React from "react";
import Header from "../Components/Header";

import SearchBar from "../Components/MainPage/SearchBar";
import FeaturedQuestions from "../Components/MainPage/FeaturedQuestions";
import LatestQuestions from "../Components/MainPage/LatestQuestions";
import PostPage from "./PostPage";
import PersonPage from "./PersonPage";
import Foot from "../Components/Foot";
import PostSpeak from "../Components/PostSpeak";


class Temp extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <PostSpeak/>
                <Foot/>
            </div>
        );
    }
}

export default Temp;
