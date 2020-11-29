import Server from "@/utils/request"

// 获取分类列表
export function setCategoryList(data){
    return Server({
        url:"/article/category/search",
        method:"post",
        ...data
    })
}

// 删除
export function deleteCategory(id){
    return Server({
        url:`/article/category/${id}`,
        method:'delete'
    })
}

