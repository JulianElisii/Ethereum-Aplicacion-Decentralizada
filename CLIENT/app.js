App = {
    contracts: {},
    init: async () => {
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.render();
      await App.renderTasks();
    },
    loadWeb3: async () => {
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        await window.ethereum.request({ method: "eth_requestAccounts" }); //Nos conectamos con la wallet de metamask
      } else if (web3) {
        web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log(
          "No ethereum browser is installed. Try it installing MetaMask "
        );
      }
    },
    loadAccount: async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      App.account = accounts[0];
    },
    loadContract: async () => {
      try {
        const res = await fetch("http://127.0.0.1:5500//build/contracts/TasksContract.json");
        const tasksContractJSON = await res.json();
        App.contracts.TasksContract = TruffleContract(tasksContractJSON); // traemos el contrato con truffleContract lo guardamos en un objeto contracts y dentro del valor taskContract
        App.contracts.TasksContract.setProvider(App.web3Provider);//una vez guardamos el contrato con el valor "taskContract" tenemos que darle el provedor para poder intereactuar con dicho contrato
    
  
        App.tasksContract = await App.contracts.TasksContract.deployed(); //desplegamos el contrato y lo guardamos en la variable tasksContract que de esa variable vamos a poder crear un contrato y actualizar 
      } catch (error) {
        console.error(error);
      }
    },
    render: async () => {
      document.getElementById("account").innerText = App.account; //renderizamos adress de la wallet en donde indica id=account en index.html
    },
    renderTasks: async () => {
      const tasksCounter = await App.tasksContract.tasksCounter();
      const taskCounterNumber = tasksCounter.toNumber();//con estas dos funciones sabemos cuantas tareas hay en la blockchain 
      let html = "";
  
      for (let i = 1; i <= taskCounterNumber; i++) { //aqui decimos mientras que sea mayor o igual taskCounterNumber seguir en el bucle //le damos el valor 1 a i por que cuando se despliega el contrato ya hay una tarea creada 
        
        const task = await App.tasksContract.tasks(i);//aqui recorremos cada tarea que hay en la blockchain---ejemplo: App.tasksContract.tasks(1)
        const taskId = task[0].toNumber();//y aqui decimos ejemplo:de la tarea 1 dame el valor 0 que seria el id.
        const taskTitle = task[1];//y aqui decimos ejemplo:de la tarea 1 dame el valor 1 que seria el title.
        const taskDescription = task[2];//y aqui decimos ejemplo:de la tarea 1 dame el valor 2 que seria el description.
        const taskDone = task[3];//y aqui decimos ejemplo:de la tarea 1 dame el valor 3 que seria el done.
        const taskCreatedAt = task[4];//y aqui decimos ejemplo:de la tarea 1 dame el valor 4 que seria el createdat.
  
        // Creating a task Card
        let taskElement = `<div class="card bg-dark rounded-0 mb-2">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span> Title: ${taskTitle}</span>
            <div class="form-check form-switch">
              <input class="form-check-input" data-id="${taskId}" type="checkbox" onchange="App.toggleDone(this)" ${
                taskDone === true && "checked"
              }>
            </div>
          </div>
          <div class="card-body">
            <span> Description: ${taskDescription}</span>
            <div> 
            <span>Status Task: ${taskDone}</span> 
            </div>
            <p class="text-muted">Task was created ${new Date(
              taskCreatedAt * 1000
            ).toLocaleString()}</p>
            </label>
          </div>
        </div>`;
        html += taskElement;
      }
  
      document.querySelector("#tasksList").innerHTML = html;
    },
    createTask: async (title, description) => {
      try {
        const result = await App.tasksContract.createTask(title, description, {
          from: App.account,
        });
        console.log(result.logs[0].args);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    },
    toggleDone: async (element) => {
      const taskId = element.dataset.id;
      await App.tasksContract.toggleDone(taskId, {
        from: App.account,
      });
      window.location.reload();
    },
  };
 
 