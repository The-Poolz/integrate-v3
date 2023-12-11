// Use commonjs-style import for inquirer
const inquirer = require('inquirer');

// Definition of menu items
const menuItems = [
  { name: 'NFT + Vault Manager', value: 'item1' },
  { name: 'Simple X3', value: 'item2' },
  { name: 'Refund + Collateral', value: 'item3' },
  { name: 'Builders X2', value: 'item4' },
  { name: 'Delay Vault Provider', value: 'item5' },
  { name: 'All', value: 'item6' },
];

// Function to handle the "deploy" command
function deployCommand(): void {
  console.log('Deploying...'); // You can add deployment logic here
}

// Function to display the menu
async function displayMenu(): Promise<void> {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'menuItem',
      message: 'Choose a menu item:',
      choices: menuItems,
    },
  ]) as { menuItem: string };

  // Handling the selection
  switch (answer.menuItem) {
    case 'item1':
      console.log('Selected Item 1');
      break;
    case 'item2':
      console.log('Selected Item 2');
      break;
    case 'item3':
      console.log('Selected Item 3');
      break;
    case 'item4':
      console.log('Selected Item 4');
      break;
    case 'item5':
      console.log('Selected Item 5');
      break;
    case 'item6':
      console.log('Selected Item 6');
      break;
    default:
      break;
  }
}

displayMenu();
