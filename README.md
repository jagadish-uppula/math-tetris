# Math Tetris 🎮➗

![Game Screenshots](./screenshot.jpg)
![Game Screenshots](./screenshot1.jpg)
![Game Screenshots](./screenshot2.jpg)


A fun educational game combining math problems with Tetris mechanics. Test your math skills as you solve problems to prevent bricks from stacking up!

## Features ✨

- 👤 Player name input
- 📈 Progressive difficulty (easy → medium → hard)
- ⏱️ Timer and score system
- 🎮 Tetris-like falling options
- 🔊 Sound effects
- 📱 Responsive design
- 🧮 BODMAS rule implementation

## Installation and Setup 🛠️

### 1. Clone the Repository

```bash
git clone https://github.com/jagadish-uppula/math-tetris.git
cd math-tetris
```

### 2. Create Python Virtual Environment (Recommended)

#### Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

#### macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Add Sound Files (Optional)

Place your sound files in:
```
static/sounds/
- correct.mp3
- wrong.mp3
```

### 5. Run the Game

```bash
python app.py
```

Then open your browser to:  
🌐 [http://localhost:5000](http://localhost:5000)

## Game Controls 🎮

- 🖱️ Click on the correct answer from the falling options
- ⏱️ Solve problems before they reach the bottom
- ❌ Wrong answers add brick lines
- 🏆 Score points for correct answers

## Project Structure 📂

```
math-tetris/
├── app.py                  # Flask backend
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/                # Stylesheets
│   ├── js/                 # Game logic
│   └── sounds/             # Sound effects
├── templates/              # HTML templates
├── README.md               # This file
└── LICENSE                 # MIT License
```

## Requirements 📋

- Python 3.7+
- Flask 2.0+
- Modern web browser

## Troubleshooting 🔧

**Issue:** Sound not working  
**Solution:** Ensure you have sound files in `static/sounds/` or disable sound in code

**Issue:** ModuleNotFoundError  
**Solution:** Ensure virtual environment is activated and run `pip install -r requirements.txt`

## Contributing 🤝

Contributions are welcome! Please fork the repository and create a pull request.

## License 📜

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
