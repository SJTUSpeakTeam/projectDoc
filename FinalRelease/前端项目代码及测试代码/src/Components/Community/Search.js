import React from "react";
import '../../Css/Header.css';
import '../../Css/bootstrap5152.css?ver=1.0';
import '../../Css/responsive5152.css?ver=1.0';
import '../../Css/main5152.css?ver=1.0';
import '../../style.css';



class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: (this.props.search)===undefined?"":this.props.search
        };
    }
    UNSAFE_componentWillMount() {

    }

    onChange = (e) => {
        this.state.content= e.target.value;
        this.setState({
            content: e.target.value
        })
    };
    searchQuestion = () => {
        console.log(111);
        this.props.onsearch(this.state.content);
    };



    render() {
        return (
            <div className="search-area-community">
                <div className="search-area container">
                    <form id="search-form" className="search-form clearfix" method="get" action="#" autoComplete="off">
                        <input className="search-term required" style={{height: 47}}
                               placeholder="请输入搜索关键字"  value={this.state.content} onChange={(value) => this.onChange(value)}/>
                        <input className="search-btn" style={{width:'90px'}}  value="搜索" onClick={() => this.searchQuestion()}/>
                    </form>
                </div>
            </div>
        )
    }
}

export default Search;
