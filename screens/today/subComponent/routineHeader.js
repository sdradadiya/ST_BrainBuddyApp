import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../helper/constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import TochableView from '../../commonComponent/touchableView';

export default  class RoutineHeader extends React.PureComponent {

    render() {
        let appColor = Constant[this.props.appTheme];
        return(
            <TochableView onPress={()=>this.props.onSelectExercises(this.props.pageName)}
                          pressInColor={appColor.cardSubSection}
                          backColor={appColor.cardBack}
                          style={{borderRadius:5}}>

                <View  style={[styles.outerView]}>
                    <View>
                        <Image source={this.props.Icon}
                               style={ styles.iconImage }/>
                    </View>
                    <View style={ styles.outerTextView }>
                        <View style={[styles.textDetail]}>
                            <Text style={[styles.titleText, {color: appColor.defaultFont}]}>{this.props.title}</Text>
                            <Text style={[styles.detailText,{color: appColor.cardSubTitle}]}
                                  numberOfLines={1}>
                                {this.props.desc}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:'center',padding:10}}>
                        {
                            (this.props.isIcon) ?
                                (this.props.isActiveDot) ?
                                    <Octicons name='primitive-dot' style={{alignSelf:'center'  }}
                                              size={20}
                                              color={Constant.activeColor}/>
                                    :
                                    null
                                :<View />
                        }
                    </View>
                </View>
            </TochableView>

        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        flexDirection:'row',
        borderRadius: 5,
        height:75,
    },
    iconImage:{
        height:75,
        width:60,
    },
    outerTextView:{
        flexDirection:'row',
        justifyContent:'center',
        flex:1,
        paddingLeft: 15,
    },
    textDetail:{
        flex:1,
        justifyContent:'center'
    },
    titleText:{
        fontSize: 15,
        fontFamily: Constant.font500,
    },
    detailText: {
        fontSize: 12,
        marginTop:5,
        fontFamily: Constant.font500,
    }
});