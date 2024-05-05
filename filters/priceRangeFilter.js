function priceRangeFilter(result, filter) {
    return result.price >= filter.min && result.price <= filter.max;
}

module.exports = priceRangeFilter;
