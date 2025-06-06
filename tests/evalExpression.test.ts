import { describe, it, expect } from 'vitest'
import { evalExpression } from '../src/utils/evalExpression'
import { parser, TagNode } from '@/utils/parser'

describe('evalExpression: basic', () => {
  it('should return the correct value', () => {
    expect(evalExpression({ expression: '1 + 1', currentVariant: 'default' })).toBe(2)
  })

  // Add more different tests here
  // Booleans
  it('should return the correct value', () => {
    expect(evalExpression({ expression: 'true', currentVariant: 'default' })).toBe(true)
  })

  it('should return the correct value', () => {
    expect(evalExpression({ expression: '132 === 123', currentVariant: 'default' })).toBe(false)
  })

  // Numbers
  it('should return the correct value', () => {
    expect(evalExpression({ expression: '1', currentVariant: 'default' })).toBe(1)
  })

  it('should return the correct value', () => {
    expect(evalExpression({ expression: '1.5', currentVariant: 'default' })).toBe(1.5)
  })
})

describe('evalExpression: variables', () => {
  const ctx = { user: { name: 'John', age: 20 } }
  it('should not return the correct value', () => {
    expect(evalExpression({ expression: 'user.name', variables: ctx, currentVariant: 'default' })).not.toBe('Ben')
  })

  it('should return the correct value', () => {
    expect(evalExpression({ expression: 'user.name', variables: ctx, currentVariant: 'default' })).toBe('John')
  })
})

describe('evalExpression: variants', () => {
  const ctx = { user: { name: 'John', age: 20 } }

  it('should return the correct value', () => {
    expect(evalExpression({ expression: 'Variant.assign({ primary: "blue", secondary: "red" }, "gray")', currentVariant: 'primary' })).toBe('blue')
  })
  it('should return the correct value', () => {
    expect(evalExpression({ expression: 'Variant.assign({ primary: 1, secondary: 2 }, 3)', currentVariant: 'primary' })).toBe(1)
  })

  it('should return the correct value', () => {
    expect(evalExpression({ expression: 'Variant.is("mobile")', currentVariant: 'mobile' })).toBe(true)
  })

  it('should return the correct value', () => {
    expect(evalExpression({ expression: 'Variant.values({ mobile: { fontSize: 14, padding: 8 }, desktop: { fontSize: 16, padding: 12 } }, { fontSize: 12, padding: 4 })', currentVariant: 'mobile' })).toStrictEqual({ fontSize: 14, padding: 8 })
  })

  it('should return the incorrect value', () => {
    expect(evalExpression({ expression: 'userName ? Variant.assign({ formal: "Estimado " + userName, casual: "Hola " + userName + "!", brief: userName }, "Usuario") : "Usuario"', variables: ctx, currentVariant: 'default' })).not.toBe('Estimado John')
  })

  it('should return the correct value', () => {
    expect(evalExpression({
      expression: 'user ? Variant.assign({ formal: "Estimado " + user.name, casual: "Hola " + user.name + "!", brief: user.name }, "Usuario") : "Usuario"',
      variables: ctx,
      currentVariant: 'formal'
    })).toBe('Estimado John')
  })
})

describe('evalExpression: parser', () => {
  it('should return the correct value', () => {
    const object: TagNode = { type: 'tag', tag: 'rect', attr: { width: '100', height: '100', fill: 'red' }, child: [] }
    expect(evalExpression({ expression: 'Parser.build([{ type: "tag", tag: "rect", attr: { width: "100", height: "100", fill: "red" }, child: [] }])', currentVariant: 'default' })).toBe(parser.build([object]))
  })

  it('should return the correct value', () => {
    const object: TagNode = {
      type: 'tag',
      tag: 'circle',
      attr: {
        cx: String(1920 / 2),
        cy: String(1080 / 2),
        r: String(16 * 1.2),
        fill: 'red',
        opacity: String(0.4),
        filter: 'url(#glowBlur)'
      },
      child: []
    }
    expect(evalExpression({ expression: 'Parser.build([{ type: "tag", tag: "rect", attr: { width: "100", height: "100", fill: "red" }, child: [] }])', currentVariant: 'default' })).toBe(parser.build([object]))
  })

  it('should return the correct value', () => {
    const object: TagNode = { type: 'tag', tag: 'rect', attr: { width: '100', height: '100', fill: 'red' }, child: [] }
    expect(evalExpression({ expression: 'Parser.build([{ type: "tag", tag: "rect", attr: { width: "100", height: "100", fill: "red" }, child: [] }])', currentVariant: 'default' })).toBe(parser.build([object]))
  })
})
