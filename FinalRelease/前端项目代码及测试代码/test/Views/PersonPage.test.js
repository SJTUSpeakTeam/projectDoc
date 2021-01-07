import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import PersonPage from '../../src/Views/PersonPage';
import {postRequest,getRequest} from '../../src/Utils/Ajax';
import flushPromises from 'flush-promises'
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('../../src/Utils/Ajax', () => ({ postRequest: jest.fn(),getRequest: jest.fn() }));
Enzyme.configure({adapter: new Adapter()});

describe('PersonPage', () => {

    it('测试自己的PersonPage',async ()=>{
        let selfData = {
            status: 0,
            data:{
                userList: [
                    {
                        "user": {
                            "avatar": "UrlString",
                            "age": 20,
                            "createTime": "DateTime",
                            "gender": true,
                            "nickname": "KONY",
                            "phoneNum": "110",
                            "userId": 1,
                            "isFollow": true
                        },
                        "userAuth": {
                            "mailAddr": "my@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户"
                        },
                        "regularUser": {
                            "answerNum": 0,
                            "commentNum": 0,
                            "fansNum": 0,
                            "followNum": 0,
                            "liftingTime": "DateTime",
                            "profile": "这个用户很懒，还没有描述过自己~",
                            "questionNum": 0,
                            "visitNum": 0
                        }
                    }]
            }

        }
        let selfData1 = {
            status: -1,
            userList: [],
        }
        let selfData2 = {
            status: 2,
            userList: [],
        }
        let location = {state: {userId:'1'}};
        localStorage.setItem("userId",'1');
        let getData={
            status: 0,
            data:{
                field:'1'
            }
        };
        postRequest.mockImplementation(() => Promise.resolve(selfData));
        getRequest.mockImplementation(() => Promise.resolve(getData));

        const wrapper = shallow(<PersonPage location={location}/>);

        // expect(wrapper.instance().fetchUser).toBeCalled();
        // await flushPromises();
        // wrapper.update();
        wrapper.setState({aimUserId:'1'});
        expect(wrapper.state('aimUserId')).toBe('1');
        expect(wrapper.state('page')).toBe(0);
        expect(wrapper.find('Header').length).toBe(1);
        expect(wrapper.find('img').length).toBe(1);
        expect(wrapper.find('h4').length).toBe(1);
        expect(wrapper.find('Information').length).toBe(1);
        expect(wrapper.find('a').length).toBe(12);

        wrapper.find('a').at(4).simulate('click');
        expect(wrapper.instance().pageChange).toBeCalled;
        expect(wrapper.state('page')).toBe(5);
        expect(wrapper.find('Following').length).toBe(1);
        wrapper.find('a').at(6).simulate('click');
        expect(wrapper.state('page')).toBe(6);
        // expect(wrapper.find('Follower').length).toBe(1);
        wrapper.find('a').at(7).simulate('click');
        expect(wrapper.find('Information').length).toBe(1);
        wrapper.find('a').at(8).simulate('click');
        expect(wrapper.find('QuestionAnswered').length).toBe(1);
        wrapper.find('a').at(9).simulate('click');
        expect(wrapper.find('QuestionRaised').length).toBe(1);
        wrapper.find('a').at(10).simulate('click');
        expect(wrapper.find('QuestionCollected').length).toBe(1);
        wrapper.find('a').at(11).simulate('click');
        expect(wrapper.find('EditInformation').length).toBe(1);

        wrapper.instance().editInformation(7,7,7,7,7,7,7);

        postRequest.mockImplementation(() => Promise.resolve(selfData1));
        wrapper.instance().fetchUser();
        await flushPromises();
        wrapper.update();
        postRequest.mockImplementation(() => Promise.resolve(selfData2));
        wrapper.instance().fetchUser();
        await flushPromises();
        wrapper.update();

    });

    it('测试别人的PersonPage',async ()=>{
        let selfData = {
            status: 0,
            data:{
                userList: [
                    {
                        "user": {
                            "avatar": "UrlString",
                            "age": 20,
                            "createTime": "DateTime",
                            "gender": true,
                            "nickname": "KONY",
                            "phoneNum": "110",
                            "userId": 1,
                            "isFollow": true
                        },
                        "userAuth": {
                            "mailAddr": "my@sjtu.edu.cn",
                            "userType": 2,
                            "humanStatus": "正常用户"
                        },
                        "regularUser": {
                            "answerNum": 0,
                            "commentNum": 0,
                            "fansNum": 0,
                            "followNum": 0,
                            "liftingTime": "DateTime",
                            "profile": "这个用户很懒，还没有描述过自己~",
                            "questionNum": 0,
                            "visitNum": 0
                        }
                    }]
            }
        }
        let selfData1 = {
            status: -1,
        }
        let selfData2 = {
            status: 2,
        }
        let location = {state: {userId:'1'}};
        localStorage.setItem("userId",'2');
        let getData={
            status: 0,
            data:{
                field:'1'
            }
        };
        // postRequest.mockImplementation(() => Promise.resolve(selfData));
        getRequest.mockImplementation(() => Promise.resolve(getData));


        postRequest.mockImplementation(() => Promise.resolve(selfData));

        const wrapper = shallow(<PersonPage location={location}/>);

        // expect(wrapper.instance().fetchUser).toBeCalled();
        // await flushPromises();
        // wrapper.update();
        wrapper.setState({aimUserId:'1'});

        wrapper.instance().handleFollow();
        await flushPromises();
        wrapper.update();
        postRequest.mockImplementation(() => Promise.resolve(selfData1));
        wrapper.instance().handleFollow();
        await flushPromises();
        wrapper.update();
        postRequest.mockImplementation(() => Promise.resolve(selfData2));
        wrapper.instance().handleFollow();
        await flushPromises();
        wrapper.update();

    });

    it('测试没有userId的PersonPage',async ()=>{
        let selfData1 = {
            status: -1,
            userList: [],
        }
        let getData={
            status: 0,
            data:{
                field:'1'
            }
        };
        // postRequest.mockImplementation(() => Promise.resolve(selfData));
        getRequest.mockImplementation(() => Promise.resolve(getData));

        let location = {state: undefined};
        localStorage.setItem("lastPersonPage",'1');
        postRequest.mockImplementation(() => Promise.resolve(selfData1));
        const wrapper = shallow(<PersonPage location={location}/>);
    });
});
