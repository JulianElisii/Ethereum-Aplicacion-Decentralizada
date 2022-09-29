// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

contract TaskContract {

   uint public counterid  = 0 ;

   constructor () {
    createTask("Tarea por defecto", "Descripcion por defecto");
   }

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping (uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description) public {
     tasks[counterid] = Task(counterid, _title, _description, false, block.timestamp);
     counterid++;
    }

    function toggleDone(uint _id) public {
      Task memory _task = tasks[_id]; //Buscar en la lista con el _id
      _task.done = !_task.done; //de esa tarea su propiedad done lo voy a cambiar a su contrario si esta true lo cambio por false
       tasks[_id] = _task; //Lo guardo en el arreglo una vez editado 
    }
}