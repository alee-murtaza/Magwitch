/// <reference types="cypress" />

import { deleteExistingApplications } from '../support/Section/firstScreen.js'

describe('Client Application Tests', () => {
  it('Concora Application Submission', () => {
    cy.visit('https://qa-api.loginstage.com/qa-portal')
    deleteExistingApplications('666000001')
    
    cy.origin('https://magwitch.qa.applystage.com', () => {

      // Handle the "Unexpected token '<'" error for client application
      cy.on('uncaught:exception', (err, runnable) => {
        console.log('Client app uncaught exception:', err.message)
        return false
      })
      
      cy.visit('https://magwitch.qa.applystage.com/v2/?init_key=ddf873767784a837197bacd86e0c22a4abb6d25c84ddcbf3880a40e9da78a386')
      cy.contains('New Application').should('be.visible').click()
      
      // Fill the application form
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
      cy.get('#ssn').type('666000001')
      cy.get('#date_of_birth').type('11112002')
      cy.get('#phone').type('1111111111')
      cy.get('#email').type('AspenPQFApp-1-600@test.com')
      cy.get('#email_confirmation').type('AspenPQFApp-1-600@test.com')
      cy.contains('Next').should('be.visible').click()
      

      cy.wait(2000)

      // Conditional: Click "Start New" button only if it's visible
      cy.get('body').then(($body) => {
          if ($body.find('button:contains("Start New")').length > 0) {
            cy.contains('button', 'Start New').should('be.visible').click()
            console.log('Start New')
          } else {
            console.log('Incomplete Application Not Found')
          }
        })
      
      // OTP Handling with retry logic
      cy.get('input[type="tel"][inputmode="numeric"]').first().clear().type('4124')
      cy.contains('Verify').should('be.visible').click()

      // Wait 5 seconds after clicking verify to allow processing
      cy.wait(5000)

      // Check if "Invalid OTP" error message appears
      cy.get('body').then(($body) => {
        const errorDiv = $body.find('div.flex.items-center.justify-center').filter(':contains("Invalid OTP! Please try again.")')
        if (errorDiv.length > 0 || $body.text().includes('Invalid OTP! Please try again.')) {
          console.log('❌ Invalid OTP detected, waiting for 5 minutes timer...')
          cy.wait(300000)
          cy.get('span').contains('Resend').should('be.visible').click()
          console.log('📱 Resend button clicked')
          cy.wait(2000)
          cy.get('input[type="tel"][inputmode="numeric"]').first().clear().type('4124')
          cy.contains('Verify').should('be.visible').click()
          console.log('🔄 OTP re-entered and verify clicked') 
        } else {
          console.log('✅ OTP accepted on first try')
        }
      })


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

      console.log('✅ Application submission completed successfully!')
    })
  })
}) 