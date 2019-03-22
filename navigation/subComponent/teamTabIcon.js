import React from 'react';
import { Text, ImageBackground, View } from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../helper/constant';

class TeamTabIcon extends React.Component {

    render() {
        const {badgeVal} = this.props;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={{
                zIndex: 0,
                width: Constant.screenWidth/5,
                height: 50,
                justifyContent: 'center',
                alignSelf:'center',
                backgroundColor: appColor.tabbarBack}}>
                <ImageBackground source={!this.props.focused ? appColor.tabIcon[this.props.tabbar] :
                    appColor.selectedTabIcon[this.props.tabbar]}
                                 style={{height: 30,width: 30, alignSelf:'center'}}
                                 resizeMode={"contain"}/>
                    {
                        (badgeVal != 0 || badgeVal != "") &&
                        <View style={{
                            overflow:'visible',
                            left: (Constant.screenWidth/5)/2,
                            top:5,
                            minWidth:18,
                            maxWidth: (Constant.screenWidth/5)/2-5,
                            position:'absolute',
                            backgroundColor: 'red',
                            alignItems:'center',
                            height:18,
                            borderRadius:9,
                            alignSelf:'flex-end',
                            justifyContent:'center'}}>
                            <Text style={{color:'#FFF',backgroundColor:'transparent',padding:2,
                                fontFamily:Constant.font700, fontSize:12}}
                                  numberOfLines={1}>
                                {badgeVal+""}</Text>
                        </View>
                        || null
                    }
                <View style={{top:0, left:0, right:0, height:1, backgroundColor: appColor.tabbarTopBorder,
                    position:'absolute'}}/>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    badgeVal: state.user.appBadgeCount,
    appTheme: state.user.appTheme
});

export default connect(mapStateToProps, null)(TeamTabIcon);