export default {
  profile: { title: 'Profile', preferences: { title: 'Preferences' } },

  home: {
    title: 'Home',
  },

  expense: {
    cta: 'Start planning your budget by adding your expenses',
    name: 'Expense | Expenses',
    new: 'New @.lower:expense.name',
    outcome: 'Outcome | Outcomes',
    add: 'Add @.lower:expense.outcome',
    budget: 'Budget',
    wasted: 'Wasted',
    balance: 'Balance',
  },

  earnings: {
    name: 'Earnings',
    cta: 'Add @.lower:earnings.income',
    income: 'Income',
  },

  actions: {
    manage: 'Manage',
    tune: 'Tune',
    remove: 'Remove',
    undo: 'Undo',
    // on: 'On',
    // off: 'Off',
    // recurring: {
    //   title: 'Recurring',
    //   on: '@:actions.recurring.title @:actions.on',
    //   off: '@:actions.recurring.title @:actions.off',
    // },
  },

  notifications: {
    deleted: '{item} deleted',
  },

  errors: {
    required: 'This is a required field',
    length: 'Length should be at least {len} characters',
    negative: "Value can't be negative",
  },
};
