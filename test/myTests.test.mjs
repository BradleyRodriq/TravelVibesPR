import { describe, it } from 'mocha';
import { expect } from 'chai';

import { locationFilter } from '../filters/locationFilter.js';
import { categoryFilter } from '../filters/categoryFilter.js';
import { priceRangeFilter } from '../filters/priceRangeFilter.js';
import { ratingFilter } from '../filters/ratingFilter.js';
import { availabilityFilter } from '../filters/availabilityFilter.js';
import { featuresFilter } from '../filters/featuresFilter.js';
import { vibesFilter } from '../filters/vibesFilter.js';
import { popularityFilter } from '../filters/popularityFilter.js';

describe('Filters', () => {
    const locationResult = { lat: 18.4655, lng: -66.1057 };
    const locationFilterData = { center: { lat: 18.4655, lng: -66.1057 }, radius: 20 };
    const categoryResult = 'Hotel';
    const categoryFilterData = 'Hotel';
    const priceRangeResult = 50;
    const priceRangeFilterData = { min: 30, max: 70 };
    const ratingResult = 4;
    const ratingFilterData = 4;
    const availabilityResult = { startDate: '2024-05-01', endDate: '2024-05-07' };
    const availabilityFilterData = { startDate: '2024-04-01', endDate: '2024-06-30' };
    const featuresResult = ['Free Wi-Fi', 'Pet-friendly'];
    const featuresFilterData = ['Free Wi-Fi'];
    const distanceResult = 10;
    const distanceFilterData = { lat: 18.2208, lng: -66.5901, maxDistance: 15 };
    const vibesResult = 'Relaxing';
    const vibesFilterData = 'Relaxing';
    const popularityResult = 100;
    const popularityFilterData = 100;

    it('should filter location', () => {
        expect(locationFilter(locationResult, locationFilterData)).to.be.true;
    });

    it('should filter category', () => {
        expect(categoryFilter(categoryResult, categoryFilterData)).to.be.true;
    });

    it('should filter price range', () => {
        expect(priceRangeFilter(priceRangeResult, priceRangeFilterData)).to.be.true;
    });

    it('should filter rating', () => {
        expect(ratingFilter(ratingResult, ratingFilterData)).to.be.true;
    });

    it('should filter availability', () => {
        expect(availabilityFilter(availabilityResult, availabilityFilterData)).to.be.true;
    });

    it('should filter features', () => {
        expect(featuresFilter(featuresResult, featuresFilterData)).to.be.true;
    });

    it('should filter distance', () => {
        expect(distanceFilter(distanceResult, distanceFilterData)).to.be.true;
    });

    it('should filter vibes', () => {
        expect(vibesFilter(vibesResult, vibesFilterData)).to.be.true;
    });

    it('should filter popularity', () => {
        expect(popularityFilter(popularityResult, popularityFilterData)).to.be.true;
    });
});
