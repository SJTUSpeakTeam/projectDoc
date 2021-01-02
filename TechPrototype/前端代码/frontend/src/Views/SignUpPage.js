import React from "react";

import SignUpForm from '../Components/SignUpForm';
class SignUpPage extends React.Component {
    render(){
        return(
            <div className="signUp-page">
                <div className="signUp-container">
                    <div className="signUp-box">
                        <h2 className="signUp-title">创建您的账号</h2>
                        <div>
                            &nbsp;
                        </div>
                        <div className="signUp-content">
                            <SignUpForm />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default SignUpPage;
