import React, { useState } from 'react';
import CustomNavbar from './components/Navbar';
import AlgorithmSelector from './components/AlgorithmSelector';
import SortingVisualizer from './components/SortingVisualizer';
import { bubbleSort, selectionSort, insertionSort, mergeSort, binaryInsertionSort, cocktailSort, countingSort, gnomeSort, combSort } from './algorithms/sorting';
import { linearSearch } from './algorithms/searching';
import SearchingVisualizer from './components/SearchingVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import SieveVisualizer from './components/SieveVisualizer';
import './App.css';

const algorithmMap = {
    bubble: { algorithm: bubbleSort, title: 'Bubble Sort', icon: '🫧', type: 'sorting' },
    selection: { algorithm: selectionSort, title: 'Selection Sort', icon: '👆', type: 'sorting' },
    insertion: { algorithm: insertionSort, title: 'Insertion Sort', icon: '📥', type: 'sorting' },
    binaryInsertion: { algorithm: binaryInsertionSort, title: 'Binary Insertion Sort', icon: '🔢', type: 'sorting' },
    merge: { algorithm: mergeSort, title: 'Merge Sort', icon: '🤝', type: 'sorting' },
    cocktail: { algorithm: cocktailSort, title: 'Cocktail Sort', icon: '🍹', type: 'sorting' },
    counting: {
        algorithm: countingSort,
        title: 'Counting Sort',
        icon: '💯',
        type: 'sorting',
        visualType: 'box',
        customConfig: { maxValue: 15, arraySize: 15 }
    },
    gnome: { algorithm: gnomeSort, title: 'Gnome Sort', icon: '🧙', type: 'sorting' },
    comb: { algorithm: combSort, title: 'Comb Sort', icon: '🧹', type: 'sorting' },
    linear: { algorithm: linearSearch, title: 'Busca Exaustiva', icon: '🔍', type: 'searching' },
    graphVisualizer: { title: 'Visualizador de Grafos', icon: '🕸️', type: 'graph' },
    sieve: { title: 'Crivo de Eratóstenes', icon: '🔢', type: 'math' }
};

function App() {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectAlgorithm = (algorithm) => {
        setSelectedAlgorithm(algorithm);
    };

    const handleBack = () => {
        setSelectedAlgorithm(null);
    };

    const renderAlgorithm = () => {
        if (!selectedAlgorithm) return null;

        const config = algorithmMap[selectedAlgorithm.id];
        if (!config) return null;

        if (config.type === 'searching') {
            return (
                <SearchingVisualizer
                    onBack={handleBack}
                    algorithm={config.algorithm}
                    title={config.title}
                    icon={config.icon}
                />
            );
        }

        if (config.type === 'graph') {
            return (
                <GraphVisualizer
                    onBack={handleBack}
                    title={config.title}
                    icon={config.icon}
                />
            );
        }

        if (config.type === 'math') {
            return (
                <SieveVisualizer
                    onBack={handleBack}
                    title={config.title}
                    icon={config.icon}
                />
            );
        }

        return (
            <SortingVisualizer
                onBack={handleBack}
                algorithm={config.algorithm}
                title={config.title}
                icon={config.icon}
                visualType={config.visualType}
                customConfig={config.customConfig}
            />
        );
    };

    return (
        <div className="app">
            <CustomNavbar />

            {selectedAlgorithm ? (
                renderAlgorithm()
            ) : (
                <AlgorithmSelector
                    onSelectAlgorithm={handleSelectAlgorithm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            )}
        </div>
    );
}

export default App;
