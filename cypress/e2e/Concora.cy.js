/// <reference types="cypress" />
import {basicScreen} from '../support/Section/firstScreen.js'
import {deleteExistingApplications} from '../support/Section/existingFound.js'
import { concoraSecondScreen } from '../support/Section/concoraSecondScreen.js'

describe('Client Application Tests', () => {
  it('Concora Application Submission', () => {
    //cy.visit('https://qa-api.loginstage.com/qa-portal')
    //deleteExistingApplications('666000001')
    
    //cy.origin('https://magwitch.qa.applystage.com', { args: { basicScreen } }, ({ basicScreen }) => {
    basicScreen(
      '7eddb3ac914f04a89aaa74ff8690bb9477f2c537b446d80f33a1bb289b25a662',        // initKey
      'John',           // firstName
      'Doe',            // lastName
      'Hudnall Street', // streetAddress
      '3343',           // streetNumber
      'Dallas',         // city
      'Texas',          // stateId
      '75235',          // zipCode
      '893629272',      // ssn
      '11112002',       // dateOfBirth
      '8695593730',     // phone
      'AspenPQFApp-1-600@test.com' // email
    )
    
    concoraSecondScreen(5000, 50000)
    
    // Wait for the Unlock button to be visible and click it
    cy.contains('button', 'Unlock Application', { timeout: 3000000 }).should('be.visible').click()
    
    // Intercept the process API call and log the id from response
    cy.intercept('POST', '**/process**').as('processApi')
    cy.wait('@processApi').then((interception) => {
        const response = interception.response.body
        const applicationId = response.next.screen.params.application.id
        console.log('Process API Response ID:', applicationId)
        cy.log('Process API Response ID:', applicationId)
        
        // Handle login using cy.origin for cross-origin support
        cy.origin('https://magwitch.qa.loginstage.com', { args: { applicationId } }, ({ applicationId }) => {
            // Use the correct login URL
            cy.visit('https://magwitch.qa.loginstage.com/login', { timeout: 30000 })
            cy.log('Navigated to correct login URL')
            
            // Check current URL
            cy.url().then((url) => {
                cy.log('Current URL:', url)
            })
            
            // Wait for page to load
            cy.wait(5000)
            
            // Debug: Log all available elements
            cy.get('input').then(($inputs) => {
                cy.log('Total input elements found:', $inputs.length)
                $inputs.each((index, element) => {
                    cy.log(`Input ${index}: type=${element.type}, placeholder=${element.placeholder}, id=${element.id}`)
                })
            })
            
            cy.get('button').then(($buttons) => {
                cy.log('Total button elements found:', $buttons.length)
                $buttons.each((index, element) => {
                    cy.log(`Button ${index}: text=${element.textContent}, type=${element.type}`)
                })
            })
            
            // Try to find and fill login form with more flexible selectors
            cy.get('input').then(($inputs) => {
                if ($inputs.length > 0) {
                    // Find email input (first text/email input)
                    const emailInput = $inputs.filter('[type="text"], [type="email"], [placeholder*="email"], [placeholder*="Email"]').first()
                    if (emailInput.length > 0) {
                        cy.wrap(emailInput).type('support@magwitch.io')
                        cy.log('Filled email field')
                    }
                    
                    // Find password input
                    const passwordInput = $inputs.filter('[type="password"], [placeholder*="password"], [placeholder*="Password"]').first()
                    if (passwordInput.length > 0) {
                        cy.wrap(passwordInput).type('Qwe1223$$')
                        cy.log('Filled password field')
                    }
                    
                    // Find submit button
                    cy.get('button, input[type="submit"]').then(($buttons) => {
                        const submitButton = $buttons.filter(':contains("Log In"), :contains("Login"), :contains("Sign In"), [type="submit"]').first()
                        if (submitButton.length > 0) {
                            cy.wrap(submitButton).click()
                            cy.log('Clicked submit button')
                        }
                    })
                } else {
                    cy.log('No input elements found on page')
                }
            })

            cy.wait(10000)
            
            // Wait for successful login and navigate to application
            cy.url({ timeout: 30000 }).should('not.include', '/login')
            cy.visit(`/applications/${applicationId}`, { timeout: 30000 })
            cy.log('Successfully logged in and navigated to application dashboard')
        })
    })
//    })
  })
}) 