/**
 * 创建 vdom
 * @param  {String}    tagName    标签名
 * @param  {Object}    props      属性节点
 * @param  {...[Object]} children 子节点
 * @return {Object}               vdom 节点
 */
function createElement(tagName, props, ...children) {
  let vnode = {
    tagName,
    props,
    children
  }

  return vnode
}

/**
 * 渲染 vdom 到 dom
 * @param  {Object}   nextElement   vdom 节点
 * @param  {Element}  container dom 节点
 * @param  {Function} callback  回调函数
 * @return {Element}
 */
function render(nextElement, container, callback) {
  let el = document.createElement(nextElement.tagName)
  nextElement.el = el

  if (nextElement.props) {
    for (let prop in nextElement.props) {
      el.setAttribute(prop, nextElement.props[prop])
    }
  }

  nextElement.children.forEach((child) => {
    typeof child == 'string'
    ? el.appendChild(document.createTextNode(child))
    : render(child, el)
  })

  container.appendChild(el)
  return el
}



let REPLACE = 0 // 替换
let CREATE = 1  // 创建
let REMOVE = 2  // 移除
let REORDER = 3 // 重排
let PROPS = 4   // 属性
let TEXT = 5    // 文本

/**
 * 更新dom
 * @param  {array} patches 需要更新的 vdom
 */
function patch(patches) {
  patches.forEach(function (patch) {
    switch (patch.type) {
      case REPLACE:
        patch.el.parentNode.replaceChild(patch.val, patch.el)
        break
      case CREATE:
        patch.el.parentNode.appendChild(patch.val, patch.el)
        break
      case REMOVE:
        patch.el.remove()
        break
      case PROPS:
        patch.el.setAttribute(patch.key, patch.val)
        break
      case TEXT:
        patch.el.textContent = patch.val
        break
    }
  })
}



/**
 * 比较 vdom 树
 * @param  {object} oldTree 老树
 * @param  {object} newTree 新树
 * @return {array}          补丁
 */
function diff(oldTree, newTree) {
  let patches = []
  walkTree(oldTree, newTree, patches)

  return patches
}

/**
 * 遍历树
 * @param  {object} oldNode 老树
 * @param  {object} newNode 新树
 * @param  {array} patches  补丁
 * @param  {element} context 文本节点操作的上下文
 */
function walkTree(oldNode, newNode, patches, context) {
  if (newNode === null) { // 节点被移除
    patches.push({type: REMOVE, el: oldNode.el})
  } else if (typeof oldNode === 'string' && typeof newNode === 'string') { // 文本节点替换
    if (newNode !== oldNode) {
      patches.push({type: TEXT, el: context, val: newNode})
    }
  } else if (JSON.stringify(oldNode.props) != JSON.stringify(newNode.props)) { // 节点更新
    let oldProps = oldNode.props
    let newProps = newNode.props

    // find different
    for (let key in oldProps) { // 寻找需要更新的属性
      if (newProps[key] !== oldProps[key]) {
        console.log(key)
          patches.push({type: PROPS, el: oldNode.el, key: key, val: newProps[key]})
      }
    }

    // find new
    for (let key in newProps) { // 寻找新加的属性
      if (!oldProps.hasOwnProperty(key)) {
          patches.push({type: PROPS, el: oldNode.el, key: key, val: newProps[key]})
      }
    }
  }

  if (newNode && oldNode.children) {
    oldNode.children.forEach( (el, idx) => {
      let new_el = null

      if (newNode.children) {
        new_el = newNode.children[idx] || null
      }

      walkTree(el, new_el, patches, oldNode.el)
    })
  }
}
