const TasksContract = artifacts.require("TaskContract");

module.exports = function (deployer) {
    deployer.deploy(TasksContract)
};