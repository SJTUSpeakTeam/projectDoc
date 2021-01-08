import React from "react";
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
class Canvas extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

        let myChart = echarts.init(document.getElementById('main'));

        myChart.setOption({
            title: { text: '' },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['发帖量','活跃人数','回复数']
            },
            toolbox: {
                show : true,
                feature : {
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {
                        show: true,
                        type: 'jpg'
                    }
                }
            },
            xAxis : [
                {
                    type : 'category',
                    data : this.props.data.xdata
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'发帖量',
                    type:'bar',
                    data: this.props.data.ydata.ydata1,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name:'活跃人数',
                    type:'bar',
                    data: this.props.data.ydata.ydata2,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : '平均值'}
                        ]
                    }
                },
                {
                    name:'回复数',
                    type:'bar',
                    data: this.props.data.ydata.ydata3,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : '平均值'}
                        ]
                    }
                },
            ]
        });
    }


    render() {
        return(
                <div id="main" style={{  height: 500 }}>

                </div>
        );
    }
}

export default Canvas;
