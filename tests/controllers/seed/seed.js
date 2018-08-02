const validUser = {
  user: {
    email: 'oluanu@yahoo.com',
    username: 'Lumex',
    password: 'spirit2019',
    isverified: true
  }
};

const validArticleData = {
  article: {
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'You have to believe',
    tagList: ['reactjs', 'angularjs', 'dragons']
  }
};

const validArticleData2 = {
  article: {
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'You have to believe',
    tagList: ['fiction']
  }
};


const editedArticle = {
  article: {
    title: 'How to train your dragon right',
    description: 'Ever wonder how?',
    body: 'You have to believe it to achieve it',
    tagList: ['reactjs', 'angularjs', 'dragons']
  }
};

const dataWithNoTitle = {
  article: {
    description: 'Ever wonder how?',
    body: 'You have to believe',
    tagList: ['reactjs', 'angularjs', 'dragons']
  }
};

const dataWithNoDescription = {
  article: {
    title: 'How to train your dragon',
    body: 'You have to believe',
    tagList: ['reactjs', 'angularjs', 'dragons']
  }
};

const dataWithNoBody = {
  article: {
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    tagList: ['reactjs', 'angularjs', 'dragons']
  }
};

export default {
  validUser,
  validArticleData,
  dataWithNoTitle,
  dataWithNoDescription,
  dataWithNoBody,
  editedArticle,
  validArticleData2
};
