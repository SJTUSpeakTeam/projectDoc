import {Router, Route, Switch} from 'react-router-dom';
import React from "react";

import SignIn from "./Views/SignInPage";
import SignUp from "./Views/SignUpPage";
import Temp from "./Views/temp";
import MainPage from "./Views/MainPage";
import PostPage from "./Views/PostPage";
import {history} from "./Utils/History";
import Community from "./Views/Community";
import QuestionDetailPage from "./Views/QuestionDetailPage";
import Admin from "./Views/Admin";
import PersonPage from "./Views/PersonPage";
class BasicRoute extends React.Component{
    render(){
        return(
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={SignIn}/>
                    <Route exact path="/SignUp" component={SignUp} />
                    <Route exact path="/QuestionDetailPage" component={QuestionDetailPage} />
                    <Route exact path="/PostPage" component={PostPage} />
                    <Route exact path="/PersonPage" component={PersonPage} />
                    <Route exact path="/MainPage" component={MainPage} />
                    <Route exact path="/Community" component={Community} />
                    <Route exact path="/Admin" component={Admin} />
                    {/*<Route exact path="/SignUpPage" component={SignUp} />*/}
                    <Temp/>
                </Switch>
            </Router>
        )
    }
}
export default BasicRoute;
