from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import json
import random
import os
from cube_solver import CubeSolver

app = Flask(__name__, static_folder='frontend', template_folder='frontend')
CORS(app)

# Initialize the cube solver
solver = CubeSolver()

@app.route('/')
def index():
    return send_from_directory('frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('frontend', path)

@app.route('/api/solve', methods=['POST'])
def solve_cube():
    try:
        data = request.json
        cube_state = data.get('cubeState')
        
        if not cube_state:
            return jsonify({'error': 'No cube state provided'}), 400
        
        # Validate cube state
        if not solver.is_valid_cube_state(cube_state):
            return jsonify({'error': 'Invalid cube state'}), 400
        
        # Solve the cube
        solution = solver.solve(cube_state)
        
        if solution is None:
            return jsonify({'error': 'No solution found'}), 400
        
        return jsonify({
            'success': True,
            'solution': solution,
            'moves': len(solution) if solution else 0
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/scramble', methods=['GET'])
def scramble_cube():
    try:
        scramble = solver.generate_scramble()
        return jsonify({
            'success': True,
            'scramble': scramble
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)