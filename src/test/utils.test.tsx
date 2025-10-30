import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toContain('base')
      expect(result).toContain('conditional')
      expect(result).not.toContain('hidden')
    })

    it('handles undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid')
      expect(result).toContain('base')
      expect(result).toContain('valid')
    })
  })
})