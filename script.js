document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const currentStateEl = document.getElementById('current-state');
    const goalStateEl = document.getElementById('goal-state');
    const differencesEl = document.getElementById('differences');
    const operatorsEl = document.getElementById('operators');
    const historyEl = document.getElementById('history-content');
    const moveCountEl = document.getElementById('move-count');
    const successMessageEl = document.getElementById('success-message');
    const finalMovesEl = document.getElementById('final-moves');
    
    // Buttons
    const analyzeBtn = document.getElementById('analyze-btn');
    const resetBtn = document.getElementById('reset-btn');
    const level1Btn = document.getElementById('level1');
    const level2Btn = document.getElementById('level2');
    const level3Btn = document.getElementById('level3');
    
    // Game state
    let currentState = {};
    let goalState = {};
    let operators = [];
    let currentLevel = null;
    let moveCount = 0;
    
    // Level definitions
    const levels = {
      level1: {
        name: "Number Puzzle",
        initialState: { numbers: [5, 2, 7, 1, 3] },
        goalState: { numbers: [1, 2, 3, 5, 7] },
        operators: [
          { name: "Sort", apply: state => ({ numbers: [...state.numbers].sort((a, b) => a - b) }) },
          { name: "Reverse", apply: state => ({ numbers: [...state.numbers].reverse() }) },
          { name: "Shift Left", apply: state => ({ numbers: [...state.numbers.slice(1), state.numbers[0]] }) },
          { name: "Shift Right", apply: state => ({ numbers: [state.numbers[state.numbers.length - 1], ...state.numbers.slice(0, -1)] }) },
          { name: "Swap First Two", apply: state => {
              const newArr = [...state.numbers];
              [newArr[0], newArr[1]] = [newArr[1], newArr[0]];
              return { numbers: newArr };
            }
          }
        ],
        renderState: (state, element) => {
          element.innerHTML = `<div style="display: flex; gap: 10px; margin-bottom: 10px;">
            ${state.numbers.map(n => `<div style="width: 40px; height: 40px; background-color: #3498db; color: white; display: flex; align-items: center; justify-content: center; border-radius: 5px;">${n}</div>`).join('')}
          </div>`;
        },
        findDifferences: (current, goal) => {
          const differences = [];
          
          // Check if arrays are identical
          const isIdentical = current.numbers.every((num, idx) => num === goal.numbers[idx]);
          if (isIdentical) return differences;
          
          // Check if arrays have the same elements
          const hasSameElements = 
            current.numbers.length === goal.numbers.length && 
            [...current.numbers].sort().every((val, idx) => val === [...goal.numbers].sort()[idx]);
          
          if (!hasSameElements) {
            differences.push("Elements in the arrays are different");
          } else if (current.numbers.length !== goal.numbers.length) {
            differences.push("Arrays have different lengths");
          } else {
            differences.push("Elements are in the wrong order");
            
            // Check how many elements are in the correct position
            const correctPositions = current.numbers.filter((num, idx) => num === goal.numbers[idx]).length;
            differences.push(`${correctPositions} out of ${current.numbers.length} elements are in correct positions`);
          }
          
          return differences;
        }
      },
      
      level2: {
        name: "Block World",
        initialState: { 
          stacks: [["A", "B", "C"], ["D", "E"], []] 
        },
        goalState: { 
          stacks: [[], ["B", "D"], ["A", "C", "E"]] 
        },
        operators: [
          { 
            name: "Move Block from Stack 1 to Stack 2", 
            apply: state => {
              if (state.stacks[0].length === 0) return state;
              const newStacks = JSON.parse(JSON.stringify(state.stacks));
              const block = newStacks[0].pop();
              newStacks[1].push(block);
              return { stacks: newStacks };
            },
            isApplicable: state => state.stacks[0].length > 0
          },
          { 
            name: "Move Block from Stack 1 to Stack 3", 
            apply: state => {
              if (state.stacks[0].length === 0) return state;
              const newStacks = JSON.parse(JSON.stringify(state.stacks));
              const block = newStacks[0].pop();
              newStacks[2].push(block);
              return { stacks: newStacks };
            },
            isApplicable: state => state.stacks[0].length > 0
          },
          { 
            name: "Move Block from Stack 2 to Stack 1", 
            apply: state => {
              if (state.stacks[1].length === 0) return state;
              const newStacks = JSON.parse(JSON.stringify(state.stacks));
              const block = newStacks[1].pop();
              newStacks[0].push(block);
              return { stacks: newStacks };
            },
            isApplicable: state => state.stacks[1].length > 0
          },
          { 
            name: "Move Block from Stack 2 to Stack 3", 
            apply: state => {
              if (state.stacks[1].length === 0) return state;
              const newStacks = JSON.parse(JSON.stringify(state.stacks));
              const block = newStacks[1].pop();
              newStacks[2].push(block);
              return { stacks: newStacks };
            },
            isApplicable: state => state.stacks[1].length > 0
          },
          { 
            name: "Move Block from Stack 3 to Stack 1", 
            apply: state => {
              if (state.stacks[2].length === 0) return state;
              const newStacks = JSON.parse(JSON.stringify(state.stacks));
              const block = newStacks[2].pop();
              newStacks[0].push(block);
              return { stacks: newStacks };
            },
            isApplicable: state => state.stacks[2].length > 0
          },
          { 
            name: "Move Block from Stack 3 to Stack 2", 
            apply: state => {
              if (state.stacks[2].length === 0) return state;
              const newStacks = JSON.parse(JSON.stringify(state.stacks));
              const block = newStacks[2].pop();
              newStacks[1].push(block);
              return { stacks: newStacks };
            },
            isApplicable: state => state.stacks[2].length > 0
          }
        ],
        renderState: (state, element) => {
          element.innerHTML = `
            <div style="display: flex; gap: 20px; justify-content: space-around;">
              ${state.stacks.map((stack, stackIdx) => `
                <div style="display: flex; flex-direction: column-reverse; align-items: center; width: 60px;">
                  ${stack.map(block => `
                    <div style="width: 50px; height: 30px; background-color: #e74c3c; color: white; display: flex; align-items: center; justify-content: center; margin: 2px; border-radius: 3px;">
                      ${block}
                    </div>
                  `).join('')}
                  <div style="width: 60px; height: 10px; background-color: #7f8c8d; margin-top: 5px;"></div>
                  <div style="margin-top: 5px;">Stack ${stackIdx + 1}</div>
                </div>
              `).join('')}
            </div>
          `;
        },
        findDifferences: (current, goal) => {
          const differences = [];
          
          // Check if stacks are identical
          const isIdentical = current.stacks.every((stack, stackIdx) => {
            if (stack.length !== goal.stacks[stackIdx].length) return false;
            return stack.every((block, blockIdx) => block === goal.stacks[stackIdx][blockIdx]);
          });
          
          if (isIdentical) return differences;
          
          for (let i = 0; i < current.stacks.length; i++) {
            const currentStack = current.stacks[i];
            const goalStack = goal.stacks[i];
            
            if (currentStack.length !== goalStack.length) {
              differences.push(`Stack ${i + 1} has ${currentStack.length} blocks, but should have ${goalStack.length}`);
            }
            
            // Check which blocks are in wrong stacks
            const wrongBlocks = currentStack.filter(block => !goalStack.includes(block));
            if (wrongBlocks.length > 0) {
              differences.push(`Blocks ${wrongBlocks.join(', ')} should not be in Stack ${i + 1}`);
            }
            
            // Check which blocks are in wrong order
            const commonBlocks = currentStack.filter(block => goalStack.includes(block));
            for (const block of commonBlocks) {
              const currentIdx = currentStack.indexOf(block);
              const goalIdx = goalStack.indexOf(block);
              if (currentIdx !== goalIdx) {
                differences.push(`Block ${block} is in wrong position in Stack ${i + 1}`);
                break;
              }
            }
          }
          
          return differences;
        }
      },
      
      level3: {
        name: "Resource Management",
        initialState: { 
          resources: { wood: 5, stone: 2, iron: 0, gold: 0 },
          tools: []
        },
        goalState: { 
          resources: { wood: 1, stone: 0, iron: 2, gold: 1 },
          tools: ["pickaxe", "axe"]
        },
        operators: [
          { 
            name: "Craft Pickaxe (2 Wood + 1 Stone)", 
            apply: state => {
              if (state.resources.wood < 2 || state.resources.stone < 1) return state;
              if (state.tools.includes("pickaxe")) return state;
              
              return {
                resources: {
                  ...state.resources,
                  wood: state.resources.wood - 2,
                  stone: state.resources.stone - 1
                },
                tools: [...state.tools, "pickaxe"]
              };
            },
            isApplicable: state => state.resources.wood >= 2 && 
                                   state.resources.stone >= 1 && 
                                   !state.tools.includes("pickaxe")
          },
          { 
            name: "Craft Axe (3 Wood + 1 Stone)", 
            apply: state => {
              if (state.resources.wood < 3 || state.resources.stone < 1) return state;
              if (state.tools.includes("axe")) return state;
              
              return {
                resources: {
                  ...state.resources,
                  wood: state.resources.wood - 3,
                  stone: state.resources.stone - 1
                },
                tools: [...state.tools, "axe"]
              };
            },
            isApplicable: state => state.resources.wood >= 3 && 
                                   state.resources.stone >= 1 && 
                                   !state.tools.includes("axe")
          },
          { 
            name: "Mine Iron (Requires Pickaxe)", 
            apply: state => {
              if (!state.tools.includes("pickaxe")) return state;
              
              return {
                resources: {
                  ...state.resources,
                  stone: state.resources.stone - 1,
                  iron: state.resources.iron + 2
                },
                tools: [...state.tools]
              };
            },
            isApplicable: state => state.tools.includes("pickaxe") && state.resources.stone >= 1
          },
          { 
            name: "Mine Gold (Requires Pickaxe + Iron)", 
            apply: state => {
              if (!state.tools.includes("pickaxe") || state.resources.iron < 1) return state;
              
              return {
                resources: {
                  ...state.resources,
                  iron: state.resources.iron - 1,
                  gold: state.resources.gold + 1
                },
                tools: [...state.tools]
              };
            },
            isApplicable: state => state.tools.includes("pickaxe") && state.resources.iron >= 1
          },
          { 
            name: "Gather Wood (Extra with Axe)", 
            apply: state => {
              const woodGain = state.tools.includes("axe") ? 3 : 1;
              
              return {
                resources: {
                  ...state.resources,
                  wood: state.resources.wood + woodGain
                },
                tools: [...state.tools]
              };
            }
          },
          { 
            name: "Gather Stone", 
            apply: state => {
              return {
                resources: {
                  ...state.resources,
                  stone: state.resources.stone + 1
                },
                tools: [...state.tools]
              };
            }
          }
        ],
        renderState: (state, element) => {
          element.innerHTML = `
            <div>
              <h4>Resources:</h4>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="background-color: #8b4513; color: white; padding: 8px; border-radius: 5px;">
                  Wood: ${state.resources.wood}
                </div>
                <div style="background-color: #7f8c8d; color: white; padding: 8px; border-radius: 5px;">
                  Stone: ${state.resources.stone}
                </div>
                <div style="background-color: #95a5a6; color: white; padding: 8px; border-radius: 5px;">
                  Iron: ${state.resources.iron}
                </div>
                <div style="background-color: #f39c12; color: white; padding: 8px; border-radius: 5px;">
                  Gold: ${state.resources.gold}
                </div>
              </div>
              <h4>Tools:</h4>
              <div style="display: flex; gap: 10px;">
                ${state.tools.length === 0 ? 
                  '<div style="padding: 8px; background-color: #ecf0f1; border-radius: 5px;">No tools yet</div>' : 
                  state.tools.map(tool => `
                    <div style="padding: 8px; background-color: #3498db; color: white; border-radius: 5px;">
                      ${tool}
                    </div>
                  `).join('')
                }
              </div>
            </div>
          `;
        },
        findDifferences: (current, goal) => {
          const differences = [];
          
          // Check resources
          for (const [resource, amount] of Object.entries(goal.resources)) {
            const currentAmount = current.resources[resource];
            if (currentAmount !== amount) {
              if (currentAmount < amount) {
                differences.push(`Need ${amount - currentAmount} more ${resource}`);
              } else {
                differences.push(`Have ${currentAmount - amount} excess ${resource}`);
              }
            }
          }
          
          // Check tools
          for (const tool of goal.tools) {
            if (!current.tools.includes(tool)) {
              differences.push(`Missing tool: ${tool}`);
            }
          }
          
          // Check for extra tools
          for (const tool of current.tools) {
            if (!goal.tools.includes(tool)) {
              differences.push(`Extra tool: ${tool}`);
            }
          }
          
          return differences;
        }
      }
    };
  
    // Initialize game
    function initLevel(levelKey) {
      currentLevel = levels[levelKey];
      currentState = JSON.parse(JSON.stringify(currentLevel.initialState));
      goalState = currentLevel.goalState;
      operators = currentLevel.operators;
      moveCount = 0;
      
      // Update UI
      currentLevel.renderState(currentState, currentStateEl);
      currentLevel.renderState(goalState, goalStateEl);
      updateMoveCount();
      renderOperators();
      clearDifferences();
      clearHistory();
      hideSuccessMessage();
    }
    
    // Render operators as buttons
    function renderOperators() {
      operatorsEl.innerHTML = '';
      operators.forEach((op, idx) => {
        const btn = document.createElement('button');
        btn.textContent = op.name;
        btn.addEventListener('click', () => applyOperator(idx));
        
        // Disable button if operator not applicable
        if (op.isApplicable && !op.isApplicable(currentState)) {
          btn.disabled = true;
        }
        
        operatorsEl.appendChild(btn);
      });
    }
    
    // Apply an operator
    function applyOperator(opIndex) {
      const operator = operators[opIndex];
      const newState = operator.apply(currentState);
      
      // Update state and UI
      if (JSON.stringify(newState) !== JSON.stringify(currentState)) {
        currentState = newState;
        currentLevel.renderState(currentState, currentStateEl);
        moveCount++;
        updateMoveCount();
        addToHistory(`Applied: ${operator.name}`);
        renderOperators();
        
        // Check if goal reached
        checkGoalState();
      }
    }
    
    // Analyze differences between current and goal states
    function analyzeDifferences() {
      const differences = currentLevel.findDifferences(currentState, goalState);
      renderDifferences(differences);
    }
    
    // Render differences in UI
    function renderDifferences(differences) {
      if (differences.length === 0) {
        differencesEl.innerHTML = '<p>No differences - Goal state reached!</p>';
        return;
      }
      
      differencesEl.innerHTML = differences.map(d => `<p>• ${d}</p>`).join('');
    }
    
    // Clear differences display
    function clearDifferences() {
      differencesEl.innerHTML = '<p>Click "Analyze Differences" to identify disparities</p>';
    }
    
    // Add entry to history
    function addToHistory(text) {
      const entry = document.createElement('p');
      entry.textContent = `${moveCount}. ${text}`;
      historyEl.appendChild(entry);
      
      // Scroll to bottom
      historyEl.scrollTop = historyEl.scrollHeight;
    }
    
    // Clear history
    function clearHistory() {
      historyEl.innerHTML = '';
    }
    
    // Update move counter
    function updateMoveCount() {
      moveCountEl.textContent = moveCount;
    }
    
    // Check if goal state is reached
    function checkGoalState() {
      const differences = currentLevel.findDifferences(currentState, goalState);
      if (differences.length === 0) {
        showSuccessMessage();
      }
    }
    
    // Show success message
    function showSuccessMessage() {
      successMessageEl.style.display = 'block';
      finalMovesEl.textContent = moveCount;
    }
    
    // Hide success message
    function hideSuccessMessage() {
      successMessageEl.style.display = 'none';
    }
    
    // Event listeners
    analyzeBtn.addEventListener('click', analyzeDifferences);
    resetBtn.addEventListener('click', () => initLevel(currentLevel === null ? 'level1' : Object.keys(levels).find(k => levels[k] === currentLevel)));
    level1Btn.addEventListener('click', () => initLevel('level1'));
    level2Btn.addEventListener('click', () => initLevel('level2'));
    level3Btn.addEventListener('click', () => initLevel('level3'));
    
    // Initialize default level
    initLevel('level1');
  });