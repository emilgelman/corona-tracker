export const query = async (geometry) => {
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

export const formatResponse = (response) => {
    let arr = response.features.map(i => {
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
    });
    return arr;
};
