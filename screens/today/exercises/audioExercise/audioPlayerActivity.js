import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    DeviceEventEmitter,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { setRewiringPlayer } from '../../../../actions/userActions';
import { updateMetaData } from '../../../../actions/metadataActions';
import RewiringExerciseInit from './rewiringExerciseInit';
import RNAudioStreamer from 'react-native-audio-streamer';
import AudioContainer from '../../component/exerices/audioActivity/audioViewContainer';
import _ from 'lodash';
let Sound = require('react-native-sound');
import * as Animatable from 'react-native-animatable';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';

let intervalId = null;
let totalDuration = 0;

class AudioActivity extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            progressVal: 0,
            isLoading: true,
            isPlaying: false,
            isInstruction: true,
            status: "",
            params: props.navigation.state.params,
            exercise_number_audio: props.exercise_number_audio || 1,
        };
    }

    componentWillMount() {
        let exeNo = this.props.exercise_number_audio;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo -= 1;
            }
            this.setState({
                exercise_number_audio: exeNo
            });
            this.setPlayer(exeNo);
        }else{
            this.setPlayer(exeNo);
        }
        totalDuration = 0;
        this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this));
        //if(!this.props.rewiringPlay.isPlaying) {
        //this.setPlayer(exeNo);

        // }else {
        //     this.setTimer();
        //     this.setState({
        //         isLoading: false,
        //         isPlaying: this.props.rewiringPlay.isPlaying,
        //         progressVal: this.props.rewiringPlay.progressVal
        //     })
        // }
        callTodayScreenEcentListner(false);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.clearTimer();
        RNAudioStreamer.pause();
        callTodayScreenEcentListner();
        // code before change
        // this.props.setRewiringPlayer(
        //     {
        //         isPlaying: this.state.isPlaying,
        //         progressVal: this.state.progressVal
        //     }
        // );
    }

    _statusChanged (status){
        if(status == "BUFFERING" && this.state.isLoading){
        }
        if(status == "PLAYING" && this.state.isLoading){
            RNAudioStreamer.pause();
            this.setState({
                isLoading: false,
            });
        }
        if(status == "FINISHED") {
            this.onCompleteAudio();
            this.clearTimer();
            // this.props.setRewiringPlayer({
            //     isPlaying: false,
            //     progressVal: 0,
            // });
            this.setState({isPlaying: false, progressVal: 0, status: "FINISHED"});
        }else{
            this.setState({status: status});
        }
    };

    clearTimer() {
        if(intervalId) {
            clearInterval(intervalId);
        }
    }

    setTimer() {
        intervalId =  setInterval(() => {
            this.getCurrentTime()
        }, 1000);
    }

    getCurrentTime = () => {
        let audioDuration = 0;
        RNAudioStreamer.duration((err, duration) => {
            if (!err) {
                audioDuration = duration;
                totalDuration = audioDuration;
            }
        });

        RNAudioStreamer.currentTime((err, currentTime)=>{
            if(!err) {
                if(this.state.isPlaying && audioDuration > 0) {
                    let progress = parseInt((currentTime * 100)/audioDuration);
                    this.setState({ progressVal:(progress >= 98) ? 100 : progress});
                }
            }
        });
    };

    setPlayer(exNo, isFinished = false) {
        RNAudioStreamer.pause();
        let audioUrl = "https://s3.amazonaws.com/brainbuddyhostingapp/Exercises/exercise" + exNo + ".mp3";
        RNAudioStreamer.setUrl(audioUrl);
        //RNAudioStreamer.pause();
        RNAudioStreamer.play();
        this.setTimer();
        // this.setState({
        //     isLoading: false,
        // });
        if(isFinished){
            RNAudioStreamer.play();
            this.setTimer();
            this.setState({isPlaying: true});
        }
    }

    onPlayPausePressed = () => {
        if(this.state.isPlaying){
            RNAudioStreamer.pause();
            this.setState({isPlaying: false});
            this.clearTimer();
        }else {
            if(this.state.status == "FINISHED"){
                this.setPlayer(this.state.exercise_number_audio, true)
            }else{
                RNAudioStreamer.play();
                this.setTimer();
                this.setState({isPlaying: true});
            }
        }
    };

    // getTimestamp() {
    //     if(this.playbackInstance != null){
    //         let minTime = parseInt(this.playbackInstance.getDuration()/60);
    //         return minTime + ' minutes';
    //     }
    //     return '';
    // }
    getTimestamp() {
        if(totalDuration != 0){
            let minTime = Math.round(totalDuration/60);
            return minTime + ' minutes';
        }
        return '';
    }

    onCompleteAudio = () => {
        this.clearTimer();
        RNAudioStreamer.pause();
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            callTodayScreenEcentListner();
            this.props.navigation.goBack();
        }else{
            let activityNo = this.props.exercise_number_audio;
            if(activityNo >= 35){
                AsyncStorage.setItem('completedAllAudioExercises', "Completed");
                this.props.updateMetaData({audio_exercises_completed: true});
            }
            activityNo = (activityNo >= 35) ? 1 : ++activityNo;
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.props.updateMetaData({ exercise_number_audio: activityNo }, this.state.params.improve || []);
            if(this.state.params.isOptional) {
                //this.props.navigator.push(Router.getRoute("completeOptionalActivity",{title: "Audio activity complete", data: ["Wisdom"]}));
                this.props.navigation.navigate("completeOptionalActivity",{title: "Audio activity complete", data: ["Wisdom"]})
            }else{
                this.state.params.makeFadeInAnimation();
                this.props.navigation.goBack();
                callTodayScreenEcentListner();
                /*
                 if(this.state.params.isLast){
                 this.props.navigation.navigate("completeMorningRoutine");
                 }else{
                 this.props.navigation.goBack();
                 }*/
            }
        }
    };

    onBackButtonPress = () => {
        this.clearTimer();
        this.state.params.makeFadeInAnimation();
        callTodayScreenEcentListner();
        this.props.navigation.goBack();
    };

    //Instruction Page
    onCloseButtonPress = () => {
        this.clearTimer();
        this.state.params.makeFadeInAnimation();
        callTodayScreenEcentListner();
        this.props.navigation.goBack();
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        RNAudioStreamer.play();
        this.setState({ isInstruction: false, isPlaying: true });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Wisdom"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <RewiringExerciseInit
                excerciseNumber = {this.state.exercise_number_audio}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable = {!this.state.isLoading}
                per={per}
            />
        )
    };

    render() {
        const {container,cancelText,cancelView} = styles;
        return (
            <View style={container}>
                <AppStatusBar backColor='rgb(49,165,159)'/>
                <View style={container}>
                    <AudioContainer exercise_number_audio={this.state.exercise_number_audio}
                                    progressVal={this.state.progressVal}
                                    isLoading={this.state.isLoading}
                                    isPlaying={this.state.isPlaying}
                                    onPlayPausePressed={this.onPlayPausePressed}
                                    getTimestamp={this.getTimestamp()}
                                    isHideBackBtn={true}
                                    onBackButtonPress={this.onBackButtonPress}/>

                    <TouchableOpacity onPress={()=> this.onBackButtonPress()} style={cancelView}>
                        <Text style={cancelText}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    {(this.state.isInstruction) ?
                        this.renderInitComponent()
                        : null }

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: Constant.getContainer("rgb(49,165,159)"),
    cancelText:{
        paddingBottom:10,
        textAlign:'center',
        alignSelf: 'center',
        color: '#FFF',
        fontFamily: Constant.font500,
        fontSize: 15,
        opacity: 0.7,
    },
    cancelView:{
        position: 'absolute',
        top: Constant.screenHeight*0.92,
        left:0, right:0,
        alignItems:'center',
    },
});

const mapStateToProps = state => {
    return {
        rewiringPlay: state.user.rewiringPlay,
        exercise_number_audio: state.metaData.metaData.exercise_number_audio || 1,
        metaData: state.metaData.metaData,
        rewiringProgress: state.metaData.rewiringProgress,
    };
};

export default connect(mapStateToProps, {
    updateMetaData,
    setRewiringPlayer
})(AudioActivity);