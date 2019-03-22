import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AppState
} from 'react-native';
import Constant from '../../../../../helper/constant';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const today = moment().format("YYYY-MM-DD");
export default  class CalendarComponent extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            todayDate: new Date(),
            visibleTab: props.visibleTab,
            appState: AppState.currentState
        };
    }

    // shouldComponentUpdate(nextProps) {
    //     if(this.state.visibleTab !== nextProps.visibleTab){
    //         return true;
    //     }
    //     return false;
    // }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.setState({
                todayDate:new Date()
            })

        }
        this.setState({appState: nextAppState});
    }

    render() {

        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
            return (
            <View style={[styles.container,{backgroundColor:appColor.scrollableViewBack}]}>
                    <Calendar
                        ref="cal"
                        current={moment().format('YYYY-MM-DD')}
                        theme={appColor.statisticCalendar}
                        onDayPress={(day) => {}}
                        monthFormat={'MMMM yyyy'}
                        onMonthChange={(month) => {}}
                        hideArrows={false}
                        renderArrow={(direction) => (
                            <Ionicons name={(direction == 'left') ? 'ios-arrow-back' : 'ios-arrow-forward'}
                                      size={30}
                                      color={appColor.arrowColor}/>
                        )}
                        maxDate={this.state.todayDate}
                        hideExtraDays={true}
                        disableMonthChange={false}
                        firstDay={1}
                        markedDates={this.props.markedDates}
                        markingType={'interactive'}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
        alignItems:'center',
        alignSelf:'center',
        width:'90%'
    },
});
