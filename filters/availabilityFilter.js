function availabilityFilter(result, filter) {
    // Assuming result has startDate and endDate properties
    return result.startDate <= filter.startDate && result.endDate >= filter.endDate;
}

export { availabilityFilter };
