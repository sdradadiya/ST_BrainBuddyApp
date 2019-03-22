import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default class senderChatBubble extends React.PureComponent {

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container, {backgroundColor: appColor.scrollableViewBack}]}>
                <View style={[styles.subContainer,{backgroundColor: appColor.senderBubble}]}>
                    <Text  style={[styles.textStyle,{color: appColor.defaultFont}]}>
                        {this.props.messageText}</Text>
                </View>
                {
                    (this.props.isShowUser || this.props.index == 0) &&
                    <View style={{flexDirection:'row',alignSelf:'flex-end',marginTop:10,
                        marginBottom: (Constant.isIOS) && 7 || this.props.index === 0 && 10 || 7}}>
                        <Image resizeMode="contain"
                               source={this.props.userImage}
                               style={styles.avtarStyle}
                        />
                        <Text style={[styles.avtarText,{color: appColor.chatUsername}]}>You</Text>
                    </View>
                    || null
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    subContainer:{
        alignItems:'flex-start',
        backgroundColor:'#0b99de',
        padding:10,
        borderRadius:20
    },
    container: {
        marginTop: 3,
        marginRight:10,
        maxWidth:"75%",
        alignSelf:'flex-end',
    },
    textStyle:{
        color:"white",
        fontSize:15,
        fontFamily: Constant.font500,
        lineHeight:21
    },
    avtarStyle:{
        height: 15,
        width:15,
        marginRight:5
    },
    avtarText:{
        color:'white',
        fontSize:10,
        alignSelf:'center',
        fontFamily: Constant.font300,
    }
});