class CubeSolver {
    constructor() {
        this.apiUrl = '/api';
    }

    async solve(cubeState) {
        try {
            const response = await fetch(`${this.apiUrl}/solve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cubeState: cubeState
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to solve cube');
            }

            return data;
        } catch (error) {
            throw new Error(`Solver error: ${error.message}`);
        }
    }

    async scramble() {
        try {
            const response = await fetch(`${this.apiUrl}/scramble`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate scramble');
            }

            return data;
        } catch (error) {
            throw new Error(`Scramble error: ${error.message}`);
        }
    }
}