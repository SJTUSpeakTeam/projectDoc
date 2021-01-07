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
import AdminForm from "../Components/Admin/AdminForm";
import AllUsersContent from "../Components/Admin/AllUsersContent"
import BannedQuestionForm from "../Components/Admin/BannedQuestionForm";
import BannedUserForm from "../Components/Admin/BannedUserForm";
import SensitiveWordsForm from "../Components/Admin/SensitiveWordsForm";
import CommentsForm from "../Components/Admin/CommentsForm";
import ThemeForm from "../Components/Admin/ThemeForm";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('../Utils/Ajax', () => ({ getRequest: jest.fn(),postRequest:jest.fn(),deleteRequest: jest.fn() }));
Enzyme.configure({adapter: new Adapter()});
//    "collectCoverage": true
describe('AdminPart', () => {
    it('Admintest3_adminform', async () => {
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<AdminForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        // postRequest.mockImplementation(() => Promise.resolve(data));
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
        wrapper.instance().handleChange(3);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("visible")).toBe(false);
        expect(wrapper.instance().handleChange).toBeCalled;
    });
    it('Admintest3_adminform2', async () => {
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<AdminForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        // postRequest.mockImplementation(() => Promise.resolve(data));
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        wrapper.instance().update([]);
        await flushPromises();
        wrapper.update();
        wrapper.instance().update([1,2]);
        await flushPromises();
        wrapper.update();
        wrapper.instance().data=[
            {
                name:"apple",
                key:10001,
                tags:["全部"],
                state:'封禁中'
            }
        ];
        await flushPromises();
        wrapper.update();
        wrapper.instance().update([1]);
        wrapper.instance().setState({
            selectedRowKeys:[0,1]
        });
        await flushPromises();
        wrapper.update();
        wrapper.instance().selectRow({
            key:0
        });
        await flushPromises();
        wrapper.update();
        wrapper.instance().setState({
            selectedRowKeys:[0,1]
        });
        await flushPromises();
        wrapper.update();
        wrapper.instance().selectRow({
            key:2
        });
        wrapper.instance().data=[
            {
                name:"apple",
                key:10001,
                tags:["全部"],
                state:'正常'
            }
        ];
        await flushPromises();
        wrapper.update();
        wrapper.instance().update([1]);
        wrapper.instance().testuse(1);
        wrapper.instance().testuse(0);
    });
    it('Admintest4_allUserContent', async () => {
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<AllUsersContent {...props} />);
            return {
                props,
                wrapper,
            };
        };
        // postRequest.mockImplementation(() => Promise.resolve(data));
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        let data={
            "name":"apple",
            "email":"email@em.com",
            "gender":false,
            "userType":2,
            "date":"2020-01-01 12:12:12",
        };
        wrapper.instance().setState({
            ageRange:true
        });
        await flushPromises();
        wrapper.update();
        wrapper.instance().onFinish(data);
        wrapper.instance().toggleAge();
    });
    it('Admintest4_allUserContent', async () => {
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<BannedQuestionForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        // postRequest.mockImplementation(() => Promise.resolve(data));
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        wrapper.instance().setState({selectedRowKeys:[1,2]});
        await flushPromises();
        wrapper.update();
        wrapper.instance().selectRow({key:1});
        wrapper.instance().setState({selectedRowKeys:[1,2]});
        await flushPromises();
        wrapper.update();
        wrapper.instance().selectRow({key:3});
    });
    it('Admintest5_banUserForm', async () => {
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<BannedUserForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        // postRequest.mockImplementation(() => Promise.resolve(data));
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        let data=[
            {
                name:"apple1",
                key:12345,
                state:"封禁中"
            },
            {
                name:"apple2",
                key:12346,
                state:"正常"
            },
        ];
        wrapper.instance().setState({selectedRowKeys:[1,2]});
        await flushPromises();
        wrapper.update();
        wrapper.instance().selectRow({key:1});
        wrapper.instance().setState({selectedRowKeys:[1,2]});
        await flushPromises();
        wrapper.update();
        wrapper.instance().selectRow({key:3});
        wrapper.instance().data=data;
        await flushPromises();
        wrapper.update();
        wrapper.instance().update([1,2]);
        wrapper.instance().update([1]);
        wrapper.instance().update([2]);
        wrapper.instance().update([]);
    });
    it('Admintest6_sensitiveWordsForm', async () => {
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<SensitiveWordsForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        let data={
            status:0,
            data:{
                sensitiveWord:[
                {
                    sensitiveWordId: 1,
                    wordContent:"nmsl",
                    createTime:{
                        year:121,
                        month:1,
                        date:5
                    },
                    profileBanNum:1,
                    userBanNum:1,
                    questionBanNum:1,
                    answerBanNum:1,
                    commentBanNum:1
                },
                {
                    sensitiveWordId: 2,
                    wordContent:"nmsls",
                    createTime:{
                        year:121,
                        month:1,
                        date:7
                    },
                    profileBanNum:3,
                    userBanNum:14,
                    questionBanNum:11,
                    answerBanNum:12,
                    commentBanNum:2
                }
            ]}
        };
        let dataPost={
            status:0,
        };
        let dataFail={
            status:-1
        };
        getRequest.mockImplementation(() => Promise.resolve(data));
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        await flushPromises();
        wrapper.update();
        getRequest.mockImplementation(() => Promise.resolve(dataFail));
        wrapper.instance().getAllWords();
        postRequest.mockImplementation(() => Promise.resolve(dataPost));
        wrapper.instance().handleAddSensitiveWords("nmlgb");
        postRequest.mockImplementation(() => Promise.resolve(dataFail));
        wrapper.instance().onFinish("nmlgb");
        wrapper.instance().onSelectChange([1,2]);
        wrapper.instance().onSelectChange([1]);
        wrapper.instance().onSelectChange([]);
        deleteRequest.mockImplementation(() => Promise.resolve(dataFail));
        await flushPromises();
        wrapper.update();
        wrapper.instance().handleDelSensitiveWords({
            sensitiveWordId:1
        });
        deleteRequest.mockImplementation(() => Promise.resolve(dataPost));
        await flushPromises();
        wrapper.update();
        wrapper.instance().handleDelSensitiveWords({
            sensitiveWordId:1
        });
        wrapper.instance().setState({
            selectedRowKeys:[1,2]
        });
        await flushPromises();
        wrapper.update();
        wrapper.instance().selectRow([1]);
        wrapper.instance().setState({
            selectedRowKeys:[1,2]
        });
        await flushPromises();
        wrapper.update();
        wrapper.instance().selectRow([3]);
    });
    it('Admintest7_commentsForm', async () => {
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<CommentsForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        let data={
            status:0,
            data:{
                answer:[
                    {
                        answerId:1,
                        likeNum:1,
                        favorNum:1,
                        visitNum:1,
                        header:"nmsl",
                        content:"wsmnmsl",
                        userId:10002,
                        createTime:{
                            year:201,
                            month:1,
                            date:1
                        }
                    },
                    {
                        answerId:2,
                        likeNum:12,
                        favorNum:311,
                        visitNum:12,
                        header:"nmssal",
                        content:"wsmnasdmsl",
                        userId:10004,
                        createTime:{
                            year:201,
                            month:1,
                            date:4
                        }
                    }
                ]
            }
        };
        let dataFail={
            status:-1,
        };
        let dataSucc={
            status:0,
        };
        getRequest.mockImplementation(() => Promise.resolve(data));
        wrapper.instance().setState({selectedRowKeys:[1,2]});
        await flushPromises();
        wrapper.update();
        getRequest.mockImplementation(() => Promise.resolve(dataFail));
        wrapper.instance().replysData=[];
        wrapper.instance().getReplys(1);
        wrapper.instance().onSelectChange([1]);
        wrapper.instance().currentPage=0;
        wrapper.instance().pageUp();
        wrapper.instance().pageDown();
        wrapper.instance().currentPage=1;
        wrapper.instance().pageUp();
        wrapper.instance().pageDown();
        await flushPromises();
        wrapper.update();
        deleteRequest.mockImplementation(() => Promise.resolve(dataFail));
        localStorage.setItem("userId",10000);
        wrapper.instance().handleDeleteAnswer(null,[1],null);
        deleteRequest.mockImplementation(() => Promise.resolve(dataSucc));
        wrapper.instance().handleDeleteAnswer(null,[1],null);
    });
    it('Admintest8_themeForm', async () => {
        window.alert = () => {
        };
        const setup = ({...props}) => {
            const wrapper = shallow(<ThemeForm {...props} />);
            return {
                props,
                wrapper,
            };
        };
        const {wrapper} = setup({
            alertChange: (e) => {
            }, // 直接设为空函数
        });
        let data={
            status:0,
            data:{
                themes:[
                    {
                        name:"sjz",
                        themeId:10002,
                        createTime:{
                            year:201,
                            month:1,
                            date:1
                        }
                    },
                    {
                        name:"sjz2",
                        themeId:10003,
                        createTime:{
                            year:201,
                            month:1,
                            date:4
                        }
                    },
                ]
            }
        };
        let dataFail={
            status:-1,
        };
        let dataSucc={
            status:0,
        };
        getRequest.mockImplementation(() => Promise.resolve(data));
        wrapper.instance().setState({selectedRowKeys:[1,2]});
        await flushPromises();
        wrapper.update();
        getRequest.mockImplementation(() => Promise.resolve(dataFail));
        wrapper.instance().getThemes();
        await flushPromises();
        wrapper.update();
        wrapper.instance().setThemeToRename(0);
        wrapper.instance().confirmRenaming(0);
        wrapper.instance().cancelRenaming(0);
        wrapper.instance().setTheme("zyt");
        postRequest.mockImplementation(() => Promise.resolve(dataSucc));
        wrapper.instance().setState({themeToRename:"apple",themeToAdd: "banana"});
        wrapper.instance().renameTheme(2);
        wrapper.instance().addTheme();
        postRequest.mockImplementation(() => Promise.resolve(dataFail));
        wrapper.instance().renameTheme(2);
        wrapper.instance().addTheme();
        wrapper.instance().handleRename({key:1},null,null);
        deleteRequest.mockImplementation(() => Promise.resolve(dataFail));
        wrapper.instance().removeTheme(1);
        deleteRequest.mockImplementation(() => Promise.resolve(dataSucc));
        wrapper.instance().removeTheme(1);
    });
});