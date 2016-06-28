import {REPLACE, CREATE, REMOVE, REORDER, PROPS, TEXT} from './patch'

export function diff(oldTree, newTree) {
  let patches = []

  walkTree(oldTree, newTree, 0, patches)

  return patches
}

/**
 * 遍历 vdom 树
 *
 * @param  {Object} oldNode 老的vdom树
 * @param  {Object} newNode 新的vdom树
 * @param  {Number} index   第几层树枝
 * @param  {Array} patches  补丁集
 */
function walkTree(oldNode, newNode, index, patches) {
  let currentPatch = []

  if (oldNode == null) { // 添加节点
    currentPatch.push({type: CREATE, val: newNode})
    console.log('第', index ,'层', '添加节点')
  } else if (newNode == null) { // 移除节点
    currentPatch.push({type: REMOVE})
    console.log('第', index ,'层', '移除节点')
  } else if (oldNode.tagName !== newNode.tagName) { // 更新节点
    if (typeof oldNode === 'string') {
      currentPatch.push({type: TEXT, val: newNode})
      console.log('第', index ,'层', '更新节点 - 文本')
    } else {
      currentPatch.push({type: REPLACE, val: newNode})
      console.log('第', index ,'层', '更新节点 - 元素')
    }
  } else if (typeof oldNode === 'string' && oldNode !== newNode) { // 更新文本节点
    currentPatch.push({type: TEXT, val: newNode})
    console.log('第', index ,'层', '更新文本节点')
  } else if (JSON.stringify(oldNode.props) != JSON.stringify(newNode.props)) { // 节点属性更新
    // diff props
    var oldProps = oldNode.props || {}
    var newProps = newNode.props || {}

    // find different
    for (var key in oldProps) { // 寻找需要更新的属性
        if (newProps[key] !== oldProps[key]) {
            currentPatch.push({type: PROPS, key: key, val: newProps[key]})
        }
    }

    // find new
    for (var key in newProps) { // 寻找新加的属性
        if (!oldProps.hasOwnProperty(key)) {
            currentPatch.push({type: PROPS, key: key, val: newProps[key]})
        }
    }

    console.log('第', index ,'层', '更新节点属性')
  }

  // debug...
  else {
    console.log('第', index ,'层', '无更新')
  }

  if (oldNode.children) { // 比较子节点
    oldNode.children.forEach((child, idx) => {
      walkTree(child, newNode.children[idx], index + 1, patches)
    })
  }

  patches[index] = currentPatch
}
