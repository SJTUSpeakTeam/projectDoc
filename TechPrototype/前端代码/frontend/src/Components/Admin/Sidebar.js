import React from "react";
import { Menu, Button,Typography } from 'antd';
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
    AreaChartOutlined,
    WechatOutlined,
    TeamOutlined
} from '@ant-design/icons';
import {color} from "echarts/src/export";
import StatisticsContent from "./StatisticsContent";
const { SubMenu } = Menu;
const { Title, Paragraph, Text } = Typography;
class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.setState({
            currentPage:props.currentPage,
        })
    };
    state = {
        collapsed: false,
        selected:1
    };

    setSelected(e){
        console.log("here!!!!",e)
        this.setState({
                selected:e
            }
        );
        this.props.alertChange(e);
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <div style={{ width: "auto" }}>
                <br/>
                <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Button>
                <Menu
                    defaultSelectedKeys={['1']}
                    // defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                    <Menu.Item key="1" icon={<AreaChartOutlined />} onClick={(e) => this.setSelected(1)}>统计</Menu.Item>
                    <SubMenu key="sub1" icon={<WechatOutlined />} title="言论管理">
                        <SubMenu key="sub11" title="问题管理">
                            <Menu.Item key="2" onClick={(e) => this.setSelected(2)}>所有提问</Menu.Item>
                            <Menu.Item key="3" onClick={(e) => this.setSelected(3)}>评估待封禁的提问</Menu.Item>
                        </SubMenu>
                        {/*<SubMenu key="sub12" title="回答及评论管理">*/}
                        {/*    <Menu.Item key="4" onClick={(e) => this.setSelected(4)}>所有回答及评论</Menu.Item>*/}
                        {/*    */}
                        {/*</SubMenu>*/}'
                        <Menu.Item key="5" onClick={(e) => this.setSelected(5)}>举报管理</Menu.Item>
                        <Menu.Item key="6" onClick={(e) => this.setSelected(6)}>敏感词管理</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<TeamOutlined />} title="用户管理">
                        <Menu.Item key="7" onClick={(e) => this.setSelected(7)}>所有用户</Menu.Item>
                        <Menu.Item key="8" onClick={(e) => this.setSelected(8)}>评估待封禁的用户</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<ContainerOutlined/>} title="高级选项">
                        <Menu.Item key="9" onClick={(e) => this.setSelected(9)}>人员管理</Menu.Item>
                        <Menu.Item key="10" onClick={(e)=>this.setSelected(10)}>分区管理</Menu.Item>
                    </SubMenu>

                </Menu>
                <div style={{marginLeft:15,marginRight:15}}>
                    <br/>
                    <Typography>
                        <Title style={{fontSize:25}} type="danger">管理员公约</Title>
                        <Paragraph type="danger">1.管理员必须尊重国家法律和平台相关规定</Paragraph>
                        <Paragraph type="danger">2.管理员必须保护用户数据安全，不能无故泄露用户个人信息</Paragraph>
                        <Paragraph type="danger">3.管理员需服从超级管理员的责任分工安排</Paragraph>
                        <Paragraph type="danger">4.管理员需维护论坛良好的运营和管理</Paragraph>
                        <Paragraph type="danger">5.管理员应以平台和用户利益为先，营造良好论坛环境</Paragraph>
                        <Paragraph></Paragraph>
                        <Title style={{fontSize:25}} type="danger">管理员责任</Title>
                        <Paragraph type="danger">1.封禁违反法律和危害公众安全的不当言论、图片、视频等内容</Paragraph>
                        <Paragraph type="danger">2.封禁涉及淫秽色情、血腥暴力的言论、图片、视频等内容</Paragraph>
                        <Paragraph type="danger">3.管理用户的封禁、解封</Paragraph>
                        <Paragraph type="danger">4.管理敏感词库</Paragraph>
                        <Paragraph></Paragraph>
                    </Typography>
                </div>
            </div>
        );
    }
}

export default Sidebar;