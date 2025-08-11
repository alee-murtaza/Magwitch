

// Function to handle basic client application screen
export function basicScreen(
  initKey,
  firstName,
  lastName, 
  streetAddress,
  streetNumber,
  city,
  stateId,
  zipCode,
  ssn,
  dateOfBirth,
  phone,
  email
) {
  // Handle the "Unexpected token '<'" error for client application
  cy.on('uncaught:exception', (err, runnable) => {
    console.log('Client app uncaught exception:', err.message)
    return false
  })
  
  cy.visit(`https://magwitch.qa.applystage.com/v2/?init_key=${initKey}`)
  cy.contains('New Application').should('be.visible').click()
  
  // Fill the application form
  cy.get('#loan_product_id').click()
  cy.contains('.ant-select-item', 'HVAC (New Air Conditioner)').should('be.visible').click()
  cy.get('#first_name').type(firstName)
  cy.get('#last_name').type(lastName)
  cy.get('#street_address').type(streetAddress)
  cy.wait(2000)
  cy.get('.street-addManually').should('be.visible').click()
  
  cy.get('#street_number').should('be.visible').type(streetNumber)
  cy.get('#city').should('be.visible').type(city)
  cy.get('#state_id').should('be.visible').type(stateId)
  cy.get('.ant-select-item-option-content').contains(stateId).should('be.visible').click()    
  cy.get('#zip_code').type(zipCode)
  cy.get('#ssn').type(ssn)
  cy.get('#date_of_birth').type(dateOfBirth)
  cy.get('#phone').type(phone)
  cy.get('#email').type(email)
  cy.get('#email_confirmation').type(email)
  cy.contains('Next').should('be.visible').click()
  
  cy.wait(2000)

  // Conditional: Click "Start New" button only if it's visible
  cy.get('body').then(($body) => 
  {
    if ($body.find('button:contains("Start New")').length > 0) 
    {
      cy.contains('button', 'Start New').should('be.visible').click()
      console.log('Start New')
    } 
    else 
    {
      console.log('Incomplete Application Not Found')
    }
  })
  
  // OTP Handling with retry logic
  cy.get('input[type="tel"][inputmode="numeric"]').first().clear().type('4124')
  cy.contains('Verify').should('be.visible').click()
  cy.wait(5000)

  cy.get('body').then(($body) => {
    const errorDiv = $body.find('div.flex.items-center.justify-center').filter(':contains("Invalid OTP! Please try again.")')
    if (errorDiv.length > 0 || $body.text().includes('Invalid OTP! Please try again.')) 
    {
      console.log('Invalid OTP detected, waiting for 5 minutes timer...')
      cy.wait(300000)
      cy.get('span').contains('Resend').should('be.visible').click()
      console.log('Resend button clicked')
      cy.wait(2000)
      cy.get('input[type="tel"][inputmode="numeric"]').first().clear().type('4124')
      cy.contains('Verify').should('be.visible').click()
      console.log('OTP re-entered and verify clicked') 
    } 
    else 
    {
      console.log('OTP accepted on first try')
    }
  })
}