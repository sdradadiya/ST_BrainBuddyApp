import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
} from 'react-native';
import Constant from '../../../helper/constant';
import ProfImage from './component/profileImage'
import RowSeparator from './component/rowSeperator';
import {removeSafeArea} from "../../../actions/userActions";
import ProfileSettingRow from './component/profileSettingsRow';
import { connect } from 'react-redux';
import { getAvatarImage } from '../../../helper/appHelper';
import TopButton from '../../commonComponent/topButton';

const iconImage = {
    feelingTampered: require('../../../assets/images/tab-icon-tempted.png'),
    profileMale: require('../../../assets/images/avatar-male.png'),
    profileFemale: require('../../../assets/images/avatar-female.png'),
    journal: require('../../../assets/images/tab-icon-journal.png'),
    advice: require('../../../assets/images/moretab/tab-icon-advice.png'),
    lifeTree: require('../../../assets/images/tab-icon-tree.png'),
    completedExercise : require('../../../assets/images/moretab/tab-icon-exercise.png'),
    internetFilterIcon : require('../../../assets/images/tab-icon-filter.png'),
    settings : require('../../../assets/images/tab-icon-settings.png')
};

class UserProfile extends React.PureComponent {

    constructor(props){
        super(props);
    }

    //Navigate to inner view
    goTo = (page) => {
        this.props.navigation.navigate(page+"Card",{transition: "myCustomSlideRightTransition"});
        this.props.removeSafeArea();
    };


    getAvatarImage = () => {
        return getAvatarImage(this.props.avatar_id, this.props.gender);
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container,{backgroundColor: appColor.appBackground}]}>
                <ScrollView contentContainerStyle={{top:this.props.safeAreaInsetsData.top}}>
                    <View style={{marginBottom:40,marginTop:45, backgroundColor: appColor.pressInMoreRow}}>
                        <ProfImage profileName={(this.props.userName) ? this.props.userName:'Unknown'}
                                   profileEmail={this.props.email}
                                   profileImage={this.getAvatarImage()}
                                   viewName="moreSettings"
                                   appTheme={this.props.appTheme}
                                   goTo={this.goTo}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>

                        <ProfileSettingRow imageUrl={iconImage.feelingTampered}
                                           rowTitle="I'm feeling tempted"
                                           viewName="feelingTempted"
                                           appTheme={this.props.appTheme}
                                           goTo={this.goTo}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>

                        <ProfileSettingRow imageUrl={iconImage.journal}
                                           rowTitle="Journal"
                                           viewName="journalEntry"
                                           goTo={this.goTo}
                                           appTheme={this.props.appTheme}
                        />
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                        <ProfileSettingRow imageUrl={iconImage.advice}
                                           rowTitle="Advice"
                                           viewName="savedAdvice"
                                           goTo={this.goTo}
                                           appTheme={this.props.appTheme}
                        />
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                        <ProfileSettingRow imageUrl={iconImage.lifeTree}
                                           rowTitle="Life Tree"
                                           viewName="lifeTree"
                                           appTheme={this.props.appTheme}
                                           goTo={this.goTo}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                        <ProfileSettingRow imageUrl={iconImage.completedExercise}
                                           rowTitle="Audio exercises"
                                           viewName="completedAudioExercises"
                                           appTheme={this.props.appTheme}
                                           goTo={this.goTo}/>
                        {
                            (Constant.isIOS) &&
                            <View>
                                <RowSeparator separatorColor={appColor.moreSeparator}/>
                                <ProfileSettingRow imageUrl={iconImage.internetFilterIcon}
                                                   rowTitle="Internet filter"
                                                   viewName="internetFilter"
                                                   appTheme={this.props.appTheme}
                                                   goTo={this.goTo}/>
                            </View>
                        }
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                        <View style={{ height: 27,backgroundColor: appColor.appBackground}}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>

                        <ProfileSettingRow imageUrl={iconImage.settings}
                                           rowTitle="Settings"
                                           viewName="moreSettings"
                                           appTheme={this.props.appTheme}
                                           goTo={this.goTo}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backColor,
    }
});
const mapStateToProps = state => {
    return {
        email:state.user.email,
        userName:state.user.userDetails.name || "",
        gender:state.user.userDetails.gender || 'male',
        avatar_id:state.user.userDetails.avatar_id,
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    removeSafeArea
})(UserProfile);