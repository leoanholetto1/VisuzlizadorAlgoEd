import React, { useState, useRef, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { sieveOfEratosthenes } from '../algorithms/math';
import { delay, DEFAULT_CONFIG } from '../utils/arrayUtils';

const LIMIT = 100;

function SieveVisualizer({ onBack, title, icon }) {
    const [cellStates, setCellStates] = useState({});
    const [status, setStatus] = useState('idle');
    const [currentNumber, setCurrentNumber] = useState(null);
    const [speed, setSpeed] = useState(DEFAULT_CONFIG.defaultSpeed);
    const runningRef = useRef(false);
    const speedRef = useRef(speed);
    const [primesFound, setPrimesFound] = useState(0);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    const resetGrid = () => {
        setCellStates({});
        setCurrentNumber(null);
        setStatus('idle');
        setPrimesFound(0);
    };

    const runSieve = async () => {
        resetGrid();
        setStatus('running');
        runningRef.current = true;

        const callbacks = {
            onCheckCurrent: async (index) => {
                setCurrentNumber(index);
            },
            onMarkPrime: async (index) => {
                setCellStates(prev => ({ ...prev, [index]: 'prime' }));
                setPrimesFound(prev => prev + 1);
                setCurrentNumber(null);
            },
            onMarkComposite: async (index) => {
                setCellStates(prev => {
                    if (prev[index] === 'composite') return prev;
                    return { ...prev, [index]: 'eliminating' };
                });
            },
            onEndPass: async () => {
                setCellStates(prev => {
                    const next = { ...prev };
                    for (const key in next) {
                        if (next[key] === 'eliminating') {
                            next[key] = 'composite';
                        }
                    }
                    return next;
                });
            },
            getDelay: () => delay(Math.max(5, DEFAULT_CONFIG.maxDelay + 1 - speedRef.current) * 0.3),
            shouldStop: () => !runningRef.current
        };

        await sieveOfEratosthenes(LIMIT, callbacks);

        if (runningRef.current) {
            setStatus('done');
        }
        runningRef.current = false;
        setCurrentNumber(null);
    };

    const stopSieve = () => {
        runningRef.current = false;
        setStatus('idle');
        setCurrentNumber(null);
    };

    const numbers = [];
    for (let i = 2; i <= LIMIT; i++) {
        numbers.push(i);
    }

    const composites = Object.values(cellStates).filter(s => s === 'composite' || s === 'eliminating').length;

    return (
        <Container className="py-4 fade-in">
            <div className="back-btn" onClick={onBack}>
                ← Voltar para categorias
            </div>

            <h2 className="text-center mb-4">
                {icon} {title}
            </h2>

            <div className="visualizer-container">
                <div className="sieve-stats">
                    <div className="sieve-stat">
                        <span className="sieve-stat-value">{primesFound}</span>
                        <span className="sieve-stat-label">Primos encontrados</span>
                    </div>
                    <div className="sieve-stat">
                        <span className="sieve-stat-value">{composites}</span>
                        <span className="sieve-stat-label">Compostos</span>
                    </div>
                    <div className="sieve-stat">
                        <span className="sieve-stat-value">{LIMIT - 1}</span>
                        <span className="sieve-stat-label">Total de números</span>
                    </div>
                </div>

                <div className="sieve-legend">
                    <div className="sieve-legend-item">
                        <span className="sieve-legend-color sieve-legend-unchecked"></span>
                        <span>Não verificado</span>
                    </div>
                    <div className="sieve-legend-item">
                        <span className="sieve-legend-color sieve-legend-current"></span>
                        <span>Verificando</span>
                    </div>
                    <div className="sieve-legend-item">
                        <span className="sieve-legend-color sieve-legend-prime"></span>
                        <span>Primo</span>
                    </div>
                    <div className="sieve-legend-item">
                        <span className="sieve-legend-color sieve-legend-eliminating"></span>
                        <span>Eliminando agora</span>
                    </div>
                    <div className="sieve-legend-item">
                        <span className="sieve-legend-color sieve-legend-composite"></span>
                        <span>Composto</span>
                    </div>
                </div>

                <div className="sieve-grid">
                    {numbers.map(num => {
                        const state = cellStates[num] || 'unchecked';
                        const isCurrent = currentNumber === num;
                        return (
                            <div
                                key={num}
                                className={`sieve-cell ${state} ${isCurrent ? 'current' : ''}`}
                            >
                                {num}
                            </div>
                        );
                    })}
                </div>

                <div className="controls">
                    {status !== 'running' ? (
                        <Button
                            className="btn-custom btn-success-custom"
                            onClick={runSieve}
                        >
                            ▶️ Iniciar Crivo
                        </Button>
                    ) : (
                        <Button
                            className="btn-custom"
                            style={{ background: 'var(--accent-secondary)', border: 'none' }}
                            onClick={stopSieve}
                        >
                            ⏹️ Parar
                        </Button>
                    )}

                    <Button
                        className="btn-custom btn-secondary-custom"
                        onClick={resetGrid}
                        disabled={status === 'running'}
                    >
                        🔄 Resetar
                    </Button>

                    <div className="speed-control">
                        <span>🐢</span>
                        <input
                            type="range"
                            min="1"
                            max={DEFAULT_CONFIG.maxDelay}
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                        />
                        <span>🐇</span>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default SieveVisualizer;
