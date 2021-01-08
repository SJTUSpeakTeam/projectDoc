import  QuestionListItem from "../../../Components/MainPage/QuestionListItem";
import Enzyme, {shallow} from 'enzyme';
import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {putRequest,postRequest,getRequest} from "../../../Utils/Ajax.js";
import flushPromises from 'flush-promises'
// import SignInPage from "../../../Views/SignInPage";
Enzyme.configure({adapter: new Adapter()});
jest.mock('../../../Utils/Ajax.js', () => ({postRequest: jest.fn(),putRequest: jest.fn(),getRequest: jest.fn()}));
describe('<QuestionListItem />', () => {
    it('Dom测试', async () => {
        let question ={
            tags:[
                {content:"1"}
            ],
            createTime:{
                year:2001,
                month:10,
                data:12,
                hours:2,
                minutes:18,

            }
        };

        let data1 = {
            status: 0,
            data:{
                user:{}

            },
            like:true,
        };

        putRequest.mockImplementation(() => Promise.resolve(data1));
        getRequest.mockImplementation(() => Promise.resolve(data1));
        postRequest.mockImplementation(() => Promise.resolve(data1));

        let wrapper = shallow(<QuestionListItem question={question}/>);
        wrapper.instance().UNSAFE_componentWillMount();
        wrapper.instance().GotoPersonPage();

        wrapper.instance().GoDetailQuestion();

        wrapper.instance().changeLike();
        await flushPromises();
        wrapper.update();
        // expect(wrapper.state("content")).toBe('6666');
        expect(wrapper.state("like")).toBe(true);

        data1 = {
            status: 1,
            data:{
                user:{}

            },
            like:true,
        };
        getRequest.mockImplementation(() => Promise.resolve(data1));
        wrapper.instance().UNSAFE_componentWillMount();
        wrapper.instance().changeLike();
        await flushPromises();
        wrapper.update();
        // expect(wrapper.state("content")).toBe('6666');
        expect(wrapper.state("like")).toBe(true);

        // await flushPromises();
        // wrapper.update();
        // expect(wrapper.state("content")).toBe('6666');
        //
        // wrapper.instance().searchQuestion();
        //
        // e = {
        //     target: {
        //         value: '666'
        //     }
        // };
        // wrapper.find('form').at(0).find("input").at(0).simulate('change', e);
        // await flushPromises();
        // wrapper.update();
        // expect(wrapper.state("content")).toBe('666');
        //
        //
        // wrapper.find('form').at(0).find("input").at(1).simulate('click');
    });
});
