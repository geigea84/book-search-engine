import gql from 'graphql-tag';

//_id
//username
//email
//bookCount
//savedBooks
////savedBooks data

export const GET_ME = gql`
    {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;