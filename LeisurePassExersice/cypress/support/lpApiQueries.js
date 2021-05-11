const URL = 'http://my-json-server.typicode.com/leisurepassgroup/SDET-interview';
const citysUrl = '/citys';
const attractionsUrl = '/attractions';

Cypress.Commands.add('GETallCities', () => {
    cy.request({
        method: 'GET',
        url: URL + citysUrl,

        timeout: 20000,
        failOnStatusCode: true,
    }).then((resp) => {
        cy.log(`Response:${JSON.stringify(resp.body)}`);
    });
});

Cypress.Commands.add('GETAllAttractionsToNY', (attraction='all') => {
    const parameters = { cityId: 1 };
    cy.request({
        method: 'GET',
        url: URL + attractionsUrl,
        qs: parameters,
        timeout: 30000,
        failOnStatusCode: true,
    }).then((resp) => {
        cy.log(`Response:${JSON.stringify(resp.body)}`);
    });
});

Cypress.Commands.add('GETMuseumAttractionsToNY', (attraction='all') => {
    const parameters = { cityId: 1, type: 'MUSEUM' };
    cy.request({
        method: 'GET',
        url: URL + attractionsUrl,
        qs: {
            cityId: 1,
            type: 'MUSEUM',
        },
        timeout: 30000,
        failOnStatusCode: true,
    }).then((resp) => {
        cy.log(`Response:${JSON.stringify(resp.body)}`);
    });
});