import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const categories = [
    {
        id: 'sorting',
        name: 'Ordenação',
        icon: '📊',
        description: 'Algoritmos para ordenar elementos',
        algorithms: [
            { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)', icon: '🫧' },
            { id: 'selection', name: 'Selection Sort', complexity: 'O(n²)', icon: '👆' },
            { id: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)', icon: '📥' },
            { id: 'binaryInsertion', name: 'Binary Insertion Sort', complexity: 'O(n²)', icon: '🔢' },
            { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)', icon: '🤝' },
            { id: 'cocktail', name: 'Cocktail Sort', complexity: 'O(n²)', icon: '🍹' },
            {
                id: 'counting',
                name: 'Counting Sort',
                complexity: 'O(n+k)',
                icon: '💯',
                visualType: 'box',
                customConfig: { maxValue: 15, arraySize: 15 }
            },
            { id: 'gnome', name: 'Gnome Sort', complexity: 'O(n²)', icon: '🧙' },
            { id: 'comb', name: 'Comb Sort', complexity: 'O(n²)', icon: '🧹' }
        ]
    },
    {
        id: 'search',
        name: 'Busca',
        icon: '🔍',
        description: 'Algoritmos para encontrar elementos',
        algorithms: [
            { id: 'linear', name: 'Busca Exaustiva', complexity: 'O(n)', icon: '🔍' }
        ]
    },
    {
        id: 'graphs',
        name: 'Grafos',
        icon: '🕸️',
        description: 'Algoritmos para estruturas de grafos',
        algorithms: [
            { id: 'graphVisualizer', name: 'Visualizador de Grafos', complexity: 'O(n+m) or O(n²)', icon: '🕸️' }
        ]
    },
    {
        id: 'math',
        name: 'Matemática',
        icon: '🔢',
        description: 'Algoritmos matemáticos e numéricos',
        algorithms: [
            { id: 'sieve', name: 'Crivo de Eratóstenes', complexity: 'O(n log log n)', icon: '🔢' }
        ]
    }
];

function AlgorithmSelector({ onSelectAlgorithm, selectedCategory, setSelectedCategory }) {

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    };

    const selectedCategoryData = categories.find(c => c.id === selectedCategory);

    return (
        <Container className="category-section">
            <h2 className="text-center mb-4">Escolha uma Categoria</h2>

            <Row className="justify-content-center g-4">
                {categories.map((category) => (
                    <Col key={category.id} xs={12} sm={6} md={4}>
                        <div
                            className={`glass-card category-card ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <div className="icon">{category.icon}</div>
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                        </div>
                    </Col>
                ))}
            </Row>

            {selectedCategoryData && selectedCategoryData.algorithms.length > 0 && (
                <div className="algorithm-list fade-in">
                    <h3 className="text-center mt-5 mb-4">
                        Algoritmos de {selectedCategoryData.name}
                    </h3>
                    <Row className="justify-content-center g-3">
                        {selectedCategoryData.algorithms.map((algo) => (
                            <Col key={algo.id} xs={12} sm={6} md={4}>
                                <div
                                    className="glass-card algorithm-card"
                                    onClick={() => onSelectAlgorithm(algo)}
                                >
                                    <h4>{algo.name}</h4>
                                    <p className="mb-0" style={{ color: 'var(--accent-success)' }}>
                                        Complexidade: {algo.complexity}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {selectedCategoryData && selectedCategoryData.algorithms.length === 0 && (
                <div className="text-center mt-5 fade-in">
                    <p style={{ color: 'var(--text-secondary)' }}>
                        🚧 Algoritmos de {selectedCategoryData.name} em breve...
                    </p>
                </div>
            )}
        </Container>
    );
}

export default AlgorithmSelector;
