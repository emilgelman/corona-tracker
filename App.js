import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {ListItem} from "react-native-elements";

const wkid = {"wkid":102100,"latestWkid":3857};
export default class App extends Component {
  state = {
    places: []
  };

  constructor(props) {
    super(props);
    this._loadShit();
  }

  _resolveAddress = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      return Promise.reject("No permissions");
    }
    let location = await Location.getCurrentPositionAsync({});
    return await Location.reverseGeocodeAsync({longitude: location.coords.longitude, latitude: location.coords.latitude})
        .then(response => response[0].name.slice(0,-1) + ' ' + response[0].city);
  };

  _loadShit = async () => {
    await this._resolveAddress()
        .then(address => {
          console.log(address);
          this._findAddress(address)
              .then(foundAddress => {
                this._buffer(foundAddress)
                    .then(geometry => {
                      this._query(geometry)
                          .then(data => {
                            let arr = data.features.map(i => {
                              const container = {};
                              container.id = i.attributes.OBJECTID;
                              container.place = i.attributes.Place;
                              container.fromDate = i.attributes.fromTime;//.toLocaleDateString('he-IL');
                              container.toDate = i.attributes.toDate;//.toLocaleDateString('he-IL');
                              container.stayTimes = i.attributes.stayTimes;
                              return container;
                            });
                            arr.sort((a, b) => b.fromDate - a.fromDate);
                            arr.map(i => {
                              i.fromDate = new Date(i.fromDate).toLocaleDateString('he-IL');
                              i.toDate = new Date(i.toDate).toLocaleDateString('he-IL');
                            });
                            this.setState( {places: arr})
                          })
                    })
              })
        })

  };


  _findAddress = async (address) => {
    var myHeaders = new Headers();
    myHeaders.append("Referer", "https://imoh.maps.arcgis.com/apps/webappviewer/index.html?id=20ded58639ff4d47a2e2e36af464c36e&locale=he&/");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36");
    myHeaders.append("Sec-Fetch-Dest", "empty");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let parsedWkid = encodeURI(JSON.stringify(wkid));
    let parsedAddress = encodeURI(address);
    // fetch("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=moshe%20sneh%20street%2032%20haifa&f=json&outSR=%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D&outFields=*&countryCode=ISR&maxLocations=6", requestOptions)
    return await fetch("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=" + parsedAddress + "&f=json&outSR="+ parsedWkid + "&outFields=*&countryCode=ISR&maxLocations=6", requestOptions)
        .then(response => response.json())
        .then(response => response.candidates[0].location)
        .catch(error => console.log('error', error));
  };

  _buffer = async (foundAddress) => {
    var myHeaders = new Headers();
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Origin", "https://imoh.maps.arcgis.com");
    myHeaders.append("Sec-Fetch-Site", "cross-site");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Referer", "https://imoh.maps.arcgis.com/apps/webappviewer/index.html?id=20ded58639ff4d47a2e2e36af464c36e&locale=he&/");
    myHeaders.append("Accept-Language", "en-US,en;q=0.9");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let geometries = {"geometryType":"esriGeometryPoint","geometries":[{"x":foundAddress.x,"y":foundAddress.y,"spatialReference":{"wkid":wkid.wkid,"latestWkid":wkid.latestWkid}}]};
    let parsedGeo = encodeURI(JSON.stringify(geometries));
    let origUrl =  "https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer/buffer?f=json&unit=9036&unionResults=false&geodesic=false&geometries=%7B%22geometryType%22%3A%22esriGeometryPoint%22%2C%22geometries%22%3A%5B%7B%22x%22%3A3894070.4313595863%2C%22y%22%3A3864264.0276171053%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D%5D%7D&inSR=102100&distances=5&outSR=102100&bufferSR=102100";
    let myUrl =    "https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer/buffer?f=json&unit=9036&unionResults=false&geodesic=false&geometries=" + parsedGeo +"&inSR=102100&distances=15&outSR=102100&bufferSR=102100";
    return await fetch(myUrl, requestOptions)
        .then(response => response.json())
        .then(response => response.geometries[0])
        .catch(error => console.log('error', error));
  };

  _query = async (geometry) => {
    let completeGeo = {rings : geometry.rings, spatialReference:{ "wkid":102100,"latestWkid":3857}};
    let parsedGeo = JSON.stringify(completeGeo);
    var details = {
      'f': 'json',
      'returnGeometry': 'true',
      'spatialRel': 'esriSpatialRelIntersects',
      'geometryType': 'esriGeometryPolygon',
      'inSR' : '102100',
      'outSR' : '102100',
      'outFields': '*',
      'geometry': parsedGeo
    };

    let formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return await fetch('https://services5.arcgis.com/dlrDjz89gx9qyfev/arcgis/rest/services/Corona_Exposure_View/FeatureServer/0/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(response => response.json())
        .catch(err => console.log('error', err));
  };

  render() {
    return (
        <ScrollView>
          {this.state.places.length > 0 ?
                  this.state.places.map((l, i) => (
                      <ListItem
                          key={i}
                          badge={{}}
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
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
    textAlign: 'right',
    flex: 1
  }
});
