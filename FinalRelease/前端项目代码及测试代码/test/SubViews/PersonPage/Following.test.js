import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import {postRequest, getRequest} from '../../../src/Utils/Ajax';
import flushPromises from 'flush-promises'
import Following from "../../../src/SubViews/PersonPage/Following";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('../../../src/Utils/Ajax', () => ({ postRequest: jest.fn(), getRequest: jest.fn() }));
Enzyme.configure({adapter: new Adapter()});

describe('Following', () => {

    it('测试',async ()=>{
        let getData = {
            status: 0,
            data:{followIds:['2','3']}
        }
        let postData = {
            status: 0,
            data:{userList: [{
                    user:{avatar:'1',nickname:'1',gender:'1',age:'1',userId:'1'},
                    userAuth:{mailAddr:'1'}
                }]}}
        let data1 = {
            status: -1,
        }
        let data2 = {
            status: 2,
        }
        let aimUser = "1";
        postRequest.mockImplementation(() => Promise.resolve(postData));
        getRequest.mockImplementation(() => Promise.resolve(getData));
        const wrapper = shallow(<Following aimUser={aimUser}/>)
        wrapper.instance().fetchUserById();
        await flushPromises();
        wrapper.update();
        wrapper.instance().getFollowList();
        await flushPromises();
        wrapper.update();

        postRequest.mockImplementation(() => Promise.resolve(data1));
        getRequest.mockImplementation(() => Promise.resolve(data1));
        wrapper.instance().getFollowList();
        wrapper.instance().fetchUserById();
        await flushPromises();
        wrapper.update();
        postRequest.mockImplementation(() => Promise.resolve(data2));
        getRequest.mockImplementation(() => Promise.resolve(data2));
        wrapper.instance().getFollowList();
        wrapper.instance().fetchUserById();
        await flushPromises();
        wrapper.update();

        let nextProps = {
            aimUserId : "10"
        }
        wrapper.instance().UNSAFE_componentWillReceiveProps(nextProps, '');
    });
});
