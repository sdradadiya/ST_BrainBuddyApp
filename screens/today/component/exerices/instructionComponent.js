import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Text,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import Constant from '../../../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../../../../screens/commonComponent/progressBar';
import { connect } from 'react-redux';
import AppStatusBar from '../../../commonComponent/statusBar';
import * as Animatable from 'react-native-animatable';

class InstructionComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        };
    };

    renderBenefits = (item, index) => {
        const { outerBenefit, benefitIcon, benefitDetailText } = styles;
        return(
            <View style={outerBenefit} key={index}>

                <Image source={require('../../../../assets/images/icon-flame.png')}
                       resizeMode={"contain"}
                       style={benefitIcon}/>

                <View style={{flex:1}}>
                    <Text style={benefitDetailText}>
                        {item}
                    </Text></View>
            </View>
        );
    };
//                <Animatable.View style={{flex:1}} animation="fadeIn" duration={300} delay={100}>

    render() {
        const { container, mainView, mainScroll,
            outerImg, titleText, subTitle15Text,
            textNo, outerView, btnActivity, btnFont, detailText } = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return(
            <View style={[container, {backgroundColor:this.props.backgroundColor}]}>
                <Animatable.View style={[container, {backgroundColor:this.props.backgroundColor}]}
                                 animation="fadeIn" duration={800}>
                    <AppStatusBar backColor={this.props.backgroundColor}/>
                    <View style={{flex:1}}>
                        <StatusBar hidden={false} barStyle={appColor.statusBarStyle}/>
                        <Image source={require('../../../../assets/images/background-brain-texture.png')}
                               resizeMode={"stretch"}
                               style={{width: Constant.screenWidth, height: Constant.screenHeight}}/>
                        <ScrollView style={mainScroll}
                                    contentContainerStyle={{top:this.props.safeAreaInsetsDefault.top}}
                                    showsVerticalScrollIndicator={false}>

                            <View style={[mainView,{paddingBottom: 120 + this.props.safeAreaInsetsDefault.bottom }]}>
                                <View style={outerView}>
                                    <Text style={[textNo, {color:this.props.backgroundColor}]}>
                                        {this.props.exeTopTitle}
                                    </Text>
                                </View>

                                <View  style={[outerImg, {backgroundColor:this.props.iconBack}]}>
                                    <Image source={this.props.icon}
                                           resizeMode={"contain"}
                                           style={{height: 88, width: 88}}/>
                                </View>

                                <Text style={titleText}>
                                    {this.props.heading}
                                </Text>

                                <Text style={[subTitle15Text,{fontSize:14, marginTop: 38, opacity: 0.75}]}>
                                    WHY
                                </Text>

                                <Text style={[detailText, {marginTop: 15, fontSize:16}]}>
                                    {this.props.description}
                                </Text>

                                {(this.props.isProgressBar) ?
                                    <View style={{width:'100%', alignItems: 'center'}}>
                                        <Text style={[subTitle15Text,{marginTop: 45,textAlign: 'center',
                                            marginBottom: (this.props.isProgressBar) ? 20 : 0, fontSize: 14,  opacity: 0.75}]}>
                                            {this.props.barHeading}
                                        </Text>
                                        <ProgressBar progressVal={this.props.ProgressbarPer || "4%"}
                                                     fillBarColor={'#fff'}
                                                     otherColor={ 'rgba(255,255,255,0.2)'}/>
                                    </View>
                                    : null
                                }

                                <Text style={[subTitle15Text,{fontSize: 14, marginTop: 40, marginBottom:10, opacity: 0.75}]}>
                                    BENEFITS
                                </Text>
                                {
                                    this.props.benefitsArray.map((item, index) => {
                                        return this.renderBenefits(item, index)
                                    })
                                }
                                <Text style={[subTitle15Text, {fontSize: 14,  marginTop: 10, opacity: 0.75}]}>
                                    TIPS
                                </Text>

                                <Text style={[detailText,{marginTop: 25}]}>
                                    {this.props.tips}
                                </Text>

                            </View>
                        </ScrollView>
                        <TouchableOpacity onPress={() => this.props.onCloseButtonPress()}
                                          style={[styles.backView,{top:(this.props.safeAreaInsetsDefault.top == 20) && 25
                                              || 15+this.props.safeAreaInsetsDefault.top}]}>
                            <Ionicons name='ios-close-outline'
                                      size={35}
                                      color="#FFF"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={[btnActivity,{bottom:(Constant.isIphoneX)
                            && 5+this.props.safeAreaInsetsDefault.bottom || 15+this.props.safeAreaInsetsDefault.bottom}]}
                                          onPress={() => this.props.onActivityButtonPress()}
                                          underlayColor={'rgb(5,195,249)'}
                                          disabled={!this.props.isClickable}>
                            { (this.props.isClickable) ?
                                <Text style={btnFont}>
                                    {"Begin"}
                                </Text>
                                :
                                <ActivityIndicator
                                    animating={true}
                                    color={"#FFF"}
                                    size="small"/>
                            }
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        top:0,
        left:0,
        right:0,
        bottom:0,
        position: 'absolute',
        paddingBottom: (Constant.isIOS) && 0 || 12
    },
    mainView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingTop: 35,
        paddingBottom: 120,
        width: "80%",
        alignSelf: 'center',
    },
    mainScroll: {
        flex:1,
        top:0, bottom:0,
        left:0,
        right:0,
        position:'absolute'
    },
    outerView: {
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    textNo:{
        fontFamily: Constant.font700,
        fontSize:12,
        paddingTop:5,
        paddingBottom: 5,
        paddingLeft:25,
        paddingRight:25,
    },
    outerImg: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Constant.orangeColor,
        height: 88,//Constant.screenWidth/4,
        width: 88,//Constant.screenWidth/4,
        borderRadius: 44,//Constant.screenWidth/8,
        marginTop: 22,
    },
    subTitle15Text:{
        fontSize: 15,
        fontFamily: Constant.font500,
        color: '#fff',
    },
    titleText:{
        fontSize: 24,
        fontFamily: Constant.font300,
        color: '#fff',
        marginTop: 35
    },
    backView:{
        height:60,
        width:60,
        position:'absolute',
        top:25,
        left:10,
        paddingLeft:5,
        backgroundColor:'transparent'
    },
    btnActivity:{
        backgroundColor: 'rgb(5,195,249)',
        width: '82%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        height:60,
        bottom:15,
        alignSelf:'center',
        position:'absolute',
        maxWidth:300
    },
    btnFont: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: Constant.font700,
    },
    outerBenefit: {
        flexDirection: 'row',
        //margin: 15,
        marginTop:15,
        marginBottom:25,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
    },
    benefitIcon: {
        height: 35,
        marginLeft: -10
        // width: Constant.screenWidth/10
    },
    detailText: {
        fontSize: 15,
        fontFamily: Constant.font500,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 22,
        width: "100%"
    },
    benefitDetailText:{
        fontSize: 15,
        fontFamily: Constant.font500,
        color: '#fff',
        lineHeight: 22,
        textAlign: 'left',
        paddingLeft: 3
    }

});

const mapStateToProps = state => {
    return {
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
})(InstructionComponent);