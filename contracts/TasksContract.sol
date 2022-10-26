// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

contract TasksContract {
    uint256 public tasksCounter = 0;

 //Estructura que lleva la tarea 
    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }
//event se utiliza para "informar de una accion que ya paso en este caso para indicar que tarea fue creada y cual es su contenido"
    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );
    event TaskToggledDone(uint256 id, bool done);

    mapping(uint256 => Task) public tasks; //mapping es para recorrer el array de tareas que hay.

 //en el constructor vamos a declarar en este una funcion que se haga ni bien se crea el contrato
    constructor() {
        createTask("my first task", "my first description");
    }

    function createTask(string memory _title, string memory _description)
        public
    {
        tasksCounter++;
        tasks[tasksCounter] = Task(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
        emit TaskCreated(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
    }

    function toggleDone(uint256 _id) public {
        Task memory _task = tasks[_id];//Buscar en la lista con el _id
        _task.done = !_task.done;//de esa tarea su propiedad done lo voy a cambiar a su contrario si esta true lo cambio por false
        tasks[_id] = _task;//Lo guardo en el arreglo una vez editado
        emit TaskToggledDone(_id, _task.done);
    }
}