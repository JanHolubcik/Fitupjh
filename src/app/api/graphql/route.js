import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { getSavedFood } from "@/lib/YourIntake/search-db";


const resolvers = {
  Query: {
    hello: () => 'world',
    getFood: async (_parent, args) => {
      const { date, userID } = args;

      if (!date || !userID) {
        throw new Error("Missing required parameters");
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const food = await getSavedFood(parsedDate.toISOString(), userID);
      return food.savedFood || { breakfast: [], lunch: [], dinner: [] };
    },
  },
};

const typeDefs = gql`
  type Meal {
    name: String
    calories: Int
    protein: Float
    carbs: Float
    fat: Float
  }

  type FoodDay {
    breakfast: [Meal!]!
    lunch: [Meal!]!
    dinner: [Meal!]!
  }

  type Query {
    hello: String
    getFood(date: String!, userID: String!): FoodDay!
  }
    
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };