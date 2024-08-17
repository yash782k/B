// src/components/ActiveLog.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ActiveLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Query logs sorted by timestamp
        const logsCollection = collection(db, 'activeLogs');
        const q = query(logsCollection, orderBy('logDate', 'desc'));
        const logsSnapshot = await getDocs(q);
        const logsList = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLogs(logsList);
      } catch (error) {
        console.error('Error fetching active logs:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Active Log</h2>
      <div>
        {logs.length === 0 ? (
          <p>No logs available.</p>
        ) : (
          logs.map(log => (
            <div key={log.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
              <p><strong>Branch Code:</strong> {log.branchCode}</p>
              <p><strong>Timestamp:</strong> {new Date(log.logDate.seconds * 1000).toLocaleString()}</p>
              <p><strong>Changed Field:</strong> {log.changedField}</p>
              <p><strong>Old Value:</strong> {log.oldValue}</p>
              <p><strong>New Value:</strong> {log.newValue}</p>
              <p><strong>Activity:</strong> {log.activity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveLog;
