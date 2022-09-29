const TaskContract = artifacts.require("TaskContract");

contract("TaskContract", () => {
    before( async() => {
     taskContract = await TaskContract.deployed()
    })
   
})