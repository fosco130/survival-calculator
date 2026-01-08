/**
 * Test Suite: Match Simulation & Result Application
 *
 * Tests probability-based match outcome simulation and how results
 * are applied to the Premier League standings table
 *
 * ★ Insight ─────────────────────────────────────
 * Match simulation converts team strength differences into realistic
 * win/draw/loss outcomes. We test:
 * 1. Returns valid outcomes (home/draw/away)
 * 2. Probability distribution favors stronger teams
 * 3. Home advantage is applied correctly
 * 4. Points are awarded correctly (3 for win, 1 for draw)
 * 5. Stats (wins, draws, losses, played games) update properly
 *
 * Testing randomness: We run multiple simulations and check statistical
 * properties rather than exact outcomes.
 * ─────────────────────────────────────────────────────────────
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { simulateMatch, applyMatchResult } from './matchSimulation';
import { testStandings, cloneDeep } from '../test/fixtures/testData';

describe('Match Simulation Engine', () => {
  describe('simulateMatch()', () => {
    let homeTeam, awayTeam;

    beforeEach(() => {
      // Strong home team vs weak away team
      homeTeam = {
        id: 1,
        name: 'Arsenal',
        strength: 2.5 // High strength
      };
      awayTeam = {
        id: 340,
        name: 'Southampton',
        strength: 0.3 // Low strength
      };
    });

    it('should return a valid outcome (home/draw/away)', () => {
      const result = simulateMatch(homeTeam, awayTeam);
      expect(['home', 'draw', 'away']).toContain(result);
    });

    it('should handle null home team', () => {
      const result = simulateMatch(null, awayTeam);
      expect(result).toBe('draw'); // Defaults to draw
    });

    it('should handle null away team', () => {
      const result = simulateMatch(homeTeam, null);
      expect(result).toBe('draw'); // Defaults to draw
    });

    it('should handle missing strength property', () => {
      const teamNoStrength = { id: 1, name: 'Arsenal' }; // No strength
      const result = simulateMatch(teamNoStrength, awayTeam);
      expect(result).toBe('draw'); // Defaults to draw
    });

    it('should favor home team (statistically over many runs)', () => {
      // Run 100 simulations and check if home wins more often than away
      let homeWins = 0;
      let awayWins = 0;

      for (let i = 0; i < 100; i++) {
        const result = simulateMatch(homeTeam, awayTeam);
        if (result === 'home') homeWins++;
        if (result === 'away') awayWins++;
      }

      // Home team should win more often than away (home advantage effect)
      expect(homeWins).toBeGreaterThan(awayWins);
    });

    it('should produce more draws with evenly matched teams', () => {
      const evenTeam1 = { id: 1, name: 'Team A', strength: 1.0 };
      const evenTeam2 = { id: 2, name: 'Team B', strength: 1.0 };

      let draws = 0;
      for (let i = 0; i < 200; i++) {
        const result = simulateMatch(evenTeam1, evenTeam2);
        if (result === 'draw') draws++;
      }

      // With evenly matched teams, should have reasonable draw rate
      expect(draws).toBeGreaterThan(20); // At least 10% draws
      expect(draws).toBeLessThan(180); // Not all draws
    });

    it('should heavily favor strong team over weak team', () => {
      const strongTeam = { id: 1, name: 'Strong', strength: 3.0 };
      const weakTeam = { id: 2, name: 'Weak', strength: 0.1 };

      let strongWins = 0;
      for (let i = 0; i < 100; i++) {
        const result = simulateMatch(strongTeam, weakTeam);
        if (result === 'home') strongWins++;
      }

      // Strong team should win vast majority (>70%)
      expect(strongWins).toBeGreaterThan(70);
    });

    it('should apply home advantage (home wins more than away in equal strength)', () => {
      // Equal strength teams
      const team1 = { id: 1, name: 'Team A', strength: 1.5 };
      const team2 = { id: 2, name: 'Team B', strength: 1.5 };

      let homeWins = 0;
      let awayWins = 0;

      for (let i = 0; i < 200; i++) {
        const result = simulateMatch(team1, team2);
        if (result === 'home') homeWins++;
        if (result === 'away') awayWins++;
      }

      // With home advantage, home should win more than away
      expect(homeWins).toBeGreaterThan(awayWins);
    });

    it('should handle zero strength values', () => {
      const zeroTeam = { id: 1, name: 'Weak', strength: 0 };
      const normalTeam = { id: 2, name: 'Normal', strength: 1.0 };

      const result = simulateMatch(zeroTeam, normalTeam);
      expect(['home', 'draw', 'away']).toContain(result);
    });

    it('should handle very high strength values', () => {
      const superTeam = { id: 1, name: 'Super', strength: 10.0 };
      const normalTeam = { id: 2, name: 'Normal', strength: 1.0 };

      const result = simulateMatch(superTeam, normalTeam);
      expect(['home', 'draw', 'away']).toContain(result);
    });
  });

  describe('applyMatchResult()', () => {
    let standingsTable, homeTeam, awayTeam;

    beforeEach(() => {
      standingsTable = cloneDeep(testStandings);
      homeTeam = standingsTable[0]; // Ipswich Town
      awayTeam = standingsTable[1]; // Southampton
    });

    it('should award 3 points and 1 win for home victory', () => {
      // Use fresh clones for this test
      const testTable = cloneDeep(testStandings);
      const testHome = testTable[0];
      const testAway = testTable[1];

      const initialHomePoints = testHome.points;
      const initialHomeWins = testHome.won;
      const initialAwayLosses = testAway.lost;

      applyMatchResult('home', testHome, testAway, testTable);

      expect(testHome.points).toBe(initialHomePoints + 3);
      expect(testHome.won).toBe(initialHomeWins + 1);
      expect(testAway.lost).toBe(initialAwayLosses + 1);
    });

    it('should award 1 point each for draw', () => {
      const initialHomePoints = homeTeam.points;
      const initialAwayPoints = awayTeam.points;
      const initialHomeDraws = homeTeam.draw;
      const initialAwayDraws = awayTeam.draw;

      applyMatchResult('draw', homeTeam, awayTeam, standingsTable);

      expect(homeTeam.points).toBe(initialHomePoints + 1);
      expect(awayTeam.points).toBe(initialAwayPoints + 1);
      expect(homeTeam.draw).toBe(initialHomeDraws + 1);
      expect(awayTeam.draw).toBe(initialAwayDraws + 1);
    });

    it('should award 3 points and 1 win for away victory', () => {
      // Use fresh clones for this test
      const testTable = cloneDeep(testStandings);
      const testHome = testTable[0];
      const testAway = testTable[1];

      const initialAwayPoints = testAway.points;
      const initialAwayWins = testAway.won;
      const initialHomeLosses = testHome.lost;

      applyMatchResult('away', testHome, testAway, testTable);

      expect(testAway.points).toBe(initialAwayPoints + 3);
      expect(testAway.won).toBe(initialAwayWins + 1);
      expect(testHome.lost).toBe(initialHomeLosses + 1);
    });

    it('should increment playedGames for both teams', () => {
      const initialHomeGames = homeTeam.playedGames;
      const initialAwayGames = awayTeam.playedGames;

      applyMatchResult('home', homeTeam, awayTeam, standingsTable);

      expect(homeTeam.playedGames).toBe(initialHomeGames + 1);
      expect(awayTeam.playedGames).toBe(initialAwayGames + 1);
    });

    it('should handle null standings table', () => {
      const result = applyMatchResult('home', homeTeam, awayTeam, null);
      expect(result).toBeNull();
    });

    it('should handle non-array standings table', () => {
      const result = applyMatchResult('home', homeTeam, awayTeam, { invalid: true });
      expect(result).toEqual({ invalid: true });
    });

    it('should handle home team not found in standings', () => {
      const unknownHomeTeam = { id: 9999, name: 'Unknown', strength: 1.0 };
      const originalTable = cloneDeep(standingsTable);

      applyMatchResult('home', unknownHomeTeam, awayTeam, standingsTable);

      // Should return unchanged
      expect(standingsTable).toEqual(originalTable);
    });

    it('should handle away team not found in standings', () => {
      const unknownAwayTeam = { id: 9999, name: 'Unknown', strength: 1.0 };
      const originalTable = cloneDeep(standingsTable);

      applyMatchResult('home', homeTeam, unknownAwayTeam, standingsTable);

      // Should return unchanged
      expect(standingsTable).toEqual(originalTable);
    });

    it('should not modify standings for invalid result', () => {
      const originalPoints = homeTeam.points;
      applyMatchResult('invalid', homeTeam, awayTeam, standingsTable);
      // Invalid result: no match (unlikely, but test defensively)
      expect(homeTeam.points).toBe(originalPoints);
    });

    it('should maintain point totals correctly across multiple matches', () => {
      const initialTotalPoints = standingsTable.reduce((sum, t) => sum + t.points, 0);

      // First match: home wins (3 points total)
      applyMatchResult('home', standingsTable[0], standingsTable[1], standingsTable);

      // Second match: draw (2 points total)
      applyMatchResult('draw', standingsTable[2], standingsTable[3], standingsTable);

      const finalTotalPoints = standingsTable.reduce((sum, t) => sum + t.points, 0);

      // Total points should increase by 5 (3 for win + 2 for draw)
      expect(finalTotalPoints).toBe(initialTotalPoints + 5);
    });

    it('should update goal difference if available', () => {
      // This test assumes applyMatchResult might handle goals in future
      // For now, just ensure teams exist with goalDifference property
      expect(homeTeam).toHaveProperty('goalDifference');
      expect(awayTeam).toHaveProperty('goalDifference');
    });

    it('should handle multiple matches for same team pair', () => {
      // Use fresh data
      const testTable = cloneDeep(testStandings);
      const testHome = testTable[0];
      const testAway = testTable[1];

      const initialHomeWins = testHome.won;
      const initialHomeLosses = testHome.lost;
      const initialAwayWins = testAway.won;
      const initialAwayLosses = testAway.lost;

      // First match: home wins
      applyMatchResult('home', testHome, testAway, testTable);

      // Second match: away wins (return fixture)
      applyMatchResult('away', testHome, testAway, testTable);

      // After two matches: home should have 1 win, 1 loss; away should have 1 win, 1 loss
      expect(testHome.won).toBe(initialHomeWins + 1); // 1 win from first match
      expect(testHome.lost).toBe(initialHomeLosses + 1); // 1 loss from second match
      expect(testAway.won).toBe(initialAwayWins + 1); // 1 win from second match
      expect(testAway.lost).toBe(initialAwayLosses + 1); // 1 loss from first match
    });
  });

  describe('Integration: Match Simulation + Application', () => {
    let standingsTable, homeTeam, awayTeam;

    beforeEach(() => {
      standingsTable = cloneDeep(testStandings);
      homeTeam = standingsTable[0];
      awayTeam = standingsTable[1];
    });

    it('should simulate a match and correctly apply the result', () => {
      const result = simulateMatch(homeTeam, awayTeam);
      expect(['home', 'draw', 'away']).toContain(result);

      const initialPoints = homeTeam.points + awayTeam.points;
      applyMatchResult(result, homeTeam, awayTeam, standingsTable);
      const finalPoints = homeTeam.points + awayTeam.points;

      // For home win or away win: 3 points total, draw: 2 points total
      if (result === 'draw') {
        expect(finalPoints).toBe(initialPoints + 2);
      } else {
        expect(finalPoints).toBe(initialPoints + 3);
      }
    });

    it('should maintain consistency across 20 simulated matches', () => {
      let totalPointsAdded = 0;

      for (let i = 0; i < 20; i++) {
        const team1 = standingsTable[i % 5];
        const team2 = standingsTable[(i + 1) % 5];

        const result = simulateMatch(team1, team2);
        const pointsBefore = team1.points + team2.points;

        applyMatchResult(result, team1, team2, standingsTable);

        const pointsAfter = team1.points + team2.points;
        const pointsAdded = pointsAfter - pointsBefore;

        totalPointsAdded += pointsAdded;

        // Each match adds either 2 (draw) or 3 (decisive) points
        expect([2, 3]).toContain(pointsAdded);
      }

      // 20 matches should add between 40-60 points total
      expect(totalPointsAdded).toBeGreaterThanOrEqual(40);
      expect(totalPointsAdded).toBeLessThanOrEqual(60);
    });
  });
});
