import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme,{ shallow} from 'enzyme';
import {postRequest, getRequest} from '../../src/Utils/Ajax';
import flushPromises from 'flush-promises'
import PostSpeak from "../../src/Components/PostSpeak";
import {editorContent} from "../../src/Components/RichText";
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('../../src/Utils/Ajax', () => ({ postRequest: jest.fn(), getRequest: jest.fn() }));
Enzyme.configure({adapter: new Adapter()});

describe('PostSpeak', () => {

    it('测试',async ()=>{
        let getData = {
            status: 0,
            data:{themes: [
                    {
                        themeId: 1,
                        name: "1",
                        createTime: "1",
                    }],
                tags:['1','2'],
            }
        }
        let postData = {
            status: 0
        }
        let data1 = {
            status: -1,
        }
        let data2 = {
            status: 2,
        }
        postRequest.mockImplementation(() => Promise.resolve(postData));
        getRequest.mockImplementation(() => Promise.resolve(getData));
        const wrapper = shallow(<PostSpeak/>)
        wrapper.instance().showDrawer();
        wrapper.instance().onClose();
        let e = {target:{value:"head"}};
        wrapper.instance().onHeaderChange(e);

        wrapper.instance().handleThemeSearch("");
        wrapper.instance().handleThemeSearch("theme0");
        wrapper.setState({themeItems:["theme1"]});
        wrapper.instance().handleThemeSearch("theme1");
        wrapper.instance().handleTagSearch("");
        wrapper.instance().handleTagSearch("tag0");

        wrapper.instance().handleTagSelectChange("10");
        wrapper.instance().handleThemeSelectChange("10");

        wrapper.instance().handleTagsSearch();
        wrapper.instance().handleThemesSearch();
        await flushPromises();
        wrapper.update();

        wrapper.setState({header:'',theme:[]}); //header = '',theme = []
        wrapper.instance().handlePost();
        await flushPromises();
        wrapper.update();
        wrapper.setState({header:'header'}); //header = 'header',theme = []
        wrapper.instance().handlePost();
        await flushPromises();
        wrapper.update();
        wrapper.setState({header:'header',theme:['theme10','theme20']}); //editorContent = ''
        wrapper.instance().handlePost();


        postRequest.mockImplementation(() => Promise.resolve(data1));
        getRequest.mockImplementation(() => Promise.resolve(data1));
        wrapper.instance().handleTagsSearch();
        wrapper.instance().handleThemesSearch();
        wrapper.instance().handlePost();


        postRequest.mockImplementation(() => Promise.resolve(data2));
        getRequest.mockImplementation(() => Promise.resolve(data2));
        wrapper.instance().handleTagsSearch();
        wrapper.instance().handleThemesSearch();
        wrapper.instance().handlePost();



    });
});