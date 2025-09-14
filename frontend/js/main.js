class RuFixApp {
    constructor() {
        this.cube = new RubiksCube();
        this.solver = new CubeSolver();
        this.init();
    }

    init() {
        this.setupSolveButton();
        this.hideSolutionPanel();
    }

    setupSolveButton() {
        const solveBtn = document.getElementById('solve-btn');
        solveBtn.addEventListener('click', () => {
            this.solveCube();
        });
    }

    async solveCube() {
        const solveBtn = document.getElementById('solve-btn');
        const solutionPanel = document.getElementById('solution-panel');
        const solutionMoves = document.getElementById('solution-moves');
        const solutionInfo = document.getElementById('solution-info');

        try {
            // Validate cube state
            if (!this.cube.isValidState()) {
                this.showError('Invalid cube state! Please ensure you have exactly 9 squares of each color.');
                return;
            }

            // Disable solve button and show loading
            solveBtn.disabled = true;
            solveBtn.textContent = 'Solving...';
            
            this.showSolutionPanel();
            solutionMoves.innerHTML = '<div class="loading">Calculating solution...</div>';
            solutionInfo.innerHTML = '';

            // Get cube state and solve
            const cubeState = this.cube.getState();
            const result = await this.solver.solve(cubeState);

            if (result.success) {
                this.displaySolution(result.solution, result.moves);
            } else {
                throw new Error('No solution found');
            }

        } catch (error) {
            this.showError(error.message);
        } finally {
            // Re-enable solve button
            solveBtn.disabled = false;
            solveBtn.textContent = 'Solve';
        }
    }

    displaySolution(moves, moveCount) {
        const solutionMoves = document.getElementById('solution-moves');
        const solutionInfo = document.getElementById('solution-info');

        if (!moves || moves.length === 0) {
            solutionMoves.innerHTML = '<div class="success">Cube is already solved!</div>';
            solutionInfo.innerHTML = '';
            return;
        }

        // Display moves as styled buttons
        const moveElements = moves.map(move => 
            `<span class="move">${move}</span>`
        ).join('');

        solutionMoves.innerHTML = moveElements;
        solutionInfo.innerHTML = `
            <p><strong>Solution found!</strong></p>
            <p>Number of moves: ${moveCount}</p>
            <p>Click on each move above to see the sequence.</p>
        `;

        // Add click handlers to moves for highlighting
        document.querySelectorAll('.move').forEach((moveElement, index) => {
            moveElement.addEventListener('click', () => {
                this.highlightMove(index);
            });
        });
    }

    highlightMove(moveIndex) {
        document.querySelectorAll('.move').forEach((move, index) => {
            if (index <= moveIndex) {
                move.style.backgroundColor = '#28a745';
            } else {
                move.style.backgroundColor = '#007bff';
            }
        });
    }

    showSolutionPanel() {
        const panel = document.getElementById('solution-panel');
        panel.classList.add('show');
    }

    hideSolutionPanel() {
        const panel = document.getElementById('solution-panel');
        panel.classList.remove('show');
    }

    showError(message) {
        const solutionMoves = document.getElementById('solution-moves');
        const solutionInfo = document.getElementById('solution-info');
        
        this.showSolutionPanel();
        solutionMoves.innerHTML = `<div class="error">${message}</div>`;
        solutionInfo.innerHTML = '';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RuFixApp();
});