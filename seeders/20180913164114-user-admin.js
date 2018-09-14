
module.exports = {
  up: queryInterface/* , Sequelize */ => queryInterface.bulkInsert('Users', [
    {
      username: 'Anu',
      email: 'oki.maureen.eloho@gmail.com',
      hashedPassword: 'Adminrole',
      bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      image: 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054',
      isverified: true,
      isAdmin: true,
      favorites: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]),
  down: (queryInterface/* , Sequelize */) => { queryInterface.dropTable('Users'); }
};
