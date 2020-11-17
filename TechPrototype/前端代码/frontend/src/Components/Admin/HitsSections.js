import React from "react";

// import "../api"
import {Table} from "antd"

let dataSource = [
    {
        typeId: '1',
        type: '数学',
        dailyPost: 320,
        dailyComment: 245,
        weeklyGrowthRate: '1.2%',
    },
    {
        typeId: '2',
        type: '物理',
        dailyPost: 520,
        dailyComment: 155,
        weeklyGrowthRate: '0.2%',
    },
    {
        typeId: '3',
        type: '化学',
        dailyPost: 820,
        dailyComment: 55,
        weeklyGrowthRate: '-1.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
    {
        typeId: '4',
        type: '医学',
        dailyPost: 590,
        dailyComment: 555,
        weeklyGrowthRate: '5.2%',
    },
];
function getDiagramData() {
    let that=this;
    // console.log('Received values of form: ', values);
    //let data=[];
    //data.push("username",values.username);
    //data.push("password",values.password);
    fetch("/getDiagramData",{
        method:'GET',
        headers:{
            'Content-Type':'application/json;charset=UTF-8',
            'Access-Control-ALLow-Origin':"*"
        },
        mode:'cors',
        cache:"default"})
        .then(response => response.text())
        .then(data => {
            // alert("data:" + data);
            console.log("data:",data);
            let res=JSON.parse(data);
            console.log("status:"+res.status);
            // eslint-disable-next-line eqeqeq
            if(res.status=="failed"){
                console.log(res.error);
                alert(res.error);
                return;
            }
            else if(res.status=="success"){
                // console.log("Login success,uid:"+res.user_id);
                return res;
            }
        }).catch(function (ex) {
        console.log('parsing failed', ex)
    })
}
dataSource=getDiagramData();

const columns = [
    {
        title: '类别ID',
        dataIndex: 'typeId',
        key: 'typeId',
    },
    {
        title: '类别名称',
        dataIndex: 'type',
        key: 'typeName',
    },
    {
        title: '日发帖量',
        dataIndex: 'dailyPost',
        key: 'dailyPost',
    },
    {
        title: '日评论量',
        dataIndex: 'dailyComment',
        key: 'dailyComment',
    },
    {
        title: '周增长率',
        dataIndex: 'weeklyGrowthRate',
        key: 'weeklyGrowthRate',
    },
];




class HitsSections extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        return(
            <div>
                <Table dataSource={dataSource} columns={columns} size={"middle"} bordered/>;
            </div>
        )
    }
}

export default HitsSections;
