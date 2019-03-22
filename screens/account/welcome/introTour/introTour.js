import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    AsyncStorage,
    ScrollView,
    BackHandler
} from 'react-native';
import {connect} from 'react-redux'
import TourSSComponent from '../components/introTour/introTourSSComponent';
import CompleteComponent from '../components/introTour/CompleteComponent';
import {NavigationActions, StackActions} from 'react-navigation';
import SliderDotComponent from '../components/slider/sliderDotComponent';
import Constant from "../../../../helper/constant";
import AppStatusBar from '../../../commonComponent/statusBar';

const imagesSS = {
    image1_1: require('../../../../assets/images/intro_tour/tour-1.png'),
    image1_2: require('../../../../assets/images/intro_tour/tour-2.png'),
    image1_3: require('../../../../assets/images/intro_tour/tour-3.png'),
    image1_4: require('../../../../assets/images/intro_tour/tour-4.png'),
    image1_5: require('../../../../assets/images/intro_tour/tour-5.png'),
    image1_6: require('../../../../assets/images/intro_tour/tour-6.png'),
    image1_7: require('../../../../assets/images/intro_tour/tour-7.png'),
    image1_8: require('../../../../assets/images/intro_tour/tour-8.png'),
    image1_9: require('../../../../assets/images/intro_tour/tour-9.png'),
    image1_10: require('../../../../assets/images/intro_tour/tour-10.png'),
};

class IntroTour extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isLast: false,
            pageNo: 0,
            selectedIndex: 0,
        };
        this.currentVisiblePageNo = 0;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    _handleBackPress = () => {
        return true;
    };

    onIndexChanged = (index) => {
        if(index === 9) {
            this.setState({isLast: true});
        }
    };

    onGetStartPress = () => {
        AsyncStorage.setItem("isWelcomeFlowCompleted",'true');
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'rootTabNavigation', params: {transition: "myCustomTransition"}})],
        }));
    };

    setPagination = (pageNo) => {
            this.setState({isLast: pageNo === 9, selectedIndex: pageNo});
    }

    render() {
        let checkupTime = (this.props.navigation.state.params) && this.props.navigation.state.params.checkupTime || "";
        return (
            <View style={[styles.container,{paddingBottom:this.props.safeAreaInsetsData.bottom}]}>
                <AppStatusBar backColor={"#fbb043"}/>
                <Animated.ScrollView
                    ref={"mainScrollView"}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={9}
                    onScroll={ x => {
                        let contentOffset = x.nativeEvent.contentOffset;
                        let viewSize = x.nativeEvent.layoutMeasurement;
                        let pageNo = 0;
                        pageNo = Math.floor(contentOffset.x / viewSize.width);
                        if(this.currentVisiblePageNo !== pageNo && pageNo >= 0) {
                            this.setPagination(pageNo);
                        }
                        this.currentVisiblePageNo = pageNo;
                    }}
                    horizontal
                    pagingEnabled
                    style={[styles.scrollView]}>

                    <TourSSComponent screenShots={imagesSS.image1_1}
                                     description="Welcome to Brainbuddy! Here are a few tips to get you started."/>

                    <TourSSComponent screenShots={imagesSS.image1_2}
                                     description={"Today screen exercises help you avoid triggers and rewire your brain."}/>

                    <TourSSComponent screenShots={imagesSS.image1_3}
                                     description="Your exercises become more personalised as Brainbuddy gets to know you."/>

                    <TourSSComponent screenShots={imagesSS.image1_4}
                                     description={"You can customise these exercises from the settings menu."}/>

                    <TourSSComponent screenShots={imagesSS.image1_5}
                                     description="Take a minute to complete your checkup each evening."/>

                    <TourSSComponent screenShots={imagesSS.image1_6}
                                     description="When you report a clean day, your streak will update at midnight."/>

                    <TourSSComponent screenShots={imagesSS.image1_7}
                                     description="If you need to add clean or relapse days manually, visit the settings menu."/>

                    <TourSSComponent screenShots={imagesSS.image1_8}
                                     description="Total clean days are more important than your streak length. Every clean day rewires your brain."/>

                    <TourSSComponent screenShots={imagesSS.image1_9}
                                     description="Missed a checkup? You can complete it the next morning."/>

                    <CompleteComponent onGetStartPress={this.onGetStartPress} isLast={this.state.isLast}/>
                </Animated.ScrollView>

                <View style={{position:'absolute',bottom:this.props.safeAreaInsetsData.bottom,left:0, right:0, top:'95%'}}>
                    <SliderDotComponent noOfPages={10}
                                        selectedIndex={this.state.selectedIndex}
                                        activeDotColor={"white"}
                                        otherDotsColor={"rgba(255,225,225,0.5)"}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#fbb043',
    },
    scrollViewscrollView: {
        flexDirection: "row",
        width:Constant.screenWidth,
        height:Constant.screenHeight,
        backgroundColor:'transparent'
    },

});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
    };
};

export default connect(mapStateToProps, {
})(IntroTour);