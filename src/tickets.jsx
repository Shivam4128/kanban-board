import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Cards from './Cards/cards';
import Col from 'react-bootstrap/Col';

function tickets() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupingOption, setGroupingOption] = useState('status');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // In a real application, replace this with your API call
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://api.quicksell.co/v1/internal/frontend-assignment'
                );
                setTickets(response.data.tickets);
                setUsers(response.data.users);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const groupTickets = () => {
        const groupedTickets = {};

        tickets.forEach((ticket) => {
            const groupKey = ticket[groupingOption];
            if (!groupedTickets[groupKey]) {
                groupedTickets[groupKey] = [];
            }
            groupedTickets[groupKey].push(ticket);
        });

        return groupedTickets;
    };

    const groupedTickets = groupTickets();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Kanban Board</h1>
            <label>
                Display:
                <select
                    value={groupingOption}
                    onChange={(e) => setGroupingOption(e.target.value)}
                >
                    <option value="status">Status</option>
                    <option value="priority">Priority</option>
                    <option value="userId">UserId</option>
                    <option value="title">Title</option>
                </select>
            </label>
            {Object.keys(groupedTickets).map((groupKey) => (
                <div key={groupKey} className="group-container">
                    <Container>
                        <h2 className="group-header">{groupKey}</h2>
                        <ul className="task-list">
                            {groupedTickets[groupKey].map((ticket) => (
                                <Col key={ticket.id}>
                                    <Cards ticket={ticket} users={users} />
                                </Col>
                            ))}
                        </ul>
                    </Container>
                </div>
            ))}
        </div>
    );
}

export default tickets;
