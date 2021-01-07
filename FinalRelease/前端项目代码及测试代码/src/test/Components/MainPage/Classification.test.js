import  Classification from "../../../Components/MainPage/Classification";
import Enzyme, {shallow} from 'enzyme';
import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {putRequest,postRequest,getRequest} from "../../../Utils/Ajax.js";
import flushPromises from 'flush-promises'
// import SignInPage from "../../../Views/SignInPage";
Enzyme.configure({adapter: new Adapter()});
jest.mock('../../../Utils/Ajax.js', () => ({postRequest: jest.fn(),putRequest: jest.fn(),getRequest: jest.fn()}));
describe('<Classification />', () => {
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
               themes:[1,2]

            },
            like:true,
        };

        putRequest.mockImplementation(() => Promise.resolve(data1));
        getRequest.mockImplementation(() => Promise.resolve(data1));
        postRequest.mockImplementation(() => Promise.resolve(data1));

        let wrapper = shallow(<Classification question={question}/>);
        wrapper.instance().UNSAFE_componentWillMount();



        await flushPromises();
        wrapper.update();

        expect(wrapper.state("theme")).toStrictEqual([1,2]);

        data1 = {
            status: 1,
            data: {
                themes: [1, 2,3]

            },
            msg:"错误"
        }

        wrapper.instance().UNSAFE_componentWillMount();

        await flushPromises();
        wrapper.update();
        expect(wrapper.state("theme")).toStrictEqual([1,2]);
        let value= '666';

        wrapper.instance().GoCommunity(value);



    });
});
