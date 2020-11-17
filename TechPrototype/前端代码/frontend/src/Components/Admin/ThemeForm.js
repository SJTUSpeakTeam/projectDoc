import React from "react";
import {Button, Input, Table, Divider, Popover} from "antd";
import {apiUrl} from "../../UrlConfig";
import {deleteRequest, getRequest, postRequest} from "../../Utils/Ajax";
class ThemeForm extends React.Component{
    state = {
        sortedInfo: null,
        themeData:[],
        isEditing:false,
    };
    themesData=[];
    data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
    ];
    componentDidMount() {
        this.data=this.getThemes();
    }
    getThemes=()=>{
        let url=apiUrl+'/getThemes';
        let callback=data=>{
            console.log(data);
            if(data.status===-1){
                alert("请求主题失败");
            }
            else if(data.status===0){
                this.themesData=data.data.themes;
                let u=[];
                for(let i=0;i<this.themesData.length;i++){
                    let datetime=this.themesData[i].createTime;
                    u.push({
                        key:this.themesData[i].themeId,
                        name:this.themesData[i].name,
                        createTime:(1900+datetime.year)+"-"+(datetime.month)+"-"+(datetime.date)
                    });
                }
                this.data=u;
                this.setState({
                    sortedInfo: {
                        order: 'ascend',
                        columnKey: 'name',
                    },
                });
                console.log(u);
                return u;
            }
        };
        getRequest(url,{},callback).then((data)=>{
            callback(data);
        })
    };

    handleChange = (pagination, sorter) => {
        // console.log(this.data);
        console.log('Various parameters', pagination, sorter);
        this.setState({
            sortedInfo: sorter,
        });
    };

    setThemeToRename=(value)=>{
        console.log("renaming... ",value);
        this.setState({
            themeToRename:value
        })
    };

    confirmRenaming=(value)=>{
        console.log("confirming...",value.key);
        this.renameTheme(value.key);
        this.setState({
            isEditing:false
        });
    };

    cancelRenaming=(value)=>{
        console.log("cancelling...",value.key);
        this.setState({
            isEditing:false,
            themeToRename:null,
        })
    };

    setTheme=(value)=>{
        console.log("adding... ",value);
        this.setState({
            themeToAdd:value
        });
    };

    renameTheme=(id)=>{
        let url=apiUrl+"/updateTheme";
        let updateThemeJson={
            themeId:id,
            name:this.state.themeToRename
        };
        let callback=data=>{
            console.log(data);
            if(data.status===-1){
                alert("修改主题失败");
                return;
            }else if(data.status===0){
                alert("修改主题成功");
                this.getThemes();
            }
        };
        postRequest(url,updateThemeJson,callback)
            .then((data)=>{
                callback(data);
            })
    };

    addTheme=()=>{
        // alert("add theme "+this.state.themeToAdd);
        let url=apiUrl+"/postTheme";
        let postThemeJson={
            name:this.state.themeToAdd
        };
        let callback=data=>{
            console.log(data);
            if(data.status===-1){
                alert("添加主题失败");
                return;
            }else if(data.status===0){
                alert("添加主题成功");
                // this.data.splice(this.data.indexOf(text),1);
                this.getThemes();
            }
        };
        postRequest(url,postThemeJson,callback)
            .then((data)=>{
                callback(data);
            })
    };

    handleRename = (text,record,index) =>{
        console.log(text);
        this.setState({
            isEditing:true,
            themeIdToRename:text.key
        });
    };

    removeTheme = (text,record,index) =>{
        console.log(text,record,index);
        let url=apiUrl+"/deleteTheme";
        let deleteThemeJson={
            themeId:text.key
        };
        let callback=data=>{
            console.log(data);
            if(data.status===-1){
                alert("删除主题失败");
                return;
            }else if(data.status===0){
                alert("删除主题成功");
                // this.data.splice(this.data.indexOf(text),1);
                this.getThemes();
            }
        };
        deleteRequest(url,deleteThemeJson,callback)
            .then((data)=>{
                callback(data);
            })
    };

    render() {
        let { sortedInfo } = this.state;
        sortedInfo = sortedInfo || {};
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                sorter: (a,b)=>(a.name>b.name),
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'themeId',
                dataIndex: 'key',
                sorter: (a, b) => (a.themeId > b.themeId),
                sortOrder: sortedInfo.columnKey === 'themeId' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'createTime',
                dataIndex: 'createTime',
                sorter: (a, b) => a.createTime - b.createTime,
                sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: '操作',
                render: (text,record,index) => (this.state.isEditing&&this.state.themeIdToRename!=null&&this.state.themeIdToRename===text.key?
                    (<div><input type={"text"} size={"large"} maxLength={15} onChange={(e)=>this.setThemeToRename(e.target.value)}></input>
                        <Button onClick={()=>this.confirmRenaming(text)}>确认</Button>
                        <Button onClick={()=>this.cancelRenaming(text)}>取消</Button></div>)
                    :(<div><a onClick={()=>this.removeTheme(text,record,index)}>删除</a>
                        <Divider type="vertical"/>
                        <a onClick={()=>this.handleRename(text,record,index)}>重命名</a></div>)),
                width:150,
            }
        ];
        return (
            <div>
                {/*<Space style={{ marginBottom: 16 }}>*/}
                {/*    <Button onClick={()=>this.setAgeSort}>Sort age</Button>*/}
                {/*    <Button onClick={()=>this.clearFilters}>Clear filters</Button>*/}
                {/*    <Button onClick={()=>this.clearAll}>Clear filters and sorters</Button>*/}
                {/*</Space>*/}
                <div style={{width:"150px"}}>
                    <Input type={"text"} size={"large"} maxLength={15} onChange={(e)=>this.setTheme(e.target.value)}></Input>
                    <br/>
                    <Button onClick={this.addTheme}>添加主题</Button>
                </div>
                <Table columns={columns} dataSource={this.data} onChange={this.handleChange} />
            </div>
        );
    }
}
export default ThemeForm;
