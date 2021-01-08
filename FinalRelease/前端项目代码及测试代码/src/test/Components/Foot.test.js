import  Foot from "../../Components/Foot";
import Enzyme, {shallow} from 'enzyme';
import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {putRequest,postRequest,getRequest} from "../../Utils/Ajax.js";
import flushPromises from 'flush-promises'
// import SignInPage from "../../../Views/SignInPage";
Enzyme.configure({adapter: new Adapter()});
jest.mock('../../Utils/Ajax.js', () => ({postRequest: jest.fn(),putRequest: jest.fn(),getRequest: jest.fn()}));
describe('< Foot />', () => {
    it('Dom测试', async () => {


        let data1 = {
            status: 0,
            data:{
                user:{},
                questions:[
                    {
                        createTime:{
                            year:2001,
                            month:10,
                            data:12,
                            hours:2,
                            minutes:18,

                        }
                    }
                ]
            },
            like:true,
        };

        putRequest.mockImplementation(() => Promise.resolve(data1));
        getRequest.mockImplementation(() => Promise.resolve(data1));
        postRequest.mockImplementation(() => Promise.resolve(data1));

        let wrapper = shallow(< Foot />);


    });
});
