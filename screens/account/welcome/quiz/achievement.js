import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
} from 'react-native';
import Constant from '../../../../helper/constant';
import AchievementComponent from '../components/achievements/achievementComponent';
import Button from '../../../commonComponent/button';
import * as Animatable from 'react-native-animatable';
import NavigationTitleBar from '../../../commonComponent/navTitleBar';

const Data = [
    {
        image : require("../../../../assets/images/improvement-tour-confidence.png"),
        title:'Improved self-confidence'
    },
    {
        image : require("../../../../assets/images/improvement-tour-health.png"),
        title:"Healthier appearance"
    },
    {
        image : require("../../../../assets/images/improvement-tour-voice.png"),
        title:"Stronger voice"
    },
    {
        image : require("../../../../assets/images/improvement-tour-mind.png"),
        title:"Sharper mind and memory"
    },
    {
        image : require("../../../../assets/images/improvement-tour-sleep.png"),
        title:"Improved sleeping habits"
    },
    {
        image : require("../../../../assets/images/improvement-tour-energy.png"),
        title:"More energy and motivation"
    },
    {
        image : require("../../../../assets/images/improvement-tour-alive.png"),
        title:"Improved libido and sex life"
    },
    {
        image : require("../../../../assets/images/improvement-tour-attraction.png"),
        title:"More attention from women"
    }
];

export default  class Achievement extends React.PureComponent {

    onAchievementPress = () => {
        //this.props.navigator.replace(Router.getRoute("getStarted"));
        this.props.navigation.navigate("getStarted", {nextPage: "signUp"});
    };

    static route = {
        styles: {
            gestures: null
        },
    };

    componentDidMount(){
        this.refs.mainView.fadeIn(400);
    }

    render() {
        return (
            <Animatable.View style={styles.container} ref="mainView">
                <NavigationTitleBar
                    title="Achievements"
                    backColor="#fbb043"/>

                <ScrollView style={{flex:1}}  contentContainerStyle={{paddingBottom:50}}>
                    <View style={{backgroundColor:'#22526b',paddingTop:33,paddingBottom:33,alignItems:'center'}}>
                        <View style={{width:'80%',alignItems:'center'}}>
                            <Text style={{color:'#d7e1e8',
                            fontSize:15,textAlign:'center',
                            fontFamily: Constant.font500,}}>
                                From your results, we’ve created 8
                                 achievements for you to unlock during your reboot.
                            </Text>
                        </View>
                    </View>
                    {
                        Data.map((obj)=>{
                            return <AchievementComponent image={obj.image}
                                                         title={obj.title}
                                                         key={obj.title}
                            />
                        })
                    }
                    <Button title="Get Started"
                            onPress={this.onAchievementPress}
                            backColor="#fbb043"
                            color='white'/>

                </ScrollView>
            </Animatable.View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#FFF'
    },
});
