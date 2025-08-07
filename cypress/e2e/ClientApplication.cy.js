/// <reference types="cypress" />

describe('Client Application Tests', () => {
  
  // Handle the "Unexpected token '<'" error
  beforeEach(() => {
    cy.on('uncaught:exception', (err, runnable) => {
      console.log('Uncaught exception:', err.message)
      return false
    })
  })
  
  it('Concora Application Submission', () => {
    cy.visit('https://magwitch.qa.applystage.com/v2/?init_key=ddf873767784a837197bacd86e0c22a4abb6d25c84ddcbf3880a40e9da78a386')
    cy.contains('New Application').should('be.visible').click()
    
    cy.get('#loan_product_id').click()
    cy.contains('.ant-select-item', 'HVAC (New Air Conditioner)').should('be.visible').click()
    cy.get('#first_name').type('John')
    cy.get('#last_name').type('Doe')
    cy.get('#street_address').type('Hudnall Street')
    cy.wait(2000)
    cy.get('.street-addManually').should('be.visible').click()
    
    cy.get('#street_number').should('be.visible').type('3343')
    cy.get('#city').should('be.visible').type('Dallas')
    cy.get('#state_id').should('be.visible').type('Texas')
    cy.get('.ant-select-item-option-content').contains('Texas').should('be.visible').click()    
    cy.get('#zip_code').type('75235')
    cy.get('#ssn').type('111111111')
    cy.get('#date_of_birth').type('11112002')
    cy.get('#phone').type('1111111111')
    cy.get('#email').type('AspenPQFApp-1-600@test.com')
    cy.get('#email_confirmation').type('AspenPQFApp-1-600@test.com')
    cy.contains('Next').should('be.visible').click()
    
    cy.wait(5000)

    // Conditional: Click "Start New" button only if it's visible
    cy.get('body').then(($body) => {
        if ($body.find('button:contains("Start New")').length > 0) {
          cy.contains('button', 'Start New').should('be.visible').click()
          console.log('✅ "Start New" button found and clicked')
        } else {
          console.log('ℹ️ "Start New" button not found, proceeding...')
        }
      })
    
    cy.get('input[type="tel"][inputmode="numeric"]').first().clear().type('4124')
    cy.contains('Verify').should('be.visible').click()

    cy.wait(5000)

    
      
    
    cy.get('.ant-input-number-input').should('be.visible').clear().type('5000')
    cy.get('.ant-input-number-input').eq(1).should('be.visible').clear().type('50000')
    

    cy.get('#employment_status').click()
    
    cy.wait(1000)
    cy.contains('.ant-select-item-option-content', 'Employed').should('be.visible').click()
    
    

  })
}) 