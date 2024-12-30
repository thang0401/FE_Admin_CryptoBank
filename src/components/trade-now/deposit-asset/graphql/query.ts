import { gql } from "@apollo/client";

const GET_PORTFOLIO_BY_AUTOCOMPLETE = gql `
query getPortfolio($input: PortfolioWhereInput, $skip: Float, $take: Float){
    getPortfolio( where: $input, skip: $skip, take: $take, orderBy:{createdDate: DESC} ){
        items{
            id
            name
        }
    }
}
`
const GET_PORTFOLIO_DATA_TO_TABLE = gql `
query getPortfolio($input: PortfolioWhereInput, $skip: Float, $take: Float){
    getPortfolio( where: $input, skip: $skip, take: $take, orderBy:{createdDate: DESC} ){
        items{
            id
            name
            status{
                name
            }
            user{
                id
                firstName
                lastName
                email
                phoneNum
                idNumber
            }
        }
    }
}
`
export {GET_PORTFOLIO_BY_AUTOCOMPLETE, GET_PORTFOLIO_DATA_TO_TABLE} ;
