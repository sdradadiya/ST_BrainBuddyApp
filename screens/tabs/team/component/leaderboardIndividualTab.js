import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    FlatList,
    TouchableOpacity,
    LayoutAnimation
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import LeaderBoardRow from '../subcomponent/leaderBoard/leaderBoardRow'
import _ from 'lodash';
import TopBarComponent from "./inidividualTopBar";
import { getleaderboardIndividualList, getLeaderBoardIndividualFilterData ,getLeaderBoardIndividualBestStreak,getLeaderBoardIndividualCurrentStreak} from '../../../../actions/teamAction';
import { getSmallAvatarImage } from '../../../../helper/appHelper';

class leaderboardIndividualTab extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            countshow:'Overall',
            leaderBoardIndividualList: props.leaderBoardIndividualList,
            selectedTab: 0,
            isShowAll: false,
            isVisibleAll: false,
            arrSort:[{value: 2, label: "Best streak"},{value: 1, label: "Current streak"},{value: 0, label: "Total days"}]
        };
    }

    componentDidMount(){
        // if(this.props.navigation.state.params.selectedTab == 0){
        //     setTimeout(()=>{
        //     this.props.getleaderboardIndividualList(true);
        //     },1000);
        //     // this.labelClicked('Overall');
        // }else{
            setTimeout(()=>{
                this.props.getleaderboardIndividualList(true);
                // this.labelClicked('Overall');
            },2000);
        // }
    }

    labelClicked = (stateLabel, tabIndex = -1) => {
        console.log("call Label Clicked")
        let selectedTab = tabIndex;
        if(tabIndex === -1){
            selectedTab = this.state.selectedTab;
        }
        if(stateLabel !== "" && stateLabel != this.state.countshow) {
            this.setState({
                countshow: stateLabel,
                // leaderBoardIndividualList: sortList
            });
            if (selectedTab === 0) {
                this.props.getLeaderBoardIndividualFilterData(stateLabel).then((res) => {
                    // this.setListData(selectedTab,stateLabel)
                }).catch((err) => {
                    // this.setListData(selectedTab,stateLabel)
                })
            }
        }
    };

    setListData = (selectedTab,stateLabel) => {
        let allData = _.cloneDeep(this.props.individualLeaderBoard);
        let sortList = [];
        if(selectedTab === 0){
            switch (stateLabel)
            {
                case "Overall":
                    sortList = allData.overall;
                    break;
                case "This year":
                    sortList = allData.year;
                    break;
                case "This month":
                    sortList = allData.month;
                    break;
                case "This week":
                    sortList = allData.week;
                    break;
                case "America":
                    sortList = allData.america;
                    break;
                case "Europe":
                    sortList = allData.europe;
                    break;
                case "Asia":
                    sortList = allData.asia;
                    break;
                case "Pacific":
                    sortList = allData.pacific;
                    break;
            }
        }else if(selectedTab === 1){
            sortList = allData.currentStreak;
        }else{
            sortList = allData.bestStreak;
        }
        this.setState({
            countshow:stateLabel,
            // leaderBoardIndividualList: sortList
        });
    }

    onSwipeLeft = (gestureState) => {
        switch (this.state.countshow) {
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
                this.labelClicked("America");
                break;
            case "America":
                this.labelClicked("Europe");
                break;
            case "Europe":
                this.labelClicked("Asia");
                break;
            case "Asia":
                this.labelClicked("Pacific");
                break;
            case "Pacific":
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
            case "America":
                this.labelClicked("This week");
                break;
            case "Europe":
                this.labelClicked("America");
                break;
            case "Asia":
                this.labelClicked("Europe");
                break;
            case "Pacific":
                this.labelClicked("Asia");
                break;
        }
    };

    changeTab = (selected) => {
        LayoutAnimation.easeInEaseOut();
        if(this.state.selectedTab === selected && !this.state.isShowAll){
            this.setState({
                selectedTab: selected,
                isShowAll:true
            });
        }else{
            this.setState({
                selectedTab: selected,
                isShowAll:false
            });
        }
        this.labelClicked(this.state.countshow, selected);
        if(selected === 1){
            this.props.getLeaderBoardIndividualCurrentStreak()
        }else if(selected === 2){
            this.props.getLeaderBoardIndividualBestStreak()
        }
    };

    getCountValue = (item) => {
        if(this.state.selectedTab === 0) {
            return (this.state.countshow==="Overall") ? item.porn_free_days.counts.total :
                (this.state.countshow==="This year") ? item.porn_free_days.counts.current_year :
                    (this.state.countshow==="This month") ? item.porn_free_days.counts.current_month :
                        (this.state.countshow==="This week") ? item.porn_free_days.counts.current_week :
                            (this.state.countshow==="America") ? item.porn_free_days.counts.total :
                                (this.state.countshow==="Europe") ? item.porn_free_days.counts.total :
                                    (this.state.countshow==="Asia") ? item.porn_free_days.counts.total :
                                        (this.state.countshow==="Pacific") ? item.porn_free_days.counts.total :
                                            ""
        }else if(this.state.selectedTab === 1) {
            return item.porn_free_days.streaks.current
        }else{
            return item.porn_free_days.streaks.longest
        }
    };

    getListData = (item) => {
        if(this.state.selectedTab === 0) {
            return (this.state.countshow==="Overall") ? item.overall :
                (this.state.countshow==="This year") ? item.year :
                    (this.state.countshow==="This month") ? item.month :
                        (this.state.countshow==="This week") ? item.week :
                            (this.state.countshow==="America") ? item.america :
                                (this.state.countshow==="Europe") ? item.europe :
                                    (this.state.countshow==="Asia") ? item.asia :
                                        (this.state.countshow==="Pacific") ? item.pacific :
                                            ""
        }else if(this.state.selectedTab === 1) {
            return item.currentStreak
        }else{
            return item.bestStreak
        }
    };

    getAvatarImage = (memberDetail) => {
        if(memberDetail.is_current_user){
            return getSmallAvatarImage(memberDetail.avatar_id || 0, this.props.gender);
        }
        return getSmallAvatarImage(memberDetail.avatar_id || 0);
    };

    renderHeader = () => {
        if(this.state.selectedTab === 0){
            return <TopBarComponent onSwipeLeft={this.onSwipeLeft}
                                    labelClicked={this.labelClicked}
                                    countshow={this.state.countshow}
                                    appTheme={this.props.appTheme}
                                    onSwipeRight={this.onSwipeRight}/>
        }
        return null;
    };

    renderItems = ({item, index}) => {
        return(
            <LeaderBoardRow
                is_current_user={item.is_current_user}
                index={index+1}
                rank={item.rank}
                isTeam={false}
                key={index}
                appTheme={this.props.appTheme}
                userImage={this.getAvatarImage(item)}
                name={(item.is_current_user) ? "You":item.name}
                count={this.getCountValue(item)}/>
        );
    };

    renderSortElement = ({value, label}) => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
            return (
                <TouchableOpacity style={(this.state.selectedTab == value)&&
                [styles.selectedBtnView,{backgroundColor: appColor.selectedSortBtn}]
                || [styles.btnView,{backgroundColor: appColor.unselectedSortBtn}]}
                                  key={value}
                                  onPress={()=>this.changeTab(value)}>
                <Text style={styles.btnText}>
                    { label }
                </Text>
            </TouchableOpacity>
            )
    }

    render() {
        let views = [];
        let arr = this.state.arrSort;
        if(this.state.isShowAll){
            let selectedObj = _.find(arr, {value: this.state.selectedTab});
            let objIndex = _.findIndex(arr, {value: this.state.selectedTab});
            arr.splice(objIndex, 1);
            arr.push(selectedObj);
            arr.map((obj)=>{
                views.push(this.renderSortElement(obj));
            })
        }else{
            arr.map((obj)=>{
                if(obj.value === this.state.selectedTab) {
                    views.push(this.renderSortElement(obj));
                }
            })
        }
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container,{backgroundColor: appColor.scrollableViewBack}]}>
                <View style={{flex:1}}>
                    <FlatList
                        removeClippedSubviews={true}
                        data={this.getListData(this.props.individualLeaderBoard)}
                        automaticallyAdjustContentInsets={false}
                        //contentInset={{bottom:85}}
                        ListFooterComponent={
                            <View style={{height:80}}/>
                        }
                        ListHeaderComponent={this.renderHeader}
                        keyExtractor={(item, index) => {
                            return item.id.toString()
                        }}
                        initialNumToRender={10}
                        windowSize={5}
                        renderItem={this.renderItems}/>
                </View>
                <View style={{ left:16, right:0, bottom: 10,position: 'absolute', backgroundColor:'transparent'}}>
                    {views}
                </View>
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
    btnView:{
        marginBottom:10,
        height:40,
        width: (Constant.screenWidth > 350) && 130 || 118,
        borderRadius: 20,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: "rgb(128,170,182)"
    },
    selectedBtnView:{
        marginBottom:10,
        height:40,
        width: (Constant.screenWidth > 350) && 130 || 118,
        borderRadius: 20,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: Constant.backColor
    },
    btnText:{
        textAlign: 'center',
        color: '#FFF',
        fontFamily: Constant.font500,
        fontSize:14
    }
});

const mapStateToProps = state => {
    return {
        individualLeaderBoard:state.team.individualLeaderBoard,
        gender:state.user.userDetails.gender,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    getleaderboardIndividualList,
    getLeaderBoardIndividualFilterData,
    getLeaderBoardIndividualBestStreak,
    getLeaderBoardIndividualCurrentStreak
})(leaderboardIndividualTab);