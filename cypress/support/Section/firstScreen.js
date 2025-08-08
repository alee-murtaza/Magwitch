// Function to delete existing applications from QA portal
export function deleteExistingApplications(ssn = '666000001') {
  console.log(`🚀 NEW STRATEGY: Starting QA portal cleanup for SSN: ${ssn}`)
  
  // We're already on QA portal page, so just start the cleanup process
  console.log('✅ NEW STRATEGY: Already on QA Portal, starting cleanup...')
  
  // Search for existing applications
  cy.contains('Search Applicants by SSN or Phone').scrollIntoView()
  cy.wait(1000)
  
  cy.get('#ssnInput').should('be.visible').clear().type(ssn)
  cy.wait(500)
  
  console.log(`🔍 NEW STRATEGY: Searching for SSN: ${ssn}`)
  cy.get('#searchBySsnForm button[type="submit"]').should('be.visible').click()
  cy.wait(8000)
  
  // Check and delete applications if found
  cy.get('body').then(($body) => {
    if ($body.find('#ssnSearchResultsTableBody tr').length > 0) {
      const tableText = $body.find('#ssnSearchResultsTableBody').text()
      
      if (!tableText.includes('No applicants found') && 
          !tableText.includes('Searching') &&
          tableText.trim() !== '') {
        
        console.log('🗑️ NEW STRATEGY: Found applications, starting deletion...')
        deleteAllApplicationsRecursively()
      } else {
        console.log('ℹ️ NEW STRATEGY: No applications found to delete')
      }
    } else {
      console.log('ℹ️ NEW STRATEGY: No search results found')
    }
    })
  
  // Simplified deletion function
  function deleteAllApplicationsRecursively() {
    cy.get('#ssnSearchResultsTableBody tr').then(($rows) => {
      if ($rows.length === 0) {
        console.log('🎉 NEW STRATEGY: All applications deleted!')
        return
      }
      
      // Get first applicant ID and delete it
      cy.wrap($rows.first()).find('td').first().invoke('text').then((applicantId) => {
        const id = applicantId.trim()
        console.log(`🗑️ NEW STRATEGY: Deleting applicant ID: ${id}`)
        
        // Go to delete section
        cy.contains('Delete Applicant').scrollIntoView()
        cy.wait(1000)
        
        // Enter ID and delete
        cy.get('#applicantId').should('be.visible').clear().type(id)
        cy.wait(500)
        
        // Stub confirmation dialog
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(true)
        })
        
        // Click delete
        cy.get('#deleteApplicantForm button[type="submit"]').should('be.visible').click()
        cy.wait(5000)
        
        console.log(`✅ NEW STRATEGY: Deleted applicant ID: ${id}`)
        
        // Search again to check for more
        cy.contains('Search Applicants by SSN or Phone').scrollIntoView()
        cy.wait(1000)
        
        cy.get('#ssnInput').should('be.visible').clear().type(ssn)
        cy.wait(500)
        
        cy.get('#searchBySsnForm button[type="submit"]').should('be.visible').click()
        cy.wait(6000)
        
        // Check if more applications exist and continue
        cy.get('body').then(($body) => {
          if ($body.find('#ssnSearchResultsTableBody tr').length > 0) {
            const remainingText = $body.find('#ssnSearchResultsTableBody').text()
            
            if (!remainingText.includes('No applicants found') && 
                !remainingText.includes('Searching') &&
                remainingText.trim() !== '') {
              
              console.log('🔄 NEW STRATEGY: More applications found, continuing deletion...')
              deleteAllApplicationsRecursively() // Continue recursively
            } else {
              console.log('🎉 NEW STRATEGY: All applications cleaned up!')
            }
          } else {
            console.log('🎉 NEW STRATEGY: All applications cleaned up!')
          }
        })
      })
    })
  }
}
