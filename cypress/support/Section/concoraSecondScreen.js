export function concoraSecondScreen(financingAmount, annualIncome) 
{
    cy.get('.ant-input-number-input', { timeout: 30000 }).should('be.visible')
    cy.get('input[aria-valuemax="300000"].ant-input-number-input').should('be.visible').clear().type(financingAmount)
    cy.get('input[aria-valuemax="1000000"].ant-input-number-input').should('be.visible').clear().type(annualIncome)
    cy.get('#checkbox').check({ force: true })
    cy.contains('button', 'Submit').should('be.visible').click()
}


export function MultipleSecondScreen(financingAmount, annualIncome,propertyStatus) 
{
    cy.get('.ant-input-number-input', { timeout: 30000 }).should('be.visible')
    cy.get('input[aria-valuemax="300000"].ant-input-number-input').should('be.visible').clear().type('5000')
    cy.get('input[aria-valuemax="100000"].ant-input-number-input').should('be.visible').clear().type('500')
    cy.get('input[aria-valuemax="1000000"].ant-input-number-input').should('be.visible').clear().type('50000')
    cy.get('input[aria-valuemax="10000000"].ant-input-number-input').should('be.visible').clear().type('50000')
    cy.get('#employment_status').click()
    cy.wait(1000)
    cy.contains('.ant-select-item-option-content', 'Employed').should('be.visible').click()
    
    cy.get('#checkbox').check({ force: true })
    cy.contains('button', 'Submit').should('be.visible').click()
}



