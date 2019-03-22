import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import Button from '../../../../../commonComponent/button';
import * as Animatable from 'react-native-animatable';

let sliderData = [
    {   imageUrl: require('../../../../../../assets/images/tempted-tv.png'),
        title: 'Watch television',
        description: 'Find a great tv show, preferably a comedy. Visit IMDB for some ideas.'
    },
    {    imageUrl: require('../../../../../../assets/images/tempted-list.png'),
        title: 'Make a list',
        description: (Constant.isIOS) && "Make a list of the things you’re grateful for. If you own an " +
        "iPhone or laptop, you’re already richer than 99% of the world population." ||
        "Make a list of the things you’re grateful for. If you own a smartphone or laptop, you’re already richer than 99% of the world population."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-shopping.png'),
        title: 'Go shopping',
        description: "Go shopping for something you need or simply want. Find an excuse to get out of the house."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-book.png'),
        title: 'Find a great book',
        description: "Go to the library and find a great book to read. It doesn’t have to be intellectual, " +
        "just find something you’ll enjoy."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-better.png'),
        title: 'Make your life better',
        description: "Start with something small. Organise your music, wash your car, or clean the house."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-phone.png'),
        title: 'Phone a friend',
        description: "Call someone for a chat. Even if you haven’t chatted in a while, now is a great time for a catch up."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-online.png'),
        title: 'Go online',
        description: "Join an online community. Find a forum dedicated to something you’re" +
        " interested in and help people solve their problems.",
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-willpower.png'),
        title: 'Boost your willpower',
        description: 'Have a snack high in glucose, such as some fresh fruit or grains.'+
        ' Glucose is scientifically proven to provide a short term boost in willpower.'
    },
    {    imageUrl: require('../../../../../../assets/images/tempted-shower.png'),
        title: 'Take a cold shower',
        description: "Research shows that temperature sensors in the skin react to cold " +
        "water by sending electrical signals to the brain," +
        "providing an anti-depressive effect."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-pushups.png'),
        title: 'Do some pushups',
        description: "Continue until you physically can't do anymore. Every pushup releases a "+
        "burst of dopamine making you feel healthier and happier."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-gum.png'),
        title: 'Chew gum',
        description: "Chewing increases blood flow to the brain - distracting from stressors" +
        " and making you feel more alert and aware."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-jumping.png'),
        title: 'Do some jumping jacks',
        description: "Keep an even rhythm and continue until you become physically exhausted."

    },
    {   imageUrl: require('../../../../../../assets/images/tempted-public.png'),
        title: 'Hang out in public',
        description: "Visit a public place such as a mall, the library to the each. " +
        "Being around people will make you feel in control."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-bear.png'),
        title: 'Stare at the bear',
        description: "Reconnect with your childhood self. Imagine the feel of the" +
        " bear’s fur and how it would feel to cuddle."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-towel.png'),
        title: 'Grab a hot towel',
        description: 'Wet a small towel with hot water and wrap it gently around' +
        ' your neck and upper back. For 5 minutes, close your eyes and slowly roll your shoulders.'
    },
    {    imageUrl: require('../../../../../../assets/images/tempted-outside.png'),
        title: 'Get outside',
        description: "Go for a walk in the park, hang out at the shopping mall, " +
        "do whatever you can to escape from short-term temptation."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-memory.png'),
        title: 'Look at a happy photo',
        description: "Find a photo of yourself at a happy moment in time. " +
        "Stare at the photo for 3 minutes and try to recall the subtle details of that day."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-eat.png'),
        title: 'Eat healthy',
        description: "Eat something healthy and drink some water. " +
        "Hunger can make you feel grumpy and unhappy."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-nap.png'),
        title: 'Have a nap',
        description: "Relax and have a power nap. Tiredness can elevate temptation - " +
        "when you wake up you'll feel refreshed and in control.",
    },
    {    imageUrl: require('../../../../../../assets/images/tempted-outside.png'),
        title: 'Get out of the house',
        description: "Go for a walk in the park, hang out at the shopping mall, " +
        "do whatever you can to escape from short-term temptation."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-action.png'),
        title: 'Take action',
        description: "No matter what your situation, steps can be taken to improve the quality of your life." +
        " You are the master of your own destiny."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-remember.png'),
        title: 'Remember the truth',
        description: "Your body is not horny. Your addicted brain is craving dopamine from " +
        "unhealthy sources that will hurt you in the long run. You want real sex, not porn."
    },
    {   imageUrl: require('../../../../../../assets/images/tempted-moment.png'),
        title: 'Live in the moment',
        description: "Google some quotes from Eckhart Tolle’s bestseller ‘The Power of Now’. " +
        "Internalise this philosophy until it becomes part of your reality."
    }];

let escape = {
    imageUrl: require('../../../../../../assets/images/tempted-escape.png'),
    title: 'Escape',
    description: "Take some time to meditate and calm your mind.",
    isLast: true
};

let arrRandom=[];

export default class TemptedSlider extends Component {

    constructor(props){
        super(props);
        arrRandom=[];
        let random = this.generateRandom();
        this.state={
            selectedCard: sliderData[random]
        }
    }

    onButtonPress = () => {
        try{
            if(this.state.selectedCard.title !== "Escape"){
                this.refs.cardView.fadeOut(300).then(() =>{
                    let random = this.generateRandom();
                    if (random != 30) {
                        this.setState({
                            selectedCard: sliderData[random]
                        }, () => {
                            this.refs.cardView.fadeIn(300);
                        });
                    } else {
                        this.setState({
                            selectedCard: escape
                        }, () => {
                            this.refs.cardView.fadeIn(300);
                        });
                    }
                })
            }else{
                this.refs.cardView.fadeOut(300).then(()=>{
                    this.props.onEscapeActivityPress();
                });
            }
        }catch (e){

        }
    }

    generateRandom = () => {
        let maximun=22,minimum=0;
        let randomnumber = Math.floor(Math.random() * (maximun - minimum + 1)) + minimum;
        if(arrRandom.indexOf(randomnumber) < 0) {
            arrRandom.push(randomnumber);
            return randomnumber;
        } else{
            if(arrRandom.length == 23){
                return 30;
            }else{
                return this.generateRandom();
            }
        }
    };

    render() {
        return (
            <View style={{flex:1}}>
                <Animatable.View style={styles.mainView}  ref={"cardView"}
                                 animation="fadeIn" duration={300} delay={300}>
                    <Image source={this.state.selectedCard.imageUrl}
                           style={{height:115}}
                           resizeMode={"contain"}/>
                    <Text style={styles.titleText}>
                        {this.state.selectedCard.title}
                    </Text>
                    <Text style={styles.detailText}>
                        {this.state.selectedCard.description}
                    </Text>
                    <View style={styles.innerBtn}>
                        <Button title={(this.state.selectedCard.title !== "Escape") && "Try something else" || "Meditate now"}
                                backColor='rgba(255,255,255,0.5)'
                                color="#fff"
                                otherTextStyle={{fontFamily: Constant.font700}}
                                otherStyle={{width:"100%", height: 50, marginTop: 0, marginBottom: 0, paddingTop:0, paddingBottom:0}}
                                onPress={this.onButtonPress}/>
                    </View>
                </Animatable.View>

                <View style={styles.bottomBtn}>
                    <Button title={"I'm feeling better"}
                            backColor='rgba(255,255,255,0.5)'
                            color="#fff"
                            otherTextStyle={{fontFamily: Constant.font700}}
                            otherStyle={{width:Constant.screenWidth*0.6, height: 50, marginTop: 0, marginBottom: 0, paddingTop:0, paddingBottom:0}}
                            onPress={this.props.onFeelingBetterPress}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        width: 300,
        backgroundColor:'#FFF',
        alignItems:'center',
        borderRadius:20,
        paddingBottom:20,
        paddingTop:35
    },
    titleText:{
        fontSize: 15,
        fontFamily: Constant.font700,
        textAlign: 'center',
        color:'#3b3b3b',
        marginTop:34,
        maxWidth:'80%'
    },
    detailText:{
        fontSize: 15,
        fontFamily: Constant.font500,
        textAlign: 'center',
        color:'#585858',
        lineHeight: 21,
        marginTop:14,
        marginBottom: 26,
        maxWidth:'80%'
    },
    innerBtn:{
        backgroundColor: 'rgb(49,165,159)',
        width:Constant.screenWidth*0.6,
        borderRadius:25
    },
    bottomBtn:{
        top: '83%',
        left:0,
        right:0,
        bottom:0, position: 'absolute', backgroundColor: 'rgb(49,165,159)',
        alignItems:'center',
        justifyContent:'center'
    }
});