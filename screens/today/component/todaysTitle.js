import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../helper/constant';
import ProgressBar from '../../commonComponent/progressBar';

export default  class TodayTitle extends React.PureComponent {

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // }

    render() {
        let appColor = Constant[this.props.appTheme];
        let goalDays = (this.props.goalDays === 1) ? "24 hours clean"
            : this.props.goalDays + " days clean";
        return (
            <View style={[styles.container, {backgroundColor: appColor.appBackground}]}>
                <View style={styles.titleView}>
                    <Text style={[styles.titleText, {color: appColor.defaultFont}]}>
                        {/*{"Streak goal " + this.props.heading}*/}
                        {"Your streak goal - " + goalDays}
                    </Text>
                </View>
                <View style={{paddingLeft:40,paddingTop:12,paddingBottom:22,paddingRight:40}}>
                    <View style={{maxWidth:400,alignSelf:'center', width:'100%'}}>
                    <ProgressBar otherColor={appColor.pogressBarOtherColor}
                                 progressVal={this.props.progress}
                                 fillBarColor={Constant.lightBlueColor}
                    isToday={true}/>
                    </View>
                    <Text style={[styles.titleStyle, {color: appColor.topTodayRemainig}]}>
                        {(this.props.remaining_days.toString().includes("midnight")) &&
                        this.props.remaining_days || "Current streak - " + this.props.remaining_days}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:Constant.backColor,
        paddingTop: 6,
        paddingBottom: 6
    },
    titleStyle:{
        fontSize:13,
        paddingTop:12,
        alignSelf:'center',
        fontFamily: Constant.font500,
    },
    titleView:{
        padding:0,
        justifyContent:'center',
        alignItems:'center',
    },
    titleText:{
        color: '#FFFFFF',
        fontSize: 14,
        alignSelf:'center',
        fontFamily: Constant.font500,
    },
    outerView:{
        alignSelf:'center',
        justifyContent:'center',
        height:Constant.screenWidth/4,
        width:Constant.screenWidth/4,
        borderRadius:Constant.screenWidth/5,
        backgroundColor:Constant.backColor2
    },
});