const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(bodyParser.json());

/**
 * Budgets
 * 
 */

let budgets = [];

// Fetch all budget data for a userwr
app.get('/:userId/budgets', (req, res) => {
    // Handle fetching all budget data for the specified user ID
    // For example, if you want to fetch budgets for a specific user:
    const userId = req.params.userId;
    const userBudgets = budgets.filter(budget => budget.userId === userId);
    res.json(userBudgets);
});

app.post('/:userId/budgets', (req, res) => {
    const newBudget = req.body;

    // Handle creating a new budget for the specified user ID
    budgets.push(newBudget);

    // Send a response back to the client
    res.status(201).json(newBudget);
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

app.get('/:userId/budgets/:budgetId/transactions', (req, res) => {
    const userId = req.params.userId;
    const budgetId = req.params.budgetId;

    // Find the budget for the specified user ID and budget ID
    const budget = budgets.find(budget => budget.userId === userId && budget.id === budgetId);

    if (budget && budget.transactions && budget.transactions.length > 0) {
        // Budget and transactions found, return the transactions
        res.json(budget.transactions);
    } else {
        // Budget not found or no transactions, return an appropriate response
        if (!budget) {
            res.status(404).json({ error: 'Budget not found' });
        } else {
            res.status(404).json({ error: 'No transactions found for the budget' });
        }
    }
});

// Fetch overall budget for a user
app.get('/:userId/budgets/overall', (req, res) => {
    const userId = req.params.userId;

    // Find budgets for the specified user ID
    const userBudgets = budgets.filter(budget => budget.userId === userId);

    if (userBudgets.length === 0) {
        return res.status(404).json({ error: 'No budgets found for the user' });
    }
    // Calculate overallAmount, overallSpentAmount, overallExpenseAmount, and overallIncomeAmount
    let overallAmount = 0;
    let overallSpentAmount = 0;
    let overallExpenseAmount = 0;
    let overallIncomeAmount = 0;

    userBudgets.forEach(budget => {
        overallAmount += budget.amount;
        overallSpentAmount += budget.spentAmount;
        overallExpenseAmount += budget.expenseAmount;
        overallIncomeAmount += budget.incomeAmount;
    });
    const uuid = uuidv4();
    // Create BudgetOverViewForUser object
    const budgetOverview = new BudgetOverViewForUser({
        id: uuid,
        overallAmount: overallAmount,
        overallSpentAmount: overallSpentAmount,
        overallExpenseAmount: overallExpenseAmount,
        overallIncomeAmount: overallIncomeAmount
    });

    // Return the JSON object
    res.json(budgetOverview);
});

/**
 * Transactions
 */

// Sample database to store user transactions
const transactions = []

app.post('/:userId/transactions', (req, res) => {
    const userId = req.params.userId;
    const transactionData = req.body;

    if (Object.keys(transactionData).length === 0) {
        return res.status(400).json({ message: 'Bad Request: Transaction data is empty.' });
    }

    // Add the new transaction to the transactions array
    transactions.push(transactionData);

    res.status(201).json({ message: `Created a new transaction with ID: ${transactionId} for user with ID: ${userId}` });
});

// Update a transaction for a specific user by transaction ID
app.put('/:userId/transactions/:transactionId', (req, res) => {
    const userId = req.params.userId;
    const transactionId = req.params.transactionId;
    const updatedTransactionData = req.body;

    const transactionIndex = transactions.findIndex(transaction => transaction.id === transactionId && transaction.userId === userId);
    if (transactionIndex !== -1) {
        transactions[transactionIndex] = {
            updatedTransactionData
        };
        res.status(200).json({ message: `Updated transaction with ID: ${transactionId} for user with ID: ${userId}` });
    } else {
        res.status(404).json({ message: `Transaction with ID ${transactionId} not found for user with ID: ${userId}` });
    }
});

// Delete a transaction for a specific user by transaction ID
app.delete('/:userId/transactions/:transactionId', (req, res) => {
    const userId = req.params.userId;
    const transactionId = req.params.transactionId;

    const transactionIndex = transactions.findIndex(transaction => transaction.id === transactionId && transaction.userId === userId);
    if (transactionIndex !== -1) {
        transactions.splice(transactionIndex, 1);
        res.status(204).json();
    } else {
        res.status(404).json({ message: `Transaction with ID ${transactionId} not found for user with ID: ${userId}` });
    }
});

// Fetch all transaction data for a specific user
app.get('/:userId/transactions/', (req, res) => {
    const userId = req.params.userId;
    const userTransactionsArray = transactions.filter(transaction => transaction.userId === userId);
    res.status(200).json(userTransactionsArray);
});

/**
 * Authentication
 * 
 */

const users = [
    {id: uuidv4(), name: "user", email: 'user@example.com', password: 'password123' },
    // Add more users as needed
  ];
  
  app.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
  
    // Check if the provided email and password match any user in the users array
  
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // Authentication successful
      res.status(200).json(user);
    } else {
      // Authentication failed
      res.status(401).json({ message: 'Authentication failed' });
    }
  });

  /**
   * User registration
   * 
   */

  app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if the email is already registered
    const userExists = users.some(u => u.email === email);
  
    if (userExists) {
      // User with this email already exists
      res.status(400).json({ message: 'User with this email already exists' });
    } else {
      // Create a new user
      const newUser = { name, email, password };
      users.push(newUser);
      res.status(201).json(newUser);
    }
  });


  /**
   * Charts
   * 
   */

  app.get('/:userId/charts/spentAmountForPreviousSevenDays', (req, res) => {
    const uuid = uuidv4();
    const data = {
        "id": uuid,
        "amount": 100.50,
        "monthOrYear": "October",
        "daysCount": 7,
        "budgetType": "Monthly"
    };
    res.json(data);
});

app.get('/:userId/charts/previousMonthSpentAmountRelatedToCurrentPeriod', (req, res) => {
    const uuid = uuidv4();
    const data = [
        {
        "id": uuid,
        "amount": 200.75
        }
    ];
    res.json(data);
});

app.get('/:userId/charts/ongoingWeekExpenseAndIncomeByDay', (req, res) => {
    const data = [
        {
            "id":  uuidv4(),
            "type": "Food",
            "amount": 50.25,
            "shortDay": "Mon"
        },
        {
            "id":  uuidv4(),
            "type": "Entertainment",
            "amount": 30.75,
            "shortDay": "Tue"
        },
        // Add more objects as needed
    ];
    res.json(data);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
