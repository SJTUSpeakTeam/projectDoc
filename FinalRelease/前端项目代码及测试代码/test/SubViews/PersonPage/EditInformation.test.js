import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import {postRequest} from '../../../src/Utils/Ajax';
import flushPromises from 'flush-promises'
import EditInformation from "../../../src/SubViews/PersonPage/EditInformation";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('../../../src/Utils/Ajax', () => ({ postRequest: jest.fn() }));
Enzyme.configure({adapter: new Adapter()});

describe('EditInformation', () => {

    it('测试',async ()=>{
        let data0 = {
            status: 0,
        }
        let data1 = {
            status: -1,
        }
        let data2 = {
            status: 2,
        }
        let avatar = "1";
        let nickname = "1";
        let age = "1";
        let gender = "1";
        let mailAddr = "1";
        let phoneNum = "1";
        let profile = "1";
        let editInformation = jest.fn();
        const wrapper = shallow(<EditInformation avatar={avatar}
                         nickname={nickname}
                         age={age}
                         gender={gender}
                         mailAddr={mailAddr}
                         phoneNum={phoneNum}
                         profile={profile}
                         editInformation={editInformation}/>)

        let e = {target:{value:'2'}};
        wrapper.instance().avatarChange("2");
        wrapper.instance().nicknameChange(e);
        wrapper.instance().ageChange("2");
        wrapper.instance().genderChange("2");
        wrapper.instance().mailAddrChange(e);
        wrapper.instance().phoneNumChange(e);
        wrapper.instance().profileChange(e);

        postRequest.mockImplementation(() => Promise.resolve(data0));
        wrapper.instance().handleSave();
        await flushPromises();
        wrapper.update();
        postRequest.mockImplementation(() => Promise.resolve(data1));
        wrapper.instance().handleSave();
        await flushPromises();
        wrapper.update();
        postRequest.mockImplementation(() => Promise.resolve(data2));
        wrapper.instance().handleSave();
        await flushPromises();
        wrapper.update();

        let nextProps = {
            avatar : "1",
            nickname : "1",
            age : "1",
            gender : "1",
            mailAddr : "1",
            phoneNum : "1",
            profile : "1"
        }
        wrapper.instance().UNSAFE_componentWillReceiveProps(nextProps, '');
    });
});