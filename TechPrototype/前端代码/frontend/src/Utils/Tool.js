import {apiUrl} from "../UrlConfig";
import {message} from "antd";
import {history} from "./History";
import {postRequestWithoutJson} from "./Ajax";

let isEmptyJson = (json) => {
    for (let name in json)
    {
        return false;
    }
    return true;
};
let returnRole = (role) => {
    switch (role) {
        case 'us': {
            return "普通用户";
        }
        case 'pm': {
            return "动态管理员";
        }
        case 'um': {
            return "用户管理员";
        }
        case 'ad': {
            return "系统管理员";
        }
        default: break;
    }
    return '未知错误';
};

let imageUploadCallBack = file => new Promise(
    (resolve, reject) => {

        let reader = new FileReader();
        reader.readAsDataURL(file);
        let img = new Image();
        // let url = ''
        reader.onload = function (e) {
            img.src = this.result
        };

        img.onload = function () {
            //console.log(img); // 获取图片
            // console.log(img.src.length)
            // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');

            // 图片原始尺寸
            let originWidth = this.width;
            let originHeight = this.height;

            // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
            let maxWidth = 400,
                maxHeight = 500;
            // 目标尺寸
            let targetWidth = originWidth,
                targetHeight = originHeight;
            // 图片尺寸超过300x300的限制
            if(originWidth > maxWidth || originHeight > maxHeight) {
                if(originWidth / originHeight > maxWidth / maxHeight) {
                    // 更宽，按照宽度限定尺寸
                    targetWidth = maxWidth;
                    targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                } else {
                    targetHeight = maxHeight;
                    targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                }
            }
            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);

            console.log(file);
            /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/

            //把压缩后的图片转blob格式用于上传
            let fileToUpload = canvas.toBlob((blob)=>{
                // 这是回调函数，在回调函数中编程！！
                console.log(blob)
                let fd = new FormData();
                fd.append("file", blob);
                // todo：调用上传图片接口
                // 接口细节见接口文档
                // 方法：Post
                // url：/file/upload
                // 返回值中有请求图片的 url 链接
                // body: 把 blob 直接传给后端
                let url = apiUrl + '/file/upload';
                let body = fd;
                let callback = data => {
                    console.log(data);
                    if (data.status === 0) {
                        let newUrl = data.data.link;
                        console.log(newUrl);
                        resolve({
                            data: {
                                key:"image",
                                link: newUrl
                            }
                        })
                    }
                    if (data.status === -1) {
                        message.error(data.msg);
                    }
                    if (data.status === 2) {
                        message.error('登录失效');
                        history.replace("/SignInPage")
                    }
                };
                postRequestWithoutJson(url, body, callback)
                    .then((data) => {
                        callback(data);
                    });

            }, 'image/jpeg', 0.92)

        }
    }
);

export {isEmptyJson,returnRole,imageUploadCallBack};
