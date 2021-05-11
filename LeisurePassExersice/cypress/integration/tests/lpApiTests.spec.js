// For cpmparing JSON contents
const _ = require('lodash');
/* ==================================================
                    API Tests
    NOTES:
    - No negative cases
    - Lodash used for check possible leak of query filters
   ==================================================*/
const museumAttraction = 'MUSEUM';

function compareIfExtraElements(content, key, queryFilter) {
    // Checks if response contains some subsets which were not filtered out
    const shouldNotBeHere = content.filter((element) => element[key] !== queryFilter);
    if (Object.keys(shouldNotBeHere).length !== 0) {
        cy.log(typeof Object.keys(shouldNotBeHere));
        cy.log(`WARNING - Extra type(s) found which should not be on response: ${JSON.stringify(shouldNotBeHere)}`);
    }
}

describe('Leisure Pass Group API tests', () => {
    before('Suite Setup', () => {
        cy.log('Suite setup');
    });

    it('GET Museum New York attractions', () => {
        cy.GETMuseumAttractionsToNY().then((response) => {
            const respBody = response.body;
            // NOTE: Just to help to clarify if 'MUSEUM' filter leaks
            compareIfExtraElements(respBody, 'type', 'MUSEUM');
            cy.fixture('LPNyMuseums').then((contentOrig) => {
                cy.log(`Comaparing JSON contents`);
                assert.isTrue(_.isEqual(respBody, contentOrig).valueOf(), 'New Yourk Museum Attraction response status OK?:');
            });
        });
    });

    it('GET All cities', () => {
        cy.GETallCities().then((response) => {
            const respBody = response.body;
            cy.fixture('LPAllCities').then((contentOrig) => {
                cy.log(`Comaparing JSON contents`);
                assert.isTrue(_.isEqual(respBody, contentOrig).valueOf(), 'All Cities response status OK?:');
            });
        });
    });

    
    it('GET All New York Attractions', () => {
        cy.GETAllAttractionsToNY().then((response) => {
            const respBody = response.body;
            // NOTE: Just to help to clarify if 'cityId' filter leaks
            compareIfExtraElements(respBody, 'cityId', '1');
            cy.fixture('LPAllNYAtractions').then((contentOrig) => {
                cy.log(`Comaparing JSON contents`);
                assert.isTrue(_.isEqual(respBody, contentOrig).valueOf(), 'All New Yourk Attraction response status OK?:');
            });
        });
    });
});
