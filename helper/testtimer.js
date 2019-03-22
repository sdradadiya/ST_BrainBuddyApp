/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    PushNotificationIOS,
    View,DeviceEventEmitter
} from 'react-native';

let justSomeNumber = 0;

let globalTimer = null

export default class App extends React.PureComponent<{}> {


    constructor() {
        super();

    }

    AdjustingInterval (workFunc, interval, errorFunc)  {
        let that = this;
        let expected, timeout;
        this.interval = interval;

        this.start = function() {
            expected = Date.now() + this.interval;
            timeout = setTimeout(step, this.interval);
            console.log("---created---"+timeout)
        };
        this.stop = function() {
            console.log("---stopped---"+timeout);
            clearTimeout(timeout);
        };
        function step() {
            let drift = Date.now() - expected;
            if (drift > that.interval) {
                // You could have some default stuff here too...
                if (errorFunc) errorFunc();
            }
            workFunc();
            expected += that.interval;
            timeout = setTimeout(step, Math.max(0, that.interval-drift));
        }
    }

    componentDidMount(){
        this.ticker = new this.AdjustingInterval(this.doWork, 1000, this.doError);
        this.ticker.start();
    }

    doError = () => {
        console.warn('The drift exceeded the interval.');
    };

    doWork = () => {
        if(justSomeNumber == 8){
            setTimeout(()=>{
                this.ticker.stop();
            },1000)
        }
        let minute = Math.floor(justSomeNumber/60);
        console.log(++justSomeNumber +"------"+ new Date().getSeconds()+"*----------*"+minute);
    };

    componentWillMount(){

    }

    render() {
        return (
            <View>
            </View>
        );
    }
}


/*
 import React, { Component } from 'react';
 import {
 Text,
 StyleSheet,
 View,
 ScrollView,
 Image,
 TouchableHighlight,
 } from 'react-native';
 import Constant from '../../../../helper/constant';
 import { AnimatedCircularProgress } from 'react-native-circular-progress';
 import { connect } from 'react-redux';
 // import PercentageCircle from 'react-native-percentage-circle';
 import { getAvatarImage } from '../../../../helper/appHelper';
 let ImagePicker = require('react-native-image-picker');

 class UserProgress extends React.PureComponent {

 constructor(props){
 super(props);
 // this.state={
 //     userImage: (props.gender==='male' ||
 //     props.gender === 'transgender_male')
 //         ?require("../../../../assets/images/avatar-male.png"):require("../../../../assets/images/avatar-female.png"),
 //     profileImage: null
 // }
 }

 componentWillReceiveProps(nextProps){
 // this.setState({
 //     userImage: (nextProps.gender==='male' ||
 //     nextProps.gender === 'transgender_male')?
 //         require("../../../../assets/images/avatar-male.png"):require("../../../../assets/images/avatar-female.png"),
 // })
 }

 onSelectImage = () => {
 // let options = {
 //     quality: 0.2,
 //     noData: true,
 // };
 // ImagePicker.showImagePicker(options, (response) => {
 //     if (response.didCancel) {
 //         console.log('User cancelled image picker');
 //     }
 //     else if (response.error) {
 //         console.log('ImagePicker Error: ', response.error);
 //     }
 //     else if (response.customButton) {
 //         console.log('User tapped custom button: ', response.customButton);
 //     }
 //     else {
 //         let source = { uri: response.uri };
 //         this.setState({
 //             userImage: source,
 //             profileImage: response
 //         });
 //     }
 // });
 };

 getAvatarImage = () => {
 return getAvatarImage(this.props.avatar_id, this.props.gender);
 };

 render() {
 const { points, profileNameStyle, otherText } = styles;
 return (
 <View style={{alignItems:'center', paddingTop: 50,backgroundColor:Constant.backColor}}>
 <AnimatedCircularProgress style={{transform: [{ rotate: '270deg'}],
 alignItems:'center',alignSelf:'center'}}
 size={116}
 width={8}
 fill={this.props.circularPercentage}
 linecap={"false"}
 tintColor="rgb(156,239,147)"
 backgroundColor="#00536e">
 {
 (fill) => (
 <View style={{ justifyContent: 'center', alignItems: 'center',
 top:0, left:0, right:0, bottom:0,position: 'absolute',}}>
 <View style={{position: 'absolute',
 alignSelf:'center'}}>
 <TouchableHighlight onPress={()=>this.onSelectImage()}
 underlayColor={Constant.transparent}>
 <Image resizeMode="cover"
 style={{height:84,
 width:84,
 borderRadius:42,
 alignSelf:'center',
 transform: [{ rotate: '90deg', }]
 }}
 source={this.getAvatarImage()}
 />
 </TouchableHighlight>
 </View>
 </View>

 )
 }
 </AnimatedCircularProgress>
 <Text style={profileNameStyle}>{this.props.profileName}</Text>
 <Text style={otherText}>Your brain is {this.props.percentage.toString()}% rewired</Text>
 </View>

 );
 }

 }

 const styles = StyleSheet.create({
 profileNameStyle: {
 color:'#FFF',
 fontSize:15,
 marginTop: 15,
 fontFamily: Constant.font500,
 },
 points: {
 backgroundColor: 'black',
 position: 'absolute',
 top: 10,left:10,right:10,
 height:100,
 width:100,
 alignSelf:'center',
 alignItems:'center'
 },
 otherText:{
 color:"rgb(184,198,205)",
 fontSize:13,
 marginTop: 5,
 fontFamily: Constant.font500,
 }

 });

 const mapStateToProps = state => {
 return {

 gender:state.user.userDetails.gender,

 };
 };

 export default connect(mapStateToProps, {

 })(UserProgress);
*/