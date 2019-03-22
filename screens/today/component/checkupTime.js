import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../helper/constant';
import TochableView from '../../commonComponent/touchableView';

export default  class CheckupTime extends React.PureComponent {

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return(
            <TochableView onPress={()=>this.props.onPress()}
                          pressInColor={appColor.cardSubSection}
                          backColor={appColor.cardBack}
                          style={[{borderRadius:5,marginLeft: 20,marginRight: 20,marginTop: 10},
                              Constant.screenWidth>600 && {maxWidth: 600, width:'100%', alignSelf:'center'}]}>
                <View  style={[styles.outerView]}>
                    <View style={ styles.imageView } >
                        <Image source={require('../../../assets/images/card-icon-checkup.png')}
                               style={ styles.iconImage }
                               resizeMode={"contain"}/>
                    </View>
                    <View style={ styles.outerTextView }>
                        <Text style={[styles.titleText, {color: appColor.defaultFont }]}>
                            {this.props.message}
                        </Text>
                    </View>
                </View>
            </TochableView>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        flexDirection:'row',
        borderRadius: 5,
        height:58,
    },
    iconImage:{
        height:58,
        width:60,
    },
    outerTextView:{
        justifyContent:'center',
        flex:1,
        paddingLeft: 15
    },
    titleText:{
        fontSize: 15,
        fontFamily: Constant.font500,
    },
});