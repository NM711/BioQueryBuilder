// no class just util functions
import type { WrapperUtils } from "types/sql.types"

// not very elegant but frick it

export function firstCondtionOrChain ({ 
    condition,
    operator,
    separator
    }: 
    WrapperUtils.Conditions,
    counter: number,
    query: string[],
    keyword: "WHERE" | "HAVING" = "WHERE"
) {
  const builtCondition = `${condition} ${operator}`
  if (!query.some(item => item.startsWith(`${keyword}`))) {
    query.push(`${keyword} ${builtCondition} $${counter}`)
  } else { 
      query.push(`${separator} ${builtCondition} $${counter}`)
  }
}
