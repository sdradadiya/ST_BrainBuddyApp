import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant'
import LikeCount from './likeCount';
import TochableView from '../../../../commonComponent/touchableView';

export default class PostAdviceRow extends Component {

    constructor(props){
        super(props);
        this.state={
            opacity: 1,
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false
    //     }
    // }

    likePostMethod = (id) => {
        this.props.likePostMethod(id)
    };

    unlikePostMethod = (heartId) => {
        this.props.unlikePostMethod(heartId)
    };

    //call with row data
    onEditPress = () => {
        this.props.onEditButtonPress(this.props.rowData);
    }

    render() {
        const { rowContainer, textDetail } = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[rowContainer,{backgroundColor:appColor.scrollableViewBack}]}>
                <TochableView onPress={()=>this.props.onAdviceRowSelect(this.props.rowData)}
                              pressInColor={appColor.scrollableViewBack}
                              backColor={appColor.scrollableViewBack}>
                    <View>
                        <Text style={[textDetail,{color: appColor.defaultFont}]}>
                            {this.props.text}</Text>
                    </View>
                </TochableView>
                <LikeCount avtarName={this.props.avtarName}
                           avtarImage={this.props.avtarImage}
                           likeCount={this.props.likeCount}
                           isLiked={this.props.isLiked}
                           isCommented={this.props.isCommented}
                           commentCount={this.props.commentCount}
                           id={this.props.id}
                           rowData={this.props.rowData}
                           heartId={this.props.heartId}
                           unlikePostMethod={this.unlikePostMethod}
                           likePostMethod={this.likePostMethod}
                           onAdviceRowSelect={this.props.onAdviceRowSelect}
                           appTheme={this.props.appTheme}
                           porn_free_days={this.props.porn_free_days}
                           onEditButtonPress={this.onEditPress}
                           isAllowEdit={this.props.rowData.creator.is_current_user}/>
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