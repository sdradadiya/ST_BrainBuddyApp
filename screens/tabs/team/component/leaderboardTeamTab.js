import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import LeaderBoardRow from '../subcomponent/leaderBoard/leaderBoardRow'
import _ from 'lodash';
import TopBarComponent from "./teamTopBar";
import { getleaderboardTeamList,getLeaderBoardTeamFilterData } from '../../../../actions/teamAction';

class LeaderboardTeamTab extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            countshow:'Overall',
            leaderBoardTeamList: props.teamLeaderBoard.overall
        }
    }

    componentDidMount(){
        if(this.props.navigation.state.params.selectedTab == 1){
            setTimeout(()=>{
                this.props.getleaderboardTeamList(true);
                // this.labelClicked('Overall');
            },1000);
        }else{
            setTimeout(()=>{
                this.props.getleaderboardTeamList(true);
                // this.labelClicked('Overall');
            },2000);
        }
    }

    labelClicked = (stateLabel) => {
        if(stateLabel != "") {
            this.setState({
                countshow:stateLabel,
                // leaderBoardTeamList: sortList
            });

            this.props.getLeaderBoardTeamFilterData(stateLabel).then((res) => {
                // this.setListData(stateLabel)
            }).catch((err) => {
                // this.setListData(stateLabel)
            })

        }
    };

    setListData = (stateLabel) => {
        let allList = _.cloneDeep(this.props.teamLeaderBoard);
        let sortList = [];
        // switch (stateLabel)
        // {
        //     case "Overall":
        //         sortList = allList.overall;
        //         break;
        //     case "This year":
        //         sortList = allList.year;
        //         break;
        //     case "This month":
        //         sortList = allList.month;
        //         break;
        //     case "This week":
        //         sortList = allList.week;
        //         break;
        // }
        this.setState({
            countshow:stateLabel,
            leaderBoardTeamList: sortList
        });

    }
    onSwipeLeft = (gestureState) => {
        switch (this.state.countshow)
        {
            case "Overall":
                this.labelClicked("This year");
                break;
            case "This year":
                this.labelClicked("This month");
                break;
            case "This month":
                this.labelClicked("This week");
                break;
            case "This week":
                break;
        }
    };

    onSwipeRight = (gestureState) => {
        switch (this.state.countshow)
        {
            case "Overall":
                break;
            case "This year":
                this.labelClicked("Overall");
                break;
            case "This month":
                this.labelClicked("This year");
                break;
            case "This week":
                this.labelClicked("This month");
                break;
        }
    };

    renderItems = ({item, index}) => {
        let teamName = "";
        item.name.trim().split(' ').forEach(str=>{
            teamName = teamName + str.charAt(0);
        });
        return(
            <LeaderBoardRow
                is_current_user={item.is_current_users_team}
                key={index}
                index={(index+1).toString()}
                //rank={item.rankings.overall || "0"}
                rank={item.rank}
                isTeam={true}
                teamProfile={teamName}
                appTheme={this.props.appTheme}
                name={(item.is_current_users_team)?"Your Team":item.name}
                count={(this.state.countshow=="Overall")?item.porn_free_days.counts.total:
                    (this.state.countshow=="This year")?item.porn_free_days.counts.current_year:
                        (this.state.countshow=="This month")?item.porn_free_days.counts.current_month:
                            (this.state.countshow=="This week")?item.porn_free_days.counts.current_week:""}/>
        );
    };

    renderHeader = () => {
        return <TopBarComponent onSwipeLeft={this.onSwipeLeft}
                                labelClicked={this.labelClicked}
                                countshow={this.state.countshow}
                                appTheme={this.props.appTheme}
                                onSwipeRight={this.onSwipeRight}/>
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container,{backgroundColor: appColor.scrollableViewBack}]}>
                <FlatList removeClippedSubviews={false}
                          data={(this.state.countshow=="Overall")?this.props.teamLeaderBoard.overall:
                              (this.state.countshow=="This year")?this.props.teamLeaderBoard.year:
                                  (this.state.countshow=="This month")?this.props.teamLeaderBoard.month:
                                      (this.state.countshow=="This week")?this.props.teamLeaderBoard.week:[]}
                          automaticallyAdjustContentInsets={false}
                          ListFooterComponent={
                              <View style={{height:80}}/>
                          }
                          ListHeaderComponent={this.renderHeader}
                          renderItem={this.renderItems}
                          keyExtractor={(item, index) => {
                              return index.toString()
                          }}
                          initialNumToRender={10}
                          windowSize={5}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
    content: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontFamily: Constant.font500,
    },
});

const mapStateToProps = state => {
    return {
        teamLeaderBoard:state.team.teamLeaderBoard,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    getleaderboardTeamList,getLeaderBoardTeamFilterData
})(LeaderboardTeamTab);