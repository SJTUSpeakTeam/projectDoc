import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow,mount} from 'enzyme';
import Admin from "../Views/Admin";
import {getRequest, postRequest, deleteRequest, putRequest} from "../Utils/Ajax";
import flushPromises from 'flush-promises'
import Sidebar from "../Components/Admin/Sidebar";
import UserForm from "../Components/Admin/UserForm";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('../Utils/Ajax', () => ({ getRequest: jest.fn(),postRequest:jest.fn(),deleteRequest: jest.fn() }));
Enzyme.configure({adapter: new Adapter()});
//    "collectCoverage": true
describe('AdminPart', () => {
    it('Admintest1_admin',async ()=>{
        window.alert = () => {};
        let dataUndeleted0={
            code:0,
            result:[{
                title:"announcement",
                content:"announcement",
                time:"2020-07-17",
                deleted:false,
            }]
        };

        getRequest.mockImplementation(() => Promise.resolve(dataUndeleted0));

        const wrapper = shallow(<Admin/>);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('currentPage')).toBe(1);
        expect(wrapper.find("StatisticsContent").length).toBe(1);
        expect(wrapper.find("BannedQuestionContent").length).toBe(0);
        wrapper.instance().alertChange(3);
        await flushPromises();
        wrapper.update();
        expect(wrapper.find("BannedQuestionContent").length).toBe(1);
        expect(wrapper.state('currentPage')).toBe(3);
        expect(wrapper.find("AllUsersContent").length).toBe(0);
        wrapper.instance().alertChange(3);
        await flushPromises();
        wrapper.update();
        expect(wrapper.find("BannedQuestionContent").length).toBe(1);
        expect(wrapper.state('currentPage')).toBe(3);
        expect(wrapper.find("AllUsersContent").length).toBe(0);
        wrapper.instance().alertChange(7);
        await flushPromises();
        wrapper.update();
        expect(wrapper.find("BannedQuestionContent").length).toBe(0);
        expect(wrapper.find("AllUsersContent").length).toBe(1);
        expect(wrapper.state('currentPage')).toBe(7);
        wrapper.instance().alertChange(11);
        await flushPromises();
        wrapper.update();
        expect(wrapper.find("StatisticsContent").length).toBe(0);
        expect(wrapper.find("BannedQuestionContent").length).toBe(0);
        expect(wrapper.find("AllUsersContent").length).toBe(1);
        expect(wrapper.state('currentPage')).toBe(7);
        wrapper.instance().alertChange(8);
        await flushPromises();
        wrapper.update();
        expect(wrapper.find("SensitiveWordsContent").length).toBe(0);
        expect(wrapper.find("BannedUserContent").length).toBe(1);
        expect(wrapper.state('currentPage')).toBe(8);
        wrapper.instance().alertChange(9);
        await flushPromises();
        wrapper.update();
        expect(wrapper.find("BannedUserContent").length).toBe(0);
        expect(wrapper.find("AdminsManagementContent").length).toBe(1);
        expect(wrapper.state('currentPage')).toBe(9);
        wrapper.instance().alertChange(10);
        await flushPromises();
        wrapper.update();
        expect(wrapper.find("BannedQuestionContent").length).toBe(0);
        expect(wrapper.find("ThemesManagementContent").length).toBe(1);
        expect(wrapper.state('currentPage')).toBe(10);
        wrapper.instance().alertChange(2);
        await flushPromises();
        wrapper.update();
        expect(wrapper.find("StatisticsContent").length).toBe(0);
        expect(wrapper.find("AllQuestionsContent").length).toBe(1);
        expect(wrapper.state('currentPage')).toBe(2);
    });
    it('Admintest2_sidebar',async ()=>{
        window.alert=()=>{};
        const setup = ({ ...props }) => {
            const wrapper = shallow(<Sidebar {...props} />);
            return {
                props,
                wrapper,
            };
        };
        const { wrapper } = setup({
            alertChange: (e) => {}, // 直接设为空函数
        });
        expect(wrapper.find('SubMenu').length).toBe(4);
        await flushPromises();
        wrapper.update();
        wrapper.instance().setSelected(5);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(5);
        wrapper.instance().setSelected(2);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(2);
        wrapper.instance().setSelected(3);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(3);
        wrapper.instance().setSelected(6);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(6);
        wrapper.instance().setSelected(7);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(7);
        wrapper.instance().setSelected(8);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(8);
        wrapper.instance().setSelected(9);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(9);
        wrapper.instance().setSelected(10);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(10);
        expect(wrapper.state('collapsed')).toBe(false);
        wrapper.find('Button').at(0).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('collapsed')).toBe(true);
        wrapper.find('Button').at(0).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('collapsed')).toBe(false);
        wrapper.instance().toggleCollapsed();
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('collapsed')).toBe(true);
        expect(wrapper.find('MenuItem').length).toBe(7);
        wrapper.find('MenuItem').at(6).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(10);
        wrapper.find('MenuItem').at(5).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(9);
        wrapper.find('MenuItem').at(4).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(7);
        wrapper.find('MenuItem').at(3).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(6);
        wrapper.find('MenuItem').at(2).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(3);
        wrapper.find('MenuItem').at(1).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(2);
        wrapper.find('MenuItem').at(0).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.state('selected')).toBe(1);
    });
    it('Admintest3_userform1',async ()=>{
        let data={
            "status":0,
            "msg":"czcg :)",
            "data":{
                "page":0,
                "userList":[
                    {
                        "user":{
                            "avatar":"imgUrlString0",
                            "age":77,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":1,
                            },
                            "gender":false,
                            "nickname":"kamisama",
                            "phoneNum":"18012345670",
                            "userId":10000,
                        },
                        "userAuth":{
                            "mailAddr":"lhy124@sjtu.edu.cn",
                            "userType":1,
                            "humanStatus":"管理员",
                        },
                        "adminUser":{
                            "contentBanNum":0,
                            "senWordNum":0,
                            "userBanNum":1,
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString",
                            "age":1,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":6,
                            },
                            "gender":true,
                            "nickname":"sora chan",
                            "phoneNum":"18012345678",
                            "userId":10001,
                        },
                        "userAuth":{
                            "mailAddr":"lhy125@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":1023,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":11,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":2,
                            "visitNum":12
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString2",
                            "age":2,
                            "createTime":{
                                "year":121,
                                "month":12,
                                "date":5,
                            },
                            "gender":true,
                            "nickname":"rin chan",
                            "phoneNum":"18012346678",
                            "userId":10002,
                        },
                        "userAuth":{
                            "mailAddr":"lhy123@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":10,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":12,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":13,
                            "visitNum":18
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString3",
                            "age":11,
                            "createTime":{
                                "year":121,
                                "month":12,
                                "date":16,
                            },
                            "gender":false,
                            "nickname":"qki chan",
                            "phoneNum":"18012345688",
                            "userId":10003,
                        },
                        "userAuth":{
                            "mailAddr":"lhy123@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":11,
                            "commentNum":10,
                            "fansNum":13,
                            "followNum":54,
                            "liftingTime":{
                                "year":120,
                                "month":12,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":0,
                            "visitNum":120
                        }
                    },
                ]
            }
        };
        let nodata={"status":0,
            "msg":"czcg :)",
            "data":{
            "page":0,
            "userList":[]}};
        window.alert = () => {};
        const setup = ({ ...props }) => {
            const wrapper = shallow(<UserForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        const { wrapper } = setup({
            alertChange: (e) => {}, // 直接设为空函数
        });
        getRequest.mockImplementation(() => Promise.resolve(data));
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(0);
        expect(wrapper.find("Table").length).toBe(1);
        expect(wrapper.find("Button").length).toBe(2);
        //getRequest.mockImplementation(() => Promise.resolve(nodata));
        wrapper.find("Button").at(0).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(0);
        wrapper.find("Button").at(1).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(0);
    });
    it('Admintest3_userform2',async ()=>{
        let data={
            "status":0,
            "msg":"czcg :)",
            "data":{
                "userList":[
                    {
                        "user":{
                            "avatar":"imgUrlString0",
                            "age":77,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":1,
                            },
                            "gender":false,
                            "nickname":"kamisama",
                            "phoneNum":"18012345670",
                            "userId":10000,
                        },
                        "userAuth":{
                            "mailAddr":"lhy124@sjtu.edu.cn",
                            "userType":1,
                            "humanStatus":"管理员",
                        },
                        "adminUser":{
                            "contentBanNum":0,
                            "senWordNum":0,
                            "userBanNum":1,
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString",
                            "age":1,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":6,
                            },
                            "gender":true,
                            "nickname":"sora chan",
                            "phoneNum":"18012345678",
                            "userId":10001,
                        },
                        "userAuth":{
                            "mailAddr":"lhy125@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":1023,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":11,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":2,
                            "visitNum":12
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString2",
                            "age":2,
                            "createTime":{
                                "year":121,
                                "month":12,
                                "date":5,
                            },
                            "gender":true,
                            "nickname":"rin chan",
                            "phoneNum":"18012346678",
                            "userId":10002,
                        },
                        "userAuth":{
                            "mailAddr":"lhy123@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":10,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":12,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":13,
                            "visitNum":18
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString3",
                            "age":11,
                            "createTime":{
                                "year":121,
                                "month":12,
                                "date":16,
                            },
                            "gender":false,
                            "nickname":"qki chan",
                            "phoneNum":"18012345688",
                            "userId":10003,
                        },
                        "userAuth":{
                            "mailAddr":"lhy123@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":11,
                            "commentNum":10,
                            "fansNum":13,
                            "followNum":54,
                            "liftingTime":{
                                "year":120,
                                "month":12,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":0,
                            "visitNum":120
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString",
                            "age":1,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":6,
                            },
                            "gender":true,
                            "nickname":"sora chan",
                            "phoneNum":"18012345678",
                            "userId":10004,
                        },
                        "userAuth":{
                            "mailAddr":"lhy125@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":1023,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":11,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":2,
                            "visitNum":12
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString",
                            "age":1,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":6,
                            },
                            "gender":true,
                            "nickname":"sora chan",
                            "phoneNum":"18012345678",
                            "userId":10007,
                        },
                        "userAuth":{
                            "mailAddr":"lhy125@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":1023,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":11,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":2,
                            "visitNum":12
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString",
                            "age":1,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":6,
                            },
                            "gender":true,
                            "nickname":"sora chan",
                            "phoneNum":"18012345678",
                            "userId":10008,
                        },
                        "userAuth":{
                            "mailAddr":"lhy125@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":1023,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":11,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":2,
                            "visitNum":12
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString",
                            "age":1,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":6,
                            },
                            "gender":true,
                            "nickname":"sora chan",
                            "phoneNum":"18012345678",
                            "userId":10009,
                        },
                        "userAuth":{
                            "mailAddr":"lhy125@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":1023,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":11,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":2,
                            "visitNum":12
                        }
                    },
                ],
                "page":0,
            }
        };
        let smalldata={
            "status":0,
            "msg":"czcg :)",
            "data":{
                "userList":[
                    {
                        "user":{
                            "avatar":"imgUrlString0",
                            "age":77,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":1,
                            },
                            "gender":false,
                            "nickname":"kamisama",
                            "phoneNum":"18012345670",
                            "userId":10000,
                        },
                        "userAuth":{
                            "mailAddr":"lhy124@sjtu.edu.cn",
                            "userType":1,
                            "humanStatus":"管理员",
                        },
                        "adminUser":{
                            "contentBanNum":0,
                            "senWordNum":0,
                            "userBanNum":1,
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString",
                            "age":1,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":6,
                            },
                            "gender":true,
                            "nickname":"sora chan",
                            "phoneNum":"18012345678",
                            "userId":10001,
                        },
                        "userAuth":{
                            "mailAddr":"lhy125@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":1023,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":11,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":2,
                            "visitNum":12
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString2",
                            "age":2,
                            "createTime":{
                                "year":121,
                                "month":12,
                                "date":5,
                            },
                            "gender":true,
                            "nickname":"rin chan",
                            "phoneNum":"18012346678",
                            "userId":10002,
                        },
                        "userAuth":{
                            "mailAddr":"lhy123@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":10,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":12,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":13,
                            "visitNum":18
                        }
                    },
                ],
                "page":0,
            }
        };
        let nodata={
            "status":0,
            "msg":"czcg :)",
            "data":{
                "userList":[],
                "page":0,
            }
        };
        window.alert = () => {};
        const setup = ({ ...props }) => {
            const wrapper = shallow(<UserForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        getRequest.mockImplementation(() => Promise.resolve(data));
        const { wrapper } = setup({
            alertChange: (e) => {}, // 直接设为空函数
        });
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(0);
        expect(wrapper.find("Table").length).toBe(1);
        expect(wrapper.find("Button").length).toBe(2);
        getRequest.mockImplementation(() => Promise.resolve(nodata));
        wrapper.find("Button").at(0).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(0);
        getRequest.mockImplementation(() => Promise.resolve(data));
        wrapper.find("Button").at(1).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().usersData.length).toBe(8);
        expect(wrapper.instance().getUsers).toBeCalled;
        expect(wrapper.instance().pageDown).toBeCalled;
        expect(wrapper.instance().currentPage).toBe(1);
        wrapper.find("Button").at(1).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(2);
        getRequest.mockImplementation(() => Promise.resolve(smalldata));
        wrapper.find("Button").at(1).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(3);
        getRequest.mockImplementation(() => Promise.resolve(nodata));
        wrapper.find("Button").at(1).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(3);
        getRequest.mockImplementation(() => Promise.resolve(data));
        wrapper.find("Button").at(0).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(2);
        getRequest.mockImplementation(() => Promise.resolve(data));
        wrapper.find("Button").at(0).simulate('click');
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(1);
    });
    it('Admintest3_userform3',async ()=>{
        let data={
            "status":0,
            "msg":"czcg :)",
            "data":{
                "page":0,
                "userList":[
                    {
                        "user":{
                            "avatar":"imgUrlString0",
                            "age":77,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":1,
                            },
                            "gender":false,
                            "nickname":"kamisama",
                            "phoneNum":"18012345670",
                            "userId":10000,
                        },
                        "userAuth":{
                            "mailAddr":"lhy124@sjtu.edu.cn",
                            "userType":1,
                            "humanStatus":"管理员",
                        },
                        "adminUser":{
                            "contentBanNum":0,
                            "senWordNum":0,
                            "userBanNum":1,
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString",
                            "age":1,
                            "createTime":{
                                "year":120,
                                "month":11,
                                "date":6,
                            },
                            "gender":true,
                            "nickname":"sora chan",
                            "phoneNum":"18012345678",
                            "userId":10001,
                        },
                        "userAuth":{
                            "mailAddr":"lhy125@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":1023,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":11,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":2,
                            "visitNum":12
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString2",
                            "age":2,
                            "createTime":{
                                "year":121,
                                "month":12,
                                "date":5,
                            },
                            "gender":true,
                            "nickname":"rin chan",
                            "phoneNum":"18012346678",
                            "userId":10002,
                        },
                        "userAuth":{
                            "mailAddr":"lhy123@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":12,
                            "commentNum":20,
                            "fansNum":10,
                            "followNum":29,
                            "liftingTime":{
                                "year":120,
                                "month":12,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":13,
                            "visitNum":18
                        }
                    },
                    {
                        "user":{
                            "avatar":"imgUrlString3",
                            "age":11,
                            "createTime":{
                                "year":121,
                                "month":12,
                                "date":16,
                            },
                            "gender":false,
                            "nickname":"qki chan",
                            "phoneNum":"18012345688",
                            "userId":10003,
                        },
                        "userAuth":{
                            "mailAddr":"lhy123@sjtu.edu.cn",
                            "userType":2,
                            "humanStatus":"正常用户",
                        },
                        "regularUser":{
                            "answerNum":11,
                            "commentNum":10,
                            "fansNum":13,
                            "followNum":54,
                            "liftingTime":{
                                "year":120,
                                "month":12,
                                "date":29,
                            },
                            "profile":"这个用户很懒，还没有描述过自己",
                            "questionNum":0,
                            "visitNum":120
                        }
                    },
                ]
            }
        };
        let banOrUnbanResult={
            "msg":"czcg:)",
            "status":0,
        };
        let banOrUnbanFailed={
            "msg":"czsb:(",
            "status":-1,
        };
        let nodata={"status":0,
            "msg":"czcg :)",
            "data":{
                "page":0,
                "userList":[]}};
        window.alert = () => {};
        const setup = ({ ...props }) => {
            const wrapper = shallow(<UserForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        getRequest.mockImplementation(() => Promise.resolve(data));
        const { wrapper } = setup({
            alertChange: (e) => {}, // 直接设为空函数
        });
        await flushPromises();
        wrapper.update();
        wrapper.instance().update([2]);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("selectedNumContext")).toBe("您选择了用户rin chan (ID:10002)");
        expect(wrapper.state("banSelection")).toBe("NoOperation");
        expect(wrapper.state("allContext")).toEqual(<div><Paragraph>该用户未被封禁</Paragraph></div>);
        wrapper.instance().update([0]);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("selectedNumContext")).toBe("您选择了用户kamisama (ID:10000)");
        expect(wrapper.state("banSelection")).toBe("NoOperation");
        wrapper.instance().update([]);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("selectedNumContext")).toBe(null);
        expect(wrapper.state("banSelection")).toBe(null);
        wrapper.instance().update([1,2]);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("selectedNumContext")).toBe("您选择了2位用户：");
        expect(wrapper.state("banSelection")).toBe("NoOperation");
        expect(wrapper.state("allContext")).toBe(null);
        wrapper.instance().update([1,2]);
        await flushPromises();
        wrapper.update();
        postRequest.mockImplementation(() => Promise.resolve(banOrUnbanResult));
        wrapper.instance().setState({
            selectedRowKeys:[10001,10002]
        });
        await flushPromises();
        wrapper.update();
        wrapper.instance().setState({
            selectedRowKeys: [0,1]
        });
        wrapper.instance().usersData=[
            {
                userId:10001,
                name:"tuzi",
                state:'正常',
            },
            {
                userId:10002,
                name:"apple",
                state:'正常',
            }
        ];
        await flushPromises();
        wrapper.update();
        wrapper.instance().handleBans('BanAll');
        expect(wrapper.state("banSelection")).toBe('BanAll');
        expect(wrapper.instance().tackle).toBeCalled;
        wrapper.instance().update([1]);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("selectedNumContext")).toBe("您选择了用户apple (ID:10002)");
        expect(wrapper.state("banSelection")).toBe("NoOperation");
        // expect(wrapper.instance().usersData[2].state).toBe("封禁中");
        wrapper.instance().handleBans('BanLift');
        expect(wrapper.state("banSelection")).toBe('BanLift');
        expect(wrapper.instance().tackle).toBeCalled;
        wrapper.instance().update([1]);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("selectedNumContext")).toBe("您选择了用户apple (ID:10002)");
        expect(wrapper.state("banSelection")).toBe("NoOperation");
        wrapper.instance().handleBans('BanExtend');
        expect(wrapper.state("banSelection")).toBe('BanExtend');
        expect(wrapper.instance().tackle).toBeCalled;
        wrapper.instance().update([1]);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("selectedNumContext")).toBe("您选择了用户apple (ID:10002)");
        expect(wrapper.state("banSelection")).toBe("NoOperation");
        wrapper.instance().handleBans('elseOp');
        expect(wrapper.state("banSelection")).toBe('elseOp');
        expect(wrapper.instance().tackle).toBeCalled;
        wrapper.instance().update([1]);
        postRequest.mockImplementation(() => Promise.resolve(banOrUnbanFailed));
        wrapper.instance().tackle("BanAll");
    });
    it('Admintest3_userform4',async ()=> {
        let data = {
            "status": 0,
            "msg": "czcg :)",
            "data": {
                "page": 0,
                "userList": [
                    {
                        "user": {
                            "avatar": "imgUrlString0",
                            "age": 77,
                            "createTime": {
                                "year": 120,
                                "month": 11,
                                "date": 1,
                            },
                            "gender": false,
                            "nickname": "kamisama",
                            "phoneNum": "18012345670",
                            "userId": 10000,
                        },
                        "userAuth": {
                            "mailAddr": "lhy124@sjtu.edu.cn",
                            "userType": 1,
                            "humanStatus": "管理员",
                        },
                        "adminUser": {
                            "contentBanNum": 0,
                            "senWordNum": 0,
                            "userBanNum": 1,
                        }
                    },
                    {
                        "user": {
                            "avatar": "imgUrlString",
                            "age": 1,
                            "createTime": {
                                "year": 120,
                                "month": 11,
                                "date": 6,
                            },
                            "gender": true,
                            "nickname": "sora chan",
                            "phoneNum": "18012345678",
                            "userId": 10001,
                        },
                        "userAuth": {
                            "mailAddr": "lhy125@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户",
                        },
                        "regularUser": {
                            "answerNum": 12,
                            "commentNum": 20,
                            "fansNum": 1023,
                            "followNum": 29,
                            "liftingTime": {
                                "year": 120,
                                "month": 11,
                                "date": 29,
                            },
                            "profile": "这个用户很懒，还没有描述过自己",
                            "questionNum": 2,
                            "visitNum": 12
                        }
                    },
                    {
                        "user": {
                            "avatar": "imgUrlString2",
                            "age": 2,
                            "createTime": {
                                "year": 121,
                                "month": 12,
                                "date": 5,
                            },
                            "gender": true,
                            "nickname": "rin chan",
                            "phoneNum": "18012346678",
                            "userId": 10002,
                        },
                        "userAuth": {
                            "mailAddr": "lhy123@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户",
                        },
                        "regularUser": {
                            "answerNum": 12,
                            "commentNum": 20,
                            "fansNum": 10,
                            "followNum": 29,
                            "liftingTime": {
                                "year": 120,
                                "month": 12,
                                "date": 29,
                            },
                            "profile": "这个用户很懒，还没有描述过自己",
                            "questionNum": 13,
                            "visitNum": 18
                        }
                    },
                    {
                        "user": {
                            "avatar": "imgUrlString3",
                            "age": 11,
                            "createTime": {
                                "year": 121,
                                "month": 12,
                                "date": 16,
                            },
                            "gender": false,
                            "nickname": "qki chan",
                            "phoneNum": "18012345688",
                            "userId": 10003,
                        },
                        "userAuth": {
                            "mailAddr": "lhy123@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户",
                        },
                        "regularUser": {
                            "answerNum": 11,
                            "commentNum": 10,
                            "fansNum": 13,
                            "followNum": 54,
                            "liftingTime": {
                                "year": 120,
                                "month": 12,
                                "date": 29,
                            },
                            "profile": "这个用户很懒，还没有描述过自己",
                            "questionNum": 0,
                            "visitNum": 120
                        }
                    },
                ]
            }
        };
        let banOrUnbanResult = {
            "msg": "czcg:)",
            "status": 0,
        };
        let banOrUnbanFailed = {
            "msg": "czsb:(",
            "status": -1,
        };

        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<UserForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        postRequest.mockImplementation(() => Promise.resolve(data));
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        wrapper.instance().currentLimitations={
            userType:"normalUsers",
        };
        wrapper.instance().getUsersByLimits(1);
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().usersData.length).toBe(4);
        wrapper.instance().currentLimitations={
            userType:"admiasdans",
        };
        wrapper.instance().getUsersByLimits(1);
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().usersData.length).toBe(4);
    });
    it('Admintest3_userform4.5',async ()=>{
        let nodata = {
            "status": 0,
            "msg": "czcg :)",
            "data": {
                "page": 0,
                "userList":[]
            }
        };
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<UserForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        postRequest.mockImplementation(() => Promise.resolve(nodata));
        await flushPromises();
        wrapper.update();
        wrapper.instance().currentLimitations={
            userType:2
        };
        wrapper.instance().currentPage=0;
        await flushPromises();
        wrapper.update();
        wrapper.instance().getUsersByLimits(1);
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().usersData.length).toBe(0);
        wrapper.instance().currentPage=4;
        await flushPromises();
        wrapper.update();
        wrapper.instance().getUsersByLimits(5);
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().currentPage).toBe(3);
    });
    it('Admintest3_userform5',async ()=> {
        let data = {
            "status": 0,
            "msg": "czcg :)",
            "data": {
                "page": 0,
                "userList": [
                    {
                        "user": {
                            "avatar": "imgUrlString0",
                            "age": 77,
                            "createTime": {
                                "year": 120,
                                "month": 11,
                                "date": 1,
                            },
                            "gender": false,
                            "nickname": "kamisama",
                            "phoneNum": "18012345670",
                            "userId": 10000,
                        },
                        "userAuth": {
                            "mailAddr": "lhy124@sjtu.edu.cn",
                            "userType": 1,
                            "humanStatus": "管理员",
                        },
                        "adminUser": {
                            "contentBanNum": 0,
                            "senWordNum": 0,
                            "userBanNum": 1,
                        }
                    },
                    {
                        "user": {
                            "avatar": "imgUrlString",
                            "age": 1,
                            "createTime": {
                                "year": 120,
                                "month": 11,
                                "date": 6,
                            },
                            "gender": true,
                            "nickname": "sora chan",
                            "phoneNum": "18012345678",
                            "userId": 10001,
                        },
                        "userAuth": {
                            "mailAddr": "lhy125@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户",
                        },
                        "regularUser": {
                            "answerNum": 12,
                            "commentNum": 20,
                            "fansNum": 1023,
                            "followNum": 29,
                            "liftingTime": {
                                "year": 120,
                                "month": 11,
                                "date": 29,
                            },
                            "profile": "这个用户很懒，还没有描述过自己",
                            "questionNum": 2,
                            "visitNum": 12
                        }
                    },
                    {
                        "user": {
                            "avatar": "imgUrlString2",
                            "age": 2,
                            "createTime": {
                                "year": 121,
                                "month": 12,
                                "date": 5,
                            },
                            "gender": true,
                            "nickname": "rin chan",
                            "phoneNum": "18012346678",
                            "userId": 10002,
                        },
                        "userAuth": {
                            "mailAddr": "lhy123@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户",
                        },
                        "regularUser": {
                            "answerNum": 12,
                            "commentNum": 20,
                            "fansNum": 10,
                            "followNum": 29,
                            "liftingTime": {
                                "year": 120,
                                "month": 12,
                                "date": 29,
                            },
                            "profile": "这个用户很懒，还没有描述过自己",
                            "questionNum": 13,
                            "visitNum": 18
                        }
                    },
                    {
                        "user": {
                            "avatar": "imgUrlString3",
                            "age": 11,
                            "createTime": {
                                "year": 121,
                                "month": 12,
                                "date": 16,
                            },
                            "gender": false,
                            "nickname": "qki chan",
                            "phoneNum": "18012345688",
                            "userId": 10003,
                        },
                        "userAuth": {
                            "mailAddr": "lhy123@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户",
                        },
                        "regularUser": {
                            "answerNum": 11,
                            "commentNum": 10,
                            "fansNum": 13,
                            "followNum": 54,
                            "liftingTime": {
                                "year": 120,
                                "month": 12,
                                "date": 29,
                            },
                            "profile": "这个用户很懒，还没有描述过自己",
                            "questionNum": 0,
                            "visitNum": 120
                        }
                    },
                ]
            }
        };
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<UserForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        postRequest.mockImplementation(() => Promise.resolve(data));
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        wrapper.instance().currentLimitations={
            userType:"bannedUsers",
        };
        wrapper.instance().getUsersByLimits(1);
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().usersData.length).toBe(4);
        wrapper.instance().currentLimitations={
            userType:"admins",
        };
        wrapper.instance().getUsersByLimits(1);
        await flushPromises();
        wrapper.update();
        expect(wrapper.instance().usersData.length).toBe(4);
    });
    it('Admintest3_userform6',async ()=> {
        let data = {
            "status": 0,
            "msg": "czcg :)",
            "data": {
                "page": 0,
                "userList": [
                    {
                        "user": {
                            "avatar": "imgUrlString0",
                            "age": 77,
                            "createTime": {
                                "year": 120,
                                "month": 11,
                                "date": 1,
                            },
                            "gender": false,
                            "nickname": "kamisama",
                            "phoneNum": "18012345670",
                            "userId": 10000,
                        },
                        "userAuth": {
                            "mailAddr": "lhy124@sjtu.edu.cn",
                            "userType": 1,
                            "humanStatus": "管理员",
                        },
                        "adminUser": {
                            "contentBanNum": 0,
                            "senWordNum": 0,
                            "userBanNum": 1,
                        }
                    },
                    {
                        "user": {
                            "avatar": "imgUrlString",
                            "age": 1,
                            "createTime": {
                                "year": 120,
                                "month": 11,
                                "date": 6,
                            },
                            "gender": true,
                            "nickname": "sora chan",
                            "phoneNum": "18012345678",
                            "userId": 10001,
                        },
                        "userAuth": {
                            "mailAddr": "lhy125@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户",
                        },
                        "regularUser": {
                            "answerNum": 12,
                            "commentNum": 20,
                            "fansNum": 1023,
                            "followNum": 29,
                            "liftingTime": {
                                "year": 120,
                                "month": 11,
                                "date": 29,
                            },
                            "profile": "这个用户很懒，还没有描述过自己",
                            "questionNum": 2,
                            "visitNum": 12
                        }
                    },
                    {
                        "user": {
                            "avatar": "imgUrlString2",
                            "age": 2,
                            "createTime": {
                                "year": 121,
                                "month": 12,
                                "date": 5,
                            },
                            "gender": true,
                            "nickname": "rin chan",
                            "phoneNum": "18012346678",
                            "userId": 10002,
                        },
                        "userAuth": {
                            "mailAddr": "lhy123@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户",
                        },
                        "regularUser": {
                            "answerNum": 12,
                            "commentNum": 20,
                            "fansNum": 10,
                            "followNum": 29,
                            "liftingTime": {
                                "year": 120,
                                "month": 12,
                                "date": 29,
                            },
                            "profile": "这个用户很懒，还没有描述过自己",
                            "questionNum": 13,
                            "visitNum": 18
                        }
                    },
                    {
                        "user": {
                            "avatar": "imgUrlString3",
                            "age": 11,
                            "createTime": {
                                "year": 121,
                                "month": 12,
                                "date": 16,
                            },
                            "gender": false,
                            "nickname": "qki chan",
                            "phoneNum": "18012345688",
                            "userId": 10003,
                        },
                        "userAuth": {
                            "mailAddr": "lhy123@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户",
                        },
                        "regularUser": {
                            "answerNum": 11,
                            "commentNum": 10,
                            "fansNum": 13,
                            "followNum": 54,
                            "liftingTime": {
                                "year": 120,
                                "month": 12,
                                "date": 29,
                            },
                            "profile": "这个用户很懒，还没有描述过自己",
                            "questionNum": 0,
                            "visitNum": 120
                        }
                    },
                ]
            }
        };
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<UserForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        postRequest.mockImplementation(() => Promise.resolve(data));
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        wrapper.instance().showModal();
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("visible")).toBe(true);
        wrapper.instance().handleOk(null);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("visible")).toBe(false);
        wrapper.instance().handleCancel(null);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("visible")).toBe(false);
        expect(wrapper.instance().handleChange).toBeCalled;
        let props={
            limits:{
                name:'apple',
                gender:'male',
                email:'333@sss.sc'
            }
        };
        wrapper.instance().componentWillReceiveProps(props,null);
        expect(wrapper.instance().getUsers).toBeCalled;
    });

});
