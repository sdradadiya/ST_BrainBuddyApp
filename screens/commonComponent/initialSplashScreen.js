import React, { Component } from 'react';
import { ActivityIndicator,
    View, Image, StatusBar }
    from 'react-native';
import Constant from '../../helper/constant';

export default class InitialScreen extends React.PureComponent{

    render(){
        return(
            <View style={{ position:'absolute', backgroundColor: '#01536d',
                    height: Constant.screenHeight, width:Constant.screenWidth,
                    alignItems:'center'}}>
                <StatusBar
                    hidden={false}
                    barStyle="light-content"
                    backgroundColor={Constant.backColor}/>
                <Image source={Constant.isiPAD && require('../../assets/images/initImg~ipad.png') || require('../../assets/images/initImg.png')}
                       style={{height:Constant.screenHeight, width:Constant.screenWidth}}/>
                <View style={{backgroundColor:'transparent', position:'absolute',
                 top: Constant.screenHeight*0.92}}>
                    <ActivityIndicator
                        animating={true}
                        size="small"
                        color={"#FFF"}/>
                </View>
            </View>
        );
    }
}