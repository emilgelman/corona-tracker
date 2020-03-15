import React, {Component} from 'react';
import {Slider, StyleSheet, Text, View} from "react-native";
import {Button} from 'react-native-elements';
import {Icon} from "expo";
import {Video} from "expo-av";

export default class HomeScreen extends Component {
    state = {
        value: 5
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Video
                    source={require('../assets/corona.mp4')}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.backgroundVideo}

                >
                </Video>
                <View style={styles.loginButtonSection}>
                    <Text style={styles.text}>רדיוס:</Text>
                    <Slider
                        style={{width: 300}}
                        step={1}
                        minimumValue={5}
                        maximumValue={15}
                        value={this.state.value}
                        onValueChange={val => this.setState({value: val})}
                    />
                    <Text style={styles.text}>{this.state.value}</Text>
                    <Button
                        title="חיפוש"
                        onPress={() => this.props.navigation.navigate('Details', {radius: this.state.value})}
                        titleStyle={{fontWeight: 'bold', color: 'white', fontSize: 48}}
                        type="outline"
                        buttonStyle={{
                            borderWidth: 1,
                            borderColor: 'white',
                            borderRadius: 20,
                        }}
                        icon={{
                            name: 'search',
                            type: 'font-awesome',
                            size: 48,
                            color: 'white',
                        }}
                        iconRight
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center'
        },
        button: {
            borderColor: 'white',
            padding: 12,
        },
        loginButtonSection: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 300
        },
        backgroundVideo: {
            position: "absolute",
            top: 0,
            left: 0,
            alignItems: "stretch",
            bottom: 0,
            right: 0
        },
        text: {
            color: 'white',
            fontSize: 24
        }
    }
);
