import React from 'react'
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Cards from './Cards/cards';
import './cards.css';
import './Column.css';

function column({ ticket, users }) {
    // Use props.title, props.data to access card variables that are accessed.
    const user = users.find((user) => user.id === ticket.userId);
    return (
        <>
            <div className="container">
                {tickets.map((ticket) => (
                    <Row key={ticket.id}>
                        <Cards ticket={ticket} users={users} />
                    </Row>
                ))}
            </div>
        </>
    )
}

export default column