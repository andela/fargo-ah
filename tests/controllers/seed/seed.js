const validUser = {
  user: {
    email: 'olumide@yahoo.com',
    username: 'Lumexata',
    password: 'spirit2018',
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

const validComment = {
  comment: {
    body: 'This is the first comment of the first level',
  }
};

const invalidComment = {
  comment: {
    body: '',
  }
};

const commentWithoutBody = {
  comment: {}
};

const validReply = {
  comment: {
    body: 'This is the first comment of the first level',
  }
};

const commentNotString = {
  comment: {
    body: 1,
  }
};

export default {
  validUser,
  validArticleData,
  dataWithNoTitle,
  dataWithNoDescription,
  dataWithNoBody,
  editedArticle,
  validComment,
  validReply,
  invalidComment,
  commentWithoutBody,
  commentNotString,
};
