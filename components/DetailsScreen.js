import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ListItem} from "react-native-elements";
import {findAddress, resolveAddress} from "../api/AddressResolver";
import {resolveGeometry} from "../api/GeometryResolver";
import {formatResponse, query} from "../api/Querier";

export default class DetailsScreen extends Component {
  state = {
    places: []
  };

  constructor(props) {
    super(props);
    const {radius} = this.props.route.params;
    this._loadData(radius);
  }



  _loadData = async (radius) => {
    await resolveAddress()
        .then(address => {
          console.log(address);
          findAddress(address)
              .then(foundAddress => {
                resolveGeometry(foundAddress, radius)
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
        <ScrollView contentContainerStyle={styles.viewStyle}>
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
                          badge={{containerStyle: { paddingLeft: 5 }}}
                          bottomDivider
                      />
                  ))
              :
              <Text style={styles.loadingText}>טוען...</Text>
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
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
  },
  ratingText: {
    paddingLeft: 5,
    color: 'grey',
    textAlign: 'right',
    flex: 1
  },
    loadingText: {
        textAlign: 'right',
    },
    viewStyle: {
    }
});
