import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import flushPromises from 'flush-promises';
import {deleteRequest} from "../../../src/Utils/Ajax";
import QuestionItem from "../../../src/Components/PersonPage/QuestionItem";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('../../../src/Utils/Ajax', () => ({ deleteRequest: jest.fn() }));

Enzyme.configure({adapter: new Adapter()});

describe('QuestionItem', () => {

    it('测试自己的',async ()=>{
        let data0 = {
            status: 0,
        }
        let data1 = {
            status: -1,
        }
        let data2 = {
            status: 2,
        }

        localStorage.setItem("userId",'1')
        let afterDeleteQuestion = jest.fn();
        let header='1';
        let author='1';
        let theme='1';
        let questionId='1';
        let userId=1;
        const wrapper = shallow(<QuestionItem header={header} author={author}
              theme={theme} questionId={questionId} userId={userId} afterDeleteQuestion={afterDeleteQuestion}/>)

        wrapper.instance().GoDetailQuestion();
        wrapper.instance().GoPersonPage();

        deleteRequest.mockImplementation(() => Promise.resolve(data0));
        wrapper.instance().deleteQuestion();
        await flushPromises();
        wrapper.update();
        deleteRequest.mockImplementation(() => Promise.resolve(data1));
        wrapper.instance().deleteQuestion();
        await flushPromises();
        wrapper.update();
        deleteRequest.mockImplementation(() => Promise.resolve(data2));
        wrapper.instance().deleteQuestion();
        await flushPromises();
        wrapper.update();

        let nextProps = {
            header:'1',
            author:'1',
            theme:'1',
            questionId:'1',
            userId:'1',
        }
        wrapper.instance().UNSAFE_componentWillReceiveProps(nextProps, '');

    });

    it('测试自己的',async ()=>{
        let afterDeleteQuestion = jest.fn();
        let header='1';
        let author='1';
        let theme='1';
        let questionId='1';
        let userId='1';
        const wrapper = shallow(<QuestionItem header={header} author={author}
                                              theme={theme} questionId={questionId} userId={userId} afterDeleteQuestion={afterDeleteQuestion}/>)

    });
});