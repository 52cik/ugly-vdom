export let REPLACE = 0 // 替换
export let CREATE = 1  // 移除
export let REMOVE = 2  // 移除
export let REORDER = 3 // 重排
export let PROPS = 4   // 属性
export let TEXT = 5    // 文本

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
          dom.parentNode.replaceChild(patch.new_val.render().dom)
          break
        case PROPS:
          dom.setAttribute(patch.key, patch.new_val)
          break
        case TEXT:
          dom.textContent = patch.new_val
          break
        case REORDER:
          reorderChildren(dom, patch.diff)
          break
      }
    })
  }
}

export patch
