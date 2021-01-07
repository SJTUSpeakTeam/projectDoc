import React from "react";
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
