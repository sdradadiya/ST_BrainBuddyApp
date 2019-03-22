import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    NativeEventEmitter,
    NativeModules,
    StatusBar
} from 'react-native';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import Constant from '../../../../helper/constant';
import VisualizationInit from './visualizationInit';
let customVideoPlayer = require('NativeModules').customVideoPlayer;
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import {NavigationActions} from 'react-navigation';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
let isAlreadyClicked = false;
let isClosePress = false;

const visulizationURL = [
    "https://player.vimeo.com/external/253886611.sd.mp4?s=9b27bef92807ddcead7114c3f931d1506256485e&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886632.sd.mp4?s=ff7ea39e7ede21c0c6b00b18053d5c2dc3e7a49f&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887169.sd.mp4?s=8e1b71911de751a7a815275e01b479964db50299&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887445.sd.mp4?s=842bb8e497cb7bf35e27f10d762c7ee4473db668&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886654.sd.mp4?s=d22c6bfc92ae098a460b4e877542e101b1fe85a3&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886681.sd.mp4?s=0dfb535d6f14aefbb850bee341c29e5234bb3747&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886614.sd.mp4?s=56e41b18fd341f3e8fa19b6ef75c6bff3a4c532a&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887185.sd.mp4?s=2815730ee78c615bc1be1711d16f4aa02f050d67&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886665.sd.mp4?s=72e67b81a314a1dcea7880ed838343fc68e39fb6&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887466.sd.mp4?s=26cd39a9a231ad3e874f9e49b26ed2f51064b391&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887193.sd.mp4?s=ebcd04fb004c7dc170539641d6b9b452c5c584fb&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886693.sd.mp4?s=407bf916b12c4339ac6f1630e67adb6020b79c86&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887205.sd.mp4?s=cf39f84b1bb1a041211a78d5f617c2229e5bc6e5&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886741.sd.mp4?s=04f0af98736dbef8d49e5b22dee5a57c4b2c0fd9&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886764.sd.mp4?s=d864cd7942a58d3bb711a33fe0c1b267a2eebc0c&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887226.sd.mp4?s=f2ed2f864f793f5019319f23262dc50189eed58c&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886797.sd.mp4?s=7d8f3a5aa3bf85e46a3bc6c88ff70a3d62c66c0d&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886711.sd.mp4?s=9de93ec2d0b33bc30ba143f05c69fd738336c6a9&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886723.sd.mp4?s=bd16acc49f44308313d89aeb1572183465dc65e0&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886786.sd.mp4?s=de0dbdc1eb2f07b35be6c72f05a7e47bc67d4812&profile_id=165&download=1",
];
// const visulizationURL = [
//     "https://player.vimeo.com/external/245280376.sd.mp4?s=b6492e2137aae815099b9dcae0b7a91a7200a30c&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280413.sd.mp4?s=a3272920d776b931bb869c151d14de9defbb1cb1&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245281430.sd.mp4?s=2df93305dfc5d1cc184350b23d381053198f18fa&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280468.sd.mp4?s=e0132141c9a015673379d50aca5600b7e63782de&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245282530.sd.mp4?s=0828de916dbc6c6127ca48382360e70df00492a5&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280377.sd.mp4?s=a0dc736f9918ee022d6065a673a0b430bfcfded9&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280524.sd.mp4?s=090861de2c6c79a3b75d5d280d41680b230a6586&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245281465.sd.mp4?s=f061f0aeecc7976750755968a173be272fb4fd9b&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245281502.sd.mp4?s=cb64d29985ac10dcb162a3712cadc8bcd9461491&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280542.sd.mp4?s=e474e37848bfeeca6a547bb48b22ba106cf5c402&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280561.sd.mp4?s=36534837d4c10696e72aa4b734dd10780681f432&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245281526.sd.mp4?s=2cc42d3d88c9242522bb40becfa4c9a3cfebd7a6&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280597.sd.mp4?s=809facaab43548c38484b97a6ad86571e3e799f6&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245281547.sd.mp4?s=b8151c9317f7c0c07c5d4564b5901badcba86b2c&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245281547.sd.mp4?s=b8151c9317f7c0c07c5d4564b5901badcba86b2c&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280492.sd.mp4?s=94189839d2a18835ee563cf1cae0a11b9dc63da1&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280626.sd.mp4?s=924d4d2c29f670d32b45ba706cefc2999f70aa14&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280680.sd.mp4?s=3d7c0ae46462824f7a0e8fff779c5fbdb7c90aa4&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280583.sd.mp4?s=78b2aee984370f5b5ecdb553141b9c0285c8571f&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245281445.sd.mp4?s=0272df0c2c364275435b84a7f48f71d18d609b7c&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280451.sd.mp4?s=d239b93a83a06359b27ceafda29cfcf9b176a150&profile_id=165&download=1",
//     "https://player.vimeo.com/external/245280709.sd.mp4?s=ec69be8dfe4abd090060724fcb288e2b512825ff&profile_id=165&download=1"
// ];

class VisulizationActivity extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state= {
            exercise_number_visualization: props.exercise_number_visualization,
            params: props.navigation.state.params,
            isShowing: true
        }
    }

    componentDidMount(){
        callTodayScreenEcentListner(false);
        isAlreadyClicked = false;
        isClosePress = false;
    }

    componentWillMount() {
        StatusBar.setHidden(false);
        let exeNo = this.props.exercise_number_visualization;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1) {
                exeNo -= 1;
            }
            this.setState({
                exercise_number_visualization: exeNo
            });
        }
        //let url = "https://s3.amazonaws.com/brainbuddyhostingapp/Imagine/imagine-"+ exeNo +".mp4";
        // let url = "https://s3.amazonaws.com/brainbuddyhostingapp/Imagine-React/imagine-"+ exeNo +".mp4";
        let url = visulizationURL[0];
        if(exeNo <= 20){
            let index = exeNo - 1;
            url = visulizationURL[index];
        }
        customVideoPlayer.showVideoPlayer(url);
        // customVideoPlayer.showVideoPlayer("https://s3.amazonaws.com/brainbuddyhostingapp/Imagine-React/imagine-1.mp4");
        const playerStatus = new NativeEventEmitter(customVideoPlayer);
        this.eventListener = playerStatus.addListener('sayHello', (data) => {
            if(data === 'Ready'){
                setTimeout(() => {
                    this.setState({
                        isBuffering:true
                    })
                },3000)
            }else if(data === 'Finish'){
                if(this.eventListener){
                    this.eventListener.remove();
                }
                this.onCompleteVideo();
            }else if(data === 'DonePress'){
                // customVideoPlayer.killPlayerInstance();
                //this.props.navigation.goBack();

                if(this.eventListener){
                    this.eventListener.remove();
                }
                //this.props.navigation.navigate("today",{isFadeToday: true})
                callTodayScreenEcentListner();
                // this.props.navigation.dispatch(NavigationActions.reset({
                //     index: 0,
                //     actions: [
                //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
                //     ]
                // }));
                this.props.navigation.popToTop();
            }
        });
    }

    state = {
        paused: false,
        isBuffering: false,
    };

    onCompleteVideo = () => {
        // customVideoPlayer.killPlayerInstance();
        StatusBar.setHidden(false);
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            callTodayScreenEcentListner();
            this.props.navigation.goBack();
            //this.props.navigation.navigate("today");
        }else{
            this.state.params.setDoneMorningRoutine(this.state.params.pageName);
            let activityNo = this.props.exercise_number_visualization;
            activityNo = (activityNo >= 20) ? 1 : ++activityNo;
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.props.updateMetaData({ exercise_number_visualization: activityNo }, this.state.params.improve || []);

            if(this.state.params.isLast){
                this.props.navigation.navigate("completeMorningRoutine");
            }else{
                // this.props.navigation.goBack();
                this.manageMorningRoutine();
            }
        }
    };

    manageMorningRoutine = () => {
        try{
            let morningRoutine = this.props.morningRoutine;
            let obj = _.find(morningRoutine, {pageName: this.state.params.pageName});
            let nextIndex = morningRoutine.indexOf(obj) + 1;

            let length = morningRoutine.length;
            let introTitle= (nextIndex + 1) + " of " + length;

            let isLast = (morningRoutine.length - 1 == nextIndex);
            this.props.navigation.navigate(morningRoutine[nextIndex].pageName,
                {
                    pageName: morningRoutine[nextIndex].pageName,
                    setDoneMorningRoutine: this.state.params.setDoneMorningRoutine,
                    isLast: isLast,
                    isOptional: false,
                    improve: morningRoutine[nextIndex].improve,
                    onCompleteExercises: this.state.params.onCompleteExercises,
                    makeFadeInAnimation: this.state.params.makeFadeInAnimation,
                    isReplay: false,
                    introTitle: introTitle,
                    scrollToTopToday: this.state.params.scrollToTopToday,
                });
        }catch (e){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.popToTop();
            callTodayScreenEcentListner();
        }
    };

    //Instruction Page+
    onCloseButtonPress = () => {
        if(!isClosePress){
            isClosePress = true;
            //this.eventListener.remove();
            if(this.eventListener){
                this.eventListener.remove();
            }
            customVideoPlayer.killPlayerInstance();
            //this.props.navigation.navigate("today",{isFadeToday: true})
            callTodayScreenEcentListner();
            // this.props.navigation.dispatch(NavigationActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
            //     ]
            // }));
            this.props.navigation.popToTop();
        }
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        if(!isAlreadyClicked){
            customVideoPlayer.PlayVideo();
            isAlreadyClicked = true;
        }
        //this.setState({ isInstruction: false, paused: false });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Dopamine"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <VisualizationInit
                introTitle={(this.state.params.introTitle != undefined) && this.state.params.introTitle || ""}
                excerciseNumber = {this.state.exercise_number_visualization}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable={this.state.isBuffering}
                per={per}
            />
        )
    };

    renderCustomSkin() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} barStyle="light-content"/>
                <View style={styles.container}>
                    {
                        this.renderInitComponent()
                    }
                </View>
            </View>
        );
    }

    render() {
        return  this.renderCustomSkin();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'rgb(241,86,129)',
    },
});

const mapStateToProps = state => {
    return {
        exercise_number_visualization: state.metaData.metaData.exercise_number_visualization || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        morningRoutine: state.metaData.morningRoutine,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(VisulizationActivity);