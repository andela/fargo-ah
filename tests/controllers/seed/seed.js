const validUser = {
  user: {
    email: 'olumide@yahoo.com',
    username: 'lumexat',
    password: 'spirit2018',
  }
};

const newUserlogin = {
  user: {
    email: 'newuserByMe@register.com',
    password: 'spirit2018',
  }
};

const validArticleData = {
  article: {
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'You have to believe',
    tagList: ['reactjs', 'angularjs', 'dragons'],
    categorylist: ['people', 'sports', 'culture']
  }
};

const validArticleData2 = {
  article: {
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'You have to believe',
    tagList: ['fiction'],
    categorylist: ['people', 'sports', 'culture']
  }
};

const editedArticle = {
  article: {
    title: 'How to train your dragon right',
    description: 'Ever wonder how?',
    body: 'You have to believe it to achieve it',
    tagList: ['reactjs', 'angularjs', 'dragons'],
    isPaidFor: true,
    price: 2.30,
    categorylist: ['people', 'sports', 'culture']
  }
};

const dataWithNoTitle = {
  article: {
    description: 'Ever wonder how?',
    body: 'You have to believe',
    tagList: ['reactjs', 'angularjs', 'dragons'],
    categorylist: ['people', 'sports', 'culture']
  }
};

const dataWithNoDescription = {
  article: {
    title: 'How to train your dragon',
    body: 'You have to believe',
    tagList: ['reactjs', 'angularjs', 'dragons'],
    categorylist: ['people', 'sports', 'culture']
  }
};

const dataWithNoBody = {
  article: {
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    tagList: ['reactjs', 'angularjs', 'dragons'],
    categorylist: ['people', 'sports', 'culture']
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
  validArticleData2,
  newUserlogin,
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
