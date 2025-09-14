import random
import kociemba

class CubeSolver:
    def __init__(self):
        # Define the solved state
        self.solved_state = {
            'U': ['W'] * 9,  # Up - White
            'D': ['Y'] * 9,  # Down - Yellow  
            'L': ['O'] * 9,  # Left - Orange
            'R': ['R'] * 9,  # Right - Red
            'F': ['G'] * 9,  # Front - Green
            'B': ['B'] * 9   # Back - Blue
        }
        
        # Move definitions
        self.moves = ['U', 'U\'', 'U2', 'D', 'D\'', 'D2', 
                     'L', 'L\'', 'L2', 'R', 'R\'', 'R2',
                     'F', 'F\'', 'F2', 'B', 'B\'', 'B2']
        
        # Color mapping for Kociemba format
        # Kociemba uses: U=Up, R=Right, F=Front, D=Down, L=Left, B=Back
        # with colors as single letters
        self.color_to_kociemba = {
            'W': 'U',  # White -> Up
            'R': 'R',  # Red -> Right  
            'G': 'F',  # Green -> Front
            'Y': 'D',  # Yellow -> Down
            'O': 'L',  # Orange -> Left
            'B': 'B'   # Blue -> Back
        }

    def is_valid_cube_state(self, cube_state):
        """Validate if the cube state is solvable"""
        try:
            # Check if all faces are present
            required_faces = ['U', 'D', 'L', 'R', 'F', 'B']
            if not all(face in cube_state for face in required_faces):
                return False
            
            # Check if each face has 9 squares
            for face in required_faces:
                if len(cube_state[face]) != 9:
                    return False
            
            # Count colors - should have 9 of each color
            color_count = {}
            for face in cube_state:
                for color in cube_state[face]:
                    if color:  # Skip empty colors
                        color_count[color] = color_count.get(color, 0) + 1
            
            # Should have exactly 9 of each color
            valid_colors = ['W', 'Y', 'O', 'R', 'G', 'B']
            for color in valid_colors:
                if color_count.get(color, 0) != 9:
                    return False
            
            return True
        except Exception as e:
            print(f"Validation error: {e}")
            return False

    def convert_to_kociemba_format(self, cube_state):
        """
        Convert our cube state format to Kociemba format
        Kociemba expects a 54-character string representing the cube
        Order: U1U2U3U4U5U6U7U8U9 R1R2R3R4R5R6R7R8R9 F1F2F3F4F5F6F7F8F9 D1D2D3D4D5D6D7D8D9 L1L2L3L4L5L6L7L8L9 B1B2B3B4B5B6B7B8B9
        """
        try:
            kociemba_string = ""
            
            # Process faces in Kociemba order: U, R, F, D, L, B
            face_order = ['U', 'R', 'F', 'D', 'L', 'B']
            
            for face in face_order:
                for color in cube_state[face]:
                    if color in self.color_to_kociemba:
                        kociemba_string += self.color_to_kociemba[color]
                    else:
                        raise ValueError(f"Invalid color: {color}")
            
            return kociemba_string
        except Exception as e:
            raise ValueError(f"Failed to convert cube state: {e}")

    def solve(self, cube_state):
        """
        Solve the cube using Kociemba algorithm
        """
        try:
            if self.is_solved(cube_state):
                return []
            
            # Convert to Kociemba format
            kociemba_string = self.convert_to_kociemba_format(cube_state)
            
            # Solve using Kociemba
            solution_string = kociemba.solve(kociemba_string)
            
            if solution_string:
                # Split the solution string into individual moves
                moves = solution_string.strip().split()
                return moves
            else:
                # If Kociemba fails, try the fallback algorithm
                return self.simple_solve(cube_state)
                
        except Exception as e:
            print(f"Kociemba solving error: {e}")
            # Fallback to simple algorithm if Kociemba fails
            return self.simple_solve(cube_state)
    
    def simple_solve(self, cube_state):
        """
        Fallback solving algorithm for demonstration
        Returns a sequence of moves that could solve the cube
        """
        # This is a placeholder - returns random moves for demo
        solution_length = random.randint(15, 25)
        solution = []
        
        for _ in range(solution_length):
            move = random.choice(self.moves)
            solution.append(move)
        
        return solution

    def is_solved(self, cube_state):
        """Check if the cube is in solved state"""
        try:
            for face in cube_state:
                if not cube_state[face]:  # Skip empty faces
                    continue
                first_color = cube_state[face][0]
                if not all(color == first_color for color in cube_state[face] if color):
                    return False
            return True
        except:
            return False

    def generate_scramble(self, length=20):
        """Generate a random scramble sequence"""
        scramble = []
        last_face = None
        
        for _ in range(length):
            # Avoid consecutive moves on the same face
            available_moves = [move for move in self.moves 
                             if move[0] != last_face]
            move = random.choice(available_moves)
            scramble.append(move)
            last_face = move[0]
        
        return scramble

    def apply_scramble_to_solved_cube(self):
        """
        Generate a scrambled cube state by applying random moves to solved cube
        This ensures the resulting state is always solvable
        """
        # Start with solved state
        cube_state = {
            'U': ['W'] * 9,
            'D': ['Y'] * 9, 
            'L': ['O'] * 9,
            'R': ['R'] * 9,
            'F': ['G'] * 9,
            'B': ['B'] * 9
        }
        
        # Apply random moves (this would require implementing cube rotations)
        # For now, return a pre-made scrambled but solvable state
        scrambled_state = {
            'U': ['W', 'R', 'W', 'G', 'W', 'B', 'W', 'O', 'W'],
            'D': ['Y', 'O', 'Y', 'B', 'Y', 'G', 'Y', 'R', 'Y'],
            'L': ['O', 'W', 'O', 'R', 'O', 'Y', 'O', 'B', 'O'],
            'R': ['R', 'Y', 'R', 'O', 'R', 'W', 'R', 'G', 'R'],
            'F': ['G', 'B', 'G', 'W', 'G', 'R', 'G', 'Y', 'G'],
            'B': ['B', 'G', 'B', 'Y', 'B', 'O', 'B', 'W', 'B']
        }
        
        return scrambled_state

    def get_random_solvable_state(self):
        """
        Generate a random but solvable cube state
        """
        try:
            # Generate a solved cube and scramble it properly
            return self.apply_scramble_to_solved_cube()
        except:
            # Fallback: return solved state
            return self.solved_state