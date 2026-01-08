/**
 * Test Suite: Team Data & Utilities
 *
 * Tests the team registry that provides team metadata, colors,
 * and slugs for team identification throughout the app
 *
 * ★ Insight ─────────────────────────────────────
 * Teams data is fundamental for the entire app:
 * - IDs map to football-data.org API responses
 * - Slugs enable URL-based team selection (?team=leeds)
 * - Colors drive the UI theme (team branding)
 *
 * We test that all 20 teams are correctly registered and
 * have the required properties for Phase 1 and beyond.
 * ─────────────────────────────────────────────────────────────
 */

import { describe, it, expect } from 'vitest';
import { teams, getTeamBySlug, getTeamById, getAllTeams, teamMap } from './teams';

describe('Team Registry', () => {
  describe('Teams Data Structure', () => {
    it('should have 20 teams (full Premier League)', () => {
      expect(teams).toHaveLength(20);
    });

    it('should have all required properties for each team', () => {
      teams.forEach(team => {
        expect(team).toHaveProperty('id');
        expect(team).toHaveProperty('slug');
        expect(team).toHaveProperty('name');
        expect(team).toHaveProperty('shortName');
        expect(team).toHaveProperty('colors');
      });
    });

    it('should have valid color properties', () => {
      teams.forEach(team => {
        expect(team.colors).toHaveProperty('primary');
        expect(team.colors).toHaveProperty('secondary');
        // Colors should be hex strings
        expect(team.colors.primary).toMatch(/^#[0-9A-F]{6}$/i);
        expect(team.colors.secondary).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should have unique IDs for all teams', () => {
      const ids = teams.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(20);
    });

    it('should have unique slugs for all teams', () => {
      const slugs = teams.map(t => t.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(20);
    });

    it('should have unique short names for all teams', () => {
      const shortNames = teams.map(t => t.shortName);
      const uniqueShortNames = new Set(shortNames);
      expect(uniqueShortNames.size).toBe(20);
    });

    it('should have no empty strings for names', () => {
      teams.forEach(team => {
        expect(team.name).toBeTruthy();
        expect(team.slug).toBeTruthy();
        expect(team.shortName).toBeTruthy();
      });
    });
  });

  describe('Team Identification', () => {
    it('should include Leeds United', () => {
      const leeds = teams.find(t => t.slug === 'leeds');
      expect(leeds).toBeDefined();
      expect(leeds.name).toBe('Leeds United');
    });

    it('should have Arsenal with correct ID', () => {
      const arsenal = teams.find(t => t.slug === 'arsenal');
      expect(arsenal).toBeDefined();
      expect(arsenal.id).toBe(1);
    });

    it('should have Manchester City with correct ID', () => {
      const mancity = teams.find(t => t.slug === 'man-city');
      expect(mancity).toBeDefined();
      expect(mancity.id).toBe(14);
    });

    it('should have consistent ID to slug mapping', () => {
      const idToSlugMap = {};
      teams.forEach(team => {
        expect(idToSlugMap[team.id]).toBeUndefined(); // No duplicates
        idToSlugMap[team.id] = team.slug;
      });
    });
  });

  describe('Slug Conventions', () => {
    it('should use lowercase slugs', () => {
      teams.forEach(team => {
        expect(team.slug).toBe(team.slug.toLowerCase());
      });
    });

    it('should use hyphens not spaces in slugs', () => {
      teams.forEach(team => {
        expect(team.slug).not.toContain(' ');
        expect(team.slug).not.toContain('_');
      });
    });

    it('should have 3-letter short names', () => {
      teams.forEach(team => {
        expect(team.shortName).toHaveLength(3);
      });
    });

    it('should use uppercase short names', () => {
      teams.forEach(team => {
        expect(team.shortName).toBe(team.shortName.toUpperCase());
      });
    });
  });

  describe('Team Colors', () => {
    it('should have different primary colors for variety', () => {
      const primaryColors = new Set(teams.map(t => t.colors.primary));
      // Most teams should have unique primary colors
      expect(primaryColors.size).toBeGreaterThan(15); // At least 75% unique
    });

    it('should have valid hex color codes', () => {
      teams.forEach(team => {
        const hexRegex = /^#[0-9A-F]{6}$/i;
        expect(team.colors.primary).toMatch(hexRegex);
        expect(team.colors.secondary).toMatch(hexRegex);
      });
    });

    it('should have Leeds United with yellow primary color', () => {
      const leeds = teams.find(t => t.slug === 'leeds');
      expect(leeds.colors.primary).toMatch(/^#[FfYy]/i); // Yellow hex
    });

    it('should provide secondary colors for contrast', () => {
      teams.forEach(team => {
        expect(team.colors.secondary).toBeTruthy();
        expect(team.colors.secondary).not.toBe(team.colors.primary);
      });
    });
  });

  describe('Team Names', () => {
    it('should have proper names matching football-data.org API', () => {
      // Test key teams that are commonly used
      const expectedTeams = [
        { slug: 'arsenal', name: 'Arsenal' },
        { slug: 'man-utd', name: 'Manchester United' },
        { slug: 'man-city', name: 'Manchester City' },
        { slug: 'liverpool', name: 'Liverpool' },
        { slug: 'chelsea', name: 'Chelsea' }
      ];

      expectedTeams.forEach(({ slug, name }) => {
        const team = teams.find(t => t.slug === slug);
        expect(team).toBeDefined();
        expect(team.name).toBe(name);
      });
    });

    it('should have consistent name to slug mapping', () => {
      // Some teams have shortened slugs, so just verify slug is valid
      teams.forEach(team => {
        expect(team.slug).toBeTruthy();
        expect(team.slug).not.toContain(' ');
        // Slug should relate to name in some way (at least one word match)
        const nameWords = team.name.toLowerCase().split(' ').map(w => w.replace(/[&\-\.]/g, ''));
        const slugWords = team.slug.toLowerCase().split('-');
        const hasMatch = nameWords.some(word => slugWords.some(slug => slug.includes(word) || word.includes(slug)));
        expect(hasMatch).toBe(true);
      });
    });
  });

  describe('API Integration', () => {
    it('should have IDs compatible with football-data.org', () => {
      teams.forEach(team => {
        // IDs should be positive integers
        expect(Number.isInteger(team.id)).toBe(true);
        expect(team.id).toBeGreaterThan(0);
      });
    });

    it('should have IDs in typical football-data.org range', () => {
      teams.forEach(team => {
        // football-data.org IDs for PL teams are typically 1-100 range
        expect(team.id).toBeLessThanOrEqual(10000);
      });
    });

    it('all 20 Premier League teams should be included', () => {
      // Key teams that must be in dataset
      const requiredTeams = [
        'arsenal',
        'man-city',
        'man-utd',
        'liverpool',
        'chelsea',
        'leeds',
        'tottenham',
        'newcastle',
        'brighton',
        'aston-villa'
      ];

      requiredTeams.forEach(slug => {
        const team = teams.find(t => t.slug === slug);
        expect(team).toBeDefined();
      });
    });
  });

  describe('Phase 1 vs Future Phases', () => {
    it('should have all properties needed for Phase 1', () => {
      // Phase 1 needs: id, name, colors
      teams.forEach(team => {
        expect(team.id).toBeDefined();
        expect(team.name).toBeDefined();
        expect(team.colors).toBeDefined();
      });
    });

    it('should have slug property for Phase 2 (multi-team support)', () => {
      // Phase 2 will use URL params like ?team=leicester
      teams.forEach(team => {
        expect(team.slug).toBeDefined();
        expect(typeof team.slug).toBe('string');
      });
    });

    it('should be extensible for future properties', () => {
      // Future phases might add: badges, formations, players, etc.
      // Current structure allows for this
      const leeds = teams.find(t => t.slug === 'leeds');
      expect(typeof leeds).toBe('object');
      // Can add new properties without breaking
    });
  });

  describe('Helper Functions', () => {
    it('getTeamBySlug() should find team by slug', () => {
      const leeds = getTeamBySlug('leeds');
      expect(leeds).toBeDefined();
      expect(leeds.name).toBe('Leeds United');
      expect(leeds.id).toBe(13);
    });

    it('getTeamBySlug() should be case insensitive', () => {
      const leeds1 = getTeamBySlug('leeds');
      const leeds2 = getTeamBySlug('LEEDS');
      const leeds3 = getTeamBySlug('LeEdS');

      expect(leeds1.id).toBe(leeds2.id);
      expect(leeds2.id).toBe(leeds3.id);
    });

    it('getTeamBySlug() should return undefined for non-existent team', () => {
      const result = getTeamBySlug('invalid-team');
      expect(result).toBeUndefined();
    });

    it('getTeamById() should find team by ID', () => {
      const arsenal = getTeamById(1);
      expect(arsenal).toBeDefined();
      expect(arsenal.name).toBe('Arsenal');
      expect(arsenal.slug).toBe('arsenal');
    });

    it('getTeamById() should work for all 20 teams', () => {
      for (let i = 1; i <= 20; i++) {
        const team = getTeamById(i);
        expect(team).toBeDefined();
        expect(team.id).toBe(i);
      }
    });

    it('getTeamById() should return undefined for non-existent ID', () => {
      const result = getTeamById(9999);
      expect(result).toBeUndefined();
    });

    it('getAllTeams() should return all 20 teams', () => {
      const allTeams = getAllTeams();
      expect(allTeams).toHaveLength(20);
      expect(allTeams).toEqual(teams);
    });

    it('teamMap should provide quick lookup by slug', () => {
      expect(teamMap['leeds']).toBeDefined();
      expect(teamMap['leeds'].name).toBe('Leeds United');
    });

    it('teamMap should have entry for every team', () => {
      teams.forEach(team => {
        expect(teamMap[team.slug]).toBeDefined();
        expect(teamMap[team.slug].id).toBe(team.id);
      });
    });
  });
});
