import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import Constant from '../../../helper/constant';
import PostAdvice from './postAdvice';
import HelpOthers from './helpOthers';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import {getHelpPostDetail} from "../../../actions/helpPostActions";
import {getAdviceDetail} from "../../../actions/postAdviceAction";

import CustomTabbar from '../../commonComponent/customTabBar';

const renderTabBar = props => (<CustomTabbar {...props} style={{ borderBottomWidth: 0,height:(Constant.isIOS) ? 80 : 60}}/>);
const renderLightTabBar = props => (<CustomTabbar {...props} style={{ height:(Constant.isIOS) ? 80 : 60, borderBottomWidth:1,
    borderColor:"#e4e4e4" }} />);

// const renderTabBar = props => (<DefaultTabBar {...props} style={{ borderBottomWidth: 0,height:(Constant.isIOS) ? 80 : 60 }} />);

class ShowTeam extends Component {

    constructor(props){
        super(props);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true
    //     }else {
    //         return false;
    //     }
    // }

    // componentWillReceiveProps (nextProps) {
    //     if (nextProps.visibleTab === 'milestone') {
    //         // alert("MileStone");
    //         this.props.getHelpPostDetail();
    //         this.props.getAdviceDetail();
    //     }
    // }

    render() {
        console.log('re-render--milestone')
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container,{paddingTop:this.props.safeAreaInsetsData.top, backgroundColor: appColor.appBackground}]}>
                <ScrollableTabView tabBarBackgroundColor={appColor.scrollableBack}
                                   style={{backgroundColor:appColor.scrollableViewBack}}
                                   tabBarUnderlineStyle={{backgroundColor:Constant.lightBlueColor}}
                                   renderTabBar={this.props.appTheme === Constant.darkTheme && renderTabBar || renderLightTabBar}
                                   tabBarActiveTextColor={appColor.scrollableActiveFont}
                                   tabBarTextStyle={{fontFamily:Constant.font500,fontSize:14, alignSelf: 'center',
                                       paddingTop: (Constant.isIOS) ? 30 : 15}}
                                   tabBarInactiveTextColor={appColor.scrollableInactiveFont}
                                   prerenderingSiblingsNumber={Infinity}>
                    <PostAdvice tabLabel="Share advice" {...this.props}/>
                    <HelpOthers tabLabel="Help others" {...this.props}/>
                </ScrollableTabView>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Constant.backColor,
    },
});
const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
        // visibleTab: state.user.visibleTab,
    };
};

export default connect(mapStateToProps, {
    getHelpPostDetail,
    getAdviceDetail,
})(ShowTeam);