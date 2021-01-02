import React from "react";

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