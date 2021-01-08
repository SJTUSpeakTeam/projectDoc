import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import {postRequest, getRequest} from '../../../src/Utils/Ajax';
import flushPromises from 'flush-promises'
import QuestionCollected from "../../../src/SubViews/PersonPage/QuestionCollected";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('../../../src/Utils/Ajax', () => ({ postRequest: jest.fn(), getRequest: jest.fn() }));
Enzyme.configure({adapter: new Adapter()});

describe('QuestionCollected', () => {

    it('测试',async ()=>{
        let getData = {
            status: 0,
            data:{questions:[
                    {header:'1',nickname:'1',theme:'1',questionId:'1',userId:'1'}
                ]}
        }
        let postData = {
            status: 0,
            data:{userList: [{
                    user:{nickname:'1'}
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
        const wrapper = shallow(<QuestionCollected aimUser={aimUser}/>)
        wrapper.instance().fetchNickname();
        await flushPromises();
        wrapper.update();
        wrapper.instance().getQuestionCollected();
        await flushPromises();
        wrapper.update();

        postRequest.mockImplementation(() => Promise.resolve(data1));
        getRequest.mockImplementation(() => Promise.resolve(data1));
        wrapper.instance().fetchNickname();
        wrapper.instance().getQuestionCollected();
        await flushPromises();
        wrapper.update();
        postRequest.mockImplementation(() => Promise.resolve(data2));
        getRequest.mockImplementation(() => Promise.resolve(data2));
        wrapper.instance().fetchNickname();
        wrapper.instance().getQuestionCollected();
        await flushPromises();
        wrapper.update();

        wrapper.instance().afterDeleteQuestion();

        let nextProps = {
            aimUserId : "10"
        }
        wrapper.instance().UNSAFE_componentWillReceiveProps(nextProps, '');
    });
});