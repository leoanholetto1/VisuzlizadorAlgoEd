import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { generateRandomArray, delay, DEFAULT_CONFIG } from '../utils/arrayUtils';

function BinarySearchVisualizer({ onBack, algorithm, title, icon }) {
    const [array, setArray] = useState([]);
    const [target, setTarget] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [speed, setSpeed] = useState(DEFAULT_CONFIG.defaultSpeed);
    const [message, setMessage] = useState('Gere um array para buscar. Ele será ordenado automaticamente.');

    const [low, setLow] = useState(-1);
    const [mid, setMid] = useState(-1);
    const [high, setHigh] = useState(-1);
    const [foundIndex, setFoundIndex] = useState(-1);
    const [iteration, setIteration] = useState(0);

    const searchingRef = useRef(false);
    const speedRef = useRef(speed);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    const handleGenerateArray = () => {
        const newArray = generateRandomArray({
            size: 30,
            min: 10,
            max: 100
        }).sort((a, b) => a - b);
        setArray(newArray);
        resetState();
        setMessage('Array ordenado gerado. Escolha um valor para buscar.');
    };

    const resetState = () => {
        setLow(-1);
        setMid(-1);
        setHigh(-1);
        setFoundIndex(-1);
        setIteration(0);
    };

    useEffect(() => {
        handleGenerateArray();
    }, []);

    const runSearch = async () => {
        if (target === '') {
            setMessage('⚠️ Digite um valor para buscar!');
            return;
        }

        setIsSearching(true);
        searchingRef.current = true;
        resetState();
        setMessage(`Buscando por ${target}...`);

        const callbacks = {
            onStep: ({ low, mid, high, iteration }) => {
                setLow(low);
                setMid(mid);
                setHigh(high);
                setIteration(iteration);
            },
            onFound: (index) => {
                setFoundIndex(index);
                setMessage(`✨ Encontrado na posição ${index}!`);
            },
            onNotFound: () => {
                setMessage(`❌ Valor ${target} não encontrado.`);
            },
            getDelay: () => delay((DEFAULT_CONFIG.maxDelay + 1 - speedRef.current) * 3),
            shouldStop: () => !searchingRef.current
        };

        await algorithm([...array], Number(target), callbacks);

        setIsSearching(false);
        searchingRef.current = false;
    };

    const stopSearching = () => {
        searchingRef.current = false;
        setIsSearching(false);
        resetState();
        setMessage('Busca interrompida.');
    };

    const getItemClass = (idx) => {
        if (foundIndex === idx) return 'found';
        if (mid === idx) return 'mid';
        if (idx >= low && idx <= high && low !== -1) return 'in-range';
        if (low !== -1) return 'out-range';
        return '';
    };

    return (
        <Container className="py-4 fade-in">
            <div className="back-btn" onClick={onBack}>
                ← Voltar para categorias
            </div>

            <h2 className="text-center mb-4">
                {icon} {title}
            </h2>

            <div className="visualizer-container">
                <div className="message-box mb-4 text-center">
                    <p className="lead">{message}</p>
                </div>

                {low !== -1 && (
                    <div className="binary-search-info mb-3">
                        <div className="bs-stats">
                            <div className="bs-stat">
                                <span className="bs-stat-label">Iteração</span>
                                <span className="bs-stat-value">{iteration}</span>
                            </div>
                            <div className="bs-stat">
                                <span className="bs-stat-label">Low</span>
                                <span className="bs-stat-value low-val">{low}</span>
                            </div>
                            <div className="bs-stat">
                                <span className="bs-stat-label">Mid</span>
                                <span className="bs-stat-value mid-val">{mid}</span>
                            </div>
                            <div className="bs-stat">
                                <span className="bs-stat-label">High</span>
                                <span className="bs-stat-value high-val">{high}</span>
                            </div>
                            <div className="bs-stat">
                                <span className="bs-stat-label">Intervalo</span>
                                <span className="bs-stat-value">[{low}, {high}]</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bars-container mb-4" style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    {array.map((value, idx) => (
                        <div
                            key={idx}
                            className={`searching-item bs-item ${getItemClass(idx)}`}
                            style={{
                                height: `${value * 3}px`,
                                width: '28px',
                                margin: '0 3px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                position: 'relative'
                            }}
                        >
                            <span className="value-label" style={{ marginBottom: '5px' }}>{value}</span>
                            <div className="item-bar" style={{ height: '100%', width: '100%' }}></div>
                            {low === idx && low !== -1 && (
                                <span className="bs-marker low-marker">L</span>
                            )}
                            {mid === idx && mid !== -1 && (
                                <span className="bs-marker mid-marker">M</span>
                            )}
                            {high === idx && high !== -1 && (
                                <span className="bs-marker high-marker">H</span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bs-legend mb-3">
                    <div className="bs-legend-item">
                        <span className="bs-legend-color" style={{ background: 'rgba(108, 99, 255, 0.3)', border: '1px solid rgba(108, 99, 255, 0.5)' }}></span>
                        Intervalo ativo
                    </div>
                    <div className="bs-legend-item">
                        <span className="bs-legend-color" style={{ background: '#f9ca24' }}></span>
                        Mid (comparando)
                    </div>
                    <div className="bs-legend-item">
                        <span className="bs-legend-color" style={{ background: 'var(--accent-success)' }}></span>
                        Encontrado
                    </div>
                    <div className="bs-legend-item">
                        <span className="bs-legend-color" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}></span>
                        Descartado
                    </div>
                </div>

                <div className="controls glass-card p-4">
                    <Row className="align-items-center g-3">
                        <Col md={4}>
                            <InputGroup>
                                <InputGroup.Text>Alvo</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    placeholder="Ex: 42"
                                    disabled={isSearching}
                                />
                            </InputGroup>
                        </Col>

                        <Col md={4} className="d-flex gap-2">
                            <Button
                                className="btn-custom btn-secondary-custom w-100"
                                onClick={handleGenerateArray}
                                disabled={isSearching}
                            >
                                🔄 Novo Array
                            </Button>

                            {!isSearching ? (
                                <Button
                                    className="btn-custom btn-success-custom w-100"
                                    onClick={runSearch}
                                >
                                    🔍 Buscar
                                </Button>
                            ) : (
                                <Button
                                    className="btn-custom w-100"
                                    style={{ background: 'var(--accent-secondary)', border: 'none' }}
                                    onClick={stopSearching}
                                >
                                    ⏹️ Parar
                                </Button>
                            )}
                        </Col>

                        <Col md={4}>
                            <div className="speed-control d-flex align-items-center gap-2">
                                <span>🐢</span>
                                <Form.Range
                                    min="1"
                                    max={DEFAULT_CONFIG.maxDelay}
                                    value={speed}
                                    onChange={(e) => setSpeed(Number(e.target.value))}
                                />
                                <span>🐇</span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Container>
    );
}

export default BinarySearchVisualizer;
