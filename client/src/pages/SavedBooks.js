import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';

import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';

const SavedBooks = () => {
    //use useQuery hook to make query request
    const { loading, data } = useQuery(GET_ME);
    //creat const for useMutation(REMOVE_BOOK)
    const [removeBook, { error }] = useMutation(REMOVE_BOOK);

    const userData = data?.me || { savedBooks: [] };
    console.log(userData);

    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            //delete book from user's account
            const { data } = await removeBook({
                variables: { bookId }
            });

            console.log(data);
            // upon success, remove book's id from localStorage
            removeBookId(bookId);
            console.log(bookId);
        } catch (err) {
            console.error(err);
        }
    };

    // if data isn't here yet, say so
    if (loading) {
        return <h2>LOADING...</h2>;
    }

    return (
        <>
            <Jumbotron fluid className='text-light bg-dark'>
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </Jumbotron>
            <Container>
                <h2>
                    {userData.savedBooks.length
                        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                        : 'You have no saved books!'}
                </h2>
                <CardColumns>
                    {userData.savedBooks.map((book) => {
                        return (
                            <Card key={book.bookId} border='dark'>
                                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                                <Card.Body>
                                    <Card.Title>{book.title}</Card.Title>
                                    <p className='small'>Authors: {book.authors}</p>
                                    <Card.Text>
                                        {book.description}
                                        <br />
                                        <a href={book.link}>View on Google Books</a>
                                    </Card.Text>
                                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                                        Delete this Book!
                                    </Button>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </CardColumns>
            </Container>
        </>
    );
};

export default SavedBooks;
