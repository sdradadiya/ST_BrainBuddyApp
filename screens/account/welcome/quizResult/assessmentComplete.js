import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    BackHandler
} from 'react-native';
import Constant from '../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

import QuestionProgressBar from '../components/quiz/questionProgressBar'


export default  class AssessmentComplete extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            isResultShowing:false
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        this.refs.mainView.fadeIn(400);
        setTimeout(()=>{
            this.refs.viewText.fadeOut(500);
            setTimeout(()=>{
                this.setState({isResultShowing:true})
            }, 500)
        }, 1500)
    }

    _handleBackPress = () => {
        return true;
    };

    navigateToResult = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.props.navigation.navigate('result', {resultNumber: this.props.navigation.state.params.resultNumber});
    };

    render() {
        return (
            <View style={{flex:1, backgroundColor: '#01536d'}}>
                <Animatable.View style={styles.container} ref="mainView">
                    <View  style={{paddingTop:(Constant.screenHeight*24)/100,alignItems:'center'}}>
                        <Animatable.Image style={{height:Constant.screenWidth/2.5,width:Constant.screenWidth/2.5,alignItems:'center'}}
                               animation="zoomIn"
                               resizeMode={'contain'} source={require('../../../../assets/images/checkup/large-tick-icon.png')}/>
                    </View>
                    {(!this.state.isResultShowing) ?
                        <View style={styles.bottomText}>
                            <Animatable.View animation="slideInUp"
                                             style={{alignItems:'center'}}
                                             ref="viewText">
                                <Text style={styles.titleText}>Assessment complete</Text>
                            </Animatable.View>
                        </View>:

                        <View style={styles.bottomText}>
                            <Text style={styles.titleText}>Preparing results</Text>
                            <View style={{top:0, left:0, right:0, bottom:0, position:'absolute',
                         paddingTop: (Constant.screenHeight*66)/100, alignItems:'center'}}>
                                <QuestionProgressBar navigateToResult={this.navigateToResult} {...this.props}/>
                            </View>
                        </View>
                    }
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#01536d',
    },
    titleText:{
        fontSize: 17,//25
        color: 'white',
        fontFamily: Constant.font500,
    },
    bottomText: {top:0,
        left:0,
        right:0,
        bottom:0,
        position:'absolute',
        paddingTop: Constant.screenHeight*0.59,
        alignSelf:'center',
        alignItems: 'center'
    },
});