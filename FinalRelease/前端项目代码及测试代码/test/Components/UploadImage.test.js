import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import flushPromises from 'flush-promises'
import UploadImage from "../../src/Components/UploadImage";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
Enzyme.configure({adapter: new Adapter()});

describe('QuestionAnswered', () => {

    it('测试',async ()=>{

        let img = "1";

        const wrapper = shallow(<UploadImage img={img}/>)
        wrapper.instance().showModal();
        wrapper.instance().handleCancel();

        let nextProps = {
            img : "10"
        }
        wrapper.instance().UNSAFE_componentWillReceiveProps(nextProps, '');
    });

    it('测试branch',async ()=>{

        let img = "";
        const wrapper = shallow(<UploadImage img={img}/>)

    });
});