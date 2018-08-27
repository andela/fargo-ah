module.exports = {
  up: queryInterface/* , Sequelize */ => queryInterface.bulkInsert('Users', [
    {
      username: 'asdfghjkl',
      email: 'asdfghjkl@gmail.com',
      hashedPassword: '',
      bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      image: 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054',
      isverified: true,
      favorites: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'JakeJone@register.com',
      hashedPassword: '$2b$10$vBox3ssr3T9b2YHsMbg64eciZWkWId/VvddxSEG3Be63x.MvzBUgO',
      username: 'JakeJone',
      bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      favorites: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'JakeJoneII@register.com',
      hashedPassword: '$2b$10$vBox3ssr3T9b2YHsMbg64eciZWkWId/VvddxSEG3Be63x.MvzBUgO',
      username: 'JakeJoneII',
      bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      favorites: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'JakeJoneIII@register.com',
      hashedPassword: '$2b$10$vBox3ssr3T9b2YHsMbg64eciZWkWId/VvddxSEG3Be63x.MvzBUgO',
      username: 'JakeJoneIII',
      bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      favorites: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
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
    }, {
      email: 'newuserthree@register.com',
      isverified: false,
      hashedPassword: '$2b$10$xsRq.X1mYDTjYYSeqEIhauC6BuXDRxZKbcLaZT5OV4lrApcealQkS',
      username: 'regnewuserthree',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),
  down: (queryInterface/* , Sequelize */) => { queryInterface.dropTable('Users'); }
};
