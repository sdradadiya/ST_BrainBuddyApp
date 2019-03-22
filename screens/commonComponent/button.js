import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../helper/constant';

export default class Button extends Component {

    render() {
        return (
            <TouchableOpacity onPress={()=>this.props.onPress()}
                                style={[styles.btnLogin,{backgroundColor: this.props.backColor},
                                 (this.props.otherStyle) ? this.props.otherStyle: {}]}>
                <View>
                    <Text style={[styles.btnFont, {color: this.props.color},
                    (this.props.otherTextStyle) ? this.props.otherTextStyle: {}]}>
                        {this.props.title}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    btnLogin:{
        height:60,
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
        alignSelf: 'center',
        width: Constant.screenWidth - 60,
        alignItems: 'center',
        justifyContent: 'center',
        // padding:17,
        borderRadius: 35,
        // paddingTop: 22,
        // paddingBottom: 22,
        maxWidth: 300,
    },
    btnFont:{
        fontSize: 15,
        fontFamily: Constant.font500,
    }
});