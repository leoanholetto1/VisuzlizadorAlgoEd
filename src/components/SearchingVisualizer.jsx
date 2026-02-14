import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { generateRandomArray, delay, DEFAULT_CONFIG } from '../utils/arrayUtils';

function SearchingVisualizer({ onBack, algorithm, title, icon }) {
    const [array, setArray] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [foundIndex, setFoundIndex] = useState(-1);
    const [target, setTarget] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [speed, setSpeed] = useState(DEFAULT_CONFIG.defaultSpeed);
    const [message, setMessage] = useState('Gere um array e defina um alvo para buscar.');

    const searchingRef = useRef(false);
    const speedRef = useRef(speed);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    const handleGenerateArray = () => {
        const newArray = generateRandomArray({
            size: 15, // Menos elementos para busca ficar clara
            min: 10,
            max: 100
        });
        setArray(newArray);
        setCurrentIndex(-1);
        setFoundIndex(-1);
        setMessage('Array gerado. Escolha um número do array ou qualquer valor para buscar.');
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
        setFoundIndex(-1);
        setCurrentIndex(-1);
        setMessage(`Buscando por ${target}...`);

        const callbacks = {
            onCompare: (index) => setCurrentIndex(index),
            onFound: (index) => {
                setFoundIndex(index);
                setMessage(`✨ Encontrado na posição ${index}!`);
            },
            onNotFound: () => {
                setMessage(`❌ Valor ${target} não encontrado.`);
            },
            getDelay: () => delay(DEFAULT_CONFIG.maxDelay + 1 - speedRef.current),
            shouldStop: () => !searchingRef.current
        };

        await algorithm([...array], Number(target), callbacks);

        setIsSearching(false);
        searchingRef.current = false;
        setCurrentIndex(-1);
    };

    const stopSearching = () => {
        searchingRef.current = false;
        setIsSearching(false);
        setCurrentIndex(-1);
        setMessage('Busca interrompida.');
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

                <div className="bars-container mb-4" style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    {array.map((value, idx) => (
                        <div
                            key={idx}
                            className={`searching-item ${currentIndex === idx ? 'scanning' : ''} ${foundIndex === idx ? 'found' : ''}`}
                            style={{
                                height: `${value * 3}px`,
                                width: '40px',
                                margin: '0 5px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                position: 'relative'
                            }}
                        >
                            <span className="value-label" style={{ marginBottom: '5px' }}>{value}</span>
                            <div className="item-bar" style={{ height: '100%', width: '100%' }}></div>
                        </div>
                    ))}
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

export default SearchingVisualizer;
