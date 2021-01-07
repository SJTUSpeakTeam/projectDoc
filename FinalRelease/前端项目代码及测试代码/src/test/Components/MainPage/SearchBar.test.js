import  SearchBar from "../../../Components/MainPage/SearchBar";
import Enzyme, {shallow} from 'enzyme';
import React from "react";
import Adapter from 'enzyme-adapter-react-16';

import flushPromises from 'flush-promises'
// import SignInPage from "../../../Views/SignInPage";
Enzyme.configure({adapter: new Adapter()});
// jest.mock('../../Utils/Ajax.js', () => ({postRequest: jest.fn(),putRequest: jest.fn()}));
describe('<searchBar />', () => {
    it('Dom测试', async () => {
        let wrapper = shallow(<SearchBar/>);
        let e = {
            target: {
                value: '6666'
            }
        };
        wrapper.instance().onChange(e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("content")).toBe('6666');

        wrapper.instance().searchQuestion();

         e = {
            target: {
                value: '666'
            }
        };
        wrapper.find('form').at(0).find("input").at(0).simulate('change', e);
        await flushPromises();
        wrapper.update();
        expect(wrapper.state("content")).toBe('666');


        wrapper.find('form').at(0).find("input").at(1).simulate('click');
    });
});
