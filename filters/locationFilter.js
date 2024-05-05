const puertoRicoBounds = {
    minLat: 17.831509,
    maxLat: 18.515685,
    minLon: -67.945404,
    maxLon: -65.220703
};

function locationFilter(result, filter) {
    if (
        filter.lat < puertoRicoBounds.minLat ||
        filter.lat > puertoRicoBounds.maxLat ||
        filter.lng < puertoRicoBounds.minLon ||
        filter.lng > puertoRicoBounds.maxLon
    ) {
        return false;
    }

    const distance = calculateDistance(result.lat, result.lng, filter.lat, filter.lng);
    return distance <= filter.radius;
}

module.exports = locationFilter;
