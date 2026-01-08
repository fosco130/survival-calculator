/**
 * Test Suite: Historical Relegation Thresholds & Color Coding
 *
 * Tests the lookup tables that map points to historical survival rates
 * and the color-coding system for visual feedback
 *
 * ★ Insight ─────────────────────────────────────
 * Historical data shows that certain point totals correlate strongly
 * with relegation odds. For example, 35+ points historically = 92% safe.
 * This data:
 * 1. Validates simulation accuracy (should match historical patterns)
 * 2. Provides context labels for users
 * 3. Drives color-coded UI (Green/Amber/Red)
 *
 * We test that thresholds are monotonically increasing and colors
 * properly map to danger levels.
 * ─────────────────────────────────────────────────────────────
 */

import { describe, it, expect } from 'vitest';
import {
  historicalThresholds,
  getThresholdLabel,
  getSurvivalColor
} from './historicalThresholds';

describe('Historical Relegation Thresholds', () => {
  describe('Threshold Data Structure', () => {
    it('should define thresholds for key point totals', () => {
      const expectedKeys = ['21', '23', '25', '27', '29', '31', '33', '35', '36', '37', '38'];
      expectedKeys.forEach(key => {
        expect(historicalThresholds[key]).toBeDefined();
      });
    });

    it('should have required properties for each threshold', () => {
      Object.values(historicalThresholds).forEach(threshold => {
        expect(threshold).toHaveProperty('points');
        expect(threshold).toHaveProperty('survivalRate');
        expect(threshold).toHaveProperty('label');
        expect(threshold).toHaveProperty('color');
      });
    });

    it('should have valid data types for each threshold', () => {
      Object.values(historicalThresholds).forEach(threshold => {
        expect(typeof threshold.points).toBe('number');
        expect(typeof threshold.survivalRate).toBe('number');
        expect(typeof threshold.label).toBe('string');
        expect(typeof threshold.color).toBe('string');
      });
    });
  });

  describe('Survival Rate Monotonicity', () => {
    it('should have monotonically increasing survival rates', () => {
      const keys = Object.keys(historicalThresholds)
        .map(Number)
        .sort((a, b) => a - b);

      for (let i = 0; i < keys.length - 1; i++) {
        const current = historicalThresholds[keys[i]];
        const next = historicalThresholds[keys[i + 1]];
        expect(next.survivalRate).toBeGreaterThanOrEqual(current.survivalRate);
      }
    });

    it('should have survival rates between 0 and 1', () => {
      Object.values(historicalThresholds).forEach(threshold => {
        expect(threshold.survivalRate).toBeGreaterThanOrEqual(0);
        expect(threshold.survivalRate).toBeLessThanOrEqual(1);
      });
    });

    it('should show clear progression from danger to safety', () => {
      const danger = historicalThresholds[21];
      const safe = historicalThresholds[38];

      expect(danger.survivalRate).toBeLessThan(0.2); // Very dangerous
      expect(safe.survivalRate).toBeGreaterThan(0.95); // Very safe
      expect(safe.survivalRate).toBeGreaterThan(danger.survivalRate);
    });
  });

  describe('Key Thresholds', () => {
    it('should identify 35 points as historically safe (92%)', () => {
      const threshold35 = historicalThresholds[35];
      expect(threshold35.survivalRate).toBe(0.92);
      expect(threshold35.color).toBe('safe');
    });

    it('should identify 27 points as risky (50%)', () => {
      const threshold27 = historicalThresholds[27];
      expect(threshold27.survivalRate).toBe(0.50);
      expect(threshold27.color).toBe('nervous');
    });

    it('should identify 21 points as critical (10%)', () => {
      const threshold21 = historicalThresholds[21];
      expect(threshold21.survivalRate).toBe(0.10);
      expect(threshold21.color).toBe('danger');
    });

    it('should show improvement from 38 points', () => {
      const threshold38 = historicalThresholds[38];
      expect(threshold38.survivalRate).toBe(0.99);
      expect(threshold38.label).toContain('100%');
    });
  });

  describe('Color Assignments', () => {
    it('should use only valid color values', () => {
      const validColors = ['danger', 'nervous', 'safe'];
      Object.values(historicalThresholds).forEach(threshold => {
        expect(validColors).toContain(threshold.color);
      });
    });

    it('should use danger color for low point thresholds', () => {
      const dangerThresholds = [
        historicalThresholds[21],
        historicalThresholds[23],
        historicalThresholds[25]
      ];

      dangerThresholds.forEach(threshold => {
        expect(threshold.color).toBe('danger');
        expect(threshold.survivalRate).toBeLessThan(0.5);
      });
    });

    it('should use nervous color for middle thresholds', () => {
      const nervousThresholds = [
        historicalThresholds[27],
        historicalThresholds[29],
        historicalThresholds[31],
        historicalThresholds[33]
      ];

      nervousThresholds.forEach(threshold => {
        expect(threshold.color).toBe('nervous');
        expect(threshold.survivalRate).toBeGreaterThanOrEqual(0.5);
        expect(threshold.survivalRate).toBeLessThan(0.92);
      });
    });

    it('should use safe color for high thresholds', () => {
      const safeThresholds = [
        historicalThresholds[35],
        historicalThresholds[36],
        historicalThresholds[37],
        historicalThresholds[38]
      ];

      safeThresholds.forEach(threshold => {
        expect(threshold.color).toBe('safe');
        expect(threshold.survivalRate).toBeGreaterThan(0.9);
      });
    });
  });

  describe('Label Descriptions', () => {
    it('should provide descriptive labels for each threshold', () => {
      Object.values(historicalThresholds).forEach(threshold => {
        expect(threshold.label).toBeTruthy();
        expect(threshold.label.length).toBeGreaterThan(0);
      });
    });

    it('should match label intensity to danger level', () => {
      // Danger labels should be alarming
      expect(historicalThresholds[21].label.toLowerCase()).toContain('almost');

      // Safe labels should be reassuring
      expect(historicalThresholds[35].label).toContain('Virtually');
      expect(historicalThresholds[38].label).toContain('100%');
    });

    it('should have unique labels for each threshold', () => {
      const labels = Object.values(historicalThresholds).map(t => t.label);
      const uniqueLabels = new Set(labels);
      expect(uniqueLabels.size).toBe(labels.length);
    });
  });
});

describe('getThresholdLabel() Function', () => {
  describe('Threshold Lookup', () => {
    it('should return 38 threshold for high points', () => {
      const result = getThresholdLabel(50);
      expect(result.points).toBe(38);
      expect(result.survivalRate).toBe(0.99);
    });

    it('should return exact threshold for matched points', () => {
      const result = getThresholdLabel(35);
      expect(result.points).toBe(35);
      expect(result.survivalRate).toBe(0.92);
    });

    it('should return lower threshold for in-between points', () => {
      // 34 points should map to 33 threshold (next lower)
      const result = getThresholdLabel(34);
      expect(result.points).toBe(33);
    });

    it('should return 21 threshold for very low points', () => {
      const result = getThresholdLabel(10);
      expect(result.points).toBe(21);
    });

    it('should handle edge cases', () => {
      expect(getThresholdLabel(0).points).toBe(21);
      expect(getThresholdLabel(38).points).toBe(38);
      expect(getThresholdLabel(100).points).toBe(38);
    });

    it('should handle decimal points (rounds down)', () => {
      const result34 = getThresholdLabel(34.9);
      expect(result34.points).toBe(33);

      const result35 = getThresholdLabel(35.1);
      expect(result35.points).toBe(35);
    });

    it('should return valid threshold for any point total 0-100', () => {
      for (let points = 0; points <= 100; points += 5) {
        const threshold = getThresholdLabel(points);
        expect(threshold).toBeDefined();
        expect(threshold.points).toBeGreaterThanOrEqual(21);
        expect(threshold.points).toBeLessThanOrEqual(38);
      }
    });

    it('should return threshold with all required properties', () => {
      const threshold = getThresholdLabel(30);
      expect(threshold).toHaveProperty('points');
      expect(threshold).toHaveProperty('survivalRate');
      expect(threshold).toHaveProperty('label');
      expect(threshold).toHaveProperty('color');
    });
  });

  describe('Threshold Progression', () => {
    it('should show increasing survival rate for increasing points', () => {
      const threshold20 = getThresholdLabel(20);
      const threshold30 = getThresholdLabel(30);
      const threshold40 = getThresholdLabel(40);

      expect(threshold30.survivalRate).toBeGreaterThan(threshold20.survivalRate);
      expect(threshold40.survivalRate).toBeGreaterThan(threshold30.survivalRate);
    });

    it('should map realistic Leeds scenario', () => {
      // Leeds with 27 points (actual from Phase 1 testing)
      const leedsThreshold = getThresholdLabel(27);
      expect(leedsThreshold.points).toBe(27);
      expect(leedsThreshold.survivalRate).toBe(0.50);
      expect(leedsThreshold.color).toBe('nervous');
    });
  });
});

describe('getSurvivalColor() Function', () => {
  describe('Color Mapping from Percentage', () => {
    it('should return safe for >70% survival', () => {
      expect(getSurvivalColor(100)).toBe('safe');
      expect(getSurvivalColor(95)).toBe('safe');
      expect(getSurvivalColor(71)).toBe('safe');
      expect(getSurvivalColor(70.1)).toBe('safe');
    });

    it('should return nervous for 40-70% survival', () => {
      expect(getSurvivalColor(70)).toBe('nervous');
      expect(getSurvivalColor(55)).toBe('nervous');
      expect(getSurvivalColor(40.1)).toBe('nervous');
    });

    it('should return danger for <40% survival', () => {
      expect(getSurvivalColor(40)).toBe('danger');
      expect(getSurvivalColor(25)).toBe('danger');
      expect(getSurvivalColor(0)).toBe('danger');
    });

    it('should handle boundary values correctly', () => {
      // 70% is boundary
      expect(getSurvivalColor(70)).toBe('nervous');
      expect(getSurvivalColor(70.0001)).toBe('safe');

      // 40% is boundary
      expect(getSurvivalColor(40)).toBe('danger');
      expect(getSurvivalColor(40.0001)).toBe('nervous');
    });

    it('should handle extreme values', () => {
      expect(getSurvivalColor(0)).toBe('danger');
      expect(getSurvivalColor(100)).toBe('safe');
      expect(getSurvivalColor(1000)).toBe('safe'); // Out of range, still safe
    });

    it('should use only valid color values', () => {
      const validColors = ['safe', 'nervous', 'danger'];
      for (let i = 0; i <= 100; i += 10) {
        const color = getSurvivalColor(i);
        expect(validColors).toContain(color);
      }
    });

    it('should handle decimal percentages', () => {
      expect(getSurvivalColor(45.5)).toBe('nervous');
      expect(getSurvivalColor(75.5)).toBe('safe');
      expect(getSurvivalColor(19.5)).toBe('danger');
    });
  });

  describe('Consistency with Thresholds', () => {
    it('should match threshold colors for key percentages', () => {
      // 21 pts = ~10% survival = danger
      expect(getSurvivalColor(10)).toBe('danger');

      // 27 pts = ~50% survival = nervous
      expect(getSurvivalColor(50)).toBe('nervous');

      // 35 pts = ~92% survival = safe
      expect(getSurvivalColor(92)).toBe('safe');
    });

    it('should provide consistent UI coloring', () => {
      // All danger percentages should be danger color
      for (let p = 0; p <= 40; p += 5) {
        expect(getSurvivalColor(p)).toBe('danger');
      }

      // All safe percentages should be safe color
      for (let p = 71; p <= 100; p += 5) {
        expect(getSurvivalColor(p)).toBe('safe');
      }
    });
  });

  describe('UI Integration', () => {
    it('should work with simulation output (0-100 range)', () => {
      // Typical simulation results are 0-100%
      const simulationResults = [0, 19.4, 50, 75, 100];
      simulationResults.forEach(result => {
        const color = getSurvivalColor(result);
        expect(['safe', 'nervous', 'danger']).toContain(color);
      });
    });

    it('should map Leeds survival scenario correctly', () => {
      // Phase 1: Leeds shows ~19.4% survival
      const leedsColor = getSurvivalColor(19.4);
      expect(leedsColor).toBe('danger');
    });

    it('should map championship-form teams correctly', () => {
      // A team fighting for promotion would show ~95% survival
      const promotionFightColor = getSurvivalColor(95);
      expect(promotionFightColor).toBe('safe');

      // A middling team ~60% survival
      const middlingColor = getSurvivalColor(60);
      expect(middlingColor).toBe('nervous');

      // A relegation-battling team ~35% survival
      const relegationBattleColor = getSurvivalColor(35);
      expect(relegationBattleColor).toBe('danger');
    });
  });
});

describe('Integration: Thresholds + Colors', () => {
  it('should create coherent progression from danger to safety', () => {
    // Start: very risky scenario
    const veryRiskyThreshold = getThresholdLabel(22);
    const veryRiskyColor = getSurvivalColor(15);

    expect(veryRiskyThreshold.color).toBe('danger');
    expect(veryRiskyColor).toBe('danger');

    // Middle: competitive scenario
    const competitiveThreshold = getThresholdLabel(30);
    const competitiveColor = getSurvivalColor(55);

    expect(competitiveThreshold.color).toBe('nervous');
    expect(competitiveColor).toBe('nervous');

    // End: safe scenario
    const safeThreshold = getThresholdLabel(36);
    const safeColor = getSurvivalColor(80);

    expect(safeThreshold.color).toBe('safe');
    expect(safeColor).toBe('safe');
  });

  it('should provide useful context across full season', () => {
    // Early season: Leeds with 15 points from 18 games
    const leedsThreshold = getThresholdLabel(15);
    expect(leedsThreshold).toHaveProperty('label');
    expect(leedsThreshold.color).toBe('danger');

    // Later: team targets 35 points
    const targetThreshold = getThresholdLabel(35);
    expect(targetThreshold.label).toContain('safe');
  });
});
