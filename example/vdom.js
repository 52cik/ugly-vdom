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
  return container
}


// 别名
let React = {createElement: createElement}
let ReactDOM = {render: render}











let REPLACE = 0 // 替换
let CREATE = 1  // 移除
let REMOVE = 2  // 移除
let REORDER = 3 // 重排
let PROPS = 4   // 属性
let TEXT = 5    // 文本

function patch (node, patches) {
  let walker = {index: 0}
  walkDom(node, walker, patches)
}


function walkDom(dom, walker, patches) {
  // save currentPatch
  var currentPatch = patches[walker.index]
  // walk children
  for (var i = 0; i < dom.childNodes.length; i++) {
      var childnode = dom.childNodes[i];
      walker.index++
      walkDom(childnode, walker, patches)
  }

  if (currentPatch) { // have patche in current node

    currentPatch.forEach(function (patch) {
      switch (patch.type) {
        case REPLACE:
          render(patch.val, dom.parentNode)
          break
        case PROPS:
          dom.setAttribute(patch.key, patch.val)
          break
        case TEXT:
          dom.textContent = patch.val
          break
        case REORDER:
          reorderChildren(dom, patch.diff)
          break
      }
    })
  }
}









function diff(oldTree, newTree) {
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
    // console.log('第', index ,'层', '无更新')
  }

  console.log(' -> 第', index ,'层', currentPatch, '[', oldNode, newNode, ']')

  patches[index] = currentPatch

  if (oldNode.children) { // 比较子节点
    oldNode.children.forEach((child, idx) => {
      walkTree(child, newNode.children[idx], ++index, patches)
    })
  }


}
