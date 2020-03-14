import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ListItem} from "react-native-elements";
import {findAddress, resolveAddress} from "./api/AddressResolver";
import {resolveGeometry} from "./api/GeometryResolver";
import {formatResponse, query} from "./api/Querier";
import { I18nManager } from 'react-native'

export default class App extends Component {
  state = {
    places: []
  };

  constructor(props) {
    super(props);
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      this._loadData();
  }



  _loadData = async () => {
    await resolveAddress()
        .then(address => {
          console.log(address);
          findAddress(address)
              .then(foundAddress => {
                resolveGeometry(foundAddress)
                    .then(geometry => {
                      query(geometry)
                          .then(data => {
                            let arr = formatResponse(data);
                            this.setState( {places: arr})
                          })
                    })
              })
        })

  };

  render() {
    return (
        <ScrollView>
          {this.state.places.length > 0 ?
                  this.state.places.map((l, i) => (
                      <ListItem
                          key={i}
                          title={
                            <View style={styles.titleView}>
                              <Text style={styles.ratingText}>{l.place}</Text>
                            </View>
                          }
                          subtitle={
                            <View style={styles.titleView}>
                              <Text style={styles.ratingText}>{l.fromDate} : {l.stayTimes}</Text>
                            </View>
                          }
                          badge={{containerStyle: { position: 'absolute', paddingLeft: 5 }}}
                          bottomDivider
                      />
                  ))
              :
              <Text>loading</Text>
          }
        </ScrollView>
    )
  }
}



const styles = StyleSheet.create({
  titleView: {
    paddingLeft: 5,
    paddingTop: 5,
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
  },
  ratingText: {
    paddingLeft: 5,
    color: 'grey',
    textAlign: 'right',
    flex: 1
  },
    badge: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    }
});
