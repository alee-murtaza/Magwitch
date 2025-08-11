// Function to delete existing applications from QA portal
export function deleteExistingApplications(ssn = '666000001') {

    cy.contains('Search Applicants by SSN or Phone').scrollIntoView()
    cy.wait(1000)
    
    cy.get('#ssnInput').should('be.visible').clear().type(ssn)
    cy.wait(500)
    
    cy.get('#searchBySsnForm button[type="submit"]').should('be.visible').click()
    cy.wait(8000)
    
    cy.get('body').then(($body) => {
      if ($body.find('#ssnSearchResultsTableBody tr').length > 0) 
      {
        const tableText = $body.find('#ssnSearchResultsTableBody').text()
        
        if (!tableText.includes('No applicants found') && !tableText.includes('Searching') && tableText.trim() !== '') 
        {
          deleteAllApplicationsRecursively()
        } 
        else 
        {
          console.log('No applications found to delete')
        }
      } 
      else 
      {
        console.log('No search results found')
      }
      })
    
    function deleteAllApplicationsRecursively() {
      cy.get('#ssnSearchResultsTableBody tr').then(($rows) => {
        if ($rows.length === 0) {
          console.log('All applications deleted!')
          return
        }
        
        // Get first applicant ID and delete it
        cy.wrap($rows.first()).find('td').first().invoke('text').then((applicantId) => 
        {
          const id = applicantId.trim()
          console.log(`Deleting applicant ID: ${id}`)
          
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
          
          console.log(`Deleted applicant ID: ${id}`)
          
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
              
              if (!remainingText.includes('No applicants found') && !remainingText.includes('Searching') && remainingText.trim() !== '') 
              {
                
                console.log('More applications found, continuing deletion...')
                deleteAllApplicationsRecursively()
              } 
              else 
              {
                console.log('All applications cleaned up!')
              }
            } 
            else 
            {
              console.log('All applications cleaned up!')
            }
          })
        })
      })
    }
  }