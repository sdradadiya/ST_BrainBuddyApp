import React, { Component } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image
} from "react-native";
import Constant from '../../../../helper/constant';
import SliderPageComponent from '../components/slider/sliderComponent';
import TitleSlider from '../components/slider/titleSliderComponent'
import {connect } from 'react-redux'
import SliderDotComponent from '../components/slider/sliderDotComponent';
import LastSliderComponent from '../components/slider/lastSliderComponent';
import * as Animatable from 'react-native-animatable';

import SliderImage from '../components/slider/subComponent/sliderImage';
import TitleText from '../components/slider/subComponent/titleTextComponent';
import Slider1 from '../components/slider/subComponent/slider1';
import Slider2 from '../components/slider/subComponent/slider2';
import Slider3 from '../components/slider/subComponent/slider3';
import Slider4 from '../components/slider/subComponent/slider4';
import Slider5 from '../components/slider/subComponent/slider5';
import Slider6 from '../components/slider/subComponent/slider6';
import Slider7 from '../components/slider/subComponent/slider7';
import Slider8 from '../components/slider/subComponent/slider8';
import AppStatusBar from "../../../commonComponent/statusBar";

const xOffset = new Animated.Value(0);

const topImages = {
    "1":require('../../../../assets/images/images_intro/image-1.png'),
    "2":require('../../../../assets/images/images_intro/image-2.png'),
    "3":require('../../../../assets/images/images_intro/image-3.png'),
    "4":require('../../../../assets/images/images_intro/image-4.png'),
    "5":require('../../../../assets/images/images_intro/image-5.png'),
    "7":require('../../../../assets/images/images_intro/image-6.png'),
    "8":require('../../../../assets/images/images_intro/image-7.png'),
    "9":require('../../../../assets/images/images_intro/image-8.png'),
    "10":require('../../../../assets/images/images_intro/image-9.png'),
    "11":require('../../../../assets/images/images_intro/image-10.png'),
    "13":require('../../../../assets/images/images_intro/image-11.png'),
    "14":require('../../../../assets/images/images_intro/image-12.png'),

    "0":"",
    "6":"",
    "12":"",
    "15":"",
    "16":"",
    "17":"",
    "18":"",
    "19":"",
    "20":"",
    "21":"",
    "22":"",
    "23":"",
    "24":"",
};

let arrTransparent = ['white', 'white','white' ];
const colorArray = [['rgb(236, 59, 41)', 'rgb(236, 59, 41)','white' ],arrTransparent, arrTransparent, arrTransparent, arrTransparent, ['white', 'white','rgb(236, 59, 41)' ],
    ['rgb(236, 59, 41)', 'rgb(236, 59, 41)','white' ],arrTransparent, arrTransparent, arrTransparent, arrTransparent, ['white', 'white','rgb(5, 195, 249)' ],
    ['rgb(5, 195, 249)', 'rgb(5, 195, 249)','white' ],arrTransparent, ['white', 'white','rgb(91, 196, 189)' ],

    ['rgb(91, 196, 189)', 'rgb(91, 196, 189)','rgb(1, 83, 109)' ],

    ['rgb(1, 83, 109)', 'rgb(1, 83, 109)','rgb(249, 175, 78)'],

    ['rgb(249, 175, 78)', 'rgb(249, 175, 78)','rgb(1, 83, 109)'],

    ['rgb(1, 83, 109)', 'rgb(1, 83, 109)','rgb(6,1,34)'],

    ['rgb(6,1,34)', 'rgb(6,1,34)','rgb(228, 65, 26)'],

    ['rgb(228, 65, 26)', 'rgb(228, 65, 26)','rgb(1, 83, 109)'],
    ['rgb(1, 83, 109)', 'rgb(1, 83, 109)','rgb(1, 83, 109)'],
    ['rgb(1, 83, 109)', 'rgb(1, 83, 109)','rgb(251, 176, 67)'],
    ['rgb(251, 176, 67)', 'rgb(251, 176, 67)','rgb(251, 176, 67)'],
    ['rgb(251, 176, 67)', 'rgb(251, 176, 67)','rgb(251, 176, 67)'],
    ['rgb(251, 176, 67)', 'rgb(251, 176, 67)','rgb(251, 176, 67)'],
];

let maxOffset = 0;

class IntroSlider extends React.PureComponent {

    constructor(props){
        super(props);
        this.currentVisiblePageNo = 0;
        this.state = {
            pageNo: 0,
            counter:5,
            noOfPages: 5,
            selectedIndex: 0,
            activeDotColor:'#fa2036',
            otherDotColor: "rgb(220, 220, 220)",
        };
    }

    setPagination = (pageNum) => {
        // this.setImage(pageNum);
        let activeDotColor = "#fa2036";
        let otherDotColor = 'rgb(220, 220, 220)';
        if(pageNum>=12) {
            if (pageNum <= 15 && pageNum >= 12) {
                activeDotColor = '#05c3f9';
            }else{
                activeDotColor = '#FFF';
                otherDotColor = "rgba(255,255,255,0.5)"
            }
        }
        if(pageNum === 0 || pageNum === 6 || pageNum === 12 || pageNum === 15) { //5  5 2  7
            this.setState({
                noOfPages: (pageNum===0 || pageNum === 6) ? 5 : (pageNum === 12) ? 2 : 7,
                selectedIndex: -1,
                activeDotColor: activeDotColor,
                pageNo: pageNum
            });
        }else{
            let selectedIndex = 0;
            if(pageNum === 1 || pageNum === 7 || pageNum === 13 || pageNum === 16){
                selectedIndex = 0;
            }else if(pageNum === 2 || pageNum === 8 || pageNum === 14 || pageNum === 17){
                selectedIndex = 1;
            }else if(pageNum === 3 || pageNum === 9 || pageNum === 18){
                selectedIndex = 2;
            }else if(pageNum === 4 || pageNum === 10 || pageNum === 19){
                selectedIndex = 3;
            }else if(pageNum === 5 || pageNum === 11 || pageNum === 20){
                selectedIndex = 4;
            }else if(pageNum === 21){
                selectedIndex = 5;
            }else if(pageNum === 22) {
                selectedIndex = 6;
            }else{
                selectedIndex = 7;
            }

            this.setState({
                selectedIndex: selectedIndex,
                noOfPages: (pageNum <= 12) ? 5 : (pageNum <= 14) ? 2 : 8,
                activeDotColor: activeDotColor,
                otherDotColor: otherDotColor,
                pageNo: pageNum
            });
        }
    };

    getOutputColor = (index) => {
        if(index >= 0){
            return colorArray[index]
        }
        return colorArray[0]
    };

    onLastButtonClick = () => {
        this.props.navigation.navigate("stories");
    };

    renderTopComponent = () => {
        const opacity = xOffset.interpolate({
            inputRange: [
                (this.currentVisiblePageNo - 1) * Constant.screenWidth,
                this.currentVisiblePageNo * Constant.screenWidth,
                (this.currentVisiblePageNo + 1) * Constant.screenWidth
            ],
            outputRange: [0.1, 1, 0]
        });

        // if(this.state.pageNo === 24 && this.state.isScrollEnable) {
        //     this.refs.mainScrollView.scrollToEnd()
        //     this.setState({
        //         isScrollEnable: false
        //     });
        // }
        let sliderPageNo = this.currentVisiblePageNo;
        return(
            (sliderPageNo === 0) && <TitleText viewOpacity={opacity}
                                               title={"Why do I watch so much porn?"}/>
            ||
            (sliderPageNo === 6) && <TitleText viewOpacity={opacity}
                                               title= {"Porn messes with your brain like chemical drugs do, but porn can't kill you."+'\n\n'+"So what can it do?"}/>
            ||
            (sliderPageNo === 12) && <TitleText viewOpacity={opacity}
                                                title={"How do I reboot my brain?"}/>
            ||
            (sliderPageNo === 15) && <TitleText viewOpacity={opacity}
                                                title={"Your Brainbuddy Rebooting Program"}/>
            ||
            (sliderPageNo >= 24) && <TitleText viewOpacity={Constant.isIOS && opacity || 1}
                                                title={"Some benefits from people who have successfully rebooted"}/>
            ||
            (sliderPageNo < 16) && <SliderImage image={topImages[this.currentVisiblePageNo.toString()]} viewOpacity={opacity}/> ||
            (sliderPageNo === 16) && <Slider1 userName={(this.props.userDetails.name !== "Unknown") && this.props.userDetails.name || ""} viewOpacity={opacity}/> ||
            (sliderPageNo === 17) && <Slider2 viewOpacity={opacity}/> ||
            (sliderPageNo === 18) && <Slider3 viewOpacity={opacity}/> ||
            (sliderPageNo === 19) && <Slider4 viewOpacity={opacity}/> ||
            (sliderPageNo === 20) && <Slider5 viewOpacity={opacity}/> ||
            (sliderPageNo === 21) && <Slider6 viewOpacity={opacity}/> ||
            (sliderPageNo === 22) && <Slider7 viewOpacity={opacity}/> ||
            (sliderPageNo === 23) && <Slider8 viewOpacity={opacity}/>
        );
    };

    render() {
        let backgroundColor=xOffset.interpolate({
            inputRange: [
                (this.currentVisiblePageNo - 1) * Constant.screenWidth,
                this.currentVisiblePageNo * Constant.screenWidth,
                (this.currentVisiblePageNo + 1) * Constant.screenWidth
            ],
            outputRange:  this.getOutputColor(this.state.pageNo),
            extrapolate: 'clamp'});
        return (
            <Animatable.View style={styles.container} ref="mainView">
                <AppStatusBar isHidden={true}/>
                <Animated.View style={[{left:0, right:0, top:0, bottom:0, position:'absolute'},{backgroundColor}]}/>
                <View style={[{left:0, right:0, top:0, bottom:0, position:'absolute', backgroundColor:'transparent'}]}>
                    {this.renderTopComponent()}
                </View>

                {(this.currentVisiblePageNo === 0 ||
                    this.currentVisiblePageNo === 6 ||
                    this.currentVisiblePageNo === 12 ||
                    this.currentVisiblePageNo === 15 ||
                    this.currentVisiblePageNo === 24) ?
                    <View/>
                    :
                    <View style={{position:'absolute',bottom: Constant.isIOS && this.props.safeAreaInsetsData.bottom || '5%',left:0, right:0, top:'95%'}}>
                        <SliderDotComponent noOfPages={this.state.noOfPages}
                                            selectedIndex={this.state.selectedIndex}
                                            activeDotColor={this.state.activeDotColor}
                                            otherDotsColor={this.state.otherDotColor}/>
                    </View>
                }

                <Animated.ScrollView
                    ref={"mainScrollView"}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={9}
                    onScroll={ x => {
                        let contentOffset = x.nativeEvent.contentOffset;
                        let viewSize = x.nativeEvent.layoutMeasurement;
                        let pageNo = 0;

                        if(Constant.isIOS){
                            pageNo = Math.floor(contentOffset.x / viewSize.width);
                        }else{
                            if(x.nativeEvent.contentOffset.x > maxOffset){
                                //swipe forward
                                console.log("forword ------>>>>")
                                pageNo = Math.round(contentOffset.x / viewSize.width);

                            }else{
                                //swipe backward
                                console.log("backword <<<<<<-----");
                                pageNo = Math.floor(contentOffset.x / viewSize.width);

                            }
                            maxOffset = contentOffset.x;

                        }
                        if(this.currentVisiblePageNo !== pageNo && pageNo >= 0) {
                            this.setPagination(pageNo);
                        }
                        this.currentVisiblePageNo = pageNo;
                        let mover = Animated.event([ {nativeEvent: { contentOffset: { x: xOffset} } } ]);
                        return mover(x)
                    }}
                    horizontal
                    pagingEnabled
                    style={[styles.scrollView]}>

                    <TitleSlider backcolor={"transparent"}
                                 title={"Why do I watch so much porn?"}/>

                    <SliderPageComponent titleName="Porn is a drug"
                                         description="Using porn releases a chemical in the brain called dopamine. This chemical makes you feel good - its why you feel pleasure when you watch porn."/>

                    <SliderPageComponent titleName="I need more"
                                         description="The more porn you watch, the more dopamine your brain needs to feel good. This is why porn doesn't satisfy you as much as it used to."/>

                    <SliderPageComponent titleName="Nothing compares"
                                         description="Porn has changed your brain to only respond to abnormally high levels of dopamine. So normal everyday activities leave you feeling unsatisfied."/>

                    <SliderPageComponent titleName="Feeling unhappy?"
                                         description="An elevated dopamine level means you need more dopamine to feel good. This is why so many porn users report feeling depressed, unmotivated, and anti-social."/>

                    <SliderPageComponent titleName="It gets worse"
                                         description="Over time, your brain starts to associate porn with pleasure. This can lead to a lack of interest in real women, weaker erections, and relationship problems."/>

                    <TitleSlider backcolor={"transparent"}
                                 title= {"Porn messes with your brain like chemical drugs do, but porn can't kill you."+'\n\n'+"So what can it do?"}/>

                    <SliderPageComponent titleName="Porn ruins relationships"
                                         description="Porn reduces your appetite for real relationships and increases your appetite for more porn."/>

                    <SliderPageComponent titleName="Porn kills your sex drive"
                                         description="More than 50% of heavy porn users report experiencing low libido and a loss of interest in real sex."/>

                    <SliderPageComponent titleName="Porn limits success"
                                         description="58% of heavy porn users suffer major financial loss and as many as one third eventually lose their jobs."/>

                    <SliderPageComponent titleName="Porn prevents happiness"
                                         description="Studies show a significant relationship between frequent porn use and feelings of loneliness and major depression."/>

                    <SliderPageComponent titleName="Porn ruins your life"
                                         description="Porn users are 23 times more likely to state that 'discovering online sexual material was the worst thing that every happened in my life'."/>

                    <TitleSlider backcolor={"transparent"} title={"How do I reboot my brain?"}/>

                    <SliderPageComponent titleName="Reset your baseline"
                                         description="As your dopamine levels return to normal, you'll start to feel more pleasure from everyday activities like watching a movie, or hanging out with friends."/>

                    <SliderPageComponent titleName="Rewire your brain"
                                         description="Rewiring' involves creating healthy new synaptic pathways in the brain that prefer healthy sources of dopamine instead of a destructive, short-term porn fix."/>

                    <TitleSlider backcolor={"transparent"} title={"Your Brainbuddy Rebooting Program"}/>

                    <LastSliderComponent description={"Welcome to Brainbuddy.\n\nOur class-leading app based on years of research and user interaction."}/>

                    <LastSliderComponent description={"Brainbuddy learns about you, your lifestyle, and your porn habits."}/>

                    <LastSliderComponent description={"Your responses create tailored activities to help rewire your brain, improve willpower, and prevent relapse."}/>

                    <LastSliderComponent description={"Your evening checkup helps Brainbuddy track your progress and understand your triggers."}/>

                    <LastSliderComponent description={"Brainbuddy learns your habits and temptation patterns, providing you with 24/7 protection."}/>

                    <LastSliderComponent description={"Know yourself to conquer yourself. Understand your strengths and weaknesses and track how far you’ve come."}/>

                    <LastSliderComponent description={"Welcome to the community. Work as a team to complete challenges, get advice, and help others."}/>

                    <LastSliderComponent description={"Level up your life. Rebooting has immense psychological and physical benefits. Become stronger, healthier, and happier."}/>

                    <TitleSlider backcolor={"transparent"}
                                 onNextClick={this.onLastButtonClick}
                                 title={"Some benefits from people who have successfully rebooted"}
                                 isLast={true}/>

                </Animated.ScrollView>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flexDirection: "row",
        position: 'absolute',
        width:Constant.screenWidth,
        height:Constant.fullScreenHeight,
        left:0,
        right:0,
        backgroundColor:'transparent'
    },
    container:{
        width:Constant.screenWidth,
        height:Constant.fullScreenHeight,
        alignItems:'center',
        backgroundColor:'#FFF'
    },
    scrollPage: {
        width: Constant.screenWidth,
    },
    screen: {
        height: Constant.fullScreenHeight,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 45,
        fontWeight: "bold"
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        userDetails: state.user.userDetails
    };
};

export default connect(mapStateToProps, {

})(IntroSlider);