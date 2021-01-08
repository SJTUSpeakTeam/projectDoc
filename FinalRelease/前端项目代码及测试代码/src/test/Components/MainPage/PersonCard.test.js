import  PersonCard from "../../../Components/MainPage/PersonCard";
import Enzyme, {shallow} from 'enzyme';
import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {putRequest,postRequest,getRequest} from "../../../Utils/Ajax.js";
import flushPromises from 'flush-promises'
// import SignInPage from "../../../Views/SignInPage";
Enzyme.configure({adapter: new Adapter()});
jest.mock('../../../Utils/Ajax.js', () => ({postRequest: jest.fn(),putRequest: jest.fn(),getRequest: jest.fn()}));
describe('<PersonCard />', () => {
    it('Dom测试', async () => {


        putRequest.mockImplementation(() => Promise.resolve(data1));
        getRequest.mockImplementation(() => Promise.resolve(data1));
        postRequest.mockImplementation(() => Promise.resolve(data1));

        let wrapper = shallow(<PersonCard />);

    });
});
