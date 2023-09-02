import React from 'react';

function DataDisplay({ data }) {
    return (
        <div>
            <h2>Data Display</h2>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        <strong>Name:</strong> {item.name}, <strong>Origin:</strong> {item.origin},{' '}
                        <strong>Destination:</strong> {item.destination}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default DataDisplay;
