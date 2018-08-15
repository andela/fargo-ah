module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    email: 'newuser@register.com',
    isverified: true,
    hashedPassword: '$2b$10$xsRq.X1mYDTjYYSeqEIhauC6BuXDRxZKbcLaZT5OV4lrApcealQkS',
    username: 'regnewuser',
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    email: 'newusertwo@register.com',
    isverified: false,
    hashedPassword: '$2b$10$xsRq.X1mYDTjYYSeqEIhauC6BuXDRxZKbcLaZT5OV4lrApcealQkS',
    username: 'regnewusertwo',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'newuserthree@register.com',
    isverified: false,
    hashedPassword: '$2b$10$xsRq.X1mYDTjYYSeqEIhauC6BuXDRxZKbcLaZT5OV4lrApcealQkS',
    username: 'regnewuserthree',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
