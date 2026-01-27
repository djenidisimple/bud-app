module.exports = {
  rules: {
    'react/jsx-pascal-case': [
      'error',
      {
        allowAllCaps: true,
        ignore: ['Text', 'View', 'Document', 'Page'] // Ajoutez tous les composants react-pdf
      }
    ]
  }
};