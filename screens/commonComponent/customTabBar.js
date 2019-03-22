import {getTeamChat, getTeamDetail} from "../../actions/teamAction";

const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity
} = ReactNative;
import Constant from '../../helper/constant';
import { connect } from 'react-redux';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';

const CustomTabBar = createReactClass({
    propTypes: {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
        backgroundColor: PropTypes.string,
        activeTextColor: PropTypes.string,
        inactiveTextColor: PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: ViewPropTypes.style,
        renderTab: PropTypes.func,
        underlineStyle: ViewPropTypes.style,
    },

    getDefaultProps() {
        return {
            activeTextColor: 'navy',
            inactiveTextColor: 'black',
            backgroundColor: null,
        };
    },

    renderTabOption(name, page) {
    },

    renderTab(name, page, isTabActive, onPressHandler) {
        const { activeTextColor, inactiveTextColor, textStyle } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        return <TouchableOpacity  style={{flex: 1, }}
                                     key={name}
                                     accessible={true}
                                     accessibilityLabel={name}
                                     accessibilityTraits='button'
                                     onPress={() => onPressHandler(page)}>
            <View style={[styles.tab, this.props.tabStyle, {flexDirection:'row', justifyContent:'center'}]}>
                <View>
                    <Text style={[{color: textColor,  fontFamily:Constant.font500, fontSize:14, paddingTop:(Constant.isIOS) ? 30 : 15}]}>
                        {name}
                    </Text>
                </View>
                {
                    (name === "Team chat" && this.props.appBadgeCount && this.props.appBadgeCount !== 0) &&
                    <View style={{backgroundColor:'red', marginTop:(Constant.isIOS) ? 30 : 15, padding:2, justifyContent:'center', alignItems:'center',
                    borderRadius:15, maxWidth:70, minWidth:20, height:20, marginLeft:10}}>
                        <Text style={[{color: "#FFF", fontFamily:Constant.font700, fontSize:12, backgroundColor:'transparent', }]}>
                            {this.props.appBadgeCount}
                        </Text>
                    </View>
                    || null
                }

            </View>
        </TouchableOpacity>;
    },

    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 4,
            backgroundColor: 'navy',
            bottom: 0,
        };

        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0,  containerWidth / numberOfTabs],
        });
        return (
            <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    const renderTab = this.props.renderTab || this.renderTab;
                    return renderTab(name, page, isTabActive, this.props.goToPage);
                })}
                <Animated.View
                    style={[
                        tabUnderlineStyle,
                        {
                            transform: [
                                { translateX },
                            ]
                        },
                        this.props.underlineStyle,
                    ]}
                />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#ccc',
    },
});

const mapStateToProps = state => {
    return {appBadgeCount: state.user.appBadgeCount
        };
};

export default connect(mapStateToProps, {
})(CustomTabBar);