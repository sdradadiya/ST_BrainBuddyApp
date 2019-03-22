import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class SliderComponent extends React.PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <View style={{marginTop:Constant.fullScreenHeight/10,width:'100%',height:Constant.fullScreenHeight*0.78, backgroundColor: 'transparent'}}
                      ref='introImage'/>
                <View style={{top: Constant.isIOS && Constant.screenHeight*0.78 || Constant.fullScreenHeight*0.75,width:'80%',bottom:0, alignItems:'center', position:'absolute',backgroundColor: 'transparent'}}>
                        <Text style={{color:'#FFF',fontSize:16,textAlign:'center',fontFamily: Constant.font500, lineHeight: 21}}>
                            {this.props.description}
                        </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:Constant.screenWidth,
        height:Constant.fullScreenHeight+10,
        alignItems:'center',
        backgroundColor: 'transparent'
    }
});