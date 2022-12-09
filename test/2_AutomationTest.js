const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("单元测试：Chainlink Automation", async function() {
    async function deployAutomationFixture() {
        const automationContract = await ethers.getContractFactory("AutomationTask");
        const interval = "120";
        const automation = await automationContract.deploy(interval);
        return { automation };
    }

    it("单元测试 10： 状态未发生变化时，checkUpkeep 返回 false", async function() {
        const { automation } = await loadFixture(deployAutomationFixture);
        const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""));
        const { upkeepNeeded } = await automation.callStatic.checkUpkeep(checkData);
        assert.equal(upkeepNeeded, false);
    });

    it("单元测试 11：满足 checkUpkeep 状态时，成功执行 performUpkeep ", async function() {
        const { automation } = await deployAutomationFixture();
        const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""));

        await automation.fight(1);

        const interval = await automation.interval();
        await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
        await network.provider.send("evm_mine", []);
        // await time.increase(interval.toNumber() + 1);
        const { upkeepNeeded, performData } =
        await automation.callStatic.checkUpkeep(checkData);
        await automation.performUpkeep(performData);
        const health = await automation.healthPoint(1);
        // console.log("health: ", health);
        assert(health == 1000, "the health is not refreshed to 1000");

    });

});