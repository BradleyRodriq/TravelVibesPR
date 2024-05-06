const puertoRicoBounds = {
    minLat: 17.831509,
    maxLat: 18.515685,
    minLon: -67.945404,
    maxLon: -65.220703
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

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

export { locationFilter };
