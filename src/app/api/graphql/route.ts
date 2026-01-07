import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { getSavedFood } from "@/lib/YourIntake/search-db";
import { NextRequest } from "next/server";

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

const resolvers = {
  Query: {
    hello: () => "world",
    getFood: async (_parent: any, args: { date: string; userID: string }) => {
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

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

// wrap Apollo handler in a function that matches app router types
const handler = startServerAndCreateNextHandler(server);

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
