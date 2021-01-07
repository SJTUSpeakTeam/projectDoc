import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import flushPromises from 'flush-promises'
import UsersItem from "../../../src/Components/PersonPage/UsersItem";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
Enzyme.configure({adapter: new Adapter()});

describe('UsersItem', () => {

    it('测试',async ()=>{
        let avatar='1';
        let nickname='1';
        let gender=1;
        let age='1';
        let mailAddr='1';
        let userId='1';
        const wrapper = shallow(<UsersItem
            avatar={avatar} nickname={nickname} gender={gender} age={age} mailAddr={mailAddr} userId={userId}/>)

        wrapper.instance().GoPersonPage();

    });

    it('测试branch',async ()=>{
        let avatar='1';
        let nickname=null;
        let gender=0;
        let age='1';
        let mailAddr='1';
        let userId='1';
        const wrapper = shallow(<UsersItem
            avatar={avatar} nickname={nickname} gender={gender} age={age} mailAddr={mailAddr} userId={userId}/>)

        wrapper.instance().GoPersonPage();

    });
});