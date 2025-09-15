class RubiksCube {
    constructor() {
        this.state = this.getInitialState();
        this.selectedColor = 'W';
        this.init();
    }

    getInitialState() {
        return {
            'U': ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // Up - White
            'D': ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'], // Down - Yellow
            'L': ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'], // Left - Orange
            'R': ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'], // Right - Red
            'F': ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // Front - Green
            'B': ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B']  // Back - Blue
        };
    }

    init() {
        this.setupEventListeners();
        this.render();
        this.selectColor('W'); // Default selection
    }

    setupEventListeners() {
        // Color palette selection
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.selectColor(color);
            });
        });

        // Square clicking
        document.querySelectorAll('.square').forEach(square => {
            square.addEventListener('click', (e) => {
                const face = e.target.dataset.face;
                const index = parseInt(e.target.dataset.index);
                this.setSquareColor(face, index, this.selectedColor);
            });
        });

        // Action buttons
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clear();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
        });

        document.getElementById('scramble-btn').addEventListener('click', () => {
            this.scramble();
        });
    }

    selectColor(color) {
        this.selectedColor = color;
        
        // Update UI
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        document.querySelector(`[data-color="${color}"]`).classList.add('selected');
    }

    setSquareColor(face, index, color) {
        this.state[face][index] = color;
        this.renderSquare(face, index, color);
    }

    renderSquare(face, index, color) {
        const square = document.querySelector(`[data-face="${face}"][data-index="${index}"]`);
        square.className = 'square';
        square.classList.add(this.getColorClass(color));
    }

    getColorClass(color) {
        const colorMap = {
            'W': 'white',
            'Y': 'yellow', 
            'O': 'orange',
            'R': 'red',
            'G': 'green',
            'B': 'blue'
        };
        return colorMap[color] || '';
    }

    render() {
        Object.keys(this.state).forEach(face => {
            this.state[face].forEach((color, index) => {
                this.renderSquare(face, index, color);
            });
        });
    }

    clear() {
        // Set all squares to gray/empty
        Object.keys(this.state).forEach(face => {
            for (let i = 0; i < 9; i++) {
                this.state[face][i] = '';
                const square = document.querySelector(`[data-face="${face}"][data-index="${i}"]`);
                square.className = 'square';
            }
        });
    }

    reset() {
        this.state = this.getInitialState();
        this.render();
    }

    async scramble() {
        try {
            const response = await fetch('/api/scramble');
            const data = await response.json();
            
            if (data.success) {
                // Apply scramble to create a mixed state
                this.generateScrambledState();
                this.render();
            }
        } catch (error) {
            console.error('Error fetching scramble:', error);
            // Fallback: generate random scrambled state
            this.generateScrambledState();
            this.render();
        }
    }

    generateScrambledState() {
        const colors = ['W', 'Y', 'O', 'R', 'G', 'B'];
        const allSquares = [];
        
        // Create array with 9 of each color
        colors.forEach(color => {
            for (let i = 0; i < 9; i++) {
                allSquares.push(color);
            }
        });
        
        // Shuffle the array
        for (let i = allSquares.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allSquares[i], allSquares[j]] = [allSquares[j], allSquares[i]];
        }
        
        // Distribute colors to faces
        let colorIndex = 0;
        Object.keys(this.state).forEach(face => {
            for (let i = 0; i < 9; i++) {
                this.state[face][i] = allSquares[colorIndex++];
            }
        });
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        this.state = { ...newState };
        this.render();
    }

    isValidState() {
        const colors = ['W', 'Y', 'O', 'R', 'G', 'B'];
        const colorCount = {};
        
        // Count colors
        Object.keys(this.state).forEach(face => {
            this.state[face].forEach(color => {
                if (color) {
                    colorCount[color] = (colorCount[color] || 0) + 1;
                }
            });
        });
        
        // Check if we have 9 of each color
        return colors.every(color => colorCount[color] === 9);
    }
}