import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import Constant from '../../../helper/constant';
import PornTab from '../statistics/tabComponent/pornTab';
import Rewiring from './userProgress';
import MasturbationTab from '../statistics/tabComponent/masturbationTab';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import CustomTabbar from '../../commonComponent/customTabBar';

const renderTabBar = props => (<CustomTabbar {...props} style={{ borderBottomWidth: 0,height:(Constant.isIOS) ? 80 : 60}}/>);
const renderLightTabBar = props => (<CustomTabbar {...props} style={{ height:(Constant.isIOS) ? 80 : 60, borderBottomWidth:1,
    borderColor:"#e4e4e4" }} />);

class TabProgressComponent extends React.PureComponent {

    componentWillMount () {
        console.log("will mount - Statisctic")
    }

    render() {

        console.log("re-render - Statisctic")
        let appColor = Constant[this.props.appTheme];
        return (
            <View style={{paddingTop:this.props.safeAreaInsetsData.top,flex:1,backgroundColor:appColor.appBackground}}>
                <ScrollableTabView tabBarBackgroundColor={appColor.scrollableBack}
                                   style={{backgroundColor:appColor.scrollableViewBack}}
                                   tabBarUnderlineStyle={{backgroundColor:Constant.lightBlueColor}}
                                   renderTabBar={this.props.appTheme === Constant.darkTheme && renderTabBar || renderLightTabBar}
                                   tabBarActiveTextColor={appColor.scrollableActiveFont}
                                   tabBarTextStyle={{fontFamily:Constant.font500,fontSize:14, alignSelf: 'center', paddingTop: (Constant.isIOS) ? 30 : 15}}
                                   tabBarInactiveTextColor={appColor.scrollableInactiveFont}
                                   prerenderingSiblingsNumber={Infinity}>
                    <Rewiring tabLabel="Rewiring"/>
                    <PornTab tabLabel="Porn" {...this.props}/>
                    <MasturbationTab tabLabel="Masturbation" {...this.props}/>
                </ScrollableTabView>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {

})(TabProgressComponent);
//Infinity