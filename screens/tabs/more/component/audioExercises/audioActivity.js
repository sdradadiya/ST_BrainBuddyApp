import React, { Component } from 'react';
import {
    BackHandler,
    DeviceEventEmitter
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constant from '../../../../../helper/constant';
import { connect } from 'react-redux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RNAudioStreamer from 'react-native-audio-streamer';
import AudioContainer from '../../../../today/component/exerices/audioActivity/audioViewContainer';
import {removeSafeArea} from "../../../../../actions/userActions";

let Sound = require('react-native-sound');
let intervalId = null;
let totalDuration = 0;

class AudioActivity extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            progressVal: 0,
            isPlaying: false,
            intervalId: null,
            isLoading: true,
            status: ""
        };
    }

    componentWillMount() {
        totalDuration = 0;
        this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this));
        this.setPlayer();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount() {
        RNAudioStreamer.pause();
        this.clearTimer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    _statusChanged (status){
        if(status == "PLAYING" && this.state.isLoading){
            setTimeout(()=>{
                this.setState({
                    isLoading: false,
                    isPlaying: true,
                });
            },2000);
        }
        if(status == "FINISHED") {
            this.clearTimer();
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

    setPlayer(isFinished = false) {
        RNAudioStreamer.pause();
        let audioUrl = "https://s3.amazonaws.com/brainbuddyhostingapp/Exercises/exercise" +
            this.props.navigation.state.params.exercise_number_audio + ".mp3";
        RNAudioStreamer.setUrl(audioUrl);
        RNAudioStreamer.play();
        this.setTimer();
        // this.setState({
        //     isPlaying: true,
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
                this.setPlayer(true)
            }else{
                RNAudioStreamer.play();
                this.setTimer();
                this.setState({isPlaying: true});
            }

        }
    };

    getTimestamp() {
        if(totalDuration != 0){
            let minTime = Math.round(totalDuration/60);
            return minTime + ' minutes';
        }
        return '';
    }

    onCompleteAudio = () => {
        this.props.navigation.goBack();
    };

    //Instruction Page
    onCloseButtonPress = () => {
        this.props.navigation.goBack();
    };

    onActivityButtonPress = () => {
        RNAudioStreamer.play();
        this.setState({ isInstruction: false, isPlaying: true });
    };

    onBackButtonPress = () => {
        //this.props.removeSafeArea(true);
        this.props.navigation.goBack();
    };

    render() {
        return (
            <AudioContainer exercise_number_audio={this.props.navigation.state.params.exercise_number_audio}
                            progressVal={this.state.progressVal}
                            isLoading={this.state.isLoading}
                            isPlaying={this.state.isPlaying}
                            onPlayPausePressed={this.onPlayPausePressed}
                            getTimestamp={this.getTimestamp()}
                            top={this.props.safeAreaInsetsDefault.top}
                            bottom={this.props.safeAreaInsetsDefault.bottom}
                            appTheme={this.props.appTheme}
                            onBackButtonPress={this.onBackButtonPress}
            />
        );
    }
}
const mapStateToProps = state => {
    return {
        safeAreaInsetsDefault:state.user.safeAreaInsetsDefault,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    removeSafeArea
})(AudioActivity);
