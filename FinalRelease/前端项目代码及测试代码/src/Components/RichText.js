import React, { useState, useEffect,} from 'react';
import E from 'wangeditor'
import {imageUploadCallBack} from "../Utils/Tool";
import {apiUrl} from "../UrlConfig";

let editor = null;
export let editorContent = '';

function RichText() {

    const [ content,setContent] = useState('');

    useEffect(() => {

        editor = new E("#div1");
        editor.config.uploadImgServer = apiUrl + '/file/upload';
        editor.config.customUploadImg = function (files, insert){
            for (let f in files)
            {
                imageUploadCallBack(files[f])
                    .then(r=>{
                        insert(r.data.link)
                    });
            }
        };

        editor.config.onchange = (newHtml) => {
            setContent(newHtml);
            editorContent = newHtml;
        };



        editor.create();

        return () => {

            editor.destroy()
        }
    }, []);



    return (
        <div>
            <div id="div1"/>
        </div>
    );
}

export default RichText;
