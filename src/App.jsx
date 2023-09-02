import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import DataDisplay from './DataDisplay';

const socket = socketIOClient('http://localhost:3000'); // Replace with your server address

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on('dataStream', (dataStream) => {
      // Split and parse the data received from the server
      const messages = dataStream.split('|');
      const parsedData = messages.map((message) => JSON.parse(message));
      setData(parsedData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Real-time Data Visualization</h1>
      <DataDisplay data={data} />
    </div>
  );
}
export default App;
