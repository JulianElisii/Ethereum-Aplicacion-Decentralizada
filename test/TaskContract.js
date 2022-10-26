const TaskContract = artifacts.require("TaskContract");

contract("TaskContract", () => {
    before(async () => {
        this.taskContract = await TaskContract.deployed()
    })

    it('migrate deployed succesfully', async () => {
        const address = this.taskContract.address

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    it('get Taks List', async () => {
        const taskCounter = await this.taskContract.counterid();
        const task = await this.taskContract.tasks(taskCounter);

        assert.equal(task.id.toNumber(), taskCounter);
        assert.equal(task.title, "Tarea por defecto");
        assert.equal(task.description, "Descripcion por defecto");
        assert.equal(task.done, false);
        assert.equal(taskCounter, 1);
    })

    it('task created succesfully', async () => {
        const result = await this.taskContract.createTask("Test task", "test description")
        const taskEvent = result.logs[0].args;
        const taskCounter = await this.taskContract.counterid();

        assert.equal(taskCounter, 2);
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, "Test task");
        assert.equal(taskEvent.description, "test description");
        assert.equal(taskEvent.done, false);
    })

    it('task toggle done', async() =>{
     const result = await this.taskContract.toggleDone(1);
     const taskEvent = result.logs[0].args;   
     const task = await this.taskContract.tasks(1);

     assert.equal(task.done, true);
     assert.equal(taskEvent.done, true);
     assert.equal(taskEvent.id, 1);
    })

})