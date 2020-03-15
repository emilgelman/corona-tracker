import React, {Component} from 'react';
import {StyleSheet, View} from "react-native";
import {Button} from 'react-native-elements';
import {Icon} from "expo";
import {Video} from "expo-av";

export default class App extends Component {


    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={styles.container}>

               <Video
                   source={require('./assets/corona.mp4')}
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
                       <Button
                           title="חיפוש"
                           titleStyle={{ fontWeight: 'bold', color: 'white', fontSize: 48 }}
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
                           iconLeft
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
            alignItems: 'center'
        },
        backgroundVideo: {
            position: "absolute",
            top: 0,
            left: 0,
            alignItems: "stretch",
            bottom: 0,
            right: 0
        }
    }
);

