import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import TopCircleComponent from './topAnimatedComponent1';
import * as Animatable from 'react-native-animatable';

export default  class Slider4 extends React.PureComponent {

    componentWillMount(){
        // this.image1 =
    }

    componentDidMount(){
        this.refs.nightSky.fadeIn(500)
    }
    render() {
        return (
            <Animated.View style={[styles.container,{opacity: this.props.viewOpacity}]}>
                <Animatable.Image source={require('../../../../../../assets/images/intro_slider/intro-night-sky.png')}
                                  style={{height:Constant.fullScreenHeight, width: Constant.screenWidth}}
                                  ref='nightSky'/>
                <View style={{height:'78%', width:'100%',alignItems:'center',backgroundColor:'transparent', paddingTop: Constant.fullScreenHeight*0.26, position:'absolute'}}>
                    <TopCircleComponent bubbleText="It's time for your checkup!"/>
                </View>
                <View style={{top:Constant.fullScreenHeight*0.78,left:0,bottom:0, backgroundColor: 'transparent', alignItems:'center', position:'absolute'}}/>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:Constant.screenWidth,
        height:Constant.fullScreenHeight,
        alignItems:'center',
        backgroundColor: 'transparent'
    }
});