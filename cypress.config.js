const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://inventorymanagement-frontend-qa.onrender.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
