import {wkid} from "../const";

export const resolveGeometry = async (foundAddress, radius) => {
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
    let myUrl =    "https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer/buffer?f=json&unit=9036&unionResults=false&geodesic=false&geometries=" + parsedGeo +"&inSR=102100&distances=" + radius + "&outSR=102100&bufferSR=102100";
    return await fetch(myUrl, requestOptions)
        .then(response => response.json())
        .then(response => response.geometries[0])
        .catch(error => console.log('error', error));
};
