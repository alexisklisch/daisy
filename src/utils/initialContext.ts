import { ExpressionNode, parser } from '@/utils/parser'
import { tagRegex } from '@/utils/regex'
import { evalExpression } from '@/utils/evalExpression'
import type { DeisyConfig, VariablesContext } from '@/deisyTypes'

export function assignInitialVars (initialSource: string, config: DeisyConfig, currentVariant: string | undefined) {
  let currentSource = initialSource
  const newContext: VariablesContext = { template: {}, user: {}, metadata: {} }

  // 1. Asignar variables del usuario primero
  const { variables } = config
  newContext.user = variables || {}

  // 2. Definir los tipos de tags y sus mapeos correspondientes
  const tags = ['variables', 'metadata']
  type TagType = typeof tags[number]
  const tagToVarMap: Record<TagType, keyof typeof newContext> = {
    variables: 'template',
    metadata: 'metadata'
  }

  // 3. Procesar cada tipo de tag con el contexto completo
  tags.forEach(tag => {
    const regex = tagRegex(`dsy-${tag}`)
    const match = currentSource.match(regex)

    if (match) {
      const [parsed] = parser.parse(match[0] || '')
      if (parsed.type === 'tag') {
        const expression = parsed.attr.content as ExpressionNode
        if (expression.content) {
          // Evaluar la expresión con el contexto completo
          const expressionResolved = evalExpression({
            expression: expression.content,
            variables: newContext, // Pasar el contexto completo
            currentVariant
          })
          newContext[tagToVarMap[tag]] = expressionResolved
        }
      }
      // Eliminar el tag procesado del source
      currentSource = currentSource.replace(regex, '')
    }
  })

  return { cleanSource: currentSource, cleanVariables: newContext }
}
