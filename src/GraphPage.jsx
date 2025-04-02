import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph';
import axios from 'axios';

const GraphPage = () => {
  const [data, setData] = useState({ nodes: [], links: [] });
  const graphRef = useRef();

  useEffect(() => {
    // Exemple : tu peux remplacer par ton URL Airtable
    axios.get('https://jsonplaceholder.typicode.com/users').then((res) => {
      const nodes = res.data.map((user) => ({
        id: user.email,
        group: Math.floor(Math.random() * 3) + 1 // 1, 2 ou 3 pour couleur
      }));

      const links = nodes.map((node) => ({
        source: 'mailing',
        target: node.id
      }));

      setData({
        nodes: [{ id: 'mailing', group: 0 }, ...nodes],
        links
      });
    });
  }, []);

  const getColor = (group) => {
    if (group === 1) return 'yellow';
    if (group === 2) return 'orange';
    if (group === 3) return 'green';
    return 'blue';
  };

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={data}
      nodeAutoColorBy="group"
      nodeCanvasObject={(node, ctx) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
        ctx.fillStyle = getColor(node.group);
        ctx.fill();
        ctx.font = '10px Sans-Serif';
        ctx.fillStyle = 'black';
        ctx.fillText(node.id, node.x + 12, node.y + 3);
      }}
    />
  );
};

export default GraphPage;
