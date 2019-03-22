import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    TextInput
} from 'react-native';
import Button from '../../../commonComponent/button';
import Constant from '../../../../helper/constant';
import NotificationBox from './notificationBox';
import ChooseAvatar from '../components/getDetail/chooseAvatarComponent'
import PickerComponent from './pickerComponent'

export default class BeforeBeginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: props.selectedDay,
            bottomText: (props.type == "porn") ? "Your current porn free streak will be 0 days."
                : (props.type == "masturbate") ? "Your current masturbation free streak will be 0 days."
                    : "We'll notify you when it's time for your checkup.",
            selectedAvatarImg: 1,
        };
    }

    componentDidMount(){
    }

    onSelectOption = (itemValue) => {
        let streak = 0;
        if(itemValue >= 2){
            streak = itemValue - 1;
        }
        let day = streak == 1 && " day." || " days.";
        let bottomText = "";
        if(this.props.type == "porn"){
            if(streak == 0){
                if(itemValue == 1){
                    let hours = new Date().getHours();
                    bottomText = "Your current streak will be "+ hours +" hours.";
                }else{
                    bottomText = "Your current porn free streak will be 0 days.";
                }
            }else{
                bottomText = "Your current porn clean streak will be "+ streak + day;
            }
        }else if(this.props.type == "masturbate"){
            if(streak == 0){
                if(itemValue == 1){
                    let hours = new Date().getHours();
                    bottomText = "Your current streak will be "+ hours +" hours.";
                }else{
                    bottomText = "Your current masturbation free streak will be 0 days.";
                }
            }else{
                bottomText = "Your current masturbation clean streak will be "+ streak + day;
            }
        }else{
            bottomText = "We'll notify you when it's time for your checkup.";
        }
        this.setState({selectedItem: itemValue,
            bottomText: bottomText});
    };

    onPressNext = () => {
        if(this.props.type == "firstName" && this.state.selectedItem.trim().length == 0){
        }else{
            this.props.onPressNext(this.state.selectedItem, this.props.type);
        }
    };

    setSelectedAvatarImage = (imageId) => {
        this.setState({
            selectedItem: imageId
        });
    };

    //on enter first name
    onFirstNameChange = (text) => {
        this.setState({
            selectedItem: text
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.topTitleText}>
                        {"Before we begin"}
                    </Text>
                    <Text style={styles.subTitle}>
                        {this.props.subTitle}
                    </Text>
                </View>
                {
                    (this.props.type == "firstName") &&
                    <View style={{position: 'absolute', top:Constant.screenHeight*0.37 - 13, bottom: 0, width: "100%", alignSelf: 'center'}}>
                        <View style={{justifyContent:'center'}}>
                            <TextInput ref="txtFirstName"
                                       value={this.state.selectedItem}
                                       placeholder={"Enter name"}
                                       placeholderTextColor={"#FFF"}
                                       style={ styles.textBox }
                                       returnKeyType={"done"}
                                       blurOnSubmit={true}
                                       onChangeText={(text) => {this.onFirstNameChange(text)}}
                                       autoCorrect={false}
                                       underlineColorAndroid={Constant.transparent}/>
                        </View>
                        <View style={styles.textBorder}/>
                    </View>
                    ||
                    (this.props.type == "chooseAvatar") &&
                    <View style={{position: 'absolute', top:Constant.screenHeight*0.36 - 10, bottom: 0, width: "100%", alignSelf: 'center'}}>
                        <ChooseAvatar setSelectedAvatarImage={this.setSelectedAvatarImage}/>
                    </View>

                    ||(this.props.type == "notification") &&
                    <View style={{ position: 'absolute', top:Constant.screenHeight*0.35 + 5, bottom: 0, width: "80%", alignItems: 'center', alignSelf: 'center'}}>
                        <NotificationBox title="Streak goals"
                                         description={"Streak goal achieved. Congratulations on 7 days clean."}/>
                        <View style={{marginTop:26, width: "100%"}}>
                            <NotificationBox title="Morning motivation"
                                             description={"Good morning "+ this.props.userName +"! 'Tough times don't last. Tough people do'."}/>
                        </View>
                    </View>
                    ||
                    <View style={styles.pickerOuterView}>
                        {(this.props.type == "region") &&

                        <PickerComponent
                            items={[
                                {label:"America", value:"america"},
                                {label:"Europe", value:"europe"},
                                {label:"Asia", value:"asia"},
                                {label:"Pacific", value:"pacific"}
                                 ]}
                            selectedValue={this.state.selectedItem}
                            onValueChange={this.onSelectOption}/>

                        || (this.props.type == "checkup") &&

                        <PickerComponent
                            items={[
                            {label:"6pm", value:18},
                            {label:"7pm", value:19},
                            {label:"8pm", value:20},
                            {label:"9pm", value:21},
                            {label:"10pm", value:22},
                            {label:"11pm", value:23}
                            ]}
                            selectedValue={this.state.selectedItem}
                            onValueChange={this.onSelectOption}/>

                        ||
                        <PickerComponent
                            items={this.props.pickerItems}
                            selectedValue={this.state.selectedItem}
                            onValueChange={this.onSelectOption}/>
                        }
                    </View>
                }

                {(this.props.type != "notification" && this.props.type != "region" && this.props.type != "chooseAvatar"
                && this.props.type != "firstName") &&
                <View style={styles.bottomTextView}>
                    <Text style={styles.bottomText}>
                        {this.state.bottomText}
                    </Text>
                </View>
                || null
                }
                {
                    (this.props.type == "checkup" || this.props.type == "chooseAvatar" || this.props.isLast) &&
                    <View style={{
                            top: Constant.screenHeight*0.83-3,
                            left:0, right:0,
                            alignSelf: 'center',
                            position:'absolute',
                            justifyContent:'center',
                            alignItems: 'center'}}>
                        <Button title={this.props.type == "checkup" && "Set checkup reminder" || "Finish setup"}
                                backColor="#FFF"
                                color="rgb(22,93,120)"
                                otherStyle={{margin:0,marginTop:0, height:60, width:"80%"}}
                                otherTextStyle={{fontFamily: Constant.font700}}
                                onPress={this.onPressNext}/>
                    </View>
                    ||
                    <View style={{ height:60,
                            width: 60,
                            top: Constant.screenHeight*0.83-3,
                            alignSelf: 'center',
                            position:'absolute',
                            borderRadius:30,
                            justifyContent:'center',
                            alignItems: 'center'}}>
                        <TouchableOpacity onPress={()=> this.onPressNext()}
                                          style={{flex:1, height:60,width: 60,justifyContent:'center',backgroundColor: "#FFF",
                            alignItems: 'center', borderRadius:30}}>
                            <Image source={require('../../../../assets/images/checkup/next-gray-tick.png')}
                                   style={{height:16, width: 20, tintColor: 'rgb(22,93,120)'}}/>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgb(22,93,120)',
    },
    titleView:{
        top: Constant.screenHeight*0.117-5,
        width:'80%',
        alignSelf: 'center',
        position:'absolute'
    },
    topTitleText:{
        fontSize:24,
        fontFamily: Constant.font300,
        color:'#b7bac3',
        textAlign: 'center',
    },
    subTitle:{
        fontSize:17,
        color:'#FFF',
        fontFamily: Constant.font500,
        marginTop:20,
        textAlign: 'center',
    },
    pickerOuterView:{
        top: Constant.screenHeight*0.45-50,
        left:0,
        right:0,
        position:'absolute',
    },
    bottomTextView:{
        top: Constant.screenHeight*0.72,
        alignSelf: 'center',
        position:'absolute',
        width: "70%"
    },
    bottomText:{
        fontSize:15,
        fontFamily: Constant.font500,
        color:'rgb(152,234,145)',
        textAlign: 'center',
        lineHeight: 22
    },
    textBorder:{
        backgroundColor: "#5c8ea1",
        height:1.5,
        alignSelf: 'center',
        width: "78%"
    },
    textBox:{
        color: '#FFFFFF',
        fontSize: 15,
        paddingBottom: 0,
        height:40,
        width: "78%",
        textAlign: 'center',
        alignSelf:'center',
        fontFamily: Constant.font500,
    }
});