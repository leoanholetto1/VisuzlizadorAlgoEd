import React, { useState, useEffect, useRef } from 'react';
import { Container, Button } from 'react-bootstrap';
import { generateRandomArray, delay, DEFAULT_CONFIG } from '../utils/arrayUtils';

function SortingVisualizer({ onBack, algorithm, title, icon, visualType, customConfig }) {
    const [array, setArray] = useState([]);
    const [comparing, setComparing] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [selected, setSelected] = useState([]);
    const [scanning, setScanning] = useState([]);
    const [auxiliary, setAuxiliary] = useState(null); // { data: [], active: -1 }
    const [isSorting, setIsSorting] = useState(false);
    const [speed, setSpeed] = useState(DEFAULT_CONFIG.defaultSpeed);
    const sortingRef = useRef(false);
    const speedRef = useRef(speed);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    const handleGenerateArray = () => {
        const config = customConfig || DEFAULT_CONFIG;
        const newArray = generateRandomArray({
            size: config.arraySize || DEFAULT_CONFIG.arraySize,
            min: typeof config.minValue !== 'undefined' ? config.minValue : DEFAULT_CONFIG.minValue,
            max: config.maxValue || DEFAULT_CONFIG.maxValue
        });
        setArray(newArray);
        setComparing([]);
        setSorted([]);
        setSelected([]);
        setScanning([]);
        setAuxiliary(null);
    };

    useEffect(() => {
        handleGenerateArray();
    }, [customConfig]);

    const runSort = async () => {
        setIsSorting(true);
        sortingRef.current = true;
        let arr = [...array];

        const callbacks = {
            onCompare: (...indices) => setComparing(indices),
            onSwap: (newArr) => setArray(newArr),
            onSorted: (index) => setSorted(prev => [...prev, index]),
            onSelect: (...indices) => setSelected(indices),
            onScan: (...indices) => setScanning(indices),
            onUpdateAux: (data, active = -1) => setAuxiliary({ data, active }),
            getDelay: () => delay(DEFAULT_CONFIG.maxDelay + 1 - speedRef.current),
            shouldStop: () => !sortingRef.current
        };

        await algorithm(arr, callbacks);

        if (sortingRef.current) {
            setSorted([...Array(arr.length).keys()]);
        }
        setComparing([]);
        setSelected([]);
        setScanning([]);
        setAuxiliary(null);
        setIsSorting(false);
        sortingRef.current = false;
    };

    const stopSorting = () => {
        sortingRef.current = false;
        setIsSorting(false);
        setComparing([]);
        setSelected([]);
        setScanning([]);
        setAuxiliary(null);
    };

    const resetArray = () => {
        stopSorting();
        handleGenerateArray();
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
                {visualType === 'box' ? (
                    <div className="array-container-box">
                        {array.map((value, idx) => (
                            <div
                                key={idx}
                                className={`array-box ${comparing.includes(idx) ? 'comparing' : ''} ${sorted.includes(idx) ? 'sorted' : ''} ${selected.includes(idx) ? 'selected' : ''} ${scanning.includes(idx) ? 'scanning' : ''}`}
                            >
                                {value}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bars-container">
                        {array.map((value, idx) => (
                            <div
                                key={idx}
                                className={`bar ${comparing.includes(idx) ? 'comparing' : ''} ${sorted.includes(idx) ? 'sorted' : ''} ${selected.includes(idx) ? 'selected' : ''} ${scanning.includes(idx) ? 'scanning' : ''}`}
                                style={{
                                    height: `${value}px`,
                                    width: `${Math.max(800 / array.length - 3, 4)}px`
                                }}
                            />
                        ))}
                    </div>
                )}

                {auxiliary && (
                    <div className="aux-container fade-in">
                        <h5 className="text-white mb-2 text-center">Tabela de Frequência</h5>
                        <div className="aux-bars">
                            {auxiliary.data.map((count, idx) => (
                                <div
                                    key={idx}
                                    className={`aux-box ${auxiliary.active === idx ? 'active' : ''}`}
                                    title={`Valor: ${idx}, Contagem: ${count}`}
                                >
                                    <div className="count">{count}</div>
                                    <div className="label">{idx}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="controls">
                    <Button
                        className="btn-custom btn-secondary-custom"
                        onClick={resetArray}
                        disabled={isSorting}
                    >
                        🔄 Gerar Novo Array
                    </Button>

                    {!isSorting ? (
                        <Button
                            className="btn-custom btn-success-custom"
                            onClick={runSort}
                        >
                            ▶️ Iniciar Ordenação
                        </Button>
                    ) : (
                        <Button
                            className="btn-custom"
                            style={{ background: 'var(--accent-secondary)', border: 'none' }}
                            onClick={stopSorting}
                        >
                            ⏹️ Parar
                        </Button>
                    )}

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

export default SortingVisualizer;
