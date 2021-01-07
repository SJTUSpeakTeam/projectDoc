import SignInPage from "../../Views/SignInPage";
import Enzyme, {shallow} from 'enzyme';
import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {putRequest,postRequest} from "../../Utils/Ajax.js";
import flushPromises from 'flush-promises'
Enzyme.configure({adapter: new Adapter()});
jest.mock('../../Utils/Ajax.js', () => ({postRequest: jest.fn(),putRequest: jest.fn()}));
describe('<SignIn />', () => {
    it('Dom测试', async () => {
        let data = {
            status: 0,
            data: {
                userId: '1',
                sessionId: '2',
                nickname: '3',
                icon: '',
                role: '管理员',
                avatar:"1",
                gender:"1",
                mailAddr:"1",
            }
        };
        let data1 = {
            status: 0,
            data: {
                userId: '1',
                sessionId: '2',
                nickname: '3',
                icon: '',
                role: '管理员',
                avatar:"1",
                gender:"1",
                mailAddr:"1",
            }
        };
        putRequest.mockImplementation(() => Promise.resolve(data));
        postRequest.mockImplementation(() => Promise.resolve(data1));
        let wrapper = shallow(<SignInPage/>);
        expect(wrapper.state("username")).toBe('');
        expect(wrapper.state("password")).toBe('');
        expect(wrapper.state("visible")).toBe(false);
        expect(wrapper.state("content")).toBe(null);
        wrapper.instance().handleSubmit();
        wrapper.instance().handleOk();
        expect(wrapper.state("visible")).toBe(false);
        let e = {
            target: {
                value: '6666'
            }
        }
        wrapper.instance().userNameChange(e)
        expect(wrapper.state("username")).toBe('6666');
        wrapper.instance().passwordChange(e);
        expect(wrapper.state("password")).toBe('6666');
        wrapper.instance().handleSubmit();
        await flushPromises();
        wrapper.update();

        expect(wrapper.state("visible")).toBe(false);
        e = {
            target: {
                value: '5555'
            }
        }
        wrapper.find('Input').at(0).simulate('change', e);

        expect(wrapper.state("username")).toBe('5555');

        wrapper.find('Input').at(1).simulate('change', e);

        expect(wrapper.state("password")).toBe('5555');
        // wrapper.find('Button').at(0).simulate('click');
        let LinkElem = wrapper.find('Link');
        // expect(LinkElem.prop('to')).toStrictEqual('/SignUpPage');
        wrapper.instance().handleSubmit();
        data = {
            status: 1,
            msg: '错误',
            data: {
                userId: 2,
                sessionId: 2,
                nickname: '1',
                icon: '2',
                role: '管理员',
                avatar:"1",
                gender:"1",
                mailAddr:"1",
            }
        };
        postRequest.mockImplementation(() => Promise.resolve(data));
        wrapper.instance().handleSubmit();
        await flushPromises();
        wrapper.update();
        // expect(wrapper.state("content")).toBe('错误');
        expect(wrapper.state("visible")).toBe(true);
        data = {
            status: 2,
            msg: '错误',
            data: {
                userId: 2,
                sessionId: 2,
                nickname: '1',
                icon: '2',
                role: '管理员',
                avatar:"1",
                gender:"1",
                mailAddr:"1",
            }
        };
        wrapper.instance().handleSubmit();
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("visible")).toBe(true);

        wrapper.find('button').at(1).simulate('onClick');



    });
});
