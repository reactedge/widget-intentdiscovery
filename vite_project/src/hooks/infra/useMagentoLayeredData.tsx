export type MergedAttribute = {
    code: string
    label: string
    options: MergedAttributeOption[]
}

export type MergedAttributeOption = {
    value: string
    label: string
    totalCount: number
    filteredCount: number
    isAvailable: boolean
}

export const LAYERER_ATTRIBUTE_DATA = `
  query MagentoProducts($filter: ProductAttributeFilterInput!) {
      products(filter: $filter) {
        total_count
        aggregations{
          attribute_code
          label
          count
          options{
            count
            label
            value
          }
        }
      }
    }
`;
