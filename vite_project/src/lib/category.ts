import type {MagentoCategory, MagentoCategoryChild} from "../types/infra/magento/category.types.ts";

export const categoryLayereIds = (category?: MagentoCategory) => {
    let ids = category?.children.map((child: MagentoCategoryChild) => {
        return child.id
    })

    if (!ids) {
        ids = []
    }
    if (category?.id) ids.push(category?.id)

    return ids
}