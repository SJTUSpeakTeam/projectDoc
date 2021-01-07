import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import flushPromises from 'flush-promises'
import Information from "../../../src/SubViews/PersonPage/Information";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
Enzyme.configure({adapter: new Adapter()});

describe('Information', () => {

    it('测试',async ()=>{
        let profile = "1";
        const wrapper = shallow(<Information profile={profile}/>)

        let nextProps = {
            profile : "10"
        }
        wrapper.instance().UNSAFE_componentWillReceiveProps(nextProps, '');
    });
});