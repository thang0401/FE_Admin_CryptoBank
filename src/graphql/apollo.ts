// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
// import { setContext } from '@apollo/client/link/context'

// const httpLink = new HttpLink({
//   uri: process.env.API_URL ? `${process.env.API_URL}/graphql` : 'https://be-crypto-depot.name.vn/graphql'
// })

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const token = localStorage.getItem('token')
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : ''
//     }
//   }
// })

// console.log('httpLink', httpLink)

// const apollo = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache()
// })

// export default apollo
