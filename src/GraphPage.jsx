import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GraphPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const airtableApiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
        const airtableBaseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
        const airtableTable = import.meta.env.VITE_AIRTABLE_TABLE;

        const response = await axios.get(
          `https://api.airtable.com/v0/${airtableBaseId}/${airtableTable}`,
          {
            headers: {
              Authorization: `Bearer ${airtableApiKey}`,
            },
          }
        );
        setEvents(response.data.records);
      } catch (error) {
        console.error('Erreur lors de la récupération des données Airtable:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Événements Mailjet</h2>
      <ul>
        {events.map((record) => (
          <li key={record.id}>
            📧 {record.fields.Email} | {record.fields.Type} | {record.fields.URL}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GraphPage;
