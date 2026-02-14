import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const GRAPH_CONFIG = {
    canvasWidth: 600,
    canvasHeight: 400,
    nodeRadius: 20,
    nodeCount: 6
};

function GraphVisualizer({ onBack, title, icon }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [adjacencyList, setAdjacencyList] = useState({});
    const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
    const [isWeighted, setIsWeighted] = useState(false);
    const [isDirected, setIsDirected] = useState(false);
    const [viewMode, setViewMode] = useState('list'); 

    const generateRandomGraph = () => {
        const newNodes = [];
        const newEdges = [];
        const newAdjList = {};
        const newAdjMatrix = Array(GRAPH_CONFIG.nodeCount).fill(0).map(() => Array(GRAPH_CONFIG.nodeCount).fill(0));

        const centerX = GRAPH_CONFIG.canvasWidth / 2;
        const centerY = GRAPH_CONFIG.canvasHeight / 2;
        const radius = 150;

        for (let i = 0; i < GRAPH_CONFIG.nodeCount; i++) {
            const angle = (i * 2 * Math.PI) / GRAPH_CONFIG.nodeCount;
            newNodes.push({
                id: i,
                label: String(i),
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
            newAdjList[i] = [];
        }

        for (let i = 0; i < GRAPH_CONFIG.nodeCount; i++) {
            const connections = Math.floor(Math.random() * 2) + 1;
            for (let j = 0; j < connections; j++) {
                const target = Math.floor(Math.random() * GRAPH_CONFIG.nodeCount);
                if (target !== i && !newEdges.find(e =>
                    (e.source === i && e.target === target) ||
                    (!isDirected && e.source === target && e.target === i)
                )) {
                    const weight = Math.floor(Math.random() * 9) + 1;
                    newEdges.push({ source: i, target: target, weight });

                    newAdjList[i].push({ node: target, weight });
                    newAdjMatrix[i][target] = weight;

                    if (!isDirected) {
                        newAdjList[target].push({ node: i, weight });
                        newAdjMatrix[target][i] = weight;
                    }
                }
            }
        }

        Object.keys(newAdjList).forEach(key => {
            newAdjList[key].sort((a, b) => a.node - b.node);
        });

        setNodes(newNodes);
        setEdges(newEdges);
        setAdjacencyList(newAdjList);
        setAdjacencyMatrix(newAdjMatrix);
    };

    useEffect(() => {
        generateRandomGraph();
    }, []);

    useEffect(() => {
        generateRandomGraph();
    }, [isDirected]);

    return (
        <Container className="py-4 fade-in">
            <div className="back-btn" onClick={onBack}>
                ← Voltar para categorias
            </div>

            <h2 className="text-center mb-4">
                {icon} {title}
            </h2>

            <Row>
                <Col md={8}>
                    <div className="graph-container glass-card">
                        <svg width={GRAPH_CONFIG.canvasWidth} height={GRAPH_CONFIG.canvasHeight} className="graph-svg">
                            {/* Edges */}
                            {edges.map((edge, idx) => {
                                const sourceNode = nodes[edge.source];
                                const targetNode = nodes[edge.target];
                                if (!sourceNode || !targetNode) return null;

                                return (
                                    <g key={`edge-${idx}`}>
                                        <line
                                            x1={sourceNode.x}
                                            y1={sourceNode.y}
                                            x2={targetNode.x}
                                            y2={targetNode.y}
                                            className="graph-edge"
                                        />
                                        {isWeighted && (
                                            <g>
                                                <rect
                                                    x={(sourceNode.x + targetNode.x) / 2 - 10}
                                                    y={(sourceNode.y + targetNode.y) / 2 - 10}
                                                    width="20" height="20"
                                                    fill="rgba(0,0,0,0.7)"
                                                    rx="4"
                                                />
                                                <text
                                                    x={(sourceNode.x + targetNode.x) / 2}
                                                    y={(sourceNode.y + targetNode.y) / 2}
                                                    textAnchor="middle"
                                                    dy=".3em"
                                                    fill="white"
                                                    fontSize="12"
                                                >
                                                    {edge.weight}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })}

                            {/* Nodes */}
                            {nodes.map((node) => (
                                <g key={`node-${node.id}`}>
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={GRAPH_CONFIG.nodeRadius}
                                        className="graph-node"
                                    />
                                    <text
                                        x={node.x}
                                        y={node.y}
                                        textAnchor="middle"
                                        dy=".3em"
                                        className="node-label"
                                    >
                                        {node.label}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>

                    <div className="controls mt-3 d-flex gap-3 justify-content-center">
                        <Button className="btn-custom btn-secondary-custom" onClick={generateRandomGraph}>
                            🎲 Novo Grafo
                        </Button>
                        <Form.Check
                            type="switch"
                            id="weight-switch"
                            label="Com Pesos"
                            checked={isWeighted}
                            onChange={(e) => setIsWeighted(e.target.checked)}
                            className="text-white d-flex align-items-center"
                        />
                    </div>
                </Col>

                <Col md={4}>
                    <div className="adjacency-list-container glass-card p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="text-white mb-0">
                                {viewMode === 'list' ? 'Lista de Adjacência' : 'Matriz de Adjacência'}
                            </h5>
                            <Button
                                size="sm"
                                variant="outline-light"
                                onClick={() => setViewMode(prev => prev === 'list' ? 'matrix' : 'list')}
                                style={{ fontSize: '0.8rem' }}
                            >
                                {viewMode === 'list' ? 'Ver Matriz' : 'Ver Lista'}
                            </Button>
                        </div>

                        {viewMode === 'list' ? (
                            <div className="adjacency-list">
                                {nodes.map((node) => (
                                    <div key={node.id} className="adj-row mb-2">
                                        <span className="node-badge">{node.id}</span>
                                        <span className="arrow">→</span>
                                        {adjacencyList[node.id] && adjacencyList[node.id].length > 0 ? (
                                            <div className="neighbors">
                                                {adjacencyList[node.id].map((neighbor, idx) => (
                                                    <span key={idx} className="neighbor-badge">
                                                        {neighbor.node}
                                                        {isWeighted && <span className="weight-sub">w:{neighbor.weight}</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted small">∅</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="matrix-container">
                                <div className="matrix-grid" style={{ gridTemplateColumns: `auto repeat(${nodes.length}, 1fr)` }}>
                                    {/* Header Row */}
                                    <div className="matrix-header-cell"></div>
                                    {nodes.map(node => (
                                        <div key={`head-${node.id}`} className="matrix-header-cell">{node.id}</div>
                                    ))}

                                    {/* Rows */}
                                    {adjacencyMatrix.map((row, i) => (
                                        <React.Fragment key={`row-${i}`}>
                                            <div className="matrix-header-cell row-header">{i}</div>
                                            {row.map((val, j) => (
                                                <div
                                                    key={`cell-${i}-${j}`}
                                                    className={`matrix-cell ${val > 0 ? 'active' : ''}`}
                                                    title={`(${i}, ${j}) = ${val}`}
                                                >
                                                    {val > 0 ? (isWeighted ? val : 1) : 0}
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default GraphVisualizer;
