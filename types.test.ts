import { describe, it, expect } from 'vitest';
import { ResumeData } from './types';

describe('ResumeData Types', () => {
  it('should create valid resume data structure', () => {
    const testData: ResumeData = {
      profile: {
        fullName: 'Test User',
        title: 'Software Engineer',
        email: 'test@example.com',
        phone: '123-456-7890',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/test',
        website: 'example.com',
        summary: 'Test summary',
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      mentorship: [],
      others: [],
    };

    expect(testData.profile.fullName).toBe('Test User');
    expect(testData.experience).toHaveLength(0);
  });

  it('should have required profile fields', () => {
    const profile = {
      fullName: 'John Doe',
      title: 'Developer',
      email: 'john@example.com',
      phone: '555-1234',
      location: 'NYC',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.com',
      summary: 'Experienced developer',
    };

    expect(profile.fullName).toBeTruthy();
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
