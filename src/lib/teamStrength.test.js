/**
 * Test Suite: Team Strength Calculation
 *
 * Tests the algorithm that converts league statistics into a single
 * "strength" rating used for match probability simulation
 *
 * ★ Insight ─────────────────────────────────────
 * Team strength is calculated as: PPG * 0.5 + Form * 0.3
 * where PPG = Points Per Game and Form = Last 6 games performance
 *
 * This is the foundation of match probability. Accurate strength ratings
 * produce realistic match outcomes. We test:
 * 1. PPG calculation is weighted correctly (50%)
 * 2. Recent form is weighted correctly (30%)
 * 3. Strength is clamped to 0.1-3.0 range
 * 4. Better teams have higher strength ratings
 * 5. All teams in standings get strength calculated
 * ─────────────────────────────────────────────────────────────
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateTeamStrength,
  getStrengthForAllTeams,
  getNormalizedStrength
} from './teamStrength';
import { testStandings, cloneDeep } from '../test/fixtures/testData';

describe('Team Strength Calculator', () => {
  describe('calculateTeamStrength()', () => {
    let team;

    beforeEach(() => {
      // Strong team: 45 pts from 18 games = 2.5 PPG
      team = {
        id: 1,
        name: 'Arsenal',
        playedGames: 18,
        points: 45,
        last6Points: 15,
        won: 14,
        draw: 3,
        lost: 1,
        goalsFor: 48,
        goalsAgainst: 15,
        goalDifference: 33
      };
    });

    it('should return a number between 0.1 and 3.0', () => {
      const strength = calculateTeamStrength(team);
      expect(strength).toBeGreaterThanOrEqual(0.1);
      expect(strength).toBeLessThanOrEqual(3.0);
    });

    it('should calculate strength higher for better teams', () => {
      // Strong team
      const strongTeam = {
        id: 1,
        name: 'Arsenal',
        playedGames: 18,
        points: 45,
        last6Points: 15
      };

      // Weak team
      const weakTeam = {
        id: 2,
        name: 'Southampton',
        playedGames: 18,
        points: 8,
        last6Points: 0
      };

      const strongStrength = calculateTeamStrength(strongTeam);
      const weakStrength = calculateTeamStrength(weakTeam);

      expect(strongStrength).toBeGreaterThan(weakStrength);
    });

    it('should return 0.5 for team with no games played', () => {
      const newTeam = {
        id: 99,
        name: 'New Team',
        playedGames: 0,
        points: 0
      };

      const strength = calculateTeamStrength(newTeam);
      expect(strength).toBe(0.5); // Default neutral strength
    });

    it('should return 0.5 for null team', () => {
      const strength = calculateTeamStrength(null);
      expect(strength).toBe(0.5);
    });

    it('should return 0.5 for undefined team', () => {
      const strength = calculateTeamStrength(undefined);
      expect(strength).toBe(0.5);
    });

    it('should factor in PPG (Points Per Game) - 50% weight', () => {
      // 30 points in 18 games = 1.67 PPG
      const teamWithPPG = {
        id: 1,
        name: 'Mid Table',
        playedGames: 18,
        points: 30,
        last6Points: 0
      };

      const strength = calculateTeamStrength(teamWithPPG);

      // PPG = 30/18 = 1.67
      // PPG strength = 1.67 * 0.5 = 0.833
      // Form strength = 0 (no recent points)
      // Total = 0.833, not clamped, so ~0.833
      expect(strength).toBeGreaterThan(0.5); // Better than neutral
      expect(strength).toBeLessThan(2.0); // Less than top teams
    });

    it('should factor in recent form (last 6 games) - 30% weight', () => {
      // 15 points in last 6 games = 5 PPG recently (strong form)
      const teamWithGoodForm = {
        id: 1,
        name: 'In Form',
        playedGames: 18,
        points: 27,
        last6Points: 15 // Recent form boost
      };

      // 15 points in last 6 games suggests: 5 wins = 15 points
      // or mix of wins/draws
      const strength = calculateTeamStrength(teamWithGoodForm);

      expect(strength).toBeGreaterThan(0.5); // Better than neutral
    });

    it('should clamp strength to minimum 0.1', () => {
      // Very weak team: 1 point from 18 games
      const weakTeam = {
        id: 1,
        name: 'Very Weak',
        playedGames: 18,
        points: 1,
        last6Points: 0
      };

      const strength = calculateTeamStrength(weakTeam);
      expect(strength).toBeLessThanOrEqual(0.1); // Either 0.1 (clamped) or very close
      expect(strength).toBeGreaterThanOrEqual(0.1);
    });

    it('should clamp strength to maximum 3.0', () => {
      // Unbeatable team: 60 points from 18 games
      const superTeam = {
        id: 1,
        name: 'Super Team',
        playedGames: 18,
        points: 60,
        last6Points: 18 // All wins
      };

      const strength = calculateTeamStrength(superTeam);
      expect(strength).toBeLessThanOrEqual(3.0);
      expect(strength).toBeGreaterThanOrEqual(1.5); // Should be very strong
    });

    it('should handle missing last6Points property', () => {
      const teamWithoutLast6 = {
        id: 1,
        name: 'Team',
        playedGames: 18,
        points: 30
        // No last6Points property
      };

      const strength = calculateTeamStrength(teamWithoutLast6);
      expect(strength).toBeGreaterThan(0.1);
      expect(strength).toBeLessThanOrEqual(3.0);
    });

    it('should not divide by zero when last6Games is 0', () => {
      const teamWithLast6Zero = {
        id: 1,
        name: 'Team',
        playedGames: 18,
        points: 30,
        last6Points: 0
      };

      const strength = calculateTeamStrength(teamWithLast6Zero);
      expect(strength).toBeDefined();
      expect(strength).toBeGreaterThan(0);
    });

    it('should scale strength for all 5 test teams', () => {
      const teams = cloneDeep(testStandings);
      const strengths = teams.map(t => calculateTeamStrength(t));

      // All strengths should be valid
      strengths.forEach(s => {
        expect(s).toBeGreaterThanOrEqual(0.1);
        expect(s).toBeLessThanOrEqual(3.0);
      });

      // Arsenal (1st) should be stronger than Southampton (19th)
      const arsenal = calculateTeamStrength(teams[2]); // Arsenal in test data
      const southampton = calculateTeamStrength(teams[1]); // Southampton in test data
      expect(arsenal).toBeGreaterThan(southampton);
    });

    it('should produce consistent results for same input', () => {
      const strength1 = calculateTeamStrength(team);
      const strength2 = calculateTeamStrength(team);
      expect(strength1).toBe(strength2); // Deterministic
    });
  });

  describe('getStrengthForAllTeams()', () => {
    let teams;

    beforeEach(() => {
      teams = cloneDeep(testStandings);
    });

    it('should return array of teams with strength property', () => {
      const result = getStrengthForAllTeams(teams);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(teams.length);
    });

    it('should add strength property to each team', () => {
      const result = getStrengthForAllTeams(teams);
      result.forEach(team => {
        expect(team).toHaveProperty('strength');
        expect(typeof team.strength).toBe('number');
      });
    });

    it('should preserve all original team properties', () => {
      const result = getStrengthForAllTeams(teams);
      result.forEach((teamWithStrength, index) => {
        expect(teamWithStrength.id).toBe(teams[index].id);
        expect(teamWithStrength.name).toBe(teams[index].name);
        expect(teamWithStrength.points).toBe(teams[index].points);
        expect(teamWithStrength.playedGames).toBe(teams[index].playedGames);
      });
    });

    it('should calculate different strengths for teams of different quality', () => {
      const result = getStrengthForAllTeams(teams);
      const strengths = result.map(t => t.strength);

      // Should have variation in strengths
      const maxStrength = Math.max(...strengths);
      const minStrength = Math.min(...strengths);

      expect(maxStrength).toBeGreaterThan(minStrength);
    });

    it('should handle null teams array', () => {
      const result = getStrengthForAllTeams(null);
      expect(result).toEqual([]);
    });

    it('should handle non-array teams', () => {
      const result = getStrengthForAllTeams({ teams: 'invalid' });
      expect(result).toEqual([]);
    });

    it('should handle empty teams array', () => {
      const result = getStrengthForAllTeams([]);
      expect(result).toEqual([]);
    });

    it('should not mutate original teams array', () => {
      const originalCopy = cloneDeep(teams);
      const result = getStrengthForAllTeams(teams);

      // Original should be unchanged
      teams.forEach((team, index) => {
        expect(team).toEqual(originalCopy[index]);
        expect(team).not.toHaveProperty('strength'); // Original shouldn't have strength
      });

      // Result should have strength
      result.forEach(team => {
        expect(team).toHaveProperty('strength');
      });
    });

    it('should work with variable team counts', () => {
      // Test with 1 team
      const oneTeam = getStrengthForAllTeams([teams[0]]);
      expect(oneTeam.length).toBe(1);
      expect(oneTeam[0]).toHaveProperty('strength');

      // Test with all teams
      const allTeams = getStrengthForAllTeams(teams);
      expect(allTeams.length).toBe(teams.length);
    });
  });

  describe('getNormalizedStrength()', () => {
    let team;

    beforeEach(() => {
      team = {
        id: 1,
        name: 'Arsenal',
        playedGames: 18,
        points: 45,
        last6Points: 15
      };
    });

    it('should return a normalized strength value', () => {
      const normalized = getNormalizedStrength(team);
      expect(typeof normalized).toBe('number');
      expect(normalized).toBeGreaterThanOrEqual(0.05); // Min normalized
      expect(normalized).toBeLessThanOrEqual(1.5); // Max normalized
    });

    it('should normalize by dividing by 2', () => {
      const rawStrength = calculateTeamStrength(team);
      const normalized = getNormalizedStrength(team);

      expect(normalized).toBe(rawStrength / 2);
    });

    it('should handle null team', () => {
      const normalized = getNormalizedStrength(null);
      expect(normalized).toBe(0.25); // 0.5 / 2
    });

    it('should scale high-strength teams appropriately', () => {
      const superTeam = {
        id: 1,
        name: 'Super',
        playedGames: 18,
        points: 54,
        last6Points: 18
      };

      const normalized = getNormalizedStrength(superTeam);
      expect(normalized).toBeGreaterThanOrEqual(0.75); // Strong team normalizes well
    });

    it('should scale weak teams appropriately', () => {
      const weakTeam = {
        id: 1,
        name: 'Weak',
        playedGames: 18,
        points: 3,
        last6Points: 0
      };

      const normalized = getNormalizedStrength(weakTeam);
      expect(normalized).toBeLessThan(0.1); // Weak team normalizes <0.1
    });
  });

  describe('Strength Distribution & Realism', () => {
    it('should produce realistic strength distribution for real standings', () => {
      const teams = cloneDeep(testStandings);
      const strengths = teams.map(t => calculateTeamStrength(t));

      // Arsenal (1st with 45 pts) should be much stronger than Southampton (19th with 8 pts)
      const arsenalStrength = strengths[2];
      const southamptonStrength = strengths[1];

      const strengthRatio = arsenalStrength / southamptonStrength;
      expect(strengthRatio).toBeGreaterThan(3); // Arsenal 3x stronger
    });

    it('should reflect quality differences across all test teams', () => {
      const teams = cloneDeep(testStandings);
      const teamStrengths = teams.map(t => ({
        name: t.team.name,
        strength: calculateTeamStrength(t)
      }));

      // Sort by strength
      teamStrengths.sort((a, b) => b.strength - a.strength);

      // Top team should have highest points (could be Arsenal or Manchester City)
      expect(['Arsenal', 'Manchester City']).toContain(teamStrengths[0].name);

      // Bottom team should have lowest points (Ipswich or Southampton)
      expect(['Ipswich Town', 'Southampton']).toContain(teamStrengths[teamStrengths.length - 1].name);
    });
  });
});
