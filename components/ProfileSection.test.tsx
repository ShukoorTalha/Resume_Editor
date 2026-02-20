import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileSection } from './components/ProfileSection';

describe('ProfileSection Component', () => {
  it('should render profile section with inputs', () => {
    const mockProfile = {
      fullName: 'Alex Jordan',
      title: 'Product Designer',
      email: 'alex@example.com',
      phone: '123-456-7890',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexjordan',
      website: 'alexjordan.com',
      summary: 'Experienced designer',
    };

    const mockOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Mock handler
    };

    render(
      <ProfileSection profile={mockProfile} onChange={mockOnChange} />
    );

    // Verify inputs are rendered
    expect(screen.getByDisplayValue('Alex Jordan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('alex@example.com')).toBeInTheDocument();
  });
});
