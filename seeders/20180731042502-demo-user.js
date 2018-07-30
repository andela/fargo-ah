module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    username: 'Lumex',
    email: 'oluanu@yahoo.com',
    hashedPassword: 'spirit',
    createdAt: '2018-07-27 13:36:27.179+01',
    updatedAt: '2018-07-27 13:36:27.179+01',
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})

};
