import SignUpForm from "../../Components/SignUpForm";
import SignUp from "../../Views/SignUpPage";
import Enzyme, {mount, shallow} from 'enzyme';
import React, {useCallback} from "react";
import Adapter from 'enzyme-adapter-react-16';
import {postRequest,getRequest} from "../../Utils/Ajax.js";
import flushPromises from 'flush-promises'

Enzyme.configure({adapter: new Adapter()});

jest.mock('../../Utils/Ajax.js', () => ({postRequest: jest.fn(),getRequest: jest.fn()}));
describe('<SignUp />', () => {
    it('Dom测试', async () => {
        let data = {
            status: 0,
            result: {
                userId: '1',
                sessionId: '2',
                nickname: '3',
                icon: '',
                role: '管理员',
            }
        };
        postRequest.mockImplementation(() => Promise.resolve(data));
        let wrapper = shallow(<SignUpForm/>);
        //检查初始值
        expect(wrapper.state("nickName")).toBe('');
        expect(wrapper.state("email")).toBe('');
        expect(wrapper.state("password")).toBe('');
        expect(wrapper.state("confirmPassword")).toBe('');
        expect(wrapper.state("phoneNumber")).toBe('');
        expect(wrapper.state("birthday")).toBe(null);
        expect(wrapper.state("checkNickname")).toBe(true);
        let e = {
            target: {
                value: '6666'
            }
        };
        //检查函数
        wrapper.instance().signUp();
        await flushPromises();
        wrapper.update();
        wrapper.instance().phoneChange(e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("phoneNumber")).toBe('6666');
        wrapper.instance().emailChange(e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("email")).toBe('');
        e = {
            target: {
                value: '123@qq.com'
            }
        };


        let e3 = {
            target: {
                value: '1232736r26423643264236423e3284328826482364823764@qq.com'
            }
        };
        wrapper.instance().emailChange(e3);
        await flushPromises();
        wrapper.update();
        wrapper.instance().signUp();

        let e1 = {
            target: {
                value: '1234@qq.com'
            }
        };
        wrapper.instance().emailChange(e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("email")).toBe('123@qq.com');

        wrapper.instance().passwordChange(e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("password")).toBe('123@qq.com');

        wrapper.instance().signUp();
        await flushPromises();
        wrapper.update();

        wrapper.instance().confirmPasswordChange(e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("confirmPassword")).toBe('123@qq.com');

        expect(wrapper.find('Input').length).toBe(5)

        wrapper.instance().nickNameChange(e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("nickName")).toBe('123@qq.com');


        wrapper.instance().confirmPasswordChange(e1);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("confirmPassword")).toBe('1234@qq.com');
        wrapper.instance().signUp();
        await flushPromises();
        wrapper.update();

        wrapper.instance().signUp();
        await flushPromises();
        wrapper.update();
        //检查input组件
        wrapper.find('Input').at(0).simulate('change', e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("nickName")).toBe('123@qq.com');

        wrapper.find('Input').at(1).simulate('change', e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("email")).toBe('123@qq.com');

        wrapper.find('Input').at(2).simulate('change', e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("password")).toBe('123@qq.com');

        wrapper.find('Input').at(3).simulate('change', e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("confirmPassword")).toBe('123@qq.com');

        wrapper.find('Input').at(4).simulate('change', e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("phoneNumber")).toBe('123@qq.com');

        // wrapper.find('Button').at(0).simulate('click', e);
        //重写data 进入分支
        data = {
            status: 1,
            result: {
                userId: '1',
                sessionId: '2',
                nickname: '3',
                icon: '',
                role: '管理员',
            }
        };
        wrapper.instance().signUp();

        data = {
            status: 2,
            result: {
                userId: '1',
                sessionId: '2',
                nickname: '3',
                icon: '',
                role: '管理员',
            }
        };
        wrapper.instance().signUp();

        data = {
            status: 3,
            result: {
                userId: '1',
                sessionId: '2',
                nickname: '3',
                icon: '',
                role: '管理员',
            }
        };
        wrapper.instance().signUp();
        //无法读到form.item
        expect(wrapper.find('Form').find('Form.Item').length).toBe(0)


        // 测试checkNickname函数
        getRequest.mockImplementation(() => Promise.resolve(data));
        let value='hhh';
        let rule='';
        data={
            result: false,
        };
        let  callback=(content='')=>{

        }
        wrapper.instance().checkNickname(rule,value,callback);
        await flushPromises();
        wrapper.update();
        // 改变data
        data={
            result: true,
        };
        wrapper.instance().checkNickname(rule,value,callback);
        await flushPromises();
        wrapper.update();


        // 改变value
        value='';
        wrapper.instance().checkNickname(rule,value,callback);
        await flushPromises();
        wrapper.update();

        //测试checkEmail函数
        value='hhh';
        rule='';
        data={
            result: false,
        };
        callback=(content='')=>{

        }
        wrapper.instance().checkEmail(rule,value,callback);
        await flushPromises();
        wrapper.update();
        // 改变data
        data={
            result: true,
        };
        wrapper.instance().checkEmail(rule,value,callback);
        await flushPromises();
        wrapper.update();


        // 改变value
        value='';
        wrapper.instance().checkEmail(rule,value,callback);
        await flushPromises();
        wrapper.update();
    });
    it('Dom测试', async () => {
        let wrapper = shallow(<SignUp/>);
    });
});
