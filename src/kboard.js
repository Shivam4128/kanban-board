import React, { useState, useEffect } from 'react';
import axios from 'axios';

function KanbanBoard() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupingOption, setGroupingOption] = useState('status');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getPriorityLevel = (priorityLevel) => {
        switch (priorityLevel) {
            case 4:
                return "Urgent";
            case 3:
                return "High";
            case 2:
                return "Medium";
            case 1:
                return "Low";
            default:
                return "No priority";
        }
    };

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
            const user = users.find((user) => user.id === ticket.userId);
            if (user) {
                ticket.userName = user.name;
            }
            ticket.priorityLevel = getPriorityLevel(ticket.priority);
            groupedTickets[groupKey].push(ticket);
        });

        return groupedTickets;
    };

    const groupedTickets = groupTickets();
    let sortedGroupKeys;

    if (groupingOption === 'priorityLevel') {
        const priorityOrder = {
            "Urgent": 4,
            "High": 3,
            "Medium": 2,
            "Low": 1,
            "No priority": 0,
        };
        sortedGroupKeys = Object.keys(groupedTickets).sort((a, b) => {
            const priorityA = priorityOrder[a] || 0;
            const priorityB = priorityOrder[b] || 0;
            return priorityB - priorityA;
        });
    } else {
        sortedGroupKeys = Object.keys(groupedTickets).sort((a, b) => {
            return a.localeCompare(b);
        });
    }

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
                    <option value="priorityLevel">Priority</option>
                    <option value="userName">User</option>
                    <option value="title">Title</option>
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
