// Algorithm data will be populated from Django template
let algorithms = {};

// Alpine.js functions
function getAlgorithmName(id) {
    return algorithms[id]?.name || 'Unknown Algorithm';
}

function getAlgorithmPseudocode(id) {
    return algorithms[id]?.pseudocode || 'No pseudocode available';
}

function getAlgorithmImplementation(id) {
    return algorithms[id]?.implementation || 'No implementation available';
}

// Animation functions
function initAnimation() {
    const canvas = document.getElementById('animationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const selectedAlgorithm = window.selectedAlgorithm;
    const algorithmType = algorithms[selectedAlgorithm]?.type;
    
    if (algorithmType === 'sorting') {
        initSortingAnimation(ctx);
    } else if (algorithmType === 'searching') {
        initSearchingAnimation(ctx);
    } else {
        initGraphAnimation(ctx);
    }
}

function initSortingAnimation(ctx) {
    const bars = Array.from({length: 10}, () => Math.random() * 200 + 50);
    let currentStep = 0;
    let isRunning = false;
    
    function drawBars() {
        ctx.clearRect(0, 0, 800, 300);
        bars.forEach((height, i) => {
            ctx.fillStyle = i === currentStep ? '#ef4444' : '#3b82f6';
            ctx.fillRect(i * 75 + 25, 300 - height, 50, height);
        });
    }
    
    function bubbleSort() {
        if (!isRunning) return;
        if (currentStep < bars.length - 1) {
            if (bars[currentStep] > bars[currentStep + 1]) {
                [bars[currentStep], bars[currentStep + 1]] = [bars[currentStep + 1], bars[currentStep]];
            }
            currentStep++;
            drawBars();
            setTimeout(bubbleSort, 500);
        } else {
            isRunning = false;
        }
    }
    
    drawBars();
    
    // Button event listeners
    document.getElementById('playBtn').onclick = () => {
        isRunning = true;
        bubbleSort();
    };
    
    document.getElementById('pauseBtn').onclick = () => {
        isRunning = false;
    };
    
    document.getElementById('resetBtn').onclick = () => {
        isRunning = false;
        currentStep = 0;
        bars.splice(0, bars.length, ...Array.from({length: 10}, () => Math.random() * 200 + 50));
        drawBars();
    };
}

function initSearchingAnimation(ctx) {
    const numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    let currentIndex = 0;
    let isRunning = false;
    const target = 11;
    
    function drawSearch() {
        ctx.clearRect(0, 0, 800, 300);
        numbers.forEach((num, i) => {
            ctx.fillStyle = i === currentIndex ? '#ef4444' : '#3b82f6';
            ctx.fillRect(i * 70 + 50, 150, 50, 50);
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(num, i * 70 + 75, 180);
        });
    }
    
    function binarySearch() {
        if (!isRunning) return;
        if (currentIndex < numbers.length) {
            drawSearch();
            currentIndex++;
            setTimeout(binarySearch, 800);
        } else {
            isRunning = false;
        }
    }
    
    drawSearch();
    
    // Button event listeners
    document.getElementById('playBtn').onclick = () => {
        isRunning = true;
        binarySearch();
    };
    
    document.getElementById('pauseBtn').onclick = () => {
        isRunning = false;
    };
    
    document.getElementById('resetBtn').onclick = () => {
        isRunning = false;
        currentIndex = 0;
        drawSearch();
    };
}

function initGraphAnimation(ctx) {
    const nodes = [
        {x: 100, y: 100, id: 'A'},
        {x: 300, y: 100, id: 'B'},
        {x: 500, y: 100, id: 'C'},
        {x: 200, y: 200, id: 'D'},
        {x: 400, y: 200, id: 'E'}
    ];
    let visited = new Set();
    let currentIndex = 0;
    let isRunning = false;
    
    function drawGraph() {
        ctx.clearRect(0, 0, 800, 300);
        
        // Draw edges
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(300, 100);
        ctx.moveTo(300, 100);
        ctx.lineTo(500, 100);
        ctx.moveTo(100, 100);
        ctx.lineTo(200, 200);
        ctx.moveTo(300, 100);
        ctx.lineTo(400, 200);
        ctx.stroke();
        
        // Draw nodes
        nodes.forEach((node, i) => {
            ctx.fillStyle = visited.has(i) ? '#ef4444' : '#3b82f6';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(node.id, node.x, node.y + 5);
        });
    }
    
    function dfs() {
        if (!isRunning) return;
        if (currentIndex < nodes.length) {
            visited.add(currentIndex);
            drawGraph();
            currentIndex++;
            setTimeout(dfs, 1000);
        } else {
            isRunning = false;
        }
    }
    
    drawGraph();
    
    // Button event listeners
    document.getElementById('playBtn').onclick = () => {
        isRunning = true;
        dfs();
    };
    
    document.getElementById('pauseBtn').onclick = () => {
        isRunning = false;
    };
    
    document.getElementById('resetBtn').onclick = () => {
        isRunning = false;
        visited.clear();
        currentIndex = 0;
        drawGraph();
    };
}

// Initialize animations when modal opens
document.addEventListener('alpine:init', () => {
    Alpine.data('algorithmModal', () => ({
        selectedAlgorithm: null,
        init() {
            this.$watch('selectedAlgorithm', (value) => {
                if (value) {
                    window.selectedAlgorithm = value;
                    setTimeout(initAnimation, 100);
                }
            });
        }
    }));
}); 