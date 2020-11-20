import React from "react";

import SignInForm from '../Components/SignInForm';

class SignInPage extends React.Component {
    render(){
        return(
            <div className="login-page">
                <div className="login-container">
                    <div className="login-box">
                        <h1 className="page-title">登陆</h1>
                        <div className="login-content">

                            <SignInForm />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default SignInPage;

