import React, { useState, useRef } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { delay, DEFAULT_CONFIG } from '../utils/arrayUtils';
import { hashFunction, hashInsert, hashSearch, hashRemove } from '../algorithms/dataStructures';

const TABLE_SIZE = 8;

function HashTableVisualizer({ onBack, title, icon }) {
    const [table, setTable] = useState(() => Array.from({ length: TABLE_SIZE }, () => []));
    const [inputValue, setInputValue] = useState('');
    const [highlightBucket, setHighlightBucket] = useState(-1);
    const [highlightItem, setHighlightItem] = useState(null);
    const [comparingItem, setComparingItem] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [message, setMessage] = useState('Insira números inteiros para visualizar a tabela hash.');
    const [speed, setSpeed] = useState(DEFAULT_CONFIG.defaultSpeed);
    const [lastAction, setLastAction] = useState(null);

    const speedRef = useRef(speed);

    const getDelay = () => delay((DEFAULT_CONFIG.maxDelay + 1 - speedRef.current) * 2);

    const getKey = () => {
        if (inputValue === '' || isNaN(inputValue)) return null;
        return Number(inputValue);
    };

    const handleInsert = async () => {
        const key = getKey();
        if (key === null) { setMessage('⚠️ Digite um número inteiro!'); return; }

        const bucket = hashFunction(key, TABLE_SIZE);
        setIsAnimating(true);
        setComparingItem(null);

        setLastAction({ formula: `h(${key}) = ${key} mod ${TABLE_SIZE} = ${bucket}` });
        setHighlightBucket(bucket);
        setMessage(`🔑 hash(${key}) = ${key} mod ${TABLE_SIZE} = ${bucket}`);
        await getDelay();

        const result = hashInsert(table, key, key, TABLE_SIZE);
        setHighlightItem({ bucket: result.bucket, key });
        setTable(result.table);
        setMessage(`✅ Valor ${key} inserido no bucket ${bucket}.`);
        await getDelay();

        setIsAnimating(false);
        setInputValue('');
    };

    const handleSearch = async () => {
        const key = getKey();
        if (key === null) { setMessage('⚠️ Digite um número inteiro para buscar!'); return; }

        setIsAnimating(true);
        setHighlightItem(null);
        setComparingItem(null);

        setLastAction({ formula: `h(${key}) = ${key} mod ${TABLE_SIZE} = ${hashFunction(key, TABLE_SIZE)}` });

        await hashSearch(table, key, TABLE_SIZE, {
            onBucket: (bucket) => {
                setHighlightBucket(bucket);
                setMessage(`🔍 hash(${key}) = ${key} mod ${TABLE_SIZE} = ${bucket}. Buscando no bucket ${bucket}...`);
            },
            onCompare: (bucket, idx) => {
                setComparingItem({ bucket, idx });
                setMessage(`🔍 Comparando com elemento [${idx}]: ${table[bucket][idx].key} === ${key} ?`);
            },
            onFound: (bucket, idx) => {
                setComparingItem(null);
                setHighlightItem({ bucket, key });
                setMessage(`✨ Encontrado! Valor ${key} no bucket ${bucket}, posição ${idx}.`);
            },
            onNotFound: (bucket) => {
                setComparingItem(null);
                setMessage(`❌ Valor ${key} não encontrado no bucket ${bucket}.`);
            },
            getDelay
        });

        await getDelay();
        setIsAnimating(false);
        setInputValue('');
    };

    const handleRemove = async () => {
        const key = getKey();
        if (key === null) { setMessage('⚠️ Digite um número inteiro para remover!'); return; }

        setIsAnimating(true);
        setHighlightItem(null);
        setComparingItem(null);

        setLastAction({ formula: `h(${key}) = ${key} mod ${TABLE_SIZE} = ${hashFunction(key, TABLE_SIZE)}` });

        await hashRemove(table, key, TABLE_SIZE, {
            onBucket: (bucket) => {
                setHighlightBucket(bucket);
                setMessage(`🗑️ hash(${key}) = ${key} mod ${TABLE_SIZE} = ${bucket}. Buscando para remover...`);
            },
            onCompare: (bucket, idx) => {
                setComparingItem({ bucket, idx });
                setMessage(`🔍 Comparando com elemento [${idx}]: ${table[bucket][idx].key} === ${key} ?`);
            },
            onFound: (bucket, newTable) => {
                setComparingItem(null);
                setHighlightItem(null);
                setTable(newTable);
                setMessage(`🗑️ Valor ${key} removido do bucket ${bucket}.`);
            },
            onNotFound: (bucket) => {
                setComparingItem(null);
                setMessage(`❌ Valor ${key} não encontrado para remoção no bucket ${bucket}.`);
            },
            getDelay
        });

        await getDelay();
        setIsAnimating(false);
        setInputValue('');
    };

    const handleClear = () => {
        setTable(Array.from({ length: TABLE_SIZE }, () => []));
        setHighlightBucket(-1);
        setHighlightItem(null);
        setComparingItem(null);
        setLastAction(null);
        setMessage('Tabela limpa. Insira novos valores.');
    };

    const totalItems = table.reduce((sum, bucket) => sum + bucket.length, 0);
    const maxChain = Math.max(0, ...table.map(b => b.length));
    const occupiedBuckets = table.filter(b => b.length > 0).length;

    const getItemClass = (bucketIdx, itemIdx, itemKey) => {
        if (highlightItem && highlightItem.bucket === bucketIdx && highlightItem.key === itemKey) {
            return 'ht-item-found';
        }
        if (comparingItem && comparingItem.bucket === bucketIdx && comparingItem.idx === itemIdx) {
            return 'ht-item-comparing';
        }
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

                <div className="ht-stats mb-3">
                    <div className="bs-stats">
                        <div className="bs-stat">
                            <span className="bs-stat-label">Tamanho</span>
                            <span className="bs-stat-value">{TABLE_SIZE}</span>
                        </div>
                        <div className="bs-stat">
                            <span className="bs-stat-label">Elementos</span>
                            <span className="bs-stat-value">{totalItems}</span>
                        </div>
                        <div className="bs-stat">
                            <span className="bs-stat-label">Buckets Ocupados</span>
                            <span className="bs-stat-value">{occupiedBuckets}/{TABLE_SIZE}</span>
                        </div>
                        <div className="bs-stat">
                            <span className="bs-stat-label">Maior Cadeia</span>
                            <span className="bs-stat-value" style={{ color: maxChain > 2 ? 'var(--accent-secondary)' : 'var(--accent-success)' }}>
                                {maxChain}
                            </span>
                        </div>
                        <div className="bs-stat">
                            <span className="bs-stat-label">Fator de Carga</span>
                            <span className="bs-stat-value">{(totalItems / TABLE_SIZE).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {lastAction && (
                    <div className="ht-formula mb-3 text-center">
                        <code>{lastAction.formula}</code>
                    </div>
                )}

                <div className="ht-grid">
                    {table.map((bucket, idx) => (
                        <div key={idx} className={`ht-row ${highlightBucket === idx ? 'ht-row-active' : ''}`}>
                            <div className={`ht-index ${highlightBucket === idx ? 'ht-index-active' : ''}`}>
                                {idx}
                            </div>
                            <div className="ht-arrow">→</div>
                            <div className="ht-chain">
                                {bucket.length === 0 ? (
                                    <span className="ht-empty">vazio</span>
                                ) : (
                                    bucket.map((item, itemIdx) => (
                                        <React.Fragment key={item.key}>
                                            {itemIdx > 0 && <span className="ht-chain-arrow">→</span>}
                                            <div className={`ht-item ${getItemClass(idx, itemIdx, item.key)}`}>
                                                <span className="ht-key">{item.key}</span>
                                            </div>
                                        </React.Fragment>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="controls glass-card p-4 mt-4">
                    <Row className="align-items-center g-3">
                        <Col md={3}>
                            <InputGroup size="sm">
                                <InputGroup.Text>Valor</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ex: 42"
                                    disabled={isAnimating}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6}>
                            <div className="d-flex gap-2">
                                <Button className="btn-custom btn-success-custom" size="sm" onClick={handleInsert} disabled={isAnimating}>
                                    ➕ Inserir
                                </Button>
                                <Button className="btn-custom btn-primary-custom" size="sm" onClick={handleSearch} disabled={isAnimating}>
                                    🔍 Buscar
                                </Button>
                                <Button className="btn-custom" size="sm" style={{ background: 'var(--accent-secondary)', border: 'none', color: 'white' }} onClick={handleRemove} disabled={isAnimating}>
                                    🗑️ Remover
                                </Button>
                                <Button className="btn-custom btn-secondary-custom" size="sm" onClick={handleClear} disabled={isAnimating}>
                                    🔄 Limpar
                                </Button>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="speed-control d-flex align-items-center gap-1">
                                <span>🐢</span>
                                <Form.Range
                                    min="1"
                                    max={DEFAULT_CONFIG.maxDelay}
                                    value={speed}
                                    onChange={(e) => {
                                        setSpeed(Number(e.target.value));
                                        speedRef.current = Number(e.target.value);
                                    }}
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

export default HashTableVisualizer;
