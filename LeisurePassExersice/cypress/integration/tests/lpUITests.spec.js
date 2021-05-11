const mocha = require("mocha");

/* ==========================================================================
        UI Tests for Historic Sightseeing Cruise - attraction - journey
    NOTES:
    - There could be some negative TC:s
    - Testing happypath to Historic Sightseeing Cruise - attraction until payment
    - All possible is not tested during this journey (limited time)
   ========================================================================== */
describe('Leisure Pass Group API tests - User Journey attraction Harward', () => {
    before('Suite Setup', () => {
        cy.log('Suite setup');
        cy.visit('/');
    });

    it('Main page', () => {
        cy.log('Verify content on Main page');
        // First line headers
        cy.get('.region-navigation').should('contain', 'Main navigation').and('contain', 'All-Inclusive')
            .and('contain', 'Explorer').and('contain', 'FAQs').and('contain', 'COVID-19');
        // Check Country drop-down - selection.
        // English / USA is default so no need to select on start.
        cy.get('#block-language-switcher-dropdown > div > div > div > div > ul').find('li') // multiple elements selected
            .invoke('text')
            .should('contain', 'Spanish').and('contain', 'Chinese, Simplified').and('contain', 'French');
        // Second line headers - Our journey follows "What's included"
        cy.get('.pass-product-secondary-links > .row').should('contain', "What's included")
            .and('contain', 'How it works').and('contain', 'Attractions').and('contain', 'Plan your trip');
        // NOTE: Verifying only basics on the main page (there is still more to test but time was limited)
    });

    it('What\'s included page', () => {
        // Start to spy when we has redirect to what-you-get - page
        cy.intercept('GET', 'https://gocity.com/boston/en-us/products/all-inclusive/what-you-get').as('whatyouget');
        // Click "What's included" - link
        cy.get('.secondary-menu > li:nth-of-type(1) > a').click({ force: true });
        cy.wait('@whatyouget').then(({ _, response }) => {
            mocha.expect(response.statusCode).to.equal(200);
        });
        // Page Header
        cy.get('.content__title').contains("What’s included with the Go Boston All-Inclusive pass");
        // Page options
        cy.get("[data-block-plugin-id='entity_field\:node\:field_pass_product_wyg_cta']")
            .should('contain', 'Boston Duck Tour').should('contain', 'Admission to all top attractions')
            .should('contain', 'New England Aquarium').should('contain', 'Museum of Science');
    });

    it('All top attractiuons page', () => {
        cy.intercept('GET', 'https://gocity.com/boston/en-us/products/all-inclusive/attractions').as('attractions');
        // Click to see "Admission to all top attractions"
        cy.get('.field--item:nth-of-type(1) .cta--link').click();
        cy.wait('@attractions').then(({ _, response }) => {
            mocha.expect(response.statusCode).to.equal(200);
        });
        // Page Header
        cy.get('.content__title').contains('All-in admission to the most popular Boston attractions')
    });

    it('Historic Sightseeing page', () => {
        cy.intercept('GET', 'https://gocity.com/boston/en-us/products/all-inclusive/attractions/historic-sightseeing-cruise')
            .as('historic');
        // Historic sightseeing cruise
        cy.get("a[title='Historic Sightseeing Cruise']", { timeout: 7000 }).click();
        cy.wait('@historic').then(({ _, response }) => {
            mocha.expect(response.statusCode).to.equal(200);
        });
        // Buy pass
        cy.get('.attraction-cta.passproduct-cta').click();
        // 1 day pass 
        cy.get(".slick-track [tabindex='-1']:nth-of-type(6) .lc-products-list__item-select").click();
        // Increase number of persons
        cy.wait(1000) // Ugly hack to get click() working.Should never use waits.
        cy.get(':nth-child(3) > .lc-cart__item-amount-wrapper > .lc-cart__item-amount').contains('+').click({ force: true });
        // Verify that increase number of persons worked
        cy.get('.lc-cart__items .lc-cart__item:nth-of-type(3) .lc-cart__item-amount-value', { timeout: 5000 }).should('contain', '2');
    });

    it('Checkout process', () => {
        cy.get('.lc-cart__purchase').click();
        // Wait the page to load
        cy.contains('When will you be visiting Boston?', {timeout: 5000})
        // Give date
        cy.get('[placeholder]').type('05-27-2021', { force: true }).should('have.value', '05-27-2021');
        // Righthand side summary content. 
        // NOTE: prices are dynamic, should use some JSON values which will be updated on the start by valid once. 
        cy.get('.lc-cart').should('contain', 'Your Cart').and('contain', 'Price per pass')
            .and('contain', '$152');
    });

    it('Payment page', () => {
        cy.intercept('POST', 'https://www.paypal.com/xoplatform/logger/api/logger').as('payment');
        cy.get('.block-region-first [data-testid]').click();
        cy.wait('@payment').then(({ _, response }) => {
            mocha.expect(response.statusCode).to.equal(200);
        });
    });
});
