import React from "react";
import {history} from "../../Utils/History";

import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';



class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
        };
    }
    onChange = (e) => {
        this.state.content= e.target.value;
        this.setState({
            content: e.target.value
        })
    };
    searchQuestion=()=>{
        history.push({pathname: '/Community', state: {theme:'',search:this.state.content}});
    };


    render() {
        return(
            <div className="search-area-wrapper">
                <div className="search-area container">
                    {(this.props.type === "1") ? null :
                        <div>
                        <h3 className="search-header">您有问题?</h3>
                        < p className="search-tag-line">如果您有任何问题，你可以在下方输入您的问题!</p>
                        </div>
                    }
                    <form id="search-form" className="search-form clearfix" method="get" action="#" autoComplete="off">
                        <input className="search-term required" style={{height:47}}
                               placeholder="请输入搜索关键字" onChange={(value) => this.onChange(value)}/>
                        <input className="search-btn" type="submit" value="搜索" onClick={() => this.searchQuestion()}/>
                    </form>
                </div>
            </div>
        )
    }
}

export default SearchBar;
