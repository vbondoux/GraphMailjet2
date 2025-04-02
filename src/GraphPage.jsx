import React, { useEffect, useState, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import axios from 'axios';

function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const fgRef = useRef();

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
      const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
      const tableName = import.meta.env.VITE_AIRTABLE_TABLE;

      const response = await axios.get(
        `https://api.airtable.com/v0/${baseId}/${tableName}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );

      const records = response.data.records;
      const mailingNode = { id: 'Mailing', group: 'mailing' };
      const nodes = [mailingNode];
      const links = [];

      const contactClicks = {};

      records.forEach((record) => {
        const email = record.fields.Email;
        const type = record.fields.Type;
        const url = record.fields.URL;

        if (!nodes.find((n) => n.id === email)) {
          nodes.push({ id: email, group: 'contact' });
          links.push({ source: 'Mailing', target: email });
        }

        if (type === 'click' && url) {
          const clickNodeId = `${email}-${url}`;
          nodes.push({ id: clickNodeId, group: 'click', url });
          links.push({ source: email, target: clickNodeId });

          contactClicks[email] = (contactClicks[email] || 0) + 1;
        } else {
          contactClicks[email] = contactClicks[email] || 0;
        }
      });

      // Ajout couleur selon le comportement
      nodes.forEach((node) => {
        if (node.group === 'contact') {
          const clicks = contactClicks[node.id] || 0;
          if (clicks === 0) node.color = 'yellow';
          else if (clicks === 1) node.color = 'orange';
          else node.color = 'green';
        } else if (node.group === 'mailing') {
          node.color = '#2196f3';
        } else if (node.group === 'click') {
          node.color = '#999';
        }
      });

      setGraphData({ nodes, links });
    } catch (error) {
      console.error('Erreur lors du fetch Airtable :', error);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="group"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.fillStyle = node.color || '#666';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = '#333';
          ctx.fillText(label, node.x + 10, node.y + 4);
        }}
        onNodeClick={(node) => {
          if (node.group === 'click' && node.url) {
            window.open(node.url, '_blank');
          }
        }}
      />
    </div>
  );
}

export default GraphPage;
