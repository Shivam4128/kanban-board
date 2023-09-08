import React, { useState, useEffect } from 'react';
import axios from 'axios';

function KanbanBoard() {
    const [tickets, setTickets] = useState([]);
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
                    {/* Add more grouping options here */}
                </select>
            </label>
            {Object.keys(groupedTickets).map((groupKey) => (
                <div key={groupKey} className="group-container">
                    <h2 className="group-header">{groupKey}</h2>
                    <ul className="task-list">
                        {groupedTickets[groupKey].map((ticket) => (
                            <li key={ticket.id} className={`task`} data-status={ticket.status} data-priority={ticket.priority}>
                                {ticket.title}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default KanbanBoard;
