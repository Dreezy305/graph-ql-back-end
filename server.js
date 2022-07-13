const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const expressGraphQL = require("express-graphql").graphqlHTTP;

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" },
];

const books = [
  {
    id: 1,
    name: "Harry Potter and the Chamber of Secrets",
    authorId: 1,
    releaseDate: "02/20/1989",
    priority: "Low",
    authorName: "J. K. Rowling",
    type: "Horror",
  },
  {
    id: 2,
    name: "Harry Potter and the Prisoner of Azkaban",
    authorId: 1,
    releaseDate: "10/10/1996",
    priority: "Medium",
    authorName: "J. K. Rowling",
    type: "Crime",
  },
  {
    id: 3,
    name: "Harry Potter and the Goblet of Fire",
    authorId: 1,
    releaseDate: "02/08/1988",
    priority: "High",
    authorName: "J. K. Rowling",
    type: "Magic",
  },
  {
    id: 4,
    name: "The Fellowship of the Ring",
    authorId: 2,
    releaseDate: "05/20/2021",
    priority: "Low",
    authorName: "J. R. R. Tolkien",
    type: "Adventure",
  },
  {
    id: 5,
    name: "The Two Towers",
    authorId: 2,
    releaseDate: "09/20/2014",
    priority: "High",
    authorName: "J. R. R. Tolkien",
    type: "War",
  },
  {
    id: 6,
    name: "The Return of the King",
    authorId: 2,
    releaseDate: "02/20/1989",
    priority: "Medium",
    authorName: "J. R. R. Tolkien",
    type: "Adventure",
  },
  {
    id: 7,
    name: "The Way of Shadows",
    authorId: 3,
    releaseDate: "05/10/1992",
    priority: "Low",
    authorName: "Brent Weeks",
    type: "Horror",
  },
  {
    id: 8,
    name: "Beyond the Shadows",
    authorId: 3,
    releaseDate: "09/28/1990",
    priority: "Medium",
    authorName: "Brent Weeks",
    type: "Drama",
  },
];

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents a author of a book",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This is a book from a list of books",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    releaseDate: { type: new GraphQLNonNull(GraphQLString) },
    priority: { type: new GraphQLNonNull(GraphQLString) },
    authorName: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: AuthorType,
      resolve: (books) => {
        return authors.find((author) => author.id === books.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A single book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    priority: {
      type: BookType,
      description: "A single book",
      args: {
        priority: { type: GraphQLString },
      },
      resolve: (parent, args) =>
        books.find((book) => book.priority === args.priority),
    },
    type: {
      type: BookType,
      description: "A single book",
      args: {
        type: { type: GraphQLString },
      },
      resolve: (parent, args) => books.find((book) => book.type === args.type),
    },
    releaseDate: {
      type: BookType,
      description: "A single book",
      args: {
        releaseDate: { type: GraphQLString },
      },
      resolve: (parent, args) =>
        books.find((book) => book.releaseDate === args.releaseDate),
    },
    authorName: {
      type: BookType,
      description: "A single book",
      args: {
        authorName: { type: GraphQLString },
      },
      resolve: (parent, args) =>
        books.find((book) => book.authorName === args.authorName),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    author: {
      type: AuthorType,
      description: "A single author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add book",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add author",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

const port = 5000;

app.use("/graphql", expressGraphQL({ schema: schema, graphiql: true }));

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
