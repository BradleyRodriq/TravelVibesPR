function featuresFilter(result, filter) {
    return filter.every(feature => result.features.includes(feature));
}

export { featuresFilter };
