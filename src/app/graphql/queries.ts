import { gql } from "@apollo/client";

export const GET_FOOD = gql`
  query GetFood($date: String!, $userId: String!) {
    getFood(date: $date, userID: $userId) {
      breakfast {
        name
        calories
        protein
        carbohydrates
        fat
        salt
        sugar
        fiber
      }
      lunch {
        name
        calories
        protein
        carbohydrates
        fat
        salt
        sugar
        fiber
      }
      dinner {
        name
        calories
        protein
        carbohydrates
        fat
        salt
        sugar
        fiber
      }
    }
  }
`;
