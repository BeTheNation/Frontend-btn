import { expect } from "chai";
import { ethers } from "hardhat";

describe("PredictionMarket", function () {
  let predictionMarket: any;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    // Get signers
    const [ownerSigner, userSigner] = await ethers.getSigners();
    owner = ownerSigner;
    user = userSigner;

    // Deploy contract
    const PredictionMarket = await ethers.getContractFactory(
      "PredictionMarket"
    );
    predictionMarket = await PredictionMarket.deploy();
    await predictionMarket.waitForDeployment();
  });

  it("should allow opening a position", async function () {
    const countryId = "US";
    const direction = true; // long
    const leverage = 2;
    const marginAmount = ethers.parseEther("1.0");

    const tx = await predictionMarket
      .connect(user)
      .openPosition(countryId, direction, leverage, { value: marginAmount });

    const receipt = await tx.wait();
    const positionOpenedEvent = receipt.events?.find(
      (e: any) => e.event === "PositionOpened"
    );

    expect(positionOpenedEvent).to.not.be.undefined;

    const positionId = positionOpenedEvent.args.positionId;
    const position = await predictionMarket.getPosition(positionId);

    expect(position.countryId).to.equal(countryId);
    expect(position.direction).to.equal(direction);
    expect(position.leverage).to.equal(leverage);
    expect(position.size).to.equal(marginAmount);
    expect(position.isOpen).to.be.true;
  });

  it("should allow closing a position", async function () {
    const countryId = "US";
    const direction = true;
    const leverage = 2;
    const marginAmount = ethers.parseEther("1.0");

    const tx = await predictionMarket
      .connect(user)
      .openPosition(countryId, direction, leverage, { value: marginAmount });
    const receipt = await tx.wait();
    const positionOpenedEvent = receipt.events?.find(
      (e: any) => e.event === "PositionOpened"
    );
    const positionId = positionOpenedEvent.args.positionId;

    const balanceBefore = await ethers.provider.getBalance(user.address);
    await predictionMarket.connect(user).closePosition(positionId);
    const balanceAfter = await ethers.provider.getBalance(user.address);

    // Check if user received back his funds (minus gas costs)
    expect(balanceAfter).to.be.gt(balanceBefore.sub(ethers.parseEther("0.1")));

    const position = await predictionMarket.getPosition(positionId);
    expect(position.isOpen).to.be.false;
  });

  it("should set take profit and stop loss", async function () {
    const countryId = "US";
    const direction = true;
    const leverage = 2;
    const marginAmount = ethers.parseEther("1.0");

    const tx = await predictionMarket
      .connect(user)
      .openPosition(countryId, direction, leverage, { value: marginAmount });
    const receipt = await tx.wait();
    const positionOpenedEvent = receipt.events?.find(
      (e: any) => e.event === "PositionOpened"
    );
    const positionId = positionOpenedEvent.args.positionId;

    const takeProfit = 120;
    const stopLoss = 80;

    await predictionMarket
      .connect(user)
      .setTPSL(positionId, takeProfit, stopLoss);

    const position = await predictionMarket.getPosition(positionId);
    expect(position.takeProfit).to.equal(takeProfit);
    expect(position.stopLoss).to.equal(stopLoss);
  });
});
