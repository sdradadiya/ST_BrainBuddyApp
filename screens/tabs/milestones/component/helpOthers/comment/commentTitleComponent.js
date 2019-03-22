import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import BtnEdit from '../../../subComponent/editButton';

export default class CommentTitle extends Component {

    render() {
        const { container, textDetail, textName } = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[container, {backgroundColor: appColor.commentHeader}]}>
                <View style={{maxWidth:600,alignSelf:'center', width:'100%'}}>
                    <Text style={[textDetail,{color: appColor.defaultFont}]}>
                        {this.props.content}
                    </Text>
                    <View style={{padding:5,flexDirection:'row',justifyContent:'flex-start', alignItems: 'center'}}>
                        <View style={{height:25,width:25}}>
                            <Image style={{height:25,width:25,alignSelf:'center'}}
                                   source={this.props.avtarImage}/>
                        </View>
                        <Text style={[textName, {color:appColor.postAdviceRowBottomText}]}>
                            {this.props.helpPostData.creator.is_current_user && "You" ||
                            this.props.helpPostData.creator.name}
                        </Text>
                        {
                            (this.props.porn_free_days !== null) &&
                            <View style={[styles.totalPornDayView,{backgroundColor:appColor.comunityPornDayCount}]}>
                                <Text style={styles.pornDayLabel} numberOfLines={1}>
                                    {this.props.porn_free_days}
                                </Text>
                            </View>
                            || null
                        }

                        {
                            (this.props.helpPostData.creator.is_current_user) &&
                            <BtnEdit appTheme={this.props.appTheme}
                                     onEditButtonPress={this.props.onEditButtonPress}/>
                            || null
                        }

                        <View style={{flex:1}}/>

                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={[styles.likeText,{color: appColor.postAdviceRowBottomText}]}>
                                {(this.props.helpPostData.comments) && this.props.helpPostData.comments.count || "0"}
                            </Text>
                            <FontAwesome name={(this.props.helpPostData.user.has_commented)?'comment':'comment-o'}
                                         size={20}
                                         style={{marginTop: -3}}
                                         color={(this.props.helpPostData.user.has_commented)?Constant.commentColor:appColor.postAdviceRowBottomIcon}/>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#1c475d'
    },
    textDetail: {
        color: '#FFF',
        fontSize: 15,
        margin:5,
        fontFamily: Constant.font500,
        lineHeight: 23,
    },
    textName: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        // marginLeft:5,
        // marginRight:8,
        marginLeft:12,
        marginRight:12,
    },
    likeText: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        marginRight: 5
    },
    commentText: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        marginLeft:5,
        marginRight: 5
    },
    totalPornDayView:{
        justifyContent:'center',
        backgroundColor:'#76c0bb',
        height:19,
        borderRadius: 25,
        paddingRight:11,
        paddingLeft:11,
        maxWidth:50,
        minWidth:38
    },
    pornDayLabel:{
        fontSize:11,
        color:'#FFF',
        alignSelf: 'center',
        fontFamily: Constant.font700,
        backgroundColor: 'transparent'
    }
});

/*

                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.commentText}>
                            {(this.props.helpPostData.comments) && this.props.helpPostData.comments.count || "0"}
                        </Text>
                        <FontAwesome name={(this.props.helpPostData.user.has_commented)?'comment':'comment-o'}
                                     size={20}
                                     style={{ marginRight:18, marginTop: -3}}
                                     color={(this.props.helpPostData.user.has_commented)?Constant.commentColor:Constant.lightTheamColor}/>

                    </View>

                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.likeText}>
                            {this.props.helpPostData.hearts.count || "0"}
                        </Text>
                        <FontAwesome name={(this.props.helpPostData.user.has_hearted)?'heart':'heart-o'}
                                     size={20}
                                     color={(this.props.helpPostData.user.has_hearted)?Constant.heartColor:Constant.lightTheamColor}
                        onPress={() => {
                                this.props.onHeartPress(this.props.helpPostData.id,this.props.helpPostData.user.has_hearted)
                        }}/>

                    </View>


* */