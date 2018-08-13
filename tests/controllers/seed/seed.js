const validUser = {
  user: {
    email: 'olumide@yahoo.com',
    username: 'Lumexat',
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
    tagList: ['reactjs', 'angularjs', 'dragons'],
    isPaidFor: true,
    price: 2.30
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
const paymentData = {
  userId: 5,
  articleId: 3,
  amount: 400,
  stripeToken: 'tok_1CzPWMGt81p147i69JaE0DGg',
  stripeTokenType: 'card',
  stripeEmail: 'rafo@gmail.com',
};

const userForPayment = {
  user: {
    email: 'newuser@register.com',
    username: 'regnewuser',
    password: 'password123',
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
  paymentData,
  userForPayment,
};
