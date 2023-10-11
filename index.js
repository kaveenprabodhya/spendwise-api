const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let budgets = [];

// Fetch all budget data for a user
app.get('/:userId/budgets', (req, res) => {
    // Handle fetching all budget data for the specified user ID
    // For example, if you want to fetch budgets for a specific user:
    const userId = req.params.userId;
    const userBudgets = budgets.filter(budget => budget.userId === userId);
    res.json(userBudgets);
});

// Fetch overall budget for a user
app.get('/:userId/budgets/overall', (req, res) => {
    // Handle fetching overall budget for the specified user ID
    // ...
    res.send('Fetching overall budget for user');
});

// Create a new budget for a user
app.post('/:userId/budgets', (req, res) => {
    const userId = req.params.userId;
    const newBudget = req.body;
    newBudget.userId = userId;

    // Handle creating a new budget for the specified user ID
    budgets.push(newBudget);

    // Send a response back to the client
    res.json(newBudget);
});

// Update a budget for a user
app.put('/:userId/budgets/:budgetId', (req, res) => {
    const userId = req.params.userId;
    const budgetId = req.params.budgetId;
    const updatedBudgetData = req.body;

    // Find the budget to update
    const budgetToUpdate = budgets.find(budget => budget.userId === userId && budget.id === budgetId);

    if (budgetToUpdate) {
        // Update the budget data
        Object.assign(budgetToUpdate, updatedBudgetData);
        res.json(budgetToUpdate);
    } else {
        // Budget not found
        res.status(404).json({ error: 'Budget not found' });
    }
});

// Delete a budget for a user
app.delete('/:userId/budgets/:budgetId', (req, res) => {
    const userId = req.params.userId;
    const budgetId = req.params.budgetId;

    // Find the index of the budget to delete
    const budgetIndex = budgets.findIndex(budget => budget.userId === userId && budget.id === budgetId);

    if (budgetIndex !== -1) {
        // Remove the budget from the array
        const deletedBudget = budgets.splice(budgetIndex, 1);
        res.json(deletedBudget[0]);
    } else {
        // Budget not found
        res.status(404).json({ error: 'Budget not found' });
    }
});

// Get transactions for a specific budget of a user
app.get('/:userId/budgets/:budgetId/transactions', (req, res) => {
    // Handle fetching transactions for the specified budget and user ID
    // ...
    res.send('Fetching transactions for budget');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
