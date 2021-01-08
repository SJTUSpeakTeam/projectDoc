import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import {getRequest} from '../../../src/Utils/Ajax';
import flushPromises from 'flush-promises'
import QuestionRaised from "../../../src/SubViews/PersonPage/QuestionRaised";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('../../../src/Utils/Ajax', () => ({ getRequest: jest.fn() }));
Enzyme.configure({adapter: new Adapter()});

describe('QuestionRaised', () => {

    it('测试',async ()=>{
        let getData = {
            status: 0,
            data:{questions:[
                    {header:'1',nickname:'1',theme:'1',questionId:'1',userId:'1'}
                ]}
        }
        let data1 = {
            status: -1,
        }
        let data2 = {
            status: 2,
        }
        let aimUser = "1";
        getRequest.mockImplementation(() => Promise.resolve(getData));
        const wrapper = shallow(<QuestionRaised aimUser={aimUser}/>)
        wrapper.instance().getQuestionRaised();
        await flushPromises();
        wrapper.update();

        getRequest.mockImplementation(() => Promise.resolve(data1));
        wrapper.instance().getQuestionRaised();
        await flushPromises();
        wrapper.update();
        getRequest.mockImplementation(() => Promise.resolve(data2));
        wrapper.instance().getQuestionRaised();
        await flushPromises();
        wrapper.update();

        wrapper.instance().afterDeleteQuestion();

        let nextProps = {
            aimUserId : "10"
        }
        wrapper.instance().UNSAFE_componentWillReceiveProps(nextProps, '');
    });
});