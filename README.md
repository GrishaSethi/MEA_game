# 🧠 Means-Ends Analysis Game

An interactive browser-based game that demonstrates **Means-Ends Analysis (MEA)** — a core problem-solving strategy in Artificial Intelligence. Players progress through three uniquely designed levels, each simulating a different MEA scenario.

---

## 🎯 Objective

To allow players and learners to explore and understand **Means-Ends Analysis** by interacting with problems that require identifying differences between current and goal states and applying actions to reduce those differences.

---

## 🧩 Game Levels

| Level | Title             | Description                                                                 |
|-------|-------------------|-----------------------------------------------------------------------------|
| 1     | Number Puzzle     | Solve a sliding number puzzle to reach the goal arrangement |
| 2     | Block World       | Stack colored blocks in a predefined order using limited moves               |
| 3     | Resource Management | Collect and use resources to achieve a target structure under constraints     |

Each level visualizes current vs. goal state and uses MEA to suggest or simulate steps to bridge the gap.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Game Logic:** JavaScript (MEA reasoning system per level)
- **UI Enhancements (optional):** Canvas, p5.js, or any lightweight JS libraries

---

## 🧠 What is Means-Ends Analysis?

Means-Ends Analysis (MEA) is a problem-solving approach that:
1. Identifies the **goal state**
2. Compares it with the **current state**
3. Applies **operators** (actions) that reduce the difference
4. May recursively introduce sub-goals if direct operators aren’t applicable

> Example: If a number tile is out of place, move it closer to its correct position → re-evaluate → repeat.

---

## 💻 How to Run the Game

1. Clone the repository:
   ```bash
   git clone https://github.com/GrishaSethi/mea-game.git
   ```
2. Open the folder:
   ```bash
   cd mea-game
   ```
3. Launch the game by opening index.html in your browser.

---
## 📁 Project Structure

```
mea-game/
├── index.html    # Main HTML file
├── style.css     # Styling for the game UI
└── script.js     # JavaScript logic for all three levels
```
