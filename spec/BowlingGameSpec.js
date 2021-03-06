'use strict';
var BowlingGame = require('../lib/BowlingGame.js');

describe('BowlingGame', function() {

  var bowlingGame;

  beforeEach(function() {
    bowlingGame = new BowlingGame();
  });

  it('starts on the first frame', function() {
    expect(bowlingGame.getCurrentFrame()).toEqual(1);
  });

  it('can move to the next frame', function(){
    bowlingGame.nextFrame();
    expect(bowlingGame.getCurrentFrame()).toEqual(2);
  });

  it('can return the number of the previous frame', function() {
    bowlingGame.nextFrame();
    expect(bowlingGame.getPreviousFrame()).toEqual(1);
  });

  it('starts on the first roll of the frame', function() {
    expect(bowlingGame.isFirstRoll()).toBe(true);
  });

  it('can change the roll number', function() {
    bowlingGame.changeRollNumber();
    expect(bowlingGame.isFirstRoll()).toBe(false);
  });

  it('score card starts as an object on frame 0 with 0 points', function() {
    expect(bowlingGame.getScoreCard()).toEqual({0: [0, 0, 0]});
  });

  it('a roll of 3 on the first frame can be added to the score card', function(){
    bowlingGame.addRoll(3);
    expect(bowlingGame.getScoreCard()).toEqual({
      0: [0, 0, 0],
      1: [3, 0, 0]
    });
  });

  it('a roll of 5 on the second frame can be added to the score card', function(){
    bowlingGame.addRoll(3);
    bowlingGame.addRoll(5);
    expect(bowlingGame.getScoreCard()).toEqual({
      0: [0, 0, 0],
      1: [3, 5, 0]
    });
  });

  it('adding a roll to the score card changes the roll number', function() {
    bowlingGame.addRoll(9);
    expect(bowlingGame.isFirstRoll()).toBe(false);
  });

  it('adding a second roll to the score card changes the current and previous frame numbers', function() {
    bowlingGame.addRoll(3)
    bowlingGame.addRoll(2);
    expect(bowlingGame.getCurrentFrame()).toEqual(2);
    expect(bowlingGame.getPreviousFrame()).toEqual(1);
  });

  it('rolling a strike automatically moves the game on to the next frame', function() {
    bowlingGame.addRoll(10);
    expect(bowlingGame.getCurrentFrame()).toEqual(2);
    expect(bowlingGame.getScoreCard()).toEqual({
      0: [0, 0, 0],
      1: [10, 0, 0]
    });
  });

  it('checks whether the previous frame was a spare', function() {
    bowlingGame.addRoll(5);
    bowlingGame.addRoll(5);
    expect(bowlingGame.previousFrameIsSpare()).toBe(true);
  });

  describe('when the previous frame was a spare', function() {
    it('adds the bonus to the previous frame', function() {
      bowlingGame.addRoll(5);
      bowlingGame.addRoll(5);
      bowlingGame.addRoll(2);
      expect(bowlingGame.getScoreCard()).toEqual({
        0: [0, 0, 0],
        1: [5, 5, 2],
        2: [2, 0, 0]
      });
    });
  });

  it('checks whether the previous frame was a strike', function() {
    bowlingGame.addRoll(10);
    expect(bowlingGame.previousFrameIsStrike()).toBe(true);
  });

  describe('when the previous frame was a strike', function() {
    it('adds the bonus to the previous frame', function() {
      bowlingGame.addRoll(10);
      bowlingGame.addRoll(1);
      bowlingGame.addRoll(2);
      expect(bowlingGame.getScoreCard()).toEqual({
        0: [0, 0, 0],
        1: [10, 0, 3],
        2: [1, 2, 0]
      });
    });
  });

  describe('when the previous two frames were strikes and this one is not', function() {
    it('adds the bonus to the previous but one frame', function() {
      bowlingGame.addRoll(10);
      bowlingGame.addRoll(10);
      bowlingGame.addRoll(2);
      bowlingGame.addRoll(4);
      expect(bowlingGame.getScoreCard()).toEqual({
        0: [0, 0, 0],
        1: [10, 0, 12],
        2: [10, 0, 6],
        3: [2, 4, 0]
      });
    });
  });

  it('checks whether the current frame is a strike', function() {
    expect(bowlingGame.isStrike(10)).toBe(true);
  });

  it('calculates the total score at the end of the game', function() {
    setUpCompleteGame()
    expect(bowlingGame.calculateFinalScore()).toEqual(120);
  });

  it('prevents the user from knocking down more than 10 pins per roll', function() {
    expect(function(){ bowlingGame.addRoll(11); }).toThrowError('You cannot knock more than 10 pins in one roll.');
  });

  it('prevents the user from knocking down more than 10 pins per frame', function() {
    bowlingGame.addRoll(9);
    expect(function(){ bowlingGame.addRoll(2); }).toThrowError('You cannot knock more than 10 pins in one frame.');
  });

  it('prevents the user from playing more than 10 frames per game', function() {
    bowlingGame.currentFrame = 11;
    expect(function(){ bowlingGame.addRoll(2); }).toThrowError('The game has finished.');
  });

  describe('when it is the last frame', function() {
    describe('when the first roll is a strike', function() {
      it('the frame has three rolls', function() {
        bowlingGame.currentFrame = 10;
        bowlingGame.addRoll(10);
        expect(function(){ bowlingGame.addRoll(2); }).not.toThrow();
        expect(function(){ bowlingGame.addRoll(5); }).not.toThrow();
      });
    });
    describe('when the first roll is a spare', function() {
      it('the frame has three rolls', function() {
        bowlingGame.currentFrame = 10;
        bowlingGame.addRoll(1);
        expect(function(){ bowlingGame.addRoll(9); }).not.toThrow();
        expect(function(){ bowlingGame.addRoll(5); }).not.toThrow();
      });
    });
  });

  function setUpCompleteGame() {
    bowlingGame.scoreCard = {
      0: [0, 0, 0],
      1: [1, 4, 0],
      2: [4, 5, 0],
      3: [6, 4, 5],
      4: [5, 5, 10],
      5: [10, 0, 1],
      6: [0, 1, 0],
      7: [7, 3, 6],
      8: [6, 4, 4],
      9: [4, 5, 0],
      10: [10, 9, 1]
    }
  }
});
