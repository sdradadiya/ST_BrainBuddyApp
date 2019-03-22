import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant';
import { getSmallAvatarImage } from '../../../../../helper/appHelper';
import CommentCount from './commentCount';
import TochableView from '../../../../commonComponent/touchableView';

export default class HelpOtherRow extends Component {

    constructor(props){
        super(props);
        this.state={
            opacity: 1,
        }
        this.props = props;
    }

    // shouldComponentUpdate = (nextProps, nextState) => {
    //
    //     console.log("this props -----", this.props)
    //     console.log("nextProps -----", nextProps)
    //     debugger
    //
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false
    //     }
    // }

    getAvatarImage = (avatar_id, isCurrentUser) => {
        if(isCurrentUser){
            return getSmallAvatarImage(this.props.avatar_id || 0);
        }
        return getSmallAvatarImage(avatar_id || 0);
    };

    onReplyClicked = () => {
        this.props.onRowSelect(this.props.rowData);
    };

    onLikeClicked = () => {
        if(this.props.rowData.user.has_hearted){
            this.props.unlikeHelpPost(this.props.rowData.id);
        }else{
            this.props.likeHelpPost(this.props.rowData.id);
        }
    };

    //call with row data
    onEditPress = () => {
        this.props.onEditButtonPress(this.props.rowData);
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const { rowContainer, textDetail } = styles;
        return (
            <View style={[rowContainer,{backgroundColor:appColor.scrollableViewBack}]}>
                <TochableView onPress={()=>this.onReplyClicked()}
                              pressInColor={appColor.scrollableViewBack}
                              backColor={appColor.scrollableViewBack}>
                    <View>
                        <Text style={[textDetail,{color: appColor.defaultFont}]}>
                            {this.props.rowData.content}
                        </Text>
                    </View>
                </TochableView>
                <CommentCount opacity={this.state.opacity}
                              appTheme={this.props.appTheme}
                              onReplyClicked={this.onReplyClicked}
                              onLikeClicked={this.onLikeClicked}
                              isLiked = {(this.props.rowData.user) && this.props.rowData.user.has_hearted || false}
                              isCommented = {(this.props.rowData.user) && this.props.rowData.user.has_commented || false }
                              commentCount = {(this.props.rowData.comments) && this.props.rowData.comments.count || "0" }
                              avtarImage={this.getAvatarImage(this.props.rowData.creator.avatar_id || 0, this.props.rowData.creator.is_current_user)}
                              likeCount = { (this.props.rowData.hearts) && this.props.rowData.hearts.count || "0" }
                              creatorName={this.props.rowData.creator.is_current_user && "You" || this.props.rowData.creator.name}
                              porn_free_days={(this.props.rowData.creator.stats) && this.props.rowData.creator.stats.porn_free_days.toString() || null }
                              onEditButtonPress={this.onEditPress}
                              isAllowEdit={this.props.rowData.creator.is_current_user}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        padding: 15,
        backgroundColor: Constant.backProgressBarColor,
        maxWidth:600,alignSelf:'center', width:'100%'
    },
    textDetail: {
        color: '#FFF',
        fontSize: 15,
        margin:5,
        fontFamily: Constant.font500,
        lineHeight: 23,
    }
});