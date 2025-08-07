const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://magwitch.qa.applystage.com/", // Add your main URL here
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
