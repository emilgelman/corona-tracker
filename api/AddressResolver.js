import {wkid} from "../const";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export const resolveAddress = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        return Promise.reject("No permissions");
    }
    let location = await Location.getCurrentPositionAsync({});
    return await Location.reverseGeocodeAsync({longitude: location.coords.longitude, latitude: location.coords.latitude})
        .then(response => response[0].name.slice(0,-1) + ' ' + response[0].city);
};


export const findAddress = async (address) => {
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
    return await fetch("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=" + parsedAddress + "&f=json&outSR="+ parsedWkid + "&outFields=*&countryCode=ISR&maxLocations=6", requestOptions)
        .then(response => response.json())
        .then(response => response.candidates[0].location)
        .catch(error => console.log('error', error));
};
