// import React, { Component } from 'react';
// import {
//     StyleSheet,
//     View,
//     Image,
//     TouchableHighlight,
//     Text,
//     TouchableOpacity,
//     TouchableWithoutFeedback
// } from 'react-native';
//
// import Constant from '../../../../helper/constant';
//
// export default class ProfileRow extends React.PureComponent {
//
//     constructor(props){
//         super(props);
//         let appColor = props.appTheme && Constant[props.appTheme] || Constant[Constant.darkTheme];
//         this.state={
//             backColor: appColor.moreRow,
//             appTheme: props.appTheme,
//         }
//     }
//
//     componentWillReceiveProps(nextProps) {
//         if(this.state.appTheme !== nextProps.appTheme){
//             let appColor = nextProps.appTheme && Constant[nextProps.appTheme] || Constant[Constant.darkTheme];
//             this.setState({
//                 backColor: appColor.moreRow,
//                 appTheme: nextProps.appTheme
//             });
//         }
//     }
//
//     render() {
//         let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
//         return (
//             <TouchableOpacity delayPressIn={15}
//                                       // delayPressOut={100}
//                                       // onPressIn={()=>{this.setState({backColor:appColor.backColor})}}
//                                       // onPressOut={()=>{this.setState({backColor:appColor.moreRow})}}
//                                       onPress={()=>{this.props.goTo(this.props.viewName)}}>
//                 <View style={[styles.outerView,{backgroundColor:this.state.backColor}]}>
//                     <View style={{flex:1,flexDirection:'row'}}>
//                         <Image source={this.props.imageUrl} style={ styles.iconImage }/>
//                         <View style={ styles.outerTextView }>
//                             <Text style={[styles.textDetail,{color: appColor.defaultFont}]}> {this.props.rowTitle} </Text>
//                             <Image source={require('../../../../assets/images/button-arrow.png')}
//                                    style={{width:9, height:15,opacity:0.3}}/>
//                         </View>
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//     outerView:{
//         flexDirection:'row',
//         height: 78,
//         paddingLeft: 20,
//         paddingRight: 20,
//         alignItems:'center',
//         backgroundColor:Constant.backProgressBarColor,
//     },
//     iconImage:{
//         height:58,
//         width:48
//     },
//     outerTextView:{
//         flexDirection:'row',
//         justifyContent:'space-between',
//         alignItems:'center',
//         flex:1,
//         paddingLeft: 10,
//     },
//     textDetail:{
//         flex:0.9,
//         fontSize: 15,
//         color: '#FFF',
//         fontFamily: Constant.font500,
//     },
// });

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

import Constant from '../../../../helper/constant';
import TochableView from '../../../commonComponent/touchableView';

export default class ProfileRow extends React.PureComponent {

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <TochableView onPress={()=>this.props.goTo(this.props.viewName)}
                          pressInColor={appColor.pressInMoreRow}
                          backColor={appColor.moreRow}>
                <View style={styles.outerView}>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <Image source={this.props.imageUrl} style={ styles.iconImage }/>
                        <View style={ styles.outerTextView }>
                            <Text style={[styles.textDetail,{color: appColor.defaultFont}]}>
                                {this.props.rowTitle} </Text>
                            <Image source={require('../../../../assets/images/button-arrow.png')}
                                   style={{width:9, height:15}}/>
                        </View>
                    </View>
                </View>
            </TochableView>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        flexDirection:'row',
        height: 78,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems:'center'
    },
    iconImage:{
        height:58,
        width:48
    },
    outerTextView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        flex:1,
        paddingLeft: 10,
    },
    textDetail:{
        flex:0.9,
        fontSize: 15,
        color: '#FFF',
        fontFamily: Constant.font500,
    },
});